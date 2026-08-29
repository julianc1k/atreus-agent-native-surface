# Adoption path: SurfacePilot to OctoPoxy

This is a reuse plan, not OctoPoxy implementation. SurfacePilot remains a public lab with synthetic data. It will never contain private ATREUS Core code, client data, or a reusable framework.

## Entry gate

Work starts only after Julian crowns the lab and final demo video. That is a sequencing gate, not approval of an OctoPoxy product, business claim, or action. The pilot then lives on a separate branch in the owning OctoPoxy repository. Nothing is implemented in this public repo.

## Architecture boundary

- Preserve OctoPoxy's accepted interface, thin website adapter, canonical tenant sources, and canonical ATREUS Core. Extend those owners; do not transplant SurfacePilot's tenant-pack shape.
- Never fork Core, create a second runtime, or add a parallel adapter architecture.
- Canonical Core remains model-led for interpretation, judgment, recommendations, and language.
- Business Brain owns approved business facts and provenance.
- Constitution owns hard truth and narrow authority boundaries.
- Page/shared functions validate inputs, manage state, and orchestrate visible UI. Deterministic pure functions apply only to an actually approved deterministic business rule.
- Server state and exact receipts own whether anything was sent, booked, paid, published, messaged, or completed.
- WebMCP is stage-only. Its tools may research, compare, prepare, and stage visible work; they never send, book, pay, publish, message, quote, commit, or perform or claim completion.
- Current OctoPoxy truth is receipt-backed saved leads with strict no-send behavior and manual human relay outside WebMCP. No consequential route is assumed.
- If a server action route is later owner-approved and proved end to end, only the human-facing confirmation UI may invoke it. It is never exposed through WebMCP.
- Correct wrong facts at their owning source, then regenerate the tenant projection. Never patch truth inside the adapter.

## Reuse from SurfacePilot

- Strict schemas, independent runtime validation, bounded outputs, cancellation, cleanup, and dynamic tool registration.
- Shared state and UI orchestration so manual controls and tools produce the same visible result.
- Revision and content-hash binding so edits invalidate staged work.
- Tests for invalid input, stale state, reset, tool removal, safe text, and unsupported-browser fallback.

## Replace for the pilot

- Replace synthetic facts with the approved Business Brain projection derived from OctoPoxy's canonical tenant sources.
- Do not transplant SurfacePilot's flooring-fit logic. Core handles qualification and recommendation judgment; page functions remain state/UI plumbing unless a rule is explicitly approved as deterministic.
- Replace hard-coded demo areas and limitations with approved tenant facts; unknown facts remain unknown.
- Replace the local-only demo receipt with revision-bound staged state. It is not action proof.
- Keep OctoPoxy's accepted design, copy, accessibility, responsive behavior, and existing human journey.

## Bounded OctoPoxy pilot

1. After the lab/video sequencing crown, freeze the accepted OctoPoxy UI and current canonical-Core identity.
2. Create one pilot branch in the owning OctoPoxy repo.
3. Inventory the accepted thin adapter, canonical tenant sources, approved provenance, saved-lead receipt, no-send boundary, and manual relay.
4. Extend the adapter with narrow tools for approved facts and visible staged preparation; expose a service-area tool only when that rule is sourced and approved.
5. Keep Core responsible for interpretation and judgment. Shared page functions only validate, manage state, and update visible UI.
6. Bind staged work to its revision and content hash; any source edit invalidates it.
7. If a human-facing action is later proposed, discover its exact server route and prove identity, authorization, validation, idempotency, tenant isolation, and the relevant receipt. Only the human confirmation UI may invoke an approved, proved route; WebMCP remains stage-only and manual relay remains outside it.
8. Prove the normal OctoPoxy journey first, then the same journey through a current WebMCP-capable client.
9. Verify strict no-send behavior, tenant isolation, source provenance, desktop/mobile UI preservation, revision invalidation, and manual fallback.
10. Freeze one product candidate. Release requires Julian's product crown or explicit waiver; changed business facts, representation, or a consequential route require separate OctoPoxy owner approval.

## Future-client checklist

- [ ] Use the client's owning repository and a separate candidate branch.
- [ ] Preserve the accepted human interface and normal browser workflow.
- [ ] Extend the accepted thin adapter and canonical tenant sources; do not transplant SurfacePilot's pack or fork Core.
- [ ] Use an approved Business Brain projection with provenance and explicit unknowns.
- [ ] Keep Core model-led, Constitution authority narrow, and action truth server-owned.
- [ ] Limit page functions to validation, state, and UI orchestration except for genuinely approved deterministic rules.
- [ ] Give tools distinct names, strict schemas, bounded outputs, cancellation, and cleanup.
- [ ] Expose no tool that can send, book, pay, publish, message, quote, commit, or perform or claim completion.
- [ ] Share state/UI orchestration between manual controls and tools; bind staged work to exact revisions.
- [ ] Keep WebMCP stage-only. Discover and prove any later server action route for human-facing confirmation only; never expose that route as a tool.
- [ ] Correct facts at source and regenerate downstream artifacts.
- [ ] Prove invalid-input handling, no-send, tenant isolation, manual fallback, and the natural user journey.
- [ ] Treat lab/video sequencing, product taste, business representation, and consequential authority as separate decisions.
- [ ] Freeze one candidate and obtain Julian's product crown or explicit waiver plus any required client-owner approval.

## Stop rules

- Stop before pilot implementation if the lab and final video are not crowned; that crown grants sequence only.
- Omit or return unknown for any fact without approved provenance.
- Stop if a proposed WebMCP tool crosses into sending, booking, payment, publishing, messaging, quoting, committing, or performing or claiming completion. WebMCP remains stage-only regardless of route approval.
- A later owner-approved and end-to-end-proven server action route may be invoked only by the human-facing confirmation UI, never through WebMCP. Until that route exists, keep manual relay outside WebMCP.
- Reject any design that requires a Core fork, tenant hardcoding in Core, a second finalizer, a new adapter architecture, multitenancy inside this lab, or replacement of the accepted OctoPoxy UI.
- Reject page logic that replaces Core's interpretation or judgment unless it implements a specifically approved deterministic rule.
- Stop and correct the owning Business Brain or policy source if the adapter would need to override truth.
- Do not release if no-send, tenant isolation, natural-journey proof, revision invalidation, or manual fallback fails.
- Do not release without Julian's product crown or explicit waiver. Obtain separate OctoPoxy owner approval for changed business facts, representation, or any consequential route.
- If WebMCP is unavailable, the existing human workflow remains the complete fallback; unsupported clients never block the business surface.
