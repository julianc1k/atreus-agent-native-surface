# WebMCP Challenge submission

## Project

**Title:** SurfacePilot Commercial Flooring  
**Tagline:** The website an agent can reason with—and the human still controls.

SurfacePilot is a fictional Dallas commercial-flooring website and an ATREUS agent-native demo. It lets an agent turn operating constraints into a visible material-fit board and review draft without giving the agent any tool that can approve, submit, book, message, charge, or publish.

## Why WebMCP is a strong fit

Commercial flooring decisions depend on structured constraints: use, area, shutdown window, location, heat, moisture, slip resistance, maintenance, and appearance. WebMCP lets the live page expose that domain logic as narrow, typed tools instead of forcing an agent to scrape text or imitate clicks. The page, agent, and human share the same visible state, while the business keeps its interface and the human keeps the consequential decision.

## Better user experience

The user states the project once. The agent calls page-native tools, and SurfacePilot visibly updates with ranked systems, rationale, assumptions, cautions, and unresolved site questions. A fourth tool appears only after a current fit board exists. The human can then edit the prepared draft and create a revision/hash-bound local receipt. Any source or draft edit invalidates prior approval.

This is faster and more reliable than brittle UI actuation, but it does not hide the work or bypass the website.

## What the human and agent can do now

Three tools are initially available:

1. `get_approved_business_facts` returns synthetic capabilities, limitations, and provenance.
2. `check_service_area` classifies a city as eligible, ineligible, or unknown without collecting an address.
3. `build_project_fit_board` deterministically compares four flooring systems and updates the visible page.

After a fit board exists, `stage_project_brief_for_review` is dynamically registered for that exact revision. It prepares an editable, non-binding draft. Only the visible human control can create a local demo receipt. Reset removes the board, draft, receipt, and dynamic fourth tool.

## Implementation

SurfacePilot is a static React, TypeScript, and Vite application. It uses the official `webmcp-types` package, strict JSON Schemas plus independent Zod validation, abort-aware execution, dynamic registration cleanup, and fail-closed partial registration. The normal controls and WebMCP adapter call the same deterministic domain functions. SHA-256 receipt creation is race-safe and local to the browser. There is no backend, database, model API, or submission endpoint.

CI runs linting, TypeScript, unit tests, a production build, and Playwright desktop/mobile coverage including accessibility and WebMCP lifecycle regressions.

## Links

- **Live demo:** https://atreus-agent-native-surface-julianc1ks-projects.vercel.app
- **Public repository:** https://github.com/julianc1k/atreus-agent-native-surface
- **YouTube:** `PENDING JULIAN CROWN`

## Test the project

1. Open the live demo in the ChatGPT in-app browser, **or** Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled and the browser restarted. The complete manual fallback also works in modern browsers, including Safari.
2. Use the canonical request: **“I need durable flooring for a 1,500-square-foot Dallas restaurant with a short shutdown.”**
3. Inspect the three initial tools, then build the fit board with Dallas, restaurant, 1,500 square feet, a three-day shutdown, and the visible priorities.
4. Confirm the fit board appears with assumptions and site-review questions, and that the fourth staging tool is now available.
5. Stage the exact current revision. Confirm the editable review draft appears and no consequential tool exists.
6. As the human, select **Approve local demo receipt**. Confirm the receipt says nothing was sent and shows its revision/hash prefix.
7. Select **Reset demonstration** in the footer. Confirm the prepared work, local receipt, and fourth tool disappear and the canonical inputs return.

For a local run:

```bash
npm ci
npm run check
npm run test:e2e
```

Then start the blocking local development server in a separate terminal:

```bash
npm run dev
```

## Judging criteria

- **WebMCP leverage:** Narrow page-native tools replace scraping/click simulation; the fourth tool follows live page state; tool removal, strict schemas, cancellation, and read-only boundaries are enforced.
- **Execution:** The live responsive site shares deterministic logic between manual and agent workflows and has automated unit, browser, security-boundary, state-integrity, and accessibility coverage.
- **Impact:** The pattern shows how a service-business website can let agents prepare useful work without disintermediating the site or surrendering human control over consequential actions.
- **Creativity:** The Material Ledger interface makes agent work visible as a commercial specification surface, while a revision-bound local receipt turns “human in the loop” into a concrete product boundary.

## Disclosures

- SurfacePilot is fictional and all business data is synthetic.
- The demo cannot create a real quote, specification, booking, submission, message, payment, publication, warranty, or schedule.
- It collects no analytics or personally identifiable information.
- It performs no external data writes and its production Content Security Policy uses `connect-src 'none'`.
- The approval receipt stays in browser `localStorage`; it is not a signature or business transaction.
- The narrated recording and YouTube upload are pending Julian’s crown.

## Eligibility and ownership checklist

- [x] Public source repository with an MIT license.
- [x] Public live demo URL.
- [x] Git-tracked source, tests, documentation, and original interface screenshots.
- [x] Fictional-data and no-transaction disclosures are visible in the product and documentation.
- [x] Recordable demo outline is under three minutes.
- [ ] Julian crowns and uploads the final public YouTube demo.
- [ ] Verify the final video is under three minutes, publicly visible on YouTube, shows the functioning project, and includes audio narration explaining what was built and how WebMCP is used.
- [ ] Submitter confirms personal, jurisdiction, age, affiliation, and other eligibility under the official rules; this document makes no such assertion.
- [ ] Submitter completes the Devpost fields and submits before **September 3, 2026 at 1:00 p.m. PT**.
- [ ] Submitter performs a final rights, link, repository-publicity, and rules check immediately before submission.
- [ ] Do not alter the Devpost entry, submitted repository, or submitted live site until winners are announced; fork separately to continue development.
- [ ] Keep the application free and publicly accessible through the full judging period.
