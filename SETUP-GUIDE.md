# Complete Setup Guide — Pawport Transport Booking

Follow these steps in order to get the booking system working.

---

## Google Indexing and SEO

The Next.js site serves `/robots.txt` and `/sitemap.xml` automatically. Before deploying to production, set `NEXT_PUBLIC_SITE_URL` in the hosting environment to the canonical public origin, including `https://` and without a trailing slash (for example, `https://www.example.com`). This value is used for canonical URLs and the sitemap. Do not use a preview deployment URL.

After deployment:

1. Open `https://your-domain/robots.txt` and confirm it lists the sitemap and blocks `/api/`.
2. Open `https://your-domain/sitemap.xml` and confirm it lists the homepage, About, services, process, stories, and contact pages.
3. In Google Search Console, add and verify the domain property using its DNS TXT record. Make the client the owner and add your account as a full user.
4. In Search Console, submit `sitemap.xml`, then inspect the homepage and `/services` and request indexing if they are not indexed.
5. Check Search Console's Page indexing report after Google has had time to crawl. Submission and requests do not guarantee indexing or rankings.

Google Search Console verification, GA4 installation, and Google Business Profile setup require access to the client's Google account and DNS/hosting. Never ask the client to share their Google password.

---

## Step 1: Supabase Storage Bucket

### 1.1 Log in to Supabase
- Go to https://app.supabase.com
- Select your project

### 1.2 Create Storage Bucket
- Left sidebar → **Storage** → **New Bucket**
- Name: `pet-images`
- Check: **Public bucket** (so Gupshup can fetch the image)
- Click **Create**

### 1.3 Verify Bucket Policy
- Click on the `pet-images` bucket
- Go to the **Policies** tab
- Add a policy: `Allow public SELECT (read)` → everyone can view
- Add a policy: `Allow INSERT` → authenticated users can upload
- Add a policy: `Allow DELETE` → authenticated users can delete

### 1.4 Get Your Credentials
- Left sidebar → **Settings** → **API**
- Copy your **Project URL** (looks like `https://xxx.supabase.co`)
- Copy your **service_role key** (secret key, starts with `eyJ...`)
- Save these for Step 3

---

## Step 2: Gupshup WhatsApp Templates

### 2.1 Log in to Gupshup
- Go to https://apps.gupshup.io/whatsapp
- Sign in to your account

### 2.2 Create Template 1: Transporter

1. Click **Templates** → **+ Create Template**

2. Fill in:

| Field | Value |
|-------|-------|
| Template Name | `pawport_transporter` |
| Language | English |
| Category | Utility |
| Header | **Image** |

3. **Body** — copy and paste this exact text:

```
🐾 *New Pet Transport Booking*

*Customer Information*
The customer's name is {{1}} and you can contact them on WhatsApp at {{2}}.

*Pet Profile*
We will be transporting a pet named {{3}}. This pet is a {{4}} (Breed: {{5}}). The pet is {{6}} of age and weighs around {{7}}.
Important notes and health details: {{8}}.

*Trip Details*
The journey will begin with a pickup at {{9}} and end with a dropoff at {{10}}. The scheduled date for transport is {{11}} during the {{12}} time slot. The preferred mode of transport is {{13}}.

—— Pawport Transport
```

4. **Sample Values** (Gupshup will detect 13 variables and ask for each):

| Variable | Sample Value |
|----------|-------------|
| {{1}} | Gobinath Selvam |
| {{2}} | 919876543210 |
| {{3}} | Bruno |
| {{4}} | Dog |
| {{5}} | Labrador |
| {{6}} | 2 years |
| {{7}} | 15 kg |
| {{8}} | Friendly, no medical issues |
| {{9}} | Chennai, Tamil Nadu |
| {{10}} | Bangalore, Karnataka |
| {{11}} | 15 Aug 2026 |
| {{12}} | Morning 9 AM - 12 PM |
| {{13}} | Ground Transport |

5. **Footer:** `Thank you for choosing Pawport Transport`

6. **Buttons:** Leave empty

7. Click **Submit** for approval

### 2.3 Create Template 2: Buyer Confirmation

1. Click **Templates** → **+ Create Template**

2. Fill in:

| Field | Value |
|-------|-------|
| Template Name | `pawport_buyer` |
| Language | English |
| Category | Utility |
| Header | **None** |

3. **Body** — copy and paste this exact text:

```
🐾 *Booking Confirmed!*

Hi {{1}}, your pet transport booking has been received!

*Booking Summary*
Pet: {{2}}
Pickup: {{3}}
Dropoff: {{4}}
Date: {{5}}
Time: {{6}}
Mode: {{7}}

Our transporter will review your booking and contact you shortly on WhatsApp.

For urgent queries, contact us at +91 90874 70137.

—— Pawport Transport 🐾
```

4. **Sample Values:**

| Variable | Sample Value |
|----------|-------------|
| {{1}} | Gobinath Selvam |
| {{2}} | Bruno |
| {{3}} | Chennai, Tamil Nadu |
| {{4}} | Bangalore, Karnataka |
| {{5}} | 15 Aug 2026 |
| {{6}} | Morning 9 AM - 12 PM |
| {{7}} | Ground Transport |

5. **Footer:** `Thank you for choosing Pawport Transport`

6. **Buttons:** Leave empty

7. Click **Submit** for approval

### 2.4 Get Template IDs

After both templates are approved (usually within hours):
- Go to **Templates**
- Find `pawport_transporter` → copy its **Template ID**
- Find `pawport_buyer` → copy its **Template ID**
- Save these for Step 3

### 2.5 Get Gupshup Credentials

- Go to **Settings** → **API Keys**
- Copy your **API Key**
- Note your **WABA number** (the WhatsApp Business number, e.g. `919876543210`)
- Note your **App Name**
- Save these for Step 3

---

## Step 3: Configure backend/.env

Open `backend/.env` and replace with your actual values:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Supabase (from Step 1.4)
SUPABASE_URL=https://sdqdsxhgzfokpbmvxgul.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# JWT
JWT_SECRET=eqweiugfodkbcjhduocvfwfyiqdifkwhd723824ndfbwefsdj

# Gupshup (from Steps 2.4 and 2.5)
GUPSHUP_API_KEY=your-gupshup-api-key
GUPSHUP_SOURCE_NUMBER=your-waba-phone-number
GUPSHUP_APP_NAME=your-gupshup-app-name
GUPSHUP_TEMPLATE_TRANSPORTER=template-1-id-from-step-2-4
GUPSHUP_TEMPLATE_BUYER=template-2-id-from-step-2-4
```

---

## Step 4: Deploy & Test

### 4.1 Start the Backend

```bash
cd backend
npm install
npm start
```

You should see: `Server running on port 5000`

### 4.2 Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4.3 Test the Booking Form

1. Open http://localhost:5173 (or whatever port Vite shows)
2. Go to the booking page
3. Fill in the 3-step form:
   - Step 1: Select pet type, name, breed, age, weight, details, upload photo
   - Step 2: Enter pickup, dropoff, date, time, transport mode
   - Step 3: Enter your name and WhatsApp number
4. Click **"Send via WhatsApp"**
5. Check:
   - **Transporter's WhatsApp** (+91 90874 70137): should receive booking with pet photo
   - **Your WhatsApp** (the number you entered): should receive confirmation message

### 4.4 Debugging

If messages don't arrive:
- Check backend terminal for errors
- Verify Gupshup template is **Approved** (not Draft or Rejected)
- Verify all env vars are set correctly in `backend/.env`
- Verify Supabase bucket `pet-images` exists and is public

---

## Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  1. User fills form + uploads pet photo                  │
│         │                                                │
│         ▼                                                │
│  2. Frontend sends FormData to backend /api/orders       │
│         │                                                │
│         ▼                                                │
│  3. Backend uploads photo to Supabase                    │
│     → gets public URL                                    │
│         │                                                │
│         ├──────────────────────────────────────┐         │
│         ▼                                      ▼         │
│  4a. Gupshup → Transporter             4b. Gupshup →    │
│      +91 90874 70137                         Buyer      │
│      🖼 Pet photo (header)                   📝 Order   │
│      📝 Full booking details                   summary   │
│         │                                      │         │
│         ▼                                      ▼         │
│  5. Image deleted from Supabase                          │
│     (no storage buildup)                                 │
│                                                          │
└──────────────────────────────────────────────────────────┘