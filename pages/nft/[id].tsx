import React from 'react'
import Image from "next/image"
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";


function Drop() {
    const connectWithMetamask = useMetamask();
    const address = useAddress();

    const disconnect = useDisconnect();
    console.log(address)

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">

{/* Left */}
        <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4"> 
            <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen"> 
                <div className="bg-gradient-to-br from-cyan-400 to-rose-500 p-2 rounded-xl"> 
                <img
                className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                src="https://links.papareact.com/8sg" 
                />
                </div>
                
                <div className="space-y-2 p-5 text-center"> 
                    <h1 className="text-4xl text-white font-bold">PAPAFAM Apes</h1>
                    <h2 className="text-xl text-gray-300">A collection of PAPAFAM Apes who live & breathe React</h2>
                </div>
            </div>
        </div>

{/* Right */} 
<div className="flex flex-1 flex-col col-span-6 p-5"> 
    {/* Header */}
    <header className="flex items-center justify-between"> 
        <h1 className="cursor-pointer w-52 text-xl font-extralight sm:w-80">The{" "} 
        <span className="font-extrabold underline decoration-pink-600/50">PAPAFAM</span>
            {" "}NFT Market Place
            </h1>
        <button className="rounded-full bg-rose-400 text-white px-4 py-2 border-none text-xs lg:px-5 lg:py-3" onClick={() => address ? disconnect() : connectWithMetamask()}>{address ? "Sign Up" : "Sign In"}</button>
    </header>

    <hr className="my-2 border"/>
    {address && <p className="text-center text-sm text-rose-400">You're logged in with wallet {address.substring(0,5)}...{address.substring(address.length-5)}</p>}

    {/* content */}
    <div className="flex flex-1 flex-col mt-10 items-center space-y-6 text-center lg:space-y-0 lg:justify-center"> 
        <img className="w-80 object-cover pb-10 lg:h-40" src="https://links.papareact.com/bdy" alt="" />

        <h1 className="text-3xl font-bold lg-text-5xl lg-font-extrabold">The PAPFAM Ape Coding Club | NFT Drop</h1>

        <p className="pt-2 text-xl text-green-500">13/ 21 NFT's claimed</p>
    </div>

    {/* Mint Button */}
    <button className="mt-10 h-16 bg-red-600 w-full text-white rounded-full font-bold"> 
        Mint NFT (0.01 ETH)
    </button>

</div>
    </div>
  )
}

export default Drop