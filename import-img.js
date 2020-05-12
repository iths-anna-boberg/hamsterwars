const { storage } = require('./firebase')

const uploadToStorage = async () => {
    try {
        for (let i = 1; i <= 40; i++) {
            await storage.bucket().upload(`./hamsters/hamster-${i}.jpg`, { destination: `hamsters/hamster-${i}.jpg` });
            console.log(`hamster ${i} uploaded`);
        }
    } catch (err) {
        console.error(err);
    }
}

uploadToStorage();