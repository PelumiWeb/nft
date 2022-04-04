import type { GetServerSideProps,NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {sanityClient, urlFor} from "../sanity"
import { Collection } from '../typing'

interface Props {
  collections: Collection[]
}

const Home = ({collections}: Props) => {
  console.log(collections)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center mx-auto  py-20 px-10">
      <Head>
        <title>nft</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="cursor-pointer w-52 text-3xl font-extralight sm:w-80">The{" "} 
        <span className="font-extrabold underline decoration-pink-600/50">PAPAFAM</span>
            {" "}NFT Market Place
            </h1>
            <main className=" bg-slate-100 p-10 shadow-xl shadow-rose-100 w-4/6 lg:w-3/6 mt-4"> 
              <div className="flex items-center flex-wrap justify-center md:justify-between "> 
                {collections.map(collection => (
                  <Link href={`/nft/${collection.slug.current}`}>
                  <div className="flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 p-5">
                    <img className="h-96 w-60 rounded-2xl  object-cover" src={urlFor(collection.mainImage).url()} alt=""/>
                    <div>
                      <h2 className="text-2xl text-center">{collection.title}</h2>
                      <p className="text-center mt-2 textsm text-gray-400">{collection.description}</p>
                      </div>
                  </div>
                  </Link>
                ))}
              </div>
            </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {

  const query = `
  *[_type == "collection"]{
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
  const collections = await sanityClient.fetch(query)
 
console.log(collections)
  return {
    props: {
      collections
    }
  }

}
