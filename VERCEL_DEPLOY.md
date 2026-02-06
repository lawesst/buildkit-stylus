# Vercel Deployment Guide

## Current Account
- **Account**: `mtuneccessary`
- **Team**: `mtuneccesary's projects`
- **Project**: `frontend`

## Deployment Steps

### 1. Set Root Directory (REQUIRED)

Since this is a monorepo, Vercel needs to know where the Next.js app is located.

**Via Vercel Dashboard:**
1. Go to: https://vercel.com/mtuneccesarys-projects/frontend/settings
2. Scroll to **"General"** section
3. Find **"Root Directory"** field
4. Set it to: `packages/frontend`
5. Click **"Save"**

**Via Vercel CLI (if available):**
```bash
cd packages/frontend
vercel project --help  # Check available commands
```

### 2. Environment Variables

The following environment variable is already set:
- `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb`

Optional:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (for WalletConnect support)

To add more environment variables:
```bash
cd packages/frontend
vercel env add VARIABLE_NAME production
```

### 3. Deploy

After setting the root directory, deploy:

```bash
cd packages/frontend
vercel --prod
```

Or use the Vercel dashboard to trigger a new deployment.

## Project URLs

After successful deployment:
- **Production**: https://frontend-mtuneccesarys-projects.vercel.app
- **Dashboard**: https://vercel.com/mtuneccesarys-projects/frontend

## Troubleshooting

### Error: "No Next.js version detected"
- **Solution**: Set Root Directory to `packages/frontend` in project settings

### Error: "Command 'pnpm install' exited with 1"
- **Solution**: Ensure pnpm is installed in Vercel build environment
- Vercel should auto-detect pnpm from `packageManager` field in root `package.json`

### Build fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` configuration is correct

## Dashboard Deployment

The dashboard (`packages/dashboard`) can be deployed similarly:

1. Create a new Vercel project for the dashboard
2. Set Root Directory to: `packages/dashboard`
3. Deploy

## Indexer

The indexer (`packages/indexer`) is a Node.js service and **cannot** be deployed to Vercel (serverless functions have execution time limits).

Recommended hosting options:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Fly.io**: https://fly.io
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform
