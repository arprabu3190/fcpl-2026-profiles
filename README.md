# FCPL 2026 Mock-Accurate Player Showcase
This is a full replacement package. The Player Showcase is structurally rebuilt into three columns on desktop and a deliberate stacked mobile layout. Photos always use contain over a blurred duplicate background. Replace index.html, styles.css, app.js, config.js, fcpl-logo.png, hero-stadium.png and the team-logos folder in GitHub. No Supabase schema change is required.

## Final status and team-filter update
Available, Unsold and Withdrawn auction panels now use concise status-specific messaging without repeating role, category or phase. Sold retains team, captain and sold-price details. The Players page includes a team filter. Team pages now include Overview/Squad tabs plus All, Batsmen, Bowlers and All-Rounders squad filters, with list rows opening the player profile popup.

## Light theme redesign
This build replaces the dark green visual system with warm white, pale blue and navy surfaces. It preserves Supabase data loading, Realtime updates, filters, full-photo containment, long-name handling, all four auction states, captain profiles and team role filters. Player Showcase uses a compact two-column profile with a full-width status ribbon to prevent empty space and clipping.

## Balanced light theme v2
This revision adds pale blue, lavender and teal background depth, reduces visual whiteness, and redesigns the Player Showcase with a 32/68 photo-detail split, compact six-card detail grid, colorful accent rails and integrated auction-state ribbon. Detail tiles use three columns by two rows on normal desktop screens and adapt to two columns or one column on smaller screens.

## Compact Player Showcase v3
This update removes the oversized stretched player-detail cards. Desktop details now use six fixed-height compact cards in a 3-column by 2-row grid. Common laptop/projector screens use 76px-tall cards; medium desktops use a compact 2-column by 3-row grid. Long-name rules are preserved, and all six details remain visible. Subtle FCPL background lettering fills excess space without adding more boxes.

## Navigation and sold-team allocation fix
Previous, player selector, player counter and Next now share a single aligned 50px navigation row. Sold players now use the previously empty profile area for a prominent team-allocation card containing the team logo, complete team name, captain, sold price and squad action. The bottom sold ribbon has also been restructured so long team names wrap cleanly instead of being squeezed.

## Single sold display and advanced search
Sold allocation is now shown once, in the integrated bottom ribbon; the duplicate large sold-team card is removed. The Players page now supports search by name or Player ID plus Role, Category, Phase, Experience, Status, Team, and Sort filters. Active filters and result count are displayed, with clear-search and reset-all controls.

## Sold display correction
The full sold-team allocation card in the main Player Showcase is retained. The duplicate SOLD footer ribbon is removed only for Sold players. Available, Unsold and Withdrawn players continue to use their concise bottom status ribbon. Advanced search and filters remain included.

## Separate desktop and mobile UI
One Supabase database and deployment now serve two dedicated layout systems. desktop.css targets laptops/projectors at 901px and above. mobile.css targets phones/tablets at 900px and below, with its own collapsible navigation, touch-sized controls, status-first showcase, mobile player cards, stacked team details and horizontally scrollable role filters. device-ui.js switches only when crossing the 900px breakpoint.

## Original green theme restored
The separate desktop and mobile layouts remain, but the light palette has been replaced with the original FCPL emerald, lime and gold visual system. Desktop/projector and mobile views still use separate CSS files and share one Supabase database.

## Mobile Previous/Next navigation fix
The mobile Player Showcase now always displays the player selector in the first row and two equal touch-friendly buttons in the second row: Previous and Next. The rules are scoped to #showcase and use explicit grid positions so older responsive CSS cannot hide or misplace the controls.
