#!/bin/bash
# Deploy BuildKit Stylus to Vercel

echo "🚀 Deploying BuildKit Stylus to Vercel (mtuneccessary account)"
echo ""

# Frontend deployment
echo "📦 Deploying Frontend..."
cd packages/frontend

# Set environment variable if not already set
vercel env add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS production <<< "0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb" 2>/dev/null || echo "Environment variable already set"

# Deploy
echo "Deploying to production..."
vercel --prod --yes

echo ""
echo "✅ Frontend deployed!"
echo ""
echo "⚠️  IMPORTANT: Set Root Directory in Vercel Dashboard:"
echo "   1. Go to: https://vercel.com/mtuneccesarys-projects/frontend/settings"
echo "   2. Under 'General' → 'Root Directory', set to: packages/frontend"
echo "   3. Save and redeploy"
