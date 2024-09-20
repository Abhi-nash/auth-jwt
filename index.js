const express = require('express');
const jwt=require('jsonwebtoken')
const JWT_TOKEN="JWT_TOKEN";
const app = express();

app.use(express.json())

let users=[];

app.get('/',(req,res)=>{
  res.sendFile(__dirname+"/public/index.html")
})

app.post('/signup',(req,res)=>{
  let u=req.body.username
  let p=req.body.password

  for(let i=0; i<users.length; i++){
    if(users[i].username==u){
      res.json({
        response : "Username already exists"
      })
    }
  }

  users.push({
    username :u,
    password :p
  })
  
  console.log(users)
  res.json({
    respnse : "user details filled" 
  })
})


app.post('/signin',(req,res)=>{
  let u=req.body.username
  let p=req.body.password

  let user=users.find((x)=>{
    if(x.username==u && x.password==p){
      return true;
    }
    else{
      return false;
    }
  })
  
  if(user){
    const token=jwt.sign({
      username : user.username
    },JWT_TOKEN) //token generation 

    console.log(users)
    res.json({
      token : token
    })
  }
  else{
    res.json({
      user : "notfound"
    })
  }

})

function auth(req,res,next){
  //middleware
  let tok=req.headers.token
  try{
    let usernametoken= jwt.verify(tok,JWT_TOKEN)
    req.username=usernametoken.username
    next();
  }
  catch{
    res.json({
      user : "Token Invalid"
    })
  }

}

app.get('/me',auth,(req,res)=>{
  
  
  let user=users.find((x)=>{
    if(x.username==req.username){
      return true;
    }
    else{
      return false;
    }
  })

  if(user){
    res.json({
      username : user.username,
      password : user.password,
    })
  }
  else{
    res.json({
      user : "Not found"
    })
  }

})

app.listen(3000,()=>{
  console.log("app is live")
})
