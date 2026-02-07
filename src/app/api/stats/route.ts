import { NextResponse } from 'next/server'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { arbitrumSepolia } from 'viem/chains'

const NFT_CONTRACT_ADDRESS = '0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb' as `0x${string}`

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http('https://sepolia-rollup.arbitrum.io/rpc'),
})

const transferEventAbi = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)')

export async function GET() {
  try {
    const currentBlock = await publicClient.getBlockNumber()
    const fromBlock = currentBlock - BigInt(10000) // Last 10k blocks

    // Get all Transfer events
    const logs = await publicClient.getLogs({
      address: NFT_CONTRACT_ADDRESS,
      event: transferEventAbi,
      fromBlock,
      toBlock: currentBlock,
    })

    // Calculate stats
    const uniqueUsers = new Set<string>()
    const eventsByContract: Record<string, number> = { NFT: logs.length }
    const eventsByType: Record<string, number> = { Transfer: logs.length }

    logs.forEach((log) => {
      if (log.args.to) {
        uniqueUsers.add(log.args.to.toLowerCase())
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents: logs.length,
        eventsByContract: Object.entries(eventsByContract).map(([name, count]) => ({
          contract_name: name,
          count,
        })),
        eventsByType: Object.entries(eventsByType).map(([name, count]) => ({
          event_name: name,
          count,
        })),
        lastProcessedBlock: Number(currentBlock),
        uniqueUsers: uniqueUsers.size,
        totalMints: logs.length,
      },
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch stats',
        stats: {
          totalEvents: 0,
          eventsByContract: [],
          eventsByType: [],
          lastProcessedBlock: 0,
          uniqueUsers: 0,
          totalMints: 0,
        },
      },
      { status: 500 }
    )
  }
}
