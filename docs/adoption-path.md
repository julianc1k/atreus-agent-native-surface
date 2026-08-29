# Adoption path: SurfacePilot to OctoPoxy

This is a reuse plan, not OctoPoxy implementation. SurfacePilot remains a public lab with synthetic data. It will never contain private ATREUS Core code, client data, or a reusable framework.

## Entry gate

Work starts only after Julian crowns the lab and final demo video. The pilot then lives on a separate branch in the owning OctoPoxy repository. Nothing is implemented in this public repo.

## Architecture boundary

- Preserve OctoPoxy's accepted interface and canonical ATREUS Core.
- Add one thin website adapter and one tenant pack; never fork Core or create a second runtime.
- Business Brain owns approved business facts and provenance.
- Constitution owns narrow truth and authority boundaries.
- Server state and exact receipts own whether anything was sent, booked, paid, published, messaged, or completed.
- WebMCP tools may research, compare, prepare, and stage visible work. They may not perform or claim a consequential action.
- Final human confirmation stays in the existing server-owned action path.
- Correct wrong facts at their owning source, then regenerate the tenant projection. Never patch truth inside the adapter.

## Reuse from SurfacePilot

- The typed tenant-pack contract shape, without SurfacePilot's synthetic facts.
- Pure domain functions where their behavior fits the approved OctoPoxy journey.
- The thin WebMCP adapter pattern: strict schemas, runtime validation, cancellation, cleanup, and dynamic tool registration.
- Shared UI/domain functions so manual controls and tools produce the same visible result.
- Revision and content-hash binding so edits invalidate staged work.
- Tests for invalid input, stale state, reset, tool removal, safe text, and unsupported-browser fallback.

## Replace for the pilot

- Replace the synthetic pack with an approved Business Brain projection and source provenance.
- Replace demo flooring rules with owner-approved OctoPoxy qualification and recommendation logic.
- Replace hard-coded demo areas and limitations with approved tenant facts; unknown facts remain unknown.
- Replace the local-only demo receipt with staged state that the existing server-owned confirmation path validates again.
- Keep OctoPoxy's accepted design, copy, accessibility, responsive behavior, and existing human journey.

## Bounded OctoPoxy pilot

1. Freeze the accepted OctoPoxy UI and current canonical-Core identity.
2. Create one pilot branch in the owning OctoPoxy repo.
3. Define one typed projection of approved facts, provenance, limitations, and authority.
4. Connect narrow tools for approved facts, eligible service-area checks when sourced, visible project-fit preparation, and a dynamically available review brief.
5. Route manual controls and WebMCP calls through the same tenant-owned domain functions.
6. Bind staged work to its revision and content hash; any source edit invalidates it.
7. Keep confirmation in the existing server-owned path, with fresh validation and the exact relevant receipt.
8. Prove the normal OctoPoxy journey first, then the same journey through a current WebMCP-capable client.
9. Verify strict no-send behavior, tenant isolation, source provenance, desktop/mobile UI preservation, and manual fallback.
10. Present one frozen candidate to Julian. No release follows without his explicit product crown and the owning release lane.

## Future-client checklist

- [ ] Use the client's owning repository and a separate candidate branch.
- [ ] Preserve the accepted human interface and normal browser workflow.
- [ ] Create one approved Business Brain projection with provenance and unknowns.
- [ ] Keep the Constitution narrow and consequential authority server-owned.
- [ ] Add one tenant pack and one thin adapter; do not fork Core.
- [ ] Give tools distinct names, strict schemas, bounded outputs, cancellation, and cleanup.
- [ ] Expose no tool that can send, book, pay, publish, message, or claim completion.
- [ ] Share domain functions between UI and tools; bind staged work to exact revisions.
- [ ] Correct facts at source and regenerate downstream artifacts.
- [ ] Prove invalid-input handling, no-send, tenant isolation, manual fallback, and the natural user journey.
- [ ] Freeze one candidate and obtain the required human product and representation decisions.

## Stop rules

- Stop before implementation if the lab and final video are not crowned.
- Omit or return unknown for any fact without approved provenance.
- Stop if a proposed WebMCP tool crosses into send, booking, payment, publishing, messaging, or completion claims.
- Reject any design that requires a Core fork, tenant hardcoding in Core, a second finalizer, multitenancy inside this lab, or replacement of the accepted OctoPoxy UI.
- Stop and correct the owning Business Brain or policy source if the adapter would need to override truth.
- Do not release if no-send, tenant isolation, natural-journey proof, revision invalidation, or manual fallback fails.
- If WebMCP is unavailable, the existing human workflow remains the complete fallback; unsupported clients never block the business surface.
