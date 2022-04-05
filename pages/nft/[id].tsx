import React, {useState, useEffect} from 'react'
import Image from "next/image"
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typing';
import Link from 'next/link';
import { NFTDrop } from '@thirdweb-dev/sdk';
import toast, {Toaster} from "react-hot-toast"

interface Props {
    collection: Collection
}


function Drop({collection}: Props) {

    const [claimedSupply, setClaimedSupply] = useState<number>(0)
    const [totalSupply, setTotalSupply] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [priceInEth, setPriceInEth] = useState<string>()
    const nftDrop = useNFTDrop(collection.address)

    useEffect(() => {
        if (!nftDrop) return;

        const fetchNFTDropData = async () => {
            setLoading(true)
            const claimed = await nftDrop.getAllClaimed()
            const total = await nftDrop.totalSupply()
            setClaimedSupply(claimed.length)
            setTotalSupply(total)
            setLoading(false)

        }

        fetchNFTDropData()


    
    }, [])


    useEffect(() => {
        const fetchPrice = async () => {
            const claimedCondition = await nftDrop.claimConditions.getAll() 
            setPriceInEth(claimedCondition?.[0].currencyMetadata.displayValue)

        }
        fetchPrice()
    }, [])
    const connectWithMetamask = useMetamask();
    const address = useAddress();

    const disconnect = useDisconnect();


    const mintNft = () => {
        if (!nftDrop || !address) return

        setLoading(true)
        const notifcation = toast.loading("Minting...", {
            style: {
                background: "white",
                color: "green",
                fontWeight: "bolder",
                fontSize: "17px",
                padding:"20px",

            }
        })

        const quantity = 1

        nftDrop?.claimTo(address, quantity).then( async (tx:any) => {
           const receipt = tx[0].receipt 
           const claimedTokenId = tx[0].id
           const claimedNFT = await tx[0].data()

           toast("HOORAY, You are minting boss", {
               duration: 8000,
               style: {
                background: "white",
                color: "green",
                fontWeight: "bolder",
                fontSize: "17px",
                padding:"20px",
               }
           } )

           console.log(receipt)
           console.log(claimedTokenId)
           console.log(claimedNFT)
        }).catch((err: any) => {
            console.log(err)
            toast("whoops... Oshe!!", {
                style: {
                    
                }
            })
        } )
        .finally(() => {
            setLoading(false)
            toast.dismiss(notifcation)
        })

    }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
        <Toaster position="bottom-center" />

{/* Left */}
        <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4"> 
            <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen"> 
                <div className="bg-gradient-to-br from-cyan-400 to-rose-500 p-2 rounded-xl"> 
                <img
                className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                src={urlFor(collection.previewImage).url()}  
                />
                </div>
                
                <div className="space-y-2 p-5 text-center"> 
                    <h1 className="text-4xl text-white font-bold">{collection.title}</h1>
                    <h2 className="text-xl text-gray-300">{collection.description}</h2>
                </div>
            </div>
        </div>

{/* Right */} 
<div className="flex flex-1 flex-col col-span-6 p-5"> 
    {/* Header */}
    <header className="flex items-center justify-between"> 
    <Link href="/"> 
        <h1 className="cursor-pointer w-52 text-xl font-extralight sm:w-80">The{" "} 
        <span className="font-extrabold underline decoration-pink-600/50">PAPAFAM</span>
            {" "}NFT Market Place
            </h1>
    </Link>

        <button className="rounded-full bg-rose-400 text-white px-4 py-2 border-none text-xs lg:px-5 lg:py-3" onClick={() => address ? disconnect() : connectWithMetamask()}>{address ? "Sign Up" : "Sign In"}</button>
    </header>

    <hr className="my-2 border"/>
    {address && <p className="text-center text-sm text-rose-400">You're logged in with wallet {address.substring(0,5)}...{address.substring(address.length-5)}</p>}

    {/* content */}
    <div className="flex flex-1 flex-col mt-10 items-center space-y-6 text-center lg:space-y-0 lg:justify-center"> 
        <img className="w-80 object-cover pb-10 lg:h-40" src={urlFor(collection.mainImage).url()} alt="" />

        <h1 className="text-3xl font-bold lg-text-5xl lg-font-extrabold">The PAPFAM Ape Coding Club | NFT Drop</h1>

        {loading ?
        <p className="pt-2 text-xl text-green-500 animate-bounce">loading supply count</p>
        :
        <p className="pt-2 text-xl text-green-500">{claimedSupply}/ {totalSupply?.toString()} NFT's claimed</p>}

        {loading && 
        <img className="h-60 w-80 object-contain" src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif" alt="" />
        }
    </div>

    {/* Mint Button */}
    <button
    onClick={mintNft}
    disabled={loading || claimedSupply === totalSupply || !address} className="mt-10 h-16 bg-red-600 w-full text-white rounded-full font-bold disabled:bg-gray-400"> 

    {loading ? (
        <>Loading...</>
    ): 
    claimedSupply === totalSupply ? (
        <>SOLD OUT</>
    ): (
        <span className="font-bold">Mint NFT {priceInEth} ETH)</span>
    )
    }
    </button>

</div>
    </div>
  )
}

export default Drop

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    console.log(params)

    const query = `
  *[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
    asset
    },
    previewImage {
    asset
    },
    slug {
    current
    },
     creator-> {
       _id,
       name,
       address,
       slug {
       current
     }
     }
  }
  `

  const collection = await sanityClient.fetch(query, {
      id: params?.id
  })
  console.log(collection)

  if (!collection) {
      return {
          notFound: true
      }
  } 
      return {
          props: {
              collection
          }
      }

}