#!/bin/bash
# Check ETH balance on Arbitrum Sepolia
# Usage: ./scripts/check-balance.sh [address]

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

# Get address from argument or derive from private key
if [ -z "$1" ]; then
    if [ -z "$STYLUS_PRIVATE_KEY" ]; then
        echo -e "${RED}❌ No address provided and STYLUS_PRIVATE_KEY not set${NC}"
        echo "Usage: ./scripts/check-balance.sh [address]"
        echo "Or set STYLUS_PRIVATE_KEY to auto-derive address"
        exit 1
    fi
    
    # Derive address from private key (requires cast from foundry)
    if ! command -v cast &> /dev/null; then
        echo -e "${RED}❌ cast not found. Install foundry: https://book.getfoundry.sh/${NC}"
        exit 1
    fi
    
    ADDRESS=$(cast wallet address "$STYLUS_PRIVATE_KEY")
    echo -e "${YELLOW}Derived address from STYLUS_PRIVATE_KEY${NC}"
else
    ADDRESS="$1"
fi

echo -e "${GREEN}Checking balance for: $ADDRESS${NC}"
echo "Network: Arbitrum Sepolia"
echo ""

# Check balance using cast
if command -v cast &> /dev/null; then
    BALANCE=$(cast balance "$ADDRESS" --rpc-url "$RPC_URL" 2>/dev/null)
    BALANCE_ETH=$(cast --to-unit "$BALANCE" ether 2>/dev/null)
    
    echo -e "Balance: ${GREEN}$BALANCE_ETH ETH${NC}"
    echo "Wei: $BALANCE"
    
    # Warning if balance is low
    BALANCE_NUM=$(echo "$BALANCE_ETH" | sed 's/[^0-9.]//g')
    if (( $(echo "$BALANCE_NUM < 0.001" | bc -l) )); then
        echo ""
        echo -e "${RED}⚠️  Low balance! You may not have enough for deployment.${NC}"
        echo "Get test ETH: https://bridge.arbitrum.io/ (switch to Sepolia)"
    fi
else
    echo -e "${YELLOW}cast not found. Install foundry for balance checking:${NC}"
    echo "curl -L https://foundry.paradigm.xyz | bash"
    echo ""
    echo "Or check balance manually:"
    echo "https://sepolia.arbiscan.io/address/$ADDRESS"
fi
