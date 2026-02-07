/**
 * Contract configuration and utilities
 */

// Get contract address from env or use fallback, trim any whitespace
const getContractAddress = (): `0x${string}` => {
  const envAddress = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
  const address = (envAddress || '0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb').trim()
  return address as `0x${string}`
}

export const NFT_CONTRACT_ADDRESS = getContractAddress()

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
