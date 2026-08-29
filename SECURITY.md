# Security and trust boundary

SurfacePilot is a static, fictional demonstration. It intentionally has no backend, form submission, analytics, PII collection, account, payment, messaging, booking, or publishing capability.

## Agent boundary

The WebMCP adapter exposes exactly four tools:

1. `get_approved_business_facts`
2. `check_service_area`
3. `build_project_fit_board`
4. `stage_project_brief_for_review`

Only the first two are annotated read-only. None can approve, submit, send, publish, charge, or book. Human review is a visible page control, not a tool.

All tool inputs are bounded and independently validated at runtime. Unexpected properties are rejected. Text is rendered through React rather than injected as HTML. Tool registration is removed when the app unmounts and execution honors cancellation signals.

## Local receipt

Human approval stores a receipt in the current browser's `localStorage`. The receipt includes the exact draft revision and SHA-256 content hash. Any draft edit, fit-board rebuild, reset, or content mismatch invalidates the receipt. The receipt is not a signature, quote, booking, submission, or message.

## Network policy

The production Content Security Policy uses `connect-src 'none'`. The application loads no remote fonts, images, scripts, or trackers. Vite development mode requires its local connection and therefore should not be tested under the production policy.

Please report vulnerabilities through GitHub's private vulnerability reporting rather than placing sensitive details in a public issue.
