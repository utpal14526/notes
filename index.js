const connecttomongo=require('./db');
const express=require('express');
const cors=require('cors');


const app=express();

app.use(cors());
app.use(express.json());  //middleware

connecttomongo();


//use to use routes

app.use('/api/user',require('./routes/user.js'));
app.use('/api/note',require('./routes/notes.js'));


app.listen(5000,()=>{
    console.log("Listen");
})


