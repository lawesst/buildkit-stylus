# Vercel Root Directory Setup

## The "Root Directory" Field Location

In the new Vercel UI, the Root Directory setting might be in different locations:

### Option 1: Settings → General
1. Go to: https://vercel.com/mtuneccesarys-projects/frontend/settings
2. Look for **"General"** tab
3. Scroll down to find **"Root Directory"** or **"Base Directory"**

### Option 2: Settings → Build & Development Settings
1. Go to: https://vercel.com/mtuneccesarys-projects/frontend/settings
2. Look for **"Build & Development Settings"** or **"Build Settings"** tab
3. Find **"Root Directory"** field

### Option 3: Project Settings (Top Level)
1. Go to: https://vercel.com/mtuneccesarys-projects/frontend
2. Click the **"Settings"** tab (gear icon)
3. Look for **"Root Directory"** in the main settings page

## Alternative: Use Vercel CLI

If you can't find it in the UI, we can try updating it via CLI or API.

## Current Configuration

The project is currently set to:
- Root Directory: `.` (current directory)
- Build Command: `cd ../.. && pnpm install && pnpm --filter @buildkit/frontend build`
- Output Directory: `.next`

## What Needs to Change

The Root Directory should be set to: `packages/frontend`

This tells Vercel that the Next.js app is located in the `packages/frontend` subdirectory.
