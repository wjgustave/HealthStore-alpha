# Component decision log

Custom components justified where NHS.UK frontend does not meet commissioner decision-support needs.

| ID | Component | Need | NHS alternative considered | Owner | Review |
|----|-----------|------|---------------------------|-------|--------|
| C-01 | LocalContextSelector | Inline geography + baseline control | Select + hint text | Prototype team | Jun 2026 |
| C-02 | EvidenceLabel | Controlled evidence classification | Tags + inset text | Clinical evidence | Jun 2026 |
| C-03 | ImpactMetric | Metric with assumptions and provenance | Summary list | Benefits | Jun 2026 |
| C-04 | BenefitStack | Separate benefit categories | Table | Benefits | Jun 2026 |
| C-05 | PathwayChangeMap | Before/after pathway with text equivalent | Details + lists | Service design | Jun 2026 |
| C-06 | AssurancePassport | Domain status grid | Summary list + tags | Assurance | Jun 2026 |
| C-07 | CommercialReadiness | Route + buyer pack status | Inset text | Commercial | Jun 2026 |
| C-08 | ScenarioControls | Scenario toggle with linked recalculation | Radios | Benefits | Jun 2026 |
| C-09 | CommissioningCaseTracker | Case stage + next action | Task list pattern | Operations | Jun 2026 |
| C-10 | Text colour | Blue reserved for interactive text; headings/KPIs use NHS black | `--text-primary` for static text | UX | Jul 2026 |
| C-11 | Tags / badges | Softer status labels; GOV.UK Tag style (tinted bg, same-hue dark text, regular weight, no border) adopted for `.badge` and `.nhsuk-tag` | NHS Tag (bordered, bold) | UX | Jul 2026 |
