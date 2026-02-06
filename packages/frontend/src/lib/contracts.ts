/**
 * Contract configuration and utilities
 */
declare const process: {
  env: {
    NEXT_PUBLIC_NFT_CONTRACT_ADDRESS?: string
  }
}

export const NFT_CONTRACT_ADDRESS = (
  (process?.env?.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`) || 
  '0x0000000000000000000000000000000000000000'
) as `0x${string}`

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
