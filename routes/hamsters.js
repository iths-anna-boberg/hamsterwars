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
    
    let querySnapshot = await db.collection('hamsters').where('id', '==', id).get();
    querySnapshot.forEach(el=>{
        result = el.data();
    })
    res.send(result);
})

module.exports = router;
