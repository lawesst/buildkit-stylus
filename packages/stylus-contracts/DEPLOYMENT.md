# Quick Deployment Reference

## One-Line Commands

```bash
# Build all contracts
pnpm stylus:build
# or
cargo stylus build

# Deploy all contracts
pnpm stylus:deploy
# or
cargo stylus deploy --network sepolia

# Deploy specific contract
cargo stylus deploy --network sepolia --contract nft

# Generate ABIs
cargo stylus generate-abi

# Check balance
./scripts/check-balance.sh [address]
```

## Setup Checklist

- [ ] Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- [ ] Install cargo-stylus: `cargo install cargo-stylus`
- [ ] Set private key: `export STYLUS_PRIVATE_KEY="0x..."`
- [ ] Get test ETH on Arbitrum Sepolia (see README.md)
- [ ] Build contracts: `cargo stylus build`
- [ ] Deploy: `cargo stylus deploy --network sepolia`

## Common Commands

| Task | Command |
|------|---------|
| Build | `cargo stylus build` |
| Deploy | `cargo stylus deploy --network sepolia` |
| Generate ABI | `cargo stylus generate-abi` |
| Check code | `cargo check` |
| Clean build | `cargo clean` |
| Check balance | `./scripts/check-balance.sh` |

## Troubleshooting Quick Fixes

| Error | Fix |
|-------|-----|
| Private key not found | `export STYLUS_PRIVATE_KEY="0x..."` |
| Insufficient funds | Get test ETH from faucet |
| Build failed | Run `cargo check` to see errors |
| Network error | Check RPC URL in `cargo-stylus.toml` |

## Getting Test ETH

1. **Bridge from Ethereum Sepolia**: https://bridge.arbitrum.io/ (switch to Sepolia)
2. **Faucets**: 
   - QuickNode: https://faucet.quicknode.com/arbitrum/sepolia
   - Arbitrum Discord: Check #faucet channel

## File Locations

- Contracts: `contracts/`
- ABIs: `abis/`
- Deployments: `deployments/sepolia.json`
- Config: `cargo-stylus.toml`
