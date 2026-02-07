/**
 * Indexer Configuration
 * 
 * Loads configuration from environment variables and deployment files.
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load deployment info
const deploymentPath = join(__dirname, '../../stylus-contracts/deployments/sepolia.json')
let deployments: any = {}
try {
  deployments = JSON.parse(readFileSync(deploymentPath, 'utf-8'))
} catch (error) {
  console.warn('⚠️  Could not load deployments file, using environment variables')
}

export const config = {
  // RPC Configuration
  rpcUrl: process.env.RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc',
  chainId: parseInt(process.env.CHAIN_ID || '421614'), // Arbitrum Sepolia
  
  // Indexing Configuration
  startBlock: parseInt(process.env.START_BLOCK || '0'), // Start from block 0 or specific block
  confirmations: parseInt(process.env.CONFIRMATIONS || '1'), // Wait for 1 confirmation
  pollInterval: parseInt(process.env.POLL_INTERVAL || '5000'), // Poll every 5 seconds
  
  // Database Configuration
  databasePath: process.env.DATABASE_PATH || './data/indexer.db',
  
  // API Configuration
  apiPort: parseInt(process.env.API_PORT || '3001'),
  
  // Contract Configuration
  // STYLUS NOTE: Contract ABIs and addresses work exactly like Solidity contracts
  contracts: {
    nft: {
      address: process.env.NFT_CONTRACT_ADDRESS || 
               deployments.contracts?.nft?.address || 
               '0x1e3d7fd130aaadf17dfafa50370044813854bf53',
      abi: [
        // Transfer event - identical format to Solidity events
        {
          name: 'Transfer',
          type: 'event',
          inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: true, name: 'tokenId', type: 'uint256' },
          ],
        },
      ],
    },
    // Gasless contract (Archetype 2)
    gasless: {
      address: process.env.GASLESS_CONTRACT_ADDRESS || 
               deployments.contracts?.gasless?.address || 
               '0x0000000000000000000000000000000000000000',
      abi: [
        // MessagePosted event - from Stylus gasless contract
        {
          name: 'MessagePosted',
          type: 'event',
          inputs: [
            { indexed: true, name: 'user', type: 'address' },
            { indexed: false, name: 'message', type: 'string' },
          ],
        },
      ],
    },
  },
}
