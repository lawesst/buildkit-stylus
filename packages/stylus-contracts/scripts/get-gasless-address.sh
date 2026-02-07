#!/bin/bash
# Get the gasless contract address from the most recent deployment transaction

set -e

source .env
DEPLOYER=$(cast wallet address "$STYLUS_PRIVATE_KEY" 2>/dev/null || echo "")

if [ -z "$DEPLOYER" ]; then
    echo "❌ Could not get deployer address. Make sure cast (foundry) is installed."
    echo "Install: curl -L https://foundry.paradigm.xyz | bash"
    exit 1
fi

echo "Deployer address: $DEPLOYER"
echo ""
echo "To find the gasless contract address:"
echo "1. Visit: https://sepolia.arbiscan.io/address/$DEPLOYER"
echo "2. Look for the most recent 'Contract Creation' transaction"
echo "3. Click on it to see the contract address"
echo ""
echo "Or check the deployment transaction directly if you have the tx hash."
