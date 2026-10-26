# RouteBoard design contract

A vacancy route journal with strong sans typography, an olive charcoal identity and restrained amber stage controls. Two useful surfaces replace the generic main table: a vacancy rail with actual manual stages, and a selected vacancy journal containing its source and next actions. The action collection is a dated agenda. This is a product-specific replacement under the owner’s 26 October direction, not a template applied to the other products.

## Screen contract

Vacancy stage buttons filter the already searched/visible records; their counts are actual records in that result set. They do not represent a funnel, conversion rate or probability. Desktop vacancy selection keeps focus and opens company, role, manual stage, safe HTTP(S) source link, next open actions and completed history in the adjacent journal.

“Назначить действие” opens the existing form with the current vacancy preselected. A task is never silently marked done, and an application is never sent. The action collection groups real saved actions into open work and completed history, ordered by the stored day date. “Срок прошёл” compares the local calendar date without timezone conversion of the stored day.

The original computation output remains in a collapsed secondary disclosure. Create/edit, source URLs, full-text search, archive visibility, account administration, backup/restore and audit remain. Existing completed actions can still reference their archived vacancy. The editor captures revision when opened so a later save is checked against the viewed state.

## Tokens and typography

System sans, bold tightly tracked display heading, compact monospaced dates and labels. Page `#f4f4ee`, white journal, ink `#252823`, muted `#62675e`, primary `#384e32`, hover `#263923`, header `#252d24`, borders `#d7dbcf`, selected stage `#e6cf77`. Flat rules and 3px corners keep this surface distinct from the rounded OrtaInbox desk and DalelCheck evidence dossier. No external fonts/icons, charts or decorative illustrations.

## Responsive and access rules

The two-column workspace stacks at 700px; the vacancy rail briefly uses two columns before returning to one at 430px. Stage controls wrap. Actions keep real due dates and reachable edit buttons at every width. Native controls have minimum 44px targets, inputs 48px, focus rings and reduced-motion fallback; the archive checkbox sits within a minimum 44px label. Long role/company/action/source text wraps. Secondary tables retain their own labelled scroll container. The light journal is the designed scheme.

## Evidence and limits

All six existing Node tests and app/product-view syntax checks passed on bundled Node 24.19.0. Current browser flow/screenshots at 390/768/1440, stage-filter behavior, keyboard focus and console checks remain parent QA. Prior screenshots are historical. No live vacancy synchronization, actual application, interview, employment or integration is implied.

On narrow screens, choosing an item moves focus to the selected workspace; a return button restores focus to the chosen queue item. The mobile queue has its own bounded scrolling area so long collections do not bury the primary task.

## Final collection chrome refinement · 26 October 2026

The current collection header places create/refresh beside the title and a short task-specific description. A connected search label, archive toggle and live record count share one filter rail; the workflow guide follows the primary records. This removes the repeated heading/intro/help/actions/search/count stack while preserving the task-specific workspaces and mobile selection/focus behavior. The source/refusal/role controls remain unchanged. Counts use tabular numerals and the root uses antialiased system text. No motion or asset dependency was added.

The supplied desktop scaffold screenshots were visually inspected before this pass. Fresh rendered positions, keyboard/mobile behavior and console checks still require the parent browser pass; no pixel-position acceptance is inferred from CSS alone.

When a vacancy stage is selected, the live filter-rail status reports the number actually visible in that stage, the number eligible after search/archive filtering and the total saved count. Choosing all stages restores the ordinary shown/total count. This keeps stage filtering from overstating visible results.
