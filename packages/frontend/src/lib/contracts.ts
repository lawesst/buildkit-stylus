/**
 * Contract configuration and utilities
 */
declare const process: {
  env: {
    NEXT_PUBLIC_NFT_CONTRACT_ADDRESS?: string
    NEXT_PUBLIC_GASLESS_CONTRACT_ADDRESS?: string
  }
}

// Helper to get and trim contract addresses
const getContractAddress = (envVar?: string, fallback?: string) => {
  if (envVar && envVar.trim()) {
    return envVar.trim() as `0x${string}`
  }
  return (fallback || '0x0000000000000000000000000000000000000000') as `0x${string}`
}

export const NFT_CONTRACT_ADDRESS = getContractAddress(
  process?.env?.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
  '0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb' // Deployed NFT contract
)

export const GASLESS_CONTRACT_ADDRESS = getContractAddress(
  process?.env?.NEXT_PUBLIC_GASLESS_CONTRACT_ADDRESS,
  '0x21eb06ad92434e07b4afbc96af91d62f3d579bca' // Deployed gasless contract (using bytes in events)
)

export const CHAIN_ID = 421614
export const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc'
export const NFT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    name: 'nextTokenId',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
  },
] as const

export const GASLESS_ABI = [
  {
    name: 'post_message',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'message',
        type: 'string',
      },
    ],
    outputs: [],
  },
  {
    name: 'get_sender',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    name: 'MessagePosted',
    type: 'event',
    inputs: [
      {
        indexed: true,
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        name: 'message',
        type: 'bytes',
      },
    ],
  },
] as const
