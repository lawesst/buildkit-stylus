#!/bin/bash
# Deployment script for Stylus contracts
# Usage: ./scripts/deploy.sh [contract-name] [network]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
CONTRACT="${1:-all}"
NETWORK="${2:-sepolia}"

echo -e "${GREEN}🚀 BuildKit Stylus Deployment${NC}"
echo "=================================="
echo "Contract: $CONTRACT"
echo "Network: $NETWORK"
echo ""

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if cargo-stylus is installed
if ! command -v cargo-stylus &> /dev/null; then
    echo -e "${RED}❌ cargo-stylus not found${NC}"
    echo "Install it with: cargo install cargo-stylus"
    exit 1
fi
echo -e "${GREEN}✓${NC} cargo-stylus installed"

# Load .env file if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo -e "${GREEN}✓${NC} Loaded .env file"
fi

# Check if STYLUS_PRIVATE_KEY is set
if [ -z "$STYLUS_PRIVATE_KEY" ]; then
    echo -e "${RED}❌ STYLUS_PRIVATE_KEY not set${NC}"
    echo "Set it with: export STYLUS_PRIVATE_KEY=\"0x...\""
    echo "Or create a .env file in packages/stylus-contracts/ with: STYLUS_PRIVATE_KEY=0x..."
    exit 1
fi
echo -e "${GREEN}✓${NC} STYLUS_PRIVATE_KEY set"

# Check Rust toolchain
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Rust/Cargo not found${NC}"
    echo "Install Rust: https://rustup.rs/"
    exit 1
fi
echo -e "${GREEN}✓${NC} Rust toolchain installed"

echo ""

# Build contracts
echo -e "${YELLOW}🔨 Building contracts...${NC}"
if [ "$CONTRACT" = "all" ]; then
    cargo stylus build
else
    cargo stylus build --contract "$CONTRACT"
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Build successful"

# Generate ABIs
echo -e "${YELLOW}📄 Generating ABIs...${NC}"
cargo stylus export-abi
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  ABI generation had warnings (may be okay)${NC}"
fi
echo -e "${GREEN}✓${NC} ABIs generated"

# Deploy contracts
echo ""
echo -e "${YELLOW}🚀 Deploying to $NETWORK...${NC}"

if [ "$CONTRACT" = "all" ]; then
    cargo stylus deploy
else
    cargo stylus deploy --contract "$CONTRACT"
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Contract addresses saved to: deployments/$NETWORK.json"
echo "ABIs saved to: abis/"
