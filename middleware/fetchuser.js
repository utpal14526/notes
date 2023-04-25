

var jwt = require('jsonwebtoken');
var JWT_SECRET='Utpalis@goodboy';


const fetchuser=(req,res,next)=>{
     //Get the user from jwt token and add id to req object

     const token=req.header('auth-token');  //auth token taken is from header 
      
     if(!token){
        res.status(401).send({error:"Please authenticate with correct id token"});
     }

     try{

        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;    // req.user data.user
        next()

     }catch(error){
        res.status(401).send({error:"Please authenticate with correct id token"});

     }
 
}

module.exports=fetchuser;

 
