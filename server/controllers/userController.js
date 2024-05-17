const HttpError = require("../models/errorModel")
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require("uuid")
//==================================== REGISTER A NEW USER ==========================================
//POST : api/users/register
//UNPROTECTED
const registerUser = async (req,res,next) => {
     
   try{
       const {name,email,password,CnfPassword} = req.body;
       if(!name || !email || !password || !CnfPassword){
          return next (new HttpError("Fill in all Field", 422))
       }
       const newEmail = email.toLowerCase()
       const isEmailExist = await User.findOne({email: newEmail})
       if(isEmailExist){
          return next (new HttpError("Email Already Exists", 422))
       }
       if(password.trim().length < 6){
          return next (new HttpError("Password Should Be atleast 6 charactor",422))
       }
       if(password != CnfPassword){
          return next (new HttpError("Password Does not Match",422))
       }
       const salt = await bcrypt.genSalt(10);
       const hashedPass = await bcrypt.hash(password, salt);
       const newUser = await User.create({name,email: newEmail,password: hashedPass})
       res.status(201).json(`New User ${newUser.email} Registered`)
   }
   catch(error){
     return next(new HttpError("User Registration Failed.", 422))
   }

}


//==================================== LOGIN A REGISTER USER ========================================
//POST : api/users/login
//UNPROTECTED
const loginUser = async (req,res,next) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
           return next (new HttpError("Fill in all Field", 422))
        }
        const newEmail = email.toLowerCase();
        const user = await User.findOne({email: newEmail})

        if(!user){
            return next(new HttpError("Inavlid Credentials.", 422))   
        }
        
        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass){
            return next(new HttpError("Inavlid Credentials.", 422))   
        }
        const {_id: id,name} = user;
        const token = jwt.sign({id,name}, process.env.JWT_SECRET, {expiresIn: "1d"})
        res.status(200).json({token,id,name})
    }
    catch(error){
        return next(new HttpError("Login Failed.", 422))
    }
}


//==================================== USER PROFILE =================================================
//POST : api/users/:id
//PROTECTED
const getUser = async (req,res,next) => {
   try{
      const {id} = req.params
      const user = await User.findById(id).select('-password')
      if(!user){
        return next(new HttpError("User Not Found",404))
      }
      res.status(200).json(user)
   }catch(error)
   {
      return next(new HttpError(error))
   }
}


//==================================== CHANGE USER PROFILE PIC =================================================
//POST : api/users/change-avatar
//PROTECTED
const changAvatar = async (req,res,next) => {


    try{
        if(!req.files.avatar){
           return next(new HttpError("Please choose an image",422))
        }

        const user = await User.findById(req.user.id)
        //delete the previous avatar if exists
        if(user.avatar){
            fs.unlink(path.join(__dirname,'..','uploads', user.avatar),(err) => {
                if(err){
                    return next(new HttpError(err))
                }
            })
        }

        const {avatar} = req.files
        if(avatar.size > 500000){
            return next(new HttpError("Profile picture too big should be less then 500kb",422))
        }

        let filename = avatar.name;
        let splittedFileName = filename.split('.')
        let newFileName = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1]
        avatar.mv(path.join(__dirname,'..','uploads', newFileName), async (err) => {
            if(err){
                return next(new HttpError(err))
            }
            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: newFileName}, {new: true})
            if(!updatedAvatar){
                return next(new HttpError("Avatar Couldnt be changed",422))
            }
            res.status(200).json(updatedAvatar)
        })
    }
    catch(error){
        return next(new HttpError(error))   
    }
}


//==================================== CHANGE USER DETAILS (in profile) =================================================
//POST : api/users/edit-user
//PROTECTED
const editUser = async (req,res,next) => {
    try
    {
        const {name,email,currpassword,newPassword,CnfPassword} = req.body;
        if(!name || !email || !currpassword || !newPassword){
            return next(new HttpError("Please Fill all the field",422))
        }
        const user = await User.findById(req.user.id);
        if(!user){
            return next(new HttpError("User Not Found!",403))
        }
        const emailExist = await User.findOne({email});
        if(emailExist && (emailExist._id != req.user.id)){
            return next(new HttpError("Email Already Exists",422))
        }
        const validateUserPassword = await bcrypt.compare(currpassword, user.password)
        if(!validateUserPassword){
            return next(new HttpError("Invalid Current Password",422))
        }

        if(newPassword !== CnfPassword){
            return next(new HttpError("New Password Doesnot match",422))
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name,email,password:hash}, {new: true})
        res.status(200).json(newInfo)
    }
    catch(error){
        return next(new HttpError(error))   
    }
}

//==================================== GET AUTHORS =================================================
//POST : api/users/authors
//UNPROTECTED
const getAuthors = async (req,res,next) => {
    try
    {
       const authors = await User.find().select('-password')
       res.json(authors)
    }
    catch(error)
    {
        return next(new HttpError(error))
    }
}

module.exports = {registerUser,loginUser,getUser,changAvatar,editUser,getAuthors};