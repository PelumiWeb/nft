interface Image {
    asset: {
        url: string
        _ref: string
        _type: string
    }
}

export interface Creator {
    _id: string
    name: string 
    address: string
    slug: {
        current: string
    }
    image: Image
    bio: string
}

export interface Collection {
    _id: string
    title: string 
    description: string
    nftCollectionName: string
    address: string
    create: string
    slug: {
        current: string
    }
    mainImage: Image
    previewImage: Image
}