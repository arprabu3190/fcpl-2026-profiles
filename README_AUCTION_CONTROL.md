# FCPL 2026 Auction Control Upgrade

1. Run SUPABASE_AUCTION_CONTROL_SETUP.sql once in Supabase SQL Editor.
2. Replace/upload the website files, including the new auction-control.js.
3. Keep hero-stadium.png and the team-logos folder.
4. Test with one administrator browser and one public/incognito browser.

Features: required team/positive sold price validation, purse validation when starting_purse is configured, confirmation before save, current-player/Now on the Block, public auction dashboard, authenticated activity log, and Realtime refresh.

No squad-size or bidding-increment enforcement is enabled because those rules have not been supplied. Add them only after the committee finalizes the values.

## Team squad list update
Individual team squads now use a compact tabular list with no player photo thumbnails. Clicking any player row opens a modal profile containing the photo or placeholder, role, category, phase, experience, batting, bowling, previous-tournament status, team and sold price.

## Main players list update
The Players page now uses a compact responsive list without photo thumbnails. Clicking any player opens the existing profile popup with the photograph or branded placeholder and full cricket details. Search, role filter and auction-status filter continue to work.
