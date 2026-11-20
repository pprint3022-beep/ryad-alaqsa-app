"""API contract tests for the Ryad Al Aqsa advisory ML service.

Run from ``services/ml``::

    python -m pytest -q

The tests use FastAPI's in-process ``TestClient`` (backed by httpx), so no
server, model training, or network access is required.
"""

from __future__ import annotations

from collections.abc import Iterator
from datetime import datetime
from typing import Any

import pytest
from fastapi.testclient import TestClient

from app.main import APP_VERSION, app


@pytest.fixture(scope="module")
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client


def gap_payload(
    learner_key: str = "L-001",
    *,
    attendance_rate: float = 0.98,
    average_score: float = 16.0,
    missing_assessments: int = 0,
    failed_competencies: int = 0,
    support_flags: int = 0,
    trend_delta: float = 0.0,
) -> dict[str, Any]:
    """Build a valid /v1/gap-risk body (also used for early-warning items)."""
    return {
        "learner_key": learner_key,
        "features": {
            "attendance_rate": attendance_rate,
            "average_score": average_score,
            "missing_assessments": missing_assessments,
            "failed_competencies": failed_competencies,
            "support_flags": support_flags,
            "trend_delta": trend_delta,
        },
    }


def recommendation_payload(**overrides: Any) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "learner_key": "L-001",
        "strengths": [],
        "interests": [],
        "gaps": [],
        "needs_support": False,
        "has_talent_signal": False,
    }
    payload.update(overrides)
    return payload


def error_locs(response: Any) -> list[tuple[Any, ...]]:
    body = response.json()
    return [tuple(error["loc"]) for error in body["detail"]]


# --------------------------------------------------------------------------- #
# /health
# --------------------------------------------------------------------------- #
def test_health(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "ryad-ml",
        "version": APP_VERSION,
        "models": ["gap-risk-v1", "recommendations-v1"],
        "persists_data": False,
    }


# --------------------------------------------------------------------------- #
# /v1/gap-risk
# --------------------------------------------------------------------------- #
def test_gap_risk_low(client: TestClient) -> None:
    response = client.post("/v1/gap-risk", json=gap_payload("L-LOW"))

    assert response.status_code == 200
    body = response.json()
    assert body["learner_key"] == "L-LOW"
    assert body["risk"] == 0.0
    assert body["band"] == "low"
    assert body["drivers"] == []
    assert body["advisory_only"] is True
    assert body["suggested_actions"] == [
        "Maintain the current plan; reassess at the next checkpoint.",
        "Human review required before any change of pathway.",
    ]


