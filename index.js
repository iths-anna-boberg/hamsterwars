const express = require('express');
const app = express();
app.use(express.static('public')); //serva en enkel htmlsida for now
app.use(express.json());

app.listen(3000, ()=>{
    console.log('Server up and running @ port 3000');
    })