FCPL 2026 Teams and Captains package

Replace in GitHub: index.html, styles.css, app.js, config.js, fcpl-logo.png, and team-logos folder. Delete old data.js if present.

New Teams tab includes six team cards, captain name/photo or placeholder, players bought, total spent, individual squad pages, optional remaining purse, mobile layout, and Realtime refresh. Squad membership is automatic from players where auction_status=Sold and team_id matches.

Required Supabase team columns: captain_name, captain_photo_url, starting_purse, display_order. The package works when starting_purse is NULL.

## Large captain-photo update
Captain portraits are now significantly larger on both the team overview cards and individual team pages. The responsive layout scales the portraits for tablets and phones without affecting squad cards or player profiles.