def test_gap_risk_critical(client: TestClient) -> None:
    response = client.post(
        "/v1/gap-risk",
        json=gap_payload(
            "L-CRITICAL",
            attendance_rate=0.5,
            average_score=5.0,
            missing_assessments=6,
            failed_competencies=10,
            support_flags=4,
            trend_delta=-5.0,
        ),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["learner_key"] == "L-CRITICAL"
    assert body["risk"] == pytest.approx(0.923)
    assert body["band"] == "critical"
    assert body["drivers"] == [
        "attendance 50%",
        "average 5.0/20",
        "10 gap(s)",
        "6 missing assessment(s)",
        "support history",
        "declining trend -5.0",
    ]
    assert body["advisory_only"] is True
    assert body["suggested_actions"] == [
        "Contact the family and agree on an attendance plan.",
        "Small-group support in the weakest subject (2 sessions/week).",
        "Schedule the missing assessments before the term review.",
        "Review recent feedback cards and adjust the learning path.",
        "Human review required before any change of pathway.",
    ]


@pytest.mark.parametrize(
    ("features", "expected_risk", "expected_band"),
    [
        (
            {
                "attendance_rate": 0.5,
                "average_score": 10.0,
                "failed_competencies": 3,
            },
            0.315,
            "moderate",
        ),
        (
            {
                "attendance_rate": 0.4,
                "average_score": 8.0,
                "failed_competencies": 4,
                "missing_assessments": 3,
            },
            0.517,
            "high",
        ),
    ],
)
def test_gap_risk_band_thresholds(
    client: TestClient,
    features: dict[str, Any],
    expected_risk: float,
    expected_band: str,
) -> None:
    response = client.post("/v1/gap-risk", json=gap_payload("L-BAND", **features))

    assert response.status_code == 200
    body = response.json()
    assert body["risk"] == pytest.approx(expected_risk)
    assert body["band"] == expected_band
    assert body["advisory_only"] is True


# --------------------------------------------------------------------------- #
# Validation errors
# --------------------------------------------------------------------------- #
def test_gap_risk_rejects_score_out_of_range(client: TestClient) -> None:
    response = client.post("/v1/gap-risk", json=gap_payload(average_score=25.0))

    assert response.status_code == 422
    assert ("body", "features", "average_score") in error_locs(response)


def test_gap_risk_rejects_attendance_out_of_range(client: TestClient) -> None:
    response = client.post(
        "/v1/gap-risk", json=gap_payload(attendance_rate=1.2)
    )

    assert response.status_code == 422
    assert ("body", "features", "attendance_rate") in error_locs(response)


def test_gap_risk_rejects_empty_learner_key(client: TestClient) -> None:
    response = client.post("/v1/gap-risk", json=gap_payload(""))

    assert response.status_code == 422
    assert ("body", "learner_key") in error_locs(response)


def test_gap_risk_rejects_too_long_learner_key(client: TestClient) -> None:
    response = client.post("/v1/gap-risk", json=gap_payload("L" * 65))

    assert response.status_code == 422
    assert ("body", "learner_key") in error_locs(response)


def test_gap_risk_rejects_missing_features(client: TestClient) -> None:
    response = client.post("/v1/gap-risk", json={"learner_key": "L-001"})

    assert response.status_code == 422
    assert ("body", "features") in error_locs(response)


# --------------------------------------------------------------------------- #
# /v1/early-warning
# --------------------------------------------------------------------------- #
def test_early_warning_filters_and_sorts(client: TestClient) -> None:
    response = client.post(
        "/v1/early-warning",
        json={
            "learners": [
                gap_payload("L-LOW"),
                gap_payload(
                    "L-MODERATE",
                    attendance_rate=0.5,
                    average_score=10.0,
                    failed_competencies=3,
                ),
                gap_payload(
                    "L-HIGH",
                    attendance_rate=0.4,
                    average_score=8.0,
                    failed_competencies=4,
                    missing_assessments=3,
                ),
                gap_payload(
                    "L-CRITICAL",
                    attendance_rate=0.5,
                    average_score=5.0,
                    missing_assessments=6,
                    failed_competencies=10,
                    support_flags=4,
                    trend_delta=-5.0,
                ),
            ]
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 3
    assert [item["learner_key"] for item in body["items"]] == [
        "L-CRITICAL",
        "L-HIGH",
        "L-MODERATE",
    ]
    risks = [item["risk"] for item in body["items"]]
    assert risks == pytest.approx([0.923, 0.517, 0.315])
    assert risks == sorted(risks, reverse=True)
    assert all(item["advisory_only"] is True for item in body["items"])

    generated_at = datetime.fromisoformat(body["generated_at"])
    assert generated_at.tzinfo is not None


def test_early_warning_empty_list(client: TestClient) -> None:
    response = client.post("/v1/early-warning", json={"learners": []})

    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 0
    assert body["items"] == []


def test_early_warning_rejects_empty_learner_key(client: TestClient) -> None:
    response = client.post(
        "/v1/early-warning", json={"learners": [gap_payload("")]}
    )

    assert response.status_code == 422
    assert ("body", "learners", 0, "learner_key") in error_locs(response)


def test_early_warning_rejects_more_than_500_learners(
    client: TestClient,
) -> None:
    learners = [gap_payload(f"L-{index:03d}") for index in range(501)]

    response = client.post("/v1/early-warning", json={"learners": learners})

    assert response.status_code == 422
    assert ("body", "learners") in error_locs(response)


# --------------------------------------------------------------------------- #
# /v1/recommendations
# --------------------------------------------------------------------------- #
def test_recommendations_all_signals(client: TestClient) -> None:
    response = client.post(
        "/v1/recommendations",
        json=recommendation_payload(
            learner_key="L-REC",
            gaps=["fractions", "decimals", "geometry", "measurement"],
            strengths=["mental arithmetic"],
            interests=["football"],
            needs_support=True,
            has_talent_signal=True,
        ),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["learner_key"] == "L-REC"
    assert body["recommendations"] == [
        "Targeted practice for: fractions, decimals, geometry.",
        "Use mental arithmetic as a lever in the next lesson.",
        "Anchor activities in the learner's interest: football.",
        "Continue the support programme and review in 4 weeks.",
        "Offer an enrichment track (club, competition or showcase).",
        "Final decision belongs to the educational team.",
    ]
    assert "measurement" not in body["recommendations"][0]
    assert body["rationale"] == [
        "Gaps were reported by the assessment pipeline.",
        "Strength-based approach protects motivation.",
        "Interest-driven tasks improve engagement.",
        "Support history indicates a need for continuity.",
        "Talent signal detected; enrichment prevents boredom.",
    ]
    assert body["advisory_only"] is True


@pytest.mark.parametrize(
    ("overrides", "expected"),
    [
        ({"gaps": ["fractions"]}, "Targeted practice for: fractions."),
        ({"strengths": ["algebra"]}, "Use algebra as a lever in the next lesson."),
        (
            {"interests": ["chess"]},
            "Anchor activities in the learner's interest: chess.",
        ),
        (
            {"needs_support": True},
            "Continue the support programme and review in 4 weeks.",
        ),
        (
            {"has_talent_signal": True},
            "Offer an enrichment track (club, competition or showcase).",
        ),
    ],
)
def test_recommendations_individual_signals(
    client: TestClient, overrides: dict[str, Any], expected: str
) -> None:
    response = client.post(
        "/v1/recommendations",
        json=recommendation_payload(learner_key="L-SIGNAL", **overrides),
    )

    assert response.status_code == 200
    body = response.json()
    assert expected in body["recommendations"]
    assert not any(
        "Keep the standard path" in item for item in body["recommendations"]
    )
    assert body["rationale"]
    assert body["recommendations"][-1] == (
        "Final decision belongs to the educational team."
    )
    assert body["advisory_only"] is True


def test_recommendations_fallback(client: TestClient) -> None:
    response = client.post(
        "/v1/recommendations",
        json=recommendation_payload(learner_key="L-STANDARD"),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["recommendations"] == [
        "Keep the standard path and reassess at the next checkpoint.",
        "Final decision belongs to the educational team.",
    ]
    assert body["rationale"] == ["No risk or talent signal in the provided data."]
    assert body["advisory_only"] is True


def test_recommendations_rejects_more_than_20_items(client: TestClient) -> None:
    response = client.post(
        "/v1/recommendations",
        json=recommendation_payload(gaps=[f"gap-{index}" for index in range(21)]),
    )

    assert response.status_code == 422
    assert ("body", "gaps") in error_locs(response)


# --------------------------------------------------------------------------- #
# Advisory-only guarantee
# --------------------------------------------------------------------------- #
def test_advisory_only_flags(client: TestClient) -> None:
    health = client.get("/health").json()
    assert health["persists_data"] is False

    gap = client.post("/v1/gap-risk", json=gap_payload("L-ADV")).json()
    assert gap["advisory_only"] is True

    warning = client.post(
        "/v1/early-warning",
        json={
            "learners": [
                gap_payload(
                    "L-ADV-EW",
                    attendance_rate=0.5,
                    average_score=5.0,
                    failed_competencies=10,
                )
            ]
        },
    ).json()
    assert warning["items"]
    assert all(item["advisory_only"] is True for item in warning["items"])

    recommendation = client.post(
        "/v1/recommendations",
        json=recommendation_payload(learner_key="L-ADV-REC"),
    ).json()
    assert recommendation["advisory_only"] is True
