"""Ryad Al Aqsa — ML advisory service (FastAPI).

The service is intentionally *advisory*: every response is a signal for a
human decision, never an automatic sanction or placement. All inputs are
minimised (aggregates, no names) and no data is persisted here.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

APP_VERSION = "0.1.0"

app = FastAPI(
    title="Ryad Al Aqsa ML Service",
    version=APP_VERSION,
    description="Advisory models: gap risk, early warning, recommendations.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class GapFeatures(BaseModel):
    """Minimised features for a single learner (no identifiers)."""

    attendance_rate: float = Field(ge=0, le=1, description="0..1 presence rate")
    average_score: float = Field(ge=0, le=20, description="Average out of 20")
    missing_assessments: int = Field(default=0, ge=0, le=50)
    failed_competencies: int = Field(default=0, ge=0, le=100)
    support_flags: int = Field(default=0, ge=0, le=20)
    trend_delta: float = Field(default=0, ge=-20, le=20, description="Recent minus previous average")


class GapRequest(BaseModel):
    learner_key: str = Field(min_length=1, max_length=64, description="Pseudonymous key (never a name)")
    features: GapFeatures


class GapResponse(BaseModel):
    learner_key: str
    risk: float
    band: Literal["low", "moderate", "high", "critical"]
    drivers: list[str]
    suggested_actions: list[str]
    advisory_only: bool = True


class EarlyWarningItem(GapRequest):
    pass


class EarlyWarningRequest(BaseModel):
    learners: list[EarlyWarningItem] = Field(default_factory=list, max_length=500)


class EarlyWarningResponse(BaseModel):
    generated_at: str
    count: int
    items: list[GapResponse]


class RecommendationRequest(BaseModel):
    learner_key: str
    strengths: list[str] = Field(default_factory=list, max_length=20)
    interests: list[str] = Field(default_factory=list, max_length=20)
    gaps: list[str] = Field(default_factory=list, max_length=20)
    needs_support: bool = False
    has_talent_signal: bool = False


class RecommendationResponse(BaseModel):
    learner_key: str
    recommendations: list[str]
    rationale: list[str]
    advisory_only: bool = True


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def _band(risk: float) -> Literal["low", "moderate", "high", "critical"]:
    if risk >= 0.75:
        return "critical"
    if risk >= 0.5:
        return "high"
    if risk >= 0.3:
        return "moderate"
    return "low"


def score_gap(features: GapFeatures) -> tuple[float, list[str]]:
    """Transparent weighted score — mirrors backend/ml.js for parity."""
    drivers: list[str] = []
    risk = 0.0

    attendance_gap = 1.0 - features.attendance_rate
    if attendance_gap >= 0.15:
        risk += attendance_gap * 0.35
        drivers.append(f"attendance {features.attendance_rate:.0%}")

    normalized = features.average_score / 20.0
    if normalized < 0.6:
        risk += (0.6 - normalized) * 0.9
        drivers.append(f"average {features.average_score:.1f}/20")

    if features.failed_competencies:
        risk += _clamp(features.failed_competencies / 12.0) * 0.2
        drivers.append(f"{features.failed_competencies} gap(s)")

    if features.missing_assessments:
        risk += _clamp(features.missing_assessments / 6.0) * 0.12
        drivers.append(f"{features.missing_assessments} missing assessment(s)")

    if features.support_flags:
        risk += _clamp(features.support_flags / 5.0) * 0.12
        drivers.append("support history")

    if features.trend_delta < -1:
        risk += _clamp(abs(features.trend_delta) / 10.0) * 0.1
        drivers.append(f"declining trend {features.trend_delta:+.1f}")

    return round(_clamp(risk), 3), drivers


def actions_for(risk: float, features: GapFeatures) -> list[str]:
    actions: list[str] = []
    if features.attendance_rate < 0.85:
        actions.append("Contact the family and agree on an attendance plan.")
    if features.average_score < 10:
        actions.append("Small-group support in the weakest subject (2 sessions/week).")
    if features.missing_assessments > 0:
        actions.append("Schedule the missing assessments before the term review.")
    if features.trend_delta < -1:
        actions.append("Review recent feedback cards and adjust the learning path.")
    if not actions:
        actions.append("Maintain the current plan; reassess at the next checkpoint.")
    actions.append("Human review required before any change of pathway.")
    return actions


@app.get("/health")
def health() -> dict[str, object]:
    return {
        "status": "ok",
        "service": "ryad-ml",
        "version": APP_VERSION,
        "models": ["gap-risk-v1", "recommendations-v1"],
        "persists_data": False,
    }


@app.post("/v1/gap-risk", response_model=GapResponse)
def gap_risk(payload: GapRequest) -> GapResponse:
    risk, drivers = score_gap(payload.features)
    return GapResponse(
        learner_key=payload.learner_key,
        risk=risk,
        band=_band(risk),
        drivers=drivers,
        suggested_actions=actions_for(risk, payload.features),
    )


@app.post("/v1/early-warning", response_model=EarlyWarningResponse)
def early_warning(payload: EarlyWarningRequest) -> EarlyWarningResponse:
    items: list[GapResponse] = []
    for learner in payload.learners:
        risk, drivers = score_gap(learner.features)
        if risk >= 0.3:
            items.append(
                GapResponse(
                    learner_key=learner.learner_key,
                    risk=risk,
                    band=_band(risk),
                    drivers=drivers,
                    suggested_actions=actions_for(risk, learner.features),
                )
            )
    items.sort(key=lambda item: item.risk, reverse=True)
    return EarlyWarningResponse(
        generated_at=datetime.now(timezone.utc).isoformat(),
        count=len(items),
        items=items,
    )


@app.post("/v1/recommendations", response_model=RecommendationResponse)
def recommendations(payload: RecommendationRequest) -> RecommendationResponse:
    recs: list[str] = []
    rationale: list[str] = []

    if payload.gaps:
        recs.append(f"Targeted practice for: {', '.join(payload.gaps[:3])}.")
        rationale.append("Gaps were reported by the assessment pipeline.")
    if payload.strengths:
        recs.append(f"Use {payload.strengths[0]} as a lever in the next lesson.")
        rationale.append("Strength-based approach protects motivation.")
    if payload.interests:
        recs.append(f"Anchor activities in the learner's interest: {payload.interests[0]}.")
        rationale.append("Interest-driven tasks improve engagement.")
    if payload.needs_support:
        recs.append("Continue the support programme and review in 4 weeks.")
        rationale.append("Support history indicates a need for continuity.")
    if payload.has_talent_signal:
        recs.append("Offer an enrichment track (club, competition or showcase).")
        rationale.append("Talent signal detected; enrichment prevents boredom.")
    if not recs:
        recs.append("Keep the standard path and reassess at the next checkpoint.")
        rationale.append("No risk or talent signal in the provided data.")

    recs.append("Final decision belongs to the educational team.")
    return RecommendationResponse(
        learner_key=payload.learner_key,
        recommendations=recs,
        rationale=rationale,
    )
