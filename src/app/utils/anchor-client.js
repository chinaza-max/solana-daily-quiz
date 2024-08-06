import { Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider, web3 } from '@project-serum/anchor'
import idl from '../config/solana_quiz_program.json'

const programID = new PublicKey('8pCCWwZbyeJiZRkB22oJWEEbztfW3mBCQKdxtMKAPgRt')
const opts = {
  preflightCommitment: 'processed'
}

const getProvider = () => {
  const connection = new Connection('https://api.devnet.solana.com', opts.preflightCommitment)
  const provider = new AnchorProvider(
    connection,
    window.solana,
    opts.preflightCommitment,
  )
  return provider
}

export const getQuestions = async () => {
  const provider = getProvider()
  const program = new Program(idl, programID, provider)
  const questions = await program.account.question.all()
  return questions.map(q => q.account)
}

export const createQuestion = async (question, options, answer) => {

    try {
        const provider = getProvider()
        const program = new Program(idl, programID, provider)
        await program.methods.createQuestion(question, options, answer)
          .accounts({
            question: web3.Keypair.generate().publicKey,
            signer: provider.wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc()
    } catch (error) {

        console.log("error")
        console.log("error")
        console.log("error")
        console.log("error")
        console.log("error")
        console.log("error")
        console.log("error")
        console.log("error")

        console.log(error)
        console.log("error")
        console.log("error")
        console.log("error")

    }

 
}

export const getUsers = async () => {
  const provider = getProvider()
  const program = new Program(idl, programID, provider)
  const users = await program.account.user.all()
  return users.map(u => u.account)
}