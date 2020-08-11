const grpc = require('@grpc/grpc-js')
const { Firestore } = require('@google-cloud/firestore')
const fs = require('fs')

const firebaseConfig = {
  projectId: 'art-by-city-dev',
  host: 'localhost',
  port: 8080,
  sslCreds: grpc.credentials.createInsecure(),
  customHeaders: {
    'Authorization': 'Bearer owner'
  }
}

const db = new Firestore(firebaseConfig)
const artworkCollection = db.collection('Artworks')

const imageDir = './static/artwork-images'

fs.readdir(imageDir, async (err, files) => {
  if (err) {
    console.error('Error reading local static image directory:' + err)
  } else {
    /** @type {any[]} */
    let jobs = []
    files.forEach(async file => {
      jobs.push(processImageFile(file))
    })
    await Promise.all(jobs)
  }
})

/**
 * @param {any} filename
 */
const processImageFile = async (filename) => {
  const artwork = await findArtworkForImageFile(filename)

  if (artwork) {
    console.log(`found matching artwork: ${filename} => ${artwork.id}`)
  } else {
    console.log(`no artwork found: ${filename}. Deleting.`)
    fs.unlink(`${imageDir}/${filename}`, (err) => {
      if (err) {
        console.error(`Error deleting ${filename}:`, err)
      }
    })
  }
}

/**
 * @param {any} filename
 */
const findArtworkForImageFile = async (filename) => {
  const artworkSnapshot = await artworkCollection
    .where('images', 'array-contains', { source: filename })
    .get()

  if (artworkSnapshot.empty) {
    return null
  } else {
    return artworkSnapshot.docs[0]
  }
}
