import { NextResponse } from 'next/server'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { arbitrumSepolia } from 'viem/chains'

const NFT_CONTRACT_ADDRESS = '0x9734bc2be26a92c02f32f3dee397b20aa6fe3edb' as `0x${string}`

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http('https://sepolia-rollup.arbitrum.io/rpc'),
})

// Transfer event ABI
const transferEventAbi = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)')

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const eventName = searchParams.get('event') || 'Transfer'

    // Get current block number
    const currentBlock = await publicClient.getBlockNumber()
    
    // Query events from last 1000 blocks (or adjust as needed)
    const fromBlock = currentBlock - BigInt(1000)
    const toBlock = currentBlock

    if (eventName === 'Transfer') {
      const logs = await publicClient.getLogs({
        address: NFT_CONTRACT_ADDRESS,
        event: transferEventAbi,
        fromBlock,
        toBlock,
      })

      // Format events similar to indexer response
      const events = logs
        .slice(-limit) // Get last N events
        .map((log, index) => ({
          id: index + 1,
          contract_name: 'NFT',
          contract_address: NFT_CONTRACT_ADDRESS,
          event_name: 'Transfer',
          block_number: Number(log.blockNumber),
          transaction_hash: log.transactionHash,
          event_data: {
            from: log.args.from,
            to: log.args.to,
            tokenId: log.args.tokenId?.toString(),
          },
          indexed_at: Date.now(),
        }))
        .reverse() // Most recent first

      return NextResponse.json({
        success: true,
        count: events.length,
        events,
      })
    }

    return NextResponse.json({
      success: true,
      count: 0,
      events: [],
    })
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch events',
        events: [],
      },
      { status: 500 }
    )
  }
}
