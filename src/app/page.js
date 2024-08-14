'use client'

import { useState } from 'react'
import QuestionList from './components/QuestionList'
import QuestionForm from './components/QuestionForm'
import UserList from '../app/components/QuestionList'
import Nav from '../app/components/navBar'

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

          
          <div className="container mx-auto p-4 ">

            
            <div className=''>
              <Nav setActiveTabP={setActiveTab} activeTabP={activeTab} />
            </div>
            {activeTab === 'questions' && (
              <div style={{marginTop:"70px"}}>
                <QuestionForm />
                <QuestionList />
              </div>
            )}
            {activeTab === 'users' && <UserList />}

            
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}