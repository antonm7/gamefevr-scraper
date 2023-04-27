const { MongoClient } = require('mongodb');

const api_key = '4f97c91efdb24a6e84f4688a9519c46f'
const uri = 'mongodb://127.0.0.1:27017/gameFevr';

const general_items = []
const detailed_items = []
let page = 1

async function getGeneral() {
    const totalPage = 2000
    const client = new MongoClient(uri)
    const access = await client.connect()
    const db = await access.db()

    for(let i = 1001;i <= totalPage;i++) {
        const get = await fetch(`https://api.rawg.io/api/games?key=${api_key}&page=${i}&page_size=40`)
        const body = await get.json()
        await db.collection('short_games').insertMany(body.results)
        console.log('inserted:',body.results.length,i)
    }
}

 async function getDetailed() {
    try {
// last inserted 158
        const total = 80000
        const client = new MongoClient(uri)
        const access = await client.connect()
        const db = await access.db()

        for(let i = 0;i<= total;i++) {
            const game = await db.collection('short_games').find({}).limit(1).skip(i).toArray()
            const get = await fetch(`https://api.rawg.io/api/games/${game[0].id}?key=${api_key}`)
            const body = await get.json()
            
            await db.collection('games').insertOne(body)
            console.log('inserted',game[0].id,i)
        }

    } catch(e) {
        console.log(e)
    }
}

async function getScreenshots() {
    try {
        const total = 80000
        const client = new MongoClient(uri)
        const access = await client.connect()
        const db = await access.db()

        for(let i = 101;i<=total;i++) {
            const game = await db.collection('short_games').find({}).limit(1).skip(i).toArray()
            const get = await fetch(`https://api.rawg.io/api/games/${game[0].id}/screenshots?key=${api_key}`)
            const body = await get.json()
            await db.collection('screenshots').insertOne({gameId:game[0].id,...body})
            console.log('inserted',game[0].id,i)
        }

    } catch(e) {
        console.log(e)
    }
}

async function getTreilers() {
    try {
        const total = 80000
        const client = new MongoClient(uri)
        const access = await client.connect()
        const db = await access.db()

        for(let i = 0;i<=total;i++) {
            const game = await db.collection('short_games').find({}).limit(1).skip(i).toArray()
            const get = await fetch(`https://api.rawg.io/api/games/${game[0].id}/movies?key=${api_key}`)
            const body = await get.json()
            if(!body.results.length) {
                console.log('no for',game[0].id)
            } else {
                await db.collection('movies').insertOne({gameId:game[0].id,...body.results})
                console.log('inserted',game[0].id,i)
            }
        }

    } catch(e) {
        console.log(e)
    }
}



getTreilers()
