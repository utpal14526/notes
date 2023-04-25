const express=require('express');
const router=express.Router();
const Notes=require('../models/Notes');
const fetchuser=require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// Route 1  fetch all notes   // login required

router.get('/fetchallnotes',fetchuser,async (req,res)=>{

    // current user logged in hai or uski id req.user.id hai user notes mai mai ek secific user ki id hai ab jo jo id match hoge wo saarre notes aa jayega 

    const notes=await Notes.find({userId: req.user.id});
    res.json(notes);
})

// this is for fetching all the notes for current user by using auth-token




// // to add a newNote  Route :2    // login reequired 

router.post('/addnewnote', fetchuser,

body('title','Enter a valid title').isLength({ min: 3}),
body('description','description should be of atleast 5 charachters').isLength({ min: 3}),

async (req,res)=>{
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{

        let note=await Notes.create({
            title: req.body.title,
            description:req.body.description,
            tag:req.body.tag,
            userId:req.user.id
        })

        res.json(note);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Some error occured"});
    }
    
})

 // end  of add a new node




// Route : 3 Update a existing node     // login required
// specific id of a note usko kro delete  jo logged in hai 
 //  udate jabhi krr aoge jabh yrr toh wahhi user ho 

router.put('/updatenotes/:id', fetchuser,

async (req,res)=>{
    
   const {title,description,tag}=req.body;
   const newNote={};

   if(title){newNote.title=title};
   if(description){newNote.description=description};
   if(tag){newNote.tag=tag};
   

   // find the note to be udated and udate it 

   let note=await Notes.findById(req.params.id);

   if(!note){
       res.status(404).send("Not found");
   }

   if(note.userId.toString()!=req.user.id){
       res.status(404).send("Aapni id se aa na ");
   }

   // yaha kya ho rha hai ki req.user.id mai toh user ki id hogi jo ki loggedin hai but 
   // req.arams.id ek note ki id hai 

   // hai sahi user note hai 

   note =await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});

   //updated note

   res.json(note);

})


//{}

// End of udating 



// Route : 4 Deleting a node  uska delete kro jiski id hamari
// auth-token and note ki id se user ki id same ho jaye jab


router.delete('/deletenote/:id', fetchuser,

async (req,res)=>{
    
   // find the note to be udated and udate it 

   try{

   let note=await Notes.findById(req.params.id);

   if(!note){
       res.status(404).send("Not found");
   }

   if(note.userId.toString()!=req.user.id){
       res.status(404).send("Aapni id se aa na ");
   }

   // yaha kya ho rha hai ki req.user.id mai toh user ki id hogi jo ki loggedin hai but 
   // req.arams.id ek note ki id hai 

   // hai sahi user note hai 

   note =await Notes.findByIdAndDelete(req.params.id);

   //updated note

   res.json({"Success":" note has been deleted", note:note});

   }

   catch(error){
      res.status(404).json({error:error});
   }

})


 // note enddelete





module.exports=router