# Stylus Contracts: Frontend Developer's Guide

## TL;DR: No Difference from Solidity

**Stylus contracts work exactly like Solidity contracts from the frontend perspective.**

Once deployed, Stylus contracts are standard Ethereum contracts. You use the same:
- RPC calls (`eth_call`, `eth_sendTransaction`)
- ABIs (JSON format)
- Event logs (standard Ethereum events)
- Addresses (0x... format)
- Tooling (wagmi, viem, ethers.js, etc.)

## The Only Difference: Development, Not Runtime

| Aspect | Solidity | Stylus |
|--------|----------|--------|
| **Language** | Solidity | Rust |
| **Compilation** | Solidity → EVM bytecode | Rust → WASM |
| **On-Chain** | Standard contract | Standard contract |
| **RPC Calls** | Standard | Standard |
| **ABI Format** | JSON | JSON (identical) |
| **Events** | Standard logs | Standard logs |
| **Frontend Code** | Standard | Standard (same!) |

## Detailed Comparison

### 1. Function Calls

**Solidity Contract:**
```solidity
function mint(address to) public returns (uint256) {
    // ...
}
```

**Stylus Contract (Rust):**
```rust
#[public]
pub fn mint(&mut self, to: Address) -> Result<U256, Vec<u8>> {
    // ...
}
```

**Frontend Code (Same for Both):**
```typescript
const { writeContract } = useWriteContract()

writeContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'mint',
  args: [recipient],
})
```

### 2. Event Emission

**Solidity:**
```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
emit Transfer(from, to, tokenId);
```

**Stylus (Rust):**
```rust
sol! {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
}

evm::log(Transfer { from, to, token_id });
```

**Frontend Code (Same for Both):**
```typescript
useWatchContractEvent({
  address: contractAddress,
  abi: contractABI,
  eventName: 'Transfer',
  onLogs(logs) {
    // Handle events
  },
})
```

### 3. Reading State

**Solidity:**
```solidity
function ownerOf(uint256 tokenId) public view returns (address) {
    return tokenOwners[tokenId];
}
```

**Stylus (Rust):**
```rust
#[public]
pub fn owner_of(&self, token_id: U256) -> Result<Address, Vec<u8>> {
    Ok(self.token_owners.get(token_id))
}
```

**Frontend Code (Same for Both):**
```typescript
const { data } = useReadContract({
  address: contractAddress,
  abi: contractABI,
  functionName: 'ownerOf',
  args: [tokenId],
})
```

### 4. ABI Generation

**Solidity:**
```bash
solc --abi Contract.sol
```

**Stylus:**
```bash
cargo stylus generate-abi
```

**Result (Identical Format):**
```json
{
  "name": "mint",
  "type": "function",
  "inputs": [{"name": "to", "type": "address"}],
  "outputs": [{"name": "", "type": "uint256"}]
}
```

## Why This Works

### Stylus Compilation Pipeline

```
Rust Code
    ↓
cargo-stylus build
    ↓
WebAssembly (WASM)
    ↓
Deploy to Arbitrum Stylus
    ↓
On-Chain: Standard Ethereum Contract
    ↓
Frontend: Standard RPC Calls
```

### Key Insight

Stylus contracts compile to WASM, but when deployed to Arbitrum, they:
1. Are stored as standard contract bytecode
2. Respond to standard RPC calls
3. Emit standard event logs
4. Have standard addresses
5. Work with all standard tooling

The WASM execution happens **inside** the Arbitrum node, but from the outside (frontend, indexers, etc.), it's just a regular contract.

## Practical Implications

### ✅ What You Can Do (Same as Solidity)

- Use wagmi, viem, ethers.js without modification
- Call contract functions via standard RPC
- Listen to events via standard event logs
- Index events with standard indexers
- Use standard block explorers (Arbiscan)
- Interact with standard wallets (MetaMask, etc.)

### ❌ What's Different (Development Only)

- Write contracts in Rust instead of Solidity
- Use `cargo-stylus` instead of `solc`
- Generate ABIs from Rust annotations instead of Solidity

### 🎯 Frontend Code

**Zero changes needed.** Your frontend code is identical whether the contract is written in Solidity or Rust (Stylus).

## Example: Complete Flow

### 1. Deploy Contract

**Stylus:**
```bash
cargo stylus deploy --network sepolia
# Deploys to: 0x1234...
```

**Solidity:**
```bash
forge deploy --network sepolia
# Deploys to: 0x1234...
```

### 2. Frontend Code (Identical)

```typescript
// Same code for both Stylus and Solidity contracts
const contractAddress = '0x1234...'
const abi = [...] // Same ABI format

// Call function
await writeContract({
  address: contractAddress,
  abi,
  functionName: 'mint',
  args: [recipient],
})

// Listen to events
useWatchContractEvent({
  address: contractAddress,
  abi,
  eventName: 'Transfer',
  onLogs(logs) {
    console.log('Transfer event:', logs)
  },
})
```

## Common Questions

### Q: Do I need special libraries for Stylus?

**A:** No. Use standard Ethereum libraries (wagmi, viem, ethers.js).

### Q: Are Stylus ABIs different?

**A:** No. They're standard Solidity-compatible JSON ABIs.

### Q: Can I use the same frontend code?

**A:** Yes. Frontend code is identical.

### Q: Do events work the same?

**A:** Yes. Events are standard Ethereum event logs.

### Q: Can I use block explorers?

**A:** Yes. Stylus contracts appear on Arbiscan like any other contract.

### Q: What about gas estimation?

**A:** Works the same. Use standard `eth_estimateGas` RPC call.

## Conclusion

**For frontend developers, Stylus contracts are indistinguishable from Solidity contracts.**

The only time you'll notice a difference is:
- During development (writing Rust vs Solidity)
- When generating ABIs (`cargo stylus` vs `solc`)

Once deployed, everything is standard Ethereum. Use your existing knowledge, tools, and code patterns.
