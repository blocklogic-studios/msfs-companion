# MSFS Companion

A clean, phone-friendly flight sim companion for **Microsoft Flight Simulator 2024** (Xbox + PC).

Perfect for realistic GA and commercial flying when you already use SimBrief, charts, and iFly Schedules.

### Features
- Fetch your latest **SimBrief OFP** by username
- Key flight data (route, fuel, weights, times, cruise level)
- Live **METAR** for departure & arrival
- Simple interactive checklists (GA + Airliner)
- Dark, cockpit-friendly UI optimized for phone
- Works completely standalone (no PC bridge needed)

### Live Demo
Once deployed on Render, your URL will be something like:  
`https://msfs-companion.onrender.com`

---

## Quick Deploy on Render (Free)

1. Go to [render.com](https://render.com) and sign up / log in with GitHub
2. Click **New → Static Site**
3. Connect the repo: `blocklogic-studios/msfs-companion`
4. Settings:
   - **Name**: `msfs-companion` (or whatever you like)
   - **Branch**: `main`
   - **Root Directory**: leave blank
   - **Build Command**: leave blank (it's pure static)
   - **Publish Directory**: `.` (or leave as `/`)
5. Click **Create Static Site**

Render will give you a free HTTPS URL. Bookmark it on your phone.

> Free static sites on Render stay online and don't spin down like web services.

---

## Local Development

Just open `index.html` in a browser, or use any simple static server:

```bash
npx serve .
```

---

## How to Use

1. Enter your **SimBrief username** (the one you use on simbrief.com)
2. Click **Load Latest OFP**
3. The app pulls your most recent generated flight plan
4. Use the tabs for Overview, Weather, and Checklists

Tip: Generate the plan in SimBrief first (on phone or computer), then load it here.

---

## Roadmap Ideas
- Save favorite aircraft checklists
- Direct links to Navigraph / charts
- iFly Schedules integration
- PWA install prompt ("Add to Home Screen")
- More detailed fuel & performance cards

Feel free to fork and improve!

---

Made for Xbox MSFS pilots who want a real companion experience.
