//! Minimal ERC-721-like NFT contract written in Rust for Arbitrum Stylus.
//!
//! STYLUS CONTRACT: This is a pure Rust smart contract that compiles to WebAssembly (WASM)
//! and runs on Arbitrum Stylus. It replaces Solidity entirely.
//!
//! Stylus SDK 0.10 API patterns:
//! - sol_storage!: Declares Solidity-compatible storage layout
//! - #[entrypoint]: Marks the root contract struct
//! - #[public]: Marks public/external methods
//! - sol! macro: Declares events

// Conditional compilation: use std when export-abi is enabled (for cargo-stylus checks)
// Otherwise use no_std for WASM compilation
#![cfg_attr(not(any(feature = "export-abi", test)), no_std)]

// Declare alloc - needed for macros
extern crate alloc;

use stylus_sdk::prelude::*;
use alloy_primitives::{Address, U256};
use alloy_sol_types::sol;

// Vec import - use alloc in no_std, std in std mode
#[cfg(not(feature = "export-abi"))]
use alloc::vec::Vec;
#[cfg(not(feature = "export-abi"))]
use alloc::vec;
#[cfg(feature = "export-abi")]
use std::vec::Vec;

// Event declaration using sol! macro
sol! {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed token_id
    );
}

// Storage using sol_storage! macro (stylus-sdk 0.10 compatible)
// The entrypoint macro goes on the storage struct
sol_storage! {
    #[entrypoint]
    pub struct NftContract {
        mapping(uint256 => address) token_owners;
        uint256 next_token_id;
    }
}

// Public methods using #[public] macro (stylus-sdk 0.10 API)
#[public]
impl NftContract {
    /// Mint a new NFT to the specified address
    pub fn mint(&mut self, to: Address) -> Result<U256, Vec<u8>> {
        // Validate recipient address
        if to == Address::ZERO {
            return Err(b"Invalid address: cannot mint to zero address".to_vec());
        }

        // Get current token ID
        let token_id = U256::from(self.next_token_id.get());
        
        // Check if token already exists
        if self.token_owners.get(token_id) != Address::ZERO {
            return Err(b"Token already minted".to_vec());
        }

        // Store the owner
        self.token_owners.insert(token_id, to);

        // Increment token counter
        let next_id = U256::from(self.next_token_id.get()) + U256::from(1);
        self.next_token_id.set(next_id);

        // Emit Transfer event using self.vm().log() (stylus-sdk 0.10 method)
        // STYLUS NOTE: In SDK 0.10, events are emitted using self.vm().log()
        // The old evm::log() path was deprecated. The log() method is available
        // on the VM context returned by self.vm().
        // This produces Solidity-ABI-compatible events that are indexed and readable
        // by Ethers/graph indexers exactly like Solidity events.
        // The indexer can read these events using standard Ethereum RPC methods (eth_getLogs).
        self.vm().log(Transfer {
            from: Address::ZERO,
            to,
            token_id,
        });

        Ok(token_id)
    }

    /// Get the owner of a specific token ID
    pub fn owner_of(&self, token_id: U256) -> Result<Address, Vec<u8>> {
        let owner = self.token_owners.get(token_id);
        Ok(owner)
    }

    /// Get the current token counter (next token ID that will be minted)
    pub fn next_token_id(&self) -> Result<U256, Vec<u8>> {
        Ok(U256::from(self.next_token_id.get()))
    }
}
