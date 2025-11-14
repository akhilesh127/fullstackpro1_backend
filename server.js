 import express from 'express';
 import dotenv from 'dotenv';
 import mongoose from 'mongoose';
    import cors from 'cors'; 
 dotenv.config();
 

const app=express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.error("couldn't connect", e);
});
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    number:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});
const User=mongoose.model('User',userSchema);

const itemschema=mongoose.Schema({
    name:String,
    description:String,
    price:Number
})
const Item=mongoose.model('Item',itemschema);


app.post('/signup', (req,res) => {
    const {name,email,number,password}=req.body;
    new User ({
        name,
        email,
        number,
        password
    }).save()
    .then(() => {
        res.status(201).send({message: 'User registered successfully' });
    })
    .catch((e) => {
        res.status(400).send({message: 'User already exists'});
    });
});
app.post('/login', (req,res)=>{
    const {email,password}=req.body;
    User.findOne({email,password})
   .then((user)=>{
   if(user){
       res.status(200).send({message:'Login successful'});
       
   }else{
       res.status(401).send({message:'invalid email or password'});
   }
})
.catch((e) => {
       res.status(500).send({message});
   });

});
app.post('/additem', (req, res) => {
    const { name, description, price } = req.body;
    const newItem = new Item({
        name,
        description,
        price
    });
    newItem.save()
        .then(() => {
            res.status(201).send({ message: 'Item added successfully' });
        })
        .catch((e) => {
            res.status(400).send({ message: 'Error adding item' });
        });
});
app.get('/items', async (req, res) => {
    const data= await Item.find();
    res.json(data);
});
app.put('/items/:id', async  (req, res) => {
    try {
        const updatedItem =await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);

    } 
    catch (e) {
        res.status(400).send( { message: 'Error updating item' } );
    }
});
app.delete("/items/:id",async(req, res)=>{
    try{
        await Item.findByIdAndDelete(req.params.id)
        res.send("Item deleted")
    }
    catch(e){
        res.status(400).send("Error deleting item")
    }
});


app.get('/', (req, res) => {

    res.send('Home page');

});
app.listen(4000)