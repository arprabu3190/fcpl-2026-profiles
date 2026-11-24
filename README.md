# FCPL 2026 Centralized Supabase Website

This version loads players and teams from Supabase, saves auction updates centrally, and synchronizes all open devices through Realtime.

## Upload to GitHub
Upload/replace:
- index.html
- styles.css
- app.js
- config.js
- fcpl-logo.png
- team-logos folder

Delete old data.js from GitHub because centralized data now comes from Supabase.

## Public behavior
Visitors can view player profiles without signing in. The website updates automatically when an administrator saves a player.

## Admin behavior
Open Admin, sign in with the Supabase Authentication user, select player/status/team/price, and save. Only authenticated users can update due to RLS.

## Security
config.js contains only the Project URL and browser-safe publishable key. Never add an sb_secret key, service-role key, database password, or JWT secret.

## Testing
1. Open the public site in a normal browser and phone.
2. Open Admin on the auction laptop and sign in.
3. Mark one player Sold.
4. Confirm other devices show the SOLD stamp and team logo automatically.
5. Set the test player back to Available.
