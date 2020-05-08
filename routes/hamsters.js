const { Router } = require('express');
const router = new Router();
const { db } = require ('./../firebase');


//GET Returnerar en array med samtliga hamsterobject från firestore

router.get('/', async (req, res)=>{
    
    try{
        
        let querySnapshot = await db.collection('hamsters').get();
        let arr = [];
        
        querySnapshot.forEach(el =>{ //loopa igenom resultatet och skapa array av alla objekt
            arr.push(el.data())
        })
        
        res.send(arr)
        
    }catch(err){
        res.status(500).send(err)
    }
    
})

//GET RANDOM Returnerar ett slumpat hamsterobject från databasen.


router.get('/random', async (req, res)=>{
    let randomId = Math.floor(Math.random()*41); //förutsätter förstås att det alltid är 40 st hamstrar, får ändra sedan

    let result ={} //obj behövs för att kunna skicka resultat
    try{
        
        let querySnapshot = await db.collection('hamsters').where('id', '==', randomId).get();
        querySnapshot.forEach(el=>{
            result = el.data();
        })
        res.send(result);
        
    }catch(err){

        res.status(500).send(err)
        
    }

   
})


//GET ID Returnerar ett objekt utifrån hamsterns id

router.get('/:id', async (req, res)=>{
    let id = req.params.id*1; //gör om till integer
    let result ={} //obj behövs för att kunna skicka resultat
    try{
        
        let querySnapshot = await db.collection('hamsters').where('id', '==', id).get();
        querySnapshot.forEach(el=>{
            result = el.data();
        })
        res.send(result);
        
    }catch(err){

        res.status(500).send(err)
        
    }
    
    
})

router.put('/:id/results', async (req, res)=>{
//behöver säkra upp detta så att om hamstern vinner kan man inte samtidigt förlora
    try{


        let id = req.params.id*1;
        let hamster;
    
        let querySnapshot = await db.collection('hamsters').where("id", "==", id).get();
        console.log(req.body)
        querySnapshot.forEach(el=>{
            hamster = el.data();
    
            hamster.wins += parseInt(req.body.wins);
            hamster.defeats += parseInt(req.body.defeats);
            hamster.games++;
    
            db.collection('hamsters')
            .doc(el.id)
            .set(hamster)
            .then(res.send({msg: 'ok'}))
            .catch(err => {throw err});
            
            
        })
        
    }
    catch(err){
        res.status(500).send(err)
    }

    //upppdatera total games nånstans

})



module.exports = router;
