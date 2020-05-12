const {Router} = require('express');
const {storage} = require('../firebase');
const router = new Router();
const fs = require('fs');
const fileUpload = require('express-fileupload');

router.use(fileUpload);


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
router.post('/', async (req,res)=>{
    console.log(req.files.photo)
    try{

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
          }

        let img = req.files.photo;
        let path = `../temp/${img.name}`
    
        await img.mv(path, err=> {if(err) throw err});
        console.log('uploaded file moved to temp folder');

        await storage.bucket().upload(path, {destination: `hamsters/${img.name}`});

        fs.unlink(path, err=>{if(err) throw err})

        res.status(200).send({msg: `${img.name} was added to hamster storage`})

    }catch(err){
        res.status(500).send(err)
    }

})



module.exports = router;