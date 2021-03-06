const express = require('express');
const app = express();
require('dotenv').config();


app.use(express.static('public')); //serva en enkel htmlsida for now
app.use(express.json());



//AUTH

app.use((req, res, next)=>{
    
    if(req.method !== 'GET'){
        
        const APIKey = process.env.API_KEY;
        
        if(APIKey === req.headers['authorization']){
            next();
        }else{
            res.status(400).send({msg: 'You forgot your API key!'})
        }
        
    }else{
        next();
    }
})

//routes
const hamstersRoute = require('./routes/hamsters');
app.use('/hamsters', hamstersRoute);

const chartsRoute = require('./routes/charts');
app.use('/charts', chartsRoute);

const gamesRoute = require('./routes/games');
app.use('/games', gamesRoute);

const statsRoute = require('./routes/stats');
app.use('/stats', statsRoute);

const assetsRoute = require('./routes/assets');
app.use('/assets', assetsRoute);


app.listen(3000, ()=>{
    console.log('Server up and running @ port 3000');
})