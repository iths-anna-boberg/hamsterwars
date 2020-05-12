const {Router} = require('express');
const router = new Router();
const { db, fieldValue } = require ('./../firebase');


//POST Sparar en match

router.post('/', async (req, res)=>{
    let date = new Date();
    let d = date.getDate();
    let m = date.getMonth();
    let y = date.getFullYear();
    let timeStamp = `${d}/${m+1}/${y}`;
    try{
        await db.collection('games')
        .doc()
        .set({
            id: fieldValue.increment(1),
            timestamp: timeStamp,
            contestants: [req.body.hamsterOne, req.body.hamsterTwo],
            winner: req.body.winner,
            
        })

        await db.collection('counter') //separat collection för att räkna antal games, se router för stats
        .doc('totalGamesStats')
        .update({totalGamesCount : fieldValue.increment(1)})
        .then(console.log('counter updated'))
        
        res.send({msg: 'New Game added and total games counter updated'})


    }catch(err){
        res.status(500).send(err)
    }


})

//GET alla matcher

router.get('/', async (req, res)=>{

    try{

        let games =[];

        const fetchGame = await db.collection('games').get();

        fetchGame.forEach(game =>games.push(game.data()))

        res.status(200).send(games);

    }catch(err){
        res.status(500).send(err);
    }


})





module.exports = router;