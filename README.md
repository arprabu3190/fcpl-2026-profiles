FCPL 2026 Teams and Captains package

Replace in GitHub: index.html, styles.css, app.js, config.js, fcpl-logo.png, and team-logos folder. Delete old data.js if present.

New Teams tab includes six team cards, captain name/photo or placeholder, players bought, total spent, individual squad pages, optional remaining purse, mobile layout, and Realtime refresh. Squad membership is automatic from players where auction_status=Sold and team_id matches.

Required Supabase team columns: captain_name, captain_photo_url, starting_purse, display_order. The package works when starting_purse is NULL.

## Captain-first team detail design
The individual team page now follows the approved captain-first layout: an oversized captain portrait is the primary visual, with a crown-style TEAM CAPTAIN badge and captain name below. Team identity and auction metrics appear in a secondary panel. Mobile layouts stack cleanly.

## Home page
The website now opens on a dedicated Home page with a league hero, live Supabase player/team/captain counts, six team cards, and direct links to Teams, Players and Player Showcase. Existing captain-first team details, squads, player profiles, admin login, team logos and Realtime remain included.
