const z = require("zod");
const User = require("../model/user");
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const Bank=require('../model/bank');


require('dotenv').config();


const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  secondName: z.string(),
});

//handler for user signup

export const SignUp = async (req, res) => {
  try {
    const { body } = req.body;

    const { success } = userSchema.safeParse(body);

    if (!success) {
      return res.status(401).json({
        success: false,
        message: "Invalid details",
      });
    }

    const user = await User.findOne(body.email);

    

    if (user) {
      return res.status(401).json({
        success: false,
        message: "User is already registered",
      });
    }
    const hashedPassword=await bcrypt.hash(body.password,10);

    body.password=hashedPassword;
    const newUser=await User.create(body);
    const userId=newUser._id;
    await Bank.create({userId,balance:1+Math.random()*1000})

    const token=jwt.sign({
        userId:newUser._id,
    },process.env.JWT_SECRET);



    return res.status(200).json({
        success:true,
        message:"User Registered Succesfully",
        token:token
    })
  } catch {
    return res.status(404).json({
      success:false,
      message:"Internal Server Error"
    })
  }
};



const updateaInfoSchema=z.object({
  email:z.string().optional(),
  password:z.string().optional,
  firstName:z.string().optional(),
  secondName:z.string().optional();
})

//handler for updating user info
export const updateUserInfo=async (req,res)=>{
  try{
    const body=req.body;
    const {success}=updateaInfoSchema.safeParse(body);
    if(!success){
      return res.status(403).json({
        success:false,
        message:"Invalid Input"
      })
    }
    const user=User.findById(body.userId);

    if(!user){
      return res.status(403).json({
        success:false,
        message:"User not logged in"
    })
    }


    await User.updateOne(body,{
      id:req.userId
    });

    return res.status(200).json({
      success:true,
      message:"User info updated succesfully"
    })


  }
  catch{
    return res.status(404).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

const filterSchema=z.string();


//handler to search user based on the username
export const searchUser=async (req,res)=>{
  try{
    const filter=req.query.filter || '';

    const {success}=filterSchema.safeParse(filter);

    if(!success){
      return res.status(403).json({
        success:false,
        messsaeg:"Invalid input"
      })
    }

    const response=await User.find({
      '$or':[{firstName:{
        "$regex":filter
      }},
      {secondName:{
        "$regex":filter
      }}

      ]
    })


    return response;


  }
  catch{
    return res.status(404).json({
      success:false,
      message:"Internal Server Error"
    })

  }
}

