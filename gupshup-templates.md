# Gupshup WhatsApp Templates — Setup Guide

Go to **https://apps.gupshup.io/whatsapp** → **Templates** → Create **2 templates**

---

## How It Works

```
User fills booking form + uploads pet photo → clicks Submit
        │
        ▼
Frontend POSTs FormData (image + text) to backend /api/orders
        │
        ▼
Backend uploads image to Supabase → gets public URL (temporary)
        │
        ├─► Sends TEMPLATE 1 to TRANSPORTER (+91 90874 70137)
        │      Header: pet photo image
        │      Body: 13 params (all booking + customer details)
        │
        ├─► Sends TEMPLATE 2 to BUYER (their WhatsApp number)
        │      Body: 7 params (confirmation summary)
        │
        └─► Deletes image from Supabase immediately
```

**Both receive WhatsApp messages automatically via Gupshup. No wa.me links. No manual steps.**

---

## Template 1: Transporter (13 params + Image Header)

### Basic Info

| Field | Value |
|-------|-------|
| **Template Name** | `pawport_transporter` |
| **Language** | English |
| **Category** | Utility |
| **Header** | **Image** |

### Body — Copy & Paste

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

### Sample Values

| Variable | Sample Value |
|----------|-------------|
| `{{1}}` | Gobinath Selvam |
| `{{2}}` | 919876543210 |
| `{{3}}` | Bruno |
| `{{4}}` | Dog |
| `{{5}}` | Labrador |
| `{{6}}` | 2 years |
| `{{7}}` | 15 kg |
| `{{8}}` | Friendly, no medical issues |
| `{{9}}` | Chennai, Tamil Nadu |
| `{{10}}` | Bangalore, Karnataka |
| `{{11}}` | 15 Aug 2026 |
| `{{12}}` | Morning 9 AM - 12 PM |
| `{{13}}` | Ground Transport |

### Footer

```
Thank you for choosing Pawport Transport
```

### Buttons

None

---

## Template 2: Buyer Confirmation (7 params, Text Only)

### Basic Info

| Field | Value |
|-------|-------|
| **Template Name** | `pawport_buyer` |
| **Language** | English |
| **Category** | Utility |
| **Header** | **None** |

### Body — Copy & Paste

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

### Sample Values

| Variable | Sample Value |
|----------|-------------|
| `{{1}}` | Gobinath Selvam |
| `{{2}}` | Bruno |
| `{{3}}` | Chennai, Tamil Nadu |
| `{{4}}` | Bangalore, Karnataka |
| `{{5}}` | 15 Aug 2026 |
| `{{6}}` | Morning 9 AM - 12 PM |
| `{{7}}` | Ground Transport |

### Footer

```
Thank you for choosing Pawport Transport
```

### Buttons

None

---

## Backend Config (backend/.env)

```env
# Supabase (for temporary image URL)
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# Gupshup
GUPSHUP_API_KEY=your-api-key
GUPSHUP_SOURCE_NUMBER=your-waba-number
GUPSHUP_APP_NAME=your-app-name
GUPSHUP_TEMPLATE_TRANSPORTER=<template-1-id>
GUPSHUP_TEMPLATE_BUYER=<template-2-id>
```

---

## Param Mapping

### Template 1 (Transporter) — 13 params

| Param Index | Form Field | Template Var |
|-------------|-----------|-------------|
| `params[0]` | `buyerName` | `{{1}}` |
| `params[1]` | `buyerWhatsapp` | `{{2}}` |
| `params[2]` | `petName` | `{{3}}` |
| `params[3]` | `petType` | `{{4}}` |
| `params[4]` | `petBreed` | `{{5}}` |
| `params[5]` | `petAge` | `{{6}}` |
| `params[6]` | `petWeight` | `{{7}}` |
| `params[7]` | `petDetails` | `{{8}}` |
| `params[8]` | `pickupPlace` | `{{9}}` |
| `params[9]` | `dropoffPlace` | `{{10}}` |
| `params[10]` | `bookingDate` | `{{11}}` |
| `params[11]` | `preferredTime` | `{{12}}` |
| `params[12]` | `transportMode` | `{{13}}` |

### Template 2 (Buyer) — 7 params

| Param Index | Form Field | Template Var |
|-------------|-----------|-------------|
| `params[0]` | `buyerName` | `{{1}}` |
| `params[1]` | `petName` | `{{2}}` |
| `params[2]` | `pickupPlace` | `{{3}}` |
| `params[3]` | `dropoffPlace` | `{{4}}` |
| `params[4]` | `bookingDate` | `{{5}}` |
| `params[5]` | `preferredTime` | `{{6}}` |
| `params[6]` | `transportMode` | `{{7}}` |