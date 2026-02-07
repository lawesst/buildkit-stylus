//! Gasless Stylus Contract - Archetype 2
//!
//! STYLUS CONTRACT: Stateless contract designed for ERC-4337 Account Abstraction compatibility.
//! Demonstrates gasless transactions via paymaster sponsorship.
//!
//! This contract:
//! - Accepts messages via `post_message(message)`
//! - Emits `MessagePosted` events
//! - Stateless design (no storage) for AA compatibility
//! - Uses Stylus SDK 0.10 event emission pattern
//!
//! NOTE: Using bytes instead of string in event due to Stylus SDK 0.10 limitations

// Conditional compilation: use std when export-abi is enabled
#![cfg_attr(not(any(feature = "export-abi", test)), no_std)]

extern crate alloc;

use stylus_sdk::prelude::*;
use alloy_primitives::{Address, Bytes};
use alloy_sol_types::sol;

// Vec and String imports - use alloc in no_std, std in std mode
#[cfg(not(feature = "export-abi"))]
use alloc::vec::Vec;
#[cfg(not(feature = "export-abi"))]
use alloc::vec;
#[cfg(not(feature = "export-abi"))]
use alloc::string::String;
#[cfg(feature = "export-abi")]
use std::vec::Vec;
#[cfg(feature = "export-abi")]
use std::string::String;

// Event declaration using sol! macro
// Using bytes instead of string due to Stylus SDK 0.10 event emission limitations
sol! {
    event MessagePosted(
        address indexed user,
        bytes message
    );
}

// Stateless contract - minimal storage for entrypoint
// The entrypoint macro goes on the storage struct
// We use a dummy uint256 field to satisfy sol_storage! requirements
sol_storage! {
    #[entrypoint]
    pub struct GaslessApp {
        // Dummy field - contract is effectively stateless
        // This is required by sol_storage! macro
        uint256 dummy;
    }
}

// Public methods using #[public] macro (stylus-sdk 0.10 API)
#[public]
impl GaslessApp {
    /// Post a message (gasless transaction via paymaster)
    /// 
    /// STYLUS NOTE: This function is designed to be called via ERC-4337 Account Abstraction.
    /// The paymaster sponsors the gas, so users don't need ETH.
    /// 
    /// # Arguments
    /// * `message` - The message string to post
    /// 
    /// # Returns
    /// * `Ok(())` on success
    /// * `Err(Vec<u8>)` on failure
    pub fn post_message(&mut self, message: String) -> Result<(), Vec<u8>> {
        // Use Address::ZERO as placeholder for sender
        // The actual sender address is available in the transaction metadata
        let sender = Address::ZERO;
        
        // Validate message is not empty
        if message.is_empty() {
            return Err(b"Message cannot be empty".to_vec());
        }
        
        // Validate message length (prevent excessive gas usage)
        if message.len() > 1000 {
            return Err(b"Message too long (max 1000 characters)".to_vec());
        }
        
        // Convert String to bytes for event emission
        // STYLUS NOTE: Using bytes in event instead of string due to SDK 0.10 limitations
        let message_bytes = Bytes::from(message.into_bytes());
        
        // Emit MessagePosted event using self.vm().log() (stylus-sdk 0.10 method)
        // STYLUS NOTE: In SDK 0.10, events are emitted using self.vm().log()
        // This produces Solidity-ABI-compatible events that are indexed and readable
        // by Ethers/graph indexers exactly like Solidity events.
        self.vm().log(MessagePosted {
            user: sender,
            message: message_bytes,
        });
        
        Ok(())
    }
}
