const {Router} = require('express');
const router = new Router();
const {db} = require('../firebase')



//GET topplista fem hamstrar som vunnit

router.get('/top', async (req, res) => {
    try {
        const querySnapshot = await db.collection('hamsters').orderBy('wins', 'desc').limit(5).get();
        const hamsters = [];
        querySnapshot.forEach(doc => hamsters.push(doc.data()));

        res.send(hamsters);
    } catch (err) {
        res.status(500).send(err);
    }
});

//GET fem största förlorarna

router.get('/bottom', async (req, res) => {
    try {
        const querySnapshot = await db.collection('hamsters').orderBy('defeats', 'desc').limit(5).get();
        const hamsters = [];
        querySnapshot.forEach(doc => hamsters.push(doc.data()));

        res.send(hamsters);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;