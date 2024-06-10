const express = require("express");
const app = express();
const users = require("./MOCK_DATA.json");
const fs = require('fs');
const mongoose = require("mongoose");
const { type } = require("os");
const { unique } = require("drizzle-orm/mysql-core");

// connect to mongoose
mongoose.connect("mongodb://127.0.0.1:27017/demo-connection")
.then(()=>console.log("mongodb connected"))
.catch((err)=>console.log(err));

// Schema 
const UserSchema = new mongoose.Schema({
  firstName:{ type:String, required: true},
  lastName:{ type:String},
  email:{ type:String, required: true, unique:true},
  jobTitle:{ type:String},
  gender:{ type:String},

});

// creating a model

const User = mongoose.model("user",UserSchema);


// we need a middleware - as a plugin which helps us set up permission for url encoded 
app.use(express.urlencoded({extended:false}));
app.use(express.json());


// routes
// app.get('/api/users', (req,res)=>{
//   res.json(users);
// })

app.get('/users', async(req,res)=>{
    const allDbUsers = await User.find({});
     const html =`
     <ul>
        ${allDbUsers.map(user=>`<li>${user.firstName}-${user.email}</li>`).join("")}
     </ul>
     `;
     res.send(html);
})


app.get('/api/users/:id', async(req,res)=>{
  // const id = Number(req.params.id);
  // const val = users.find((user)=>user.id===id);
  // res.json(val);
   const dbUser = await User.findById(req.params.id);
   res.json(dbUser);
})

app.route('/api/users/:id')
.get(async(req,res)=>{
  //   const id = Number(req.params.id);
  // const val = users.find((user)=>user.id===id);
  // res.json(val);
  const dbUser = await User.findById(req.params.id);
   return res.json(dbUser);
})
.patch(async(req,res)=>{
  // edit the user with id 
  const dbUser = await User.findByIdAndUpdate(req.params.id,{lastName:"indipendent"});
    return res.json({status:'successfully changed '});
})
.delete(async (req,res)=>{
  // delete the user with id 
    await User.findOneAndDelete(req.params.id);
      res.json({status:'successfully deleted '});
   
});

app.post('/api/users', async(req,res)=>{
      const body = req.body;
      if(!body|| !body.firstName || !body.lastName || !body.email || !body.gender || !body.job_title){res.status(402).json({status:"missing few fields"});}
      // console.log("body :", body);
      // users.push({...body,id: users.length+1});
      // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users),(err,data)=>{
      //   return res.json({status: 'success', id:users.length});
      // });

      // gotta use await async here bcoz we using mongodb 
      const result = await User.create({
        firstName:body.firstName ,
        lastName:body.lastName,
        email:body.email,
        gender:body.gender,
        jobTitle:body.job_title
      })
      console.log(result);
      return res.status(201).json({msg:"successfully inserted"});
      
})

app.listen(8000,()=>console.log("server has started"));
