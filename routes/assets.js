const {Router} = require('express');
const {storage} = require('../firebase');
const router = new Router();
const fs = require('fs');
const fileUpload = require('express-fileupload');


//GET hämta bild på hamster

router.get('/:filename', async (req, res)=>{
    
    console.log(req.params.filename)


    try{
        const fetchImg = await storage.bucket()
        .file(`hamsters/${req.params.filename}`)
        .download()
        
        // console.log(fetchImg)
        let pic = Buffer.concat(fetchImg)//tack johan för denna mirakelkod som omvandlar buffer till jpg
        res.status(200).contentType('jpeg').send(pic) 
    
    }catch(err){
        res.status(500).send(err)
    }
})

//POST posta bild på hamster//




module.exports = router;