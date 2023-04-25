const mongoose=require('mongoose');
const {Schema} = mongoose;

const  NotesSchema= new Schema ({

     userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
     },

     title:{
        type:String,
        required:true,
     },

     description:{
        type:String,
     },
    
     tag:{
        type:String,
        default:"General"
     },
  
     Date:{
        type:Date,
        default:Date.now,
     }

});

// now how to export this

module.exports = mongoose.model('notes',NotesSchema);

//this is how y create schema in node js
