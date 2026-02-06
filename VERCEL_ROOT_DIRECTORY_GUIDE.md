# How to Set Root Directory in Vercel Dashboard

## Quick Answer

The **Root Directory** field is located in:

**Settings → General → Root Directory**

But if you can't find it, try these locations:

## Step-by-Step Instructions

### Method 1: Via Settings Page

1. **Go to your project**: https://vercel.com/mtuneccesarys-projects/frontend
2. **Click "Settings"** (gear icon in the top navigation)
3. **Click "General"** tab (first tab, usually selected by default)
4. **Scroll down** to find "Root Directory" field
5. **Change from** `.` **to** `packages/frontend`
6. **Click "Save"**

### Method 2: Via Build Settings

1. **Go to**: https://vercel.com/mtuneccesarys-projects/frontend/settings
2. **Look for** "Build & Development Settings" tab
3. **Find** "Root Directory" field
4. **Set to**: `packages/frontend`
5. **Save**

### Method 3: Via Project Configuration

1. **Go to**: https://vercel.com/mtuneccesarys-projects/frontend
2. **Look for** "Configure" or "Edit" button
3. **Find** "Root Directory" in the configuration modal
4. **Set to**: `packages/frontend`
5. **Save**

## If You Still Can't Find It

The field might be hidden or only available when:
- You're the project owner/admin
- The project is not connected to a Git repository
- You need to disconnect and reconnect the project

### Alternative: Reconnect Project

1. Go to Settings → Git
2. Disconnect the repository
3. Reconnect it
4. During reconnection, you should see an option to set the root directory

## After Setting Root Directory

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or trigger a new deployment via Git push

## Current Status

- **Project**: frontend
- **Current Root Directory**: `.` (needs to be `packages/frontend`)
- **Build Command**: `cd ../.. && pnpm install && pnpm --filter @buildkit/frontend build`
- **Output Directory**: `.next`

## Need Help?

If you still can't find it, take a screenshot of your Settings page and I can help locate it!
