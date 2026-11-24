# FCPL 2026 dynamic SOLD stamp and team-logo showcase

## Upload these public files/folders to GitHub
- index.html
- styles.css
- app.js
- data.js
- fcpl-logo.png
- team-logos folder, including firstcity-super-kings-xi.png

Do not upload PLAYER_DATA_VALIDATION.csv publicly.

## Behavior
- Available: no stamp, no team logo, AVAILABLE FOR AUCTION.
- Sold: SOLD stamp over lower photo, selected team logo/name, optional sold price.
- Unsold: UNSOLD stamp, no team logo.
- Withdrawn: WITHDRAWN stamp, no team logo.
- Changing Sold back to another status clears team and price.

## Add more teams
1. Put each logo inside team-logos.
2. Add another object to window.FCPL_TEAMS in data.js, for example:
   {"id":"TEAM2","name":"Second Team","logo":"team-logos/second-team.png"}
3. Keep every id unique.

## Important free-version limitation
Admin updates are stored in the browser's localStorage. They are not automatically synchronized to other devices. Use Export results and Import results to move or back up auction results.
