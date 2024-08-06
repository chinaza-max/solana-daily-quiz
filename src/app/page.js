'use client'

import { useState } from 'react'
import QuestionList from './components/QuestionList'
import QuestionForm from './components/QuestionForm'
import UserList from '../app/components/QuestionList'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection } from '@solana/web3.js';


const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];


export default function Home() {
  const [activeTab, setActiveTab] = useState('questions')

  return (

    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT||clusterApiUrl(WalletAdapterNetwork.Devnet)}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Solana Quiz App</h1>
            <div className="mb-4">
              <button
                className={`mr-2 ${activeTab === 'questions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('questions')}
              >
                Questions
              </button>
              <button
                className={`mr-2 ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
            </div>
            {activeTab === 'questions' && (
              <>
                <QuestionForm />
                <QuestionList />
              </>
            )}
            {activeTab === 'users' && <UserList />}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}