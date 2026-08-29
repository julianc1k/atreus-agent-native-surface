# SurfacePilot demo script

**Target runtime:** 2 minutes 30 seconds  
**Status:** Recording and public upload pending.

## 0:00–0:20 — Establish the truth

Open the live site and show the top disclosure.

> “SurfacePilot is a fictional commercial-flooring business and an ATREUS agent-native demo. Every business fact is synthetic. Nothing here can create a real quote, booking, payment, message, or submission.”

## 0:20–0:40 — Give the agent the job

Use the canonical request:

> “I need durable flooring for a 1,500-square-foot Dallas restaurant with a short shutdown.”

Show the starting tool list. Explain that only three tools are initially available:

1. `get_approved_business_facts`
2. `check_service_area`
3. `build_project_fit_board`

## 0:40–1:15 — Build visible, bounded work

Let the agent read the approved demo facts, check Dallas, and run `build_project_fit_board` with the stated restaurant constraints.

> “The agent does not click around or invent an answer. It calls narrow page tools backed by the same deterministic logic as the manual controls.”

Show the page update to the ranked material fit board. Point out its assumptions, cautions, and required site-review questions.

## 1:15–1:45 — Reveal the fourth tool

Show that `stage_project_brief_for_review` is now available only because a current fit-board revision exists. Invoke it with that exact revision.

Show the visible, editable draft.

> “The fourth tool prepares the review surface. It still cannot approve, submit, message, charge, book, or publish anything.”

## 1:45–2:15 — Keep the human crown

Point to the intentionally absent consequential tools, then use the visible **Approve local demo receipt** button as the human.

> “Approval is not exposed as a WebMCP tool. This human-only button creates a SHA-256-bound receipt in this browser. The receipt says explicitly that nothing was sent, and any source or draft edit invalidates it.”

Show the local receipt and its revision/hash prefix.

## 2:15–2:30 — Reset cleanly

Select **Reset demonstration** in the footer.

> “Reset removes the fit board, staged draft, local receipt, and dynamic fourth tool. SurfacePilot returns to the canonical starting state, ready for another transparent human-and-agent workflow.”
