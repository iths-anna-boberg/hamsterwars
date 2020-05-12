const {Router} = require('express');
const router = new Router();
const { db, fieldValue } = require ('./../firebase');


//GET Totalt antal matcher som hållits
//hämtas från en db som innehåller en counter istället för att hämta hem hela matchdatabasen och räkna antalet objekt i den.
router.get('/total', async (req,res)=>{

    try{

        let total = await db.collection('counter')
                            .doc('totalGamesStats')
                            .get()
                            .then(doc => doc.data())

                            res.status(200).send({games : total.totalGamesCount})


    }catch(err){

        res.status(500).send(err);

    }

})


//GET topp tre favoritmat bland vinnare
//om samma mat förekommer fler gånger tas den bort

router.get('/breakfastofchampions', async (req, res)=>{

    const topThree = await db.collection('hamsters').orderBy('wins', 'desc').limit(3).get();

    let hamsters = [];
    let favFoods = [];

    topThree.forEach(hamster=>hamsters.push(hamster.data()));

    for(hamster of hamsters){
        if(!favFoods.includes(hamster.favFood)){
            favFoods.push(hamster.favFood)

        }
        
    }
    res.send({winnersEat: favFoods})
})

module.exports = router;