const { MongoClient } = require('mongodb');

const api_key = '5482dc7ea877469796bc31f77494481f'
const uri = 'mongodb+srv://migolkoa:794613qeadzcM712@gamefevr-cluster.g1lj86f.mongodb.net/prod';


// async function complete_fetch() {
//     const total_pages = 450
    
//     const client = new MongoClient(uri)
//     const access = await client.connect()
//     const db = await access.db()
//     for(let i = 362; i <= total_pages;i++) {
//         try {
//             const total_ids = []
//             const get = await fetch(`https://api.rawg.io/api/games?key=${api_key}&page=${i}&page_size=40`)
//             const body_page = await get.json()
//             await db.collection('short_games').insertMany(body_page.results)
//             // starting the detailed part
//             total_ids.push(...body_page.results.map(r => r.id))
//             for(let key in total_ids) {
//                 const get_detailed = await fetch(`https://api.rawg.io/api/games/${total_ids[key]}?key=${api_key}`)
//                 const body = await get_detailed.json()
//                 await db.collection('games').insertOne(body)
                
//                 const get_screenshots = await fetch(`https://api.rawg.io/api/games/${total_ids[key]}/screenshots?key=${api_key}`)
//                 const screenshots_body = await get_screenshots.json()
//                 await db.collection('screenshots').insertOne({gameId:total_ids[key],screenshots_body})
    
//                 console.log('pushed game-',total_ids[key],'in page',i)
//             }
//             console.log('finished pushing whole page',i)
//         } catch(e) {
//             console.log('error',e)
//         }
//     }
// }

// complete_fetch()

// async function getTreilers() {
//     try {
//         const total = 80000
//         const client = new MongoClient(uri)
//         const access = await client.connect()
//         const db = await access.db()

//         for(let i = 0;i<=total;i++) {
//             const game = await db.collection('short_games').find({}).limit(1).skip(i).toArray()
//             const get = await fetch(`https://api.rawg.io/api/games/${game[0].id}/movies?key=${api_key}`)
//             const body = await get.json()
//             if(!body.results.length) {
//                 console.log('no for',game[0].id)
//             } else {
//                 await db.collection('movies').insertOne({gameId:game[0].id,...body.results})
//                 console.log('inserted',game[0].id,i)
//             }
//         }

//     } catch(e) {
//         console.log(e)
//     }
// }



// getGeneral()
// getDetailed()
// getScreenshots()
// getTreilers()


// async function deleteShorts() {
//     try {
//         const client = new MongoClient(uri)
//         const access = await client.connect()
//         const db = await access.db()
//         let deleted = 0
//         // const totalCount = await db.collection('short_games').countDocuments()
//         for(let i = 0;i <= 18800;i++) { 
            
//             const first = await db.collection('short_games').find({}).skip(i).limit(1).toArray()
            
//             const dublicate = await db.collection('short_games').find({id:first[0].id}).toArray()
//             if(dublicate.length > 1) {
//                 await db.collection('short_games').deleteOne({id:first[0].id})
//                 await db.collection('games').deleteOne({id:first[0].id})
//                 await db.collection('screenshots').deleteOne({gameId:first[0].id})
//                 deleted++
//                 console.log('deleted dublicate', first[0].id)
//             } else {
//                 console.log('no dublicate',first[0].id,deleted)
//             }
//         }
//     } catch(e) {
//         console.log('errr',e)
//     }
// }

// deleteShorts()

async function fill_details() {
    try {
        const client = new MongoClient(uri)
        const access = await client.connect()
        const db = await access.db()
        let so_far = 0
        // const totalCount = await db.collection('short_games').countDocuments()
        for(let i = 10050;i <= 18157;i++) { 
            const first = await db.collection('short_games').find({}).skip(i).limit(1).toArray()
            const exists_data = await db.collection('games').find({id:first[0].id}).toArray()
            if(!exists_data[0]) {
                const get_detailed = await fetch(`https://api.rawg.io/api/games/${first[0].id}?key=${api_key}`)
                const body = await get_detailed.json()
                await db.collection('games').insertOne(body)
                
                const get_screenshots = await fetch(`https://api.rawg.io/api/games/${first[0].id}/screenshots?key=${api_key}`)
                const screenshots_body = await get_screenshots.json()
                await db.collection('screenshots').insertOne({gameId:first[0].id,screenshots_body})
                so_far++
                console.log('ádded',first[0].id)
            } else {
                console.log('continues',i,exists_data[0].id,so_far)
            }
        }
    } catch(e) {
        console.log('errr',e)
    }
}

fill_details()