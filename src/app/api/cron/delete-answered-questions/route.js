import { NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider, web3 } from '@project-serum/anchor'
import idl from '../../../../config/solana_quiz_program.json'

const programID = new PublicKey('8pCCWwZbyeJiZRkB22oJWEEbztfW3mBCQKdxtMKAPgRt')

export async function POST() {
  try {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
    const provider = new AnchorProvider(connection, {}, {})
    const program = new Program(idl, programID, provider)

    const questions = await program.account.question.all([
      {
        memcmp: {
          offset: 8 + 4 + 256 + 4 + (4 * 64) + 1,
          bytes: Buffer.from([1]).toString('base64'),
        },
      },
    ])

    for (const question of questions) {
      await program.methods.deleteQuestion().accounts({
        question: question.publicKey,
        authority: provider.wallet.publicKey,
      }).rpc()
    }

    return NextResponse.json({ message: 'Answered questions deleted successfully' })
  } catch (error) {
    console.error('Error deleting answered questions:', error)
    return NextResponse.json({ error: 'Failed to delete answered questions' }, { status: 500 })
  }
}