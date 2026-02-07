# Deploy BuildKit Stylus via Vercel Dashboard

## Method: Import from GitHub (Recommended for Monorepos)

This method works best for monorepos and allows you to set Root Directory during import.

### Steps:

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/new
   ```

2. **Import Git Repository:**
   - Click "Import Git Repository"
   - Search for: `lawesst/buildkit-stylus`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `packages/frontend` ⚠️ **IMPORTANT**
   - **Build Command**: (leave default or set to) `pnpm install && pnpm --filter @buildkit/frontend build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

4. **Environment Variables:**
   - Add: `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` = `0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb`

5. **Click "Deploy"**

### After Deployment:

Your app will be live at the provided URL. Future pushes to the `main` branch will auto-deploy.

## Why This Works Better:

- Vercel's Git integration handles monorepos better
- Root Directory can be set clearly during import
- No CLI caching issues
- Automatic deployments on Git push
