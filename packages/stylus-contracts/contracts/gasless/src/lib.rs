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

// Conditional compilation: use std when export-abi is enabled
#![cfg_attr(not(any(feature = "export-abi", test)), no_std)]

extern crate alloc;

use stylus_sdk::prelude::*;
use alloy_primitives::{Address, U256};
use alloy_sol_types::sol;

// Vec imports - use alloc in no_std, std in std mode
#[cfg(not(feature = "export-abi"))]
use alloc::vec::Vec;
#[cfg(not(feature = "export-abi"))]
use alloc::vec;
#[cfg(feature = "export-abi")]
use std::vec::Vec;

// Event declaration using sol! macro
sol! {
    event MessagePosted(
        address indexed user,
        uint256 message_length
    );
}

// Stateless contract - minimal storage for entrypoint
sol_storage! {
    #[entrypoint]
    pub struct GaslessApp {
        uint256 dummy;
    }
}

// Public methods using #[public] macro (stylus-sdk 0.10 API)
#[public]
impl GaslessApp {
    /// Post a message (gasless transaction via paymaster)
    /// 
    /// Minimal version - no validation, just emit event
    pub fn post_message(&mut self, message: Vec<u8>) -> Result<(), Vec<u8>> {
        // Use Address::ZERO as placeholder for sender
        let sender = Address::ZERO;
        
        // Get message length - no validation
        let message_length = U256::from(message.len());
        
        // Emit MessagePosted event
        self.vm().log(MessagePosted {
            user: sender,
            message_length,
        });
        
        Ok(())
    }
}
