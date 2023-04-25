const express=require('express');
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require ('bcrypt');
var jwt = require('jsonwebtoken');
var JWT_SECRET='Utpalis@goodboy';
const fetchuser=require('../middleware/fetchuser');


//Route 1 CreaeAuserendpoint 

router.post('/createuser',

body('name','Enter a valid name').isLength({ min: 3}),
body('email','Enter a valid email').isEmail(),
body('password','Enter a valid password').isLength({ min: 5 }),

//done express-validat

async (req,res)=>{

  let s=false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }//erros length //return bad status
  //checking validation

  try{

  //check user exist in yr dataabse or not..
  
       let user= await User.findOne({email:req.body.email});
       

       if(user){
            res.status(400).json({s,error:"Sorry user with this email already exist"});
       }

       else{
 
           //adding salt to password

           const salt=await bcrypt.genSalt(10);
           const secpass=await bcrypt.hash(req.body.password,salt);
 
           let user=await User.create({
              name: req.body.name,
              password: secpass,
              email: req.body.email,
           })
          //user ban gya
           const data ={
               user:{
                  id:user.id
               }
           }
          
          var authtoken = jwt.sign(data, JWT_SECRET);
          console.log(authtoken);
          s=true;
          res.json({s,"authtoken":authtoken});


       }//else 

  }//try block ends 

  catch(err){
    console.log(err);
    res.status(500).json({error:"Some error occured"});
  }


  //user stored credentials validate and unique ka kaam kiya 


});
// that how you send your data into database





// Route 2 login of a user endpoint and authenticate


router.post('/loginuser',

    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),

   async (req,res)=>{

       const errors = validationResult(req);
       if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
       }//erros length //return bad status
  
  
       //array destructuring

      let success=false;
 
      const {email,password}=req.body;

      try{
            let user=await User.findOne({email});

            if(!user){
               return res.status(400).json({"error":"Try to login with correct credentials."});
            }

            const passwordCompare=await bcrypt.compare(password,user.password);

            if(!passwordCompare){
                 success=false;
                 return res.status(400).json({success,"error":"Try to login with correct credentials."});
            }

             //jwt art

            const data ={
               user:{
                 id:user.id
               }
            }

            // user nikalkr waha se auth token le aayege
         
            var authtoken = jwt.sign(data, JWT_SECRET);
            console.log(authtoken);
            success=true;
            
            res.json({success,"authtoken":authtoken});

             //jwt
        
      }
     //try ends 

      catch(error){
           console.log(error.message);
           res.status(500).json({error:" Internal Server error occured"});
      }//catch

  
})


// Route3 get login user details 



router.post('/fetchuser',fetchuser,

   async (req,res)=>{
      
      try{
           
         const userId=req.user.id;         // req.user.id mai aa jayega id 
         const user=await User.findById(userId).select("-password");
         res.send(user);
  
      }
     //try ends 

      catch(error){
           console.log(error.message);
           res.status(500).json({error:" Internal Server error occured"});
      }//catch

})



module.exports=router