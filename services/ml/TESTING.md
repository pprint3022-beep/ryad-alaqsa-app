# Testing the ML service

The service is a stateless FastAPI app. The suite uses FastAPI's in-process
`TestClient`, so it needs no running server, no model training, no database and
no network access.

## Prerequisites

- Python 3.11 or 3.12 (the Docker image uses 3.12)
- Run every command from this directory: `services/ml`

## Setup

Windows PowerShell:

```powershell
cd services/ml
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
```

macOS / Linux:

```bash
cd services/ml
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
```

`requirements-dev.txt` pulls in `requirements.txt` (runtime dependencies,
including `httpx`, which backs `TestClient`) and adds `pytest`.

## Run the tests

```bash
python -m pytest -q
```

Expected last line (exact count for the current suite):

```text
23 passed in 0.XXs
```

Useful variants:

```bash
python -m pytest -q -ra          # show a short summary of skipped/xfailed tests
python -m pytest -q tests/test_api.py::test_gap_risk_critical
python -m pytest -q -k "early_warning"
python -m pytest -q --collect-only   # confirm the 23 collected cases
```

## Coverage

| Area | Tests |
|---|---|
| `GET /health` | service/version/models/persistence contract |
| `POST /v1/gap-risk` | low risk (no drivers), critical risk (0.923, 6 drivers, 5 actions), moderate/high band thresholds |
| Validation | score and attendance out of range, empty/oversized `learner_key`, missing `features`, >500 early-warning learners, >20 recommendation items |
| `POST /v1/early-warning` | drops learners below risk 0.3, sorts descending, echoes keys, UTC timestamp, empty list |
| `POST /v1/recommendations` | gaps (first 3 only), strengths, interests, support flag, talent signal, fallback plan |
| Advisory guarantee | `advisory_only: true` on all response models; `persists_data: false` on health |

The tests assert the transparent scoring formula directly, for example:

- low: attendance 98%, average 16/20 → risk `0.0`, band `low`
- moderate: attendance 50%, average 10/20, 3 failed competencies → risk `0.315`
- high: attendance 40%, average 8/20, 4 failed competencies, 3 missing assessments → risk `0.517`
- critical: attendance 50%, average 5/20, 10 failed competencies, 6 missing assessments, 4 support flags, trend -5 → risk `0.923`

## Troubleshooting

- **`TypeError: Client.__init__() got an unexpected keyword argument 'app'`**
  The installed `httpx` is newer than the Starlette `TestClient` supports.
  Install the pinned runtime dependencies: `python -m pip install -r requirements.txt`.
- **`No module named app`** — run pytest from `services/ml`; `pytest.ini` sets
  `pythonpath = .`.
- **`python` opens the Microsoft Store** — install Python 3.11/3.12 and disable
  the `python.exe` App Execution Alias, or invoke the interpreter by full path.
- **Pydantic build errors on Python 3.13** — use Python 3.12, matching the
  Docker image; the pinned `pydantic==2.7.4` predates 3.13 support.

## Notes

- No test mutates data: the service keeps everything in memory and persists
  nothing.
- `RecommendationRequest.learner_key` currently has no length constraint
  (unlike `GapRequest.learner_key`). This is existing behaviour and is not
  asserted as an error by the suite.
