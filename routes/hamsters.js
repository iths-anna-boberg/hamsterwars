const { Router } = require('express');
const router = new Router();
const { db, fieldValue } = require ('./../firebase');


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
//skalbar med separat counter, se nedan beskrivning


router.get('/random', async (req, res)=>{
    
    let result ={} //obj behövs för att kunna skicka resultat
    try{
        let getCounter = await db //har en separat collection med counter för att slippa hämta hem HELA hamster-collection varje gång
        .collection('counter')
        .doc('hamster')
        .get()
        .then(doc => doc.data())
        
        let randomId = Math.floor(Math.random()*getCounter.hamsterCount+1); //skapa random utifrån hur många som finns i min separata counter
        
        let querySnapshot = await db
        .collection('hamsters')
        .where('id', '==', randomId) //så vi hämtar bara ett random id och inte hela collection för att sedan slumpa fram något
        .get();
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
//Skicka in uppdatering om att hamster vunnit eller förlorat en match.
//OBS! Skicka bara in id (från uri) + antingen wins eller defeats.
//själva body på req params innehåller alltså bara {'wins':1} eller {'defeats':1}
//siffran i body ignoreras, istället använder vi firestores inbyggda incrementfunktion så att man inte kan skicka fel
router.put('/:id/results', async (req, res)=>{
    try{
        
        
        let id = req.params.id*1;
        let hamster;
        let docId;
        
        let querySnapshot = await db.collection('hamsters').where("id", "==", id).get();
        
        querySnapshot.forEach(el=>{
            hamster = el.data();
            docId = el.id; //hämta ut dokumentid på hamster som ska uppdateras
        })
        //Kolla om hamstern vunnit eller förlorat
        if(req.body.wins === undefined){ //om det inte skickats in att den vunnit har den förlorat
            db.collection('hamsters')
            .doc(docId)
            .update({defeats : fieldValue.increment(1), games: fieldValue.increment(1)})
            .then(res.send({msg: 'defeated hamster was updated'}))
        .catch(err => {throw err});
        }
        if(req.body.defeats === undefined){//om det inte skickas in att den förlorat har den vunnit
            db.collection('hamsters')
            .doc(docId)
            .update({wins : fieldValue.increment(1), games: fieldValue.increment(1)})
            .then(res.send({msg: 'winning hamster was updated'}))
        .catch(err => {throw err});
        }
        
    }
    catch(err){
        res.status(500).send(err);
    }
    
    
})

//POST NY hamster
router.post('/', async (req, res)=>{
    
    try{
        await db.collection('hamsters')
        .doc()
        .set(req.body)
        .then(console.log('hamster added'))
        await db.collection('counter') //när vi lägger till en hamster måste min counter uppdateras så att GET random-metoden blir rätt
        .doc('hamster')
        .update({hamsterCount : fieldValue.increment(1)})
        .then(console.log('counter updated'))
        
        res.send({msg: 'hamster added and counter updated'})
        
        
        
    }catch(err){
        res.status(500).send(err);
    }
    
})



module.exports = router;
