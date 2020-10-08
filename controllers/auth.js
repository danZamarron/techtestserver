const {hashSync, genSaltSync} = require('bcrypt');
const saltRounds = 12;
const User = require('../models/User');
const passport = require("../configs/passport")

exports.postLogin = async (req,res,next) => 
{
    passport.authenticate("local", (err, user, failureDetails) => {
        if (err) {
          console.log(failureDetails)
          res
            .status(500)
            .json({ message: "Something went wrong authenticating user" })
          return
        }
    
        if (!user) {
          res.status(401).json(failureDetails)
          return
        }
        req.login(user, err => {
          if (err) {
            res.status(500).json({ message: "Session save went bad." })
            return
          }
          res.status(200).json(user)
        })
      })(req, res, next)
}

exports.postSignUp = async (req, res, next) => 
{
    const { username, password } = req.body

    let msg = "";    
    
    if (!username || username === "") {
        msg = "Nombre del usuario es un campo requerido"
    }       
    
    if (!password || password === "") {
        const defaultMsg = "Password es un campo requerido"
        if(msg === "")
            msg = defaultMsg
        else
            msg += ", " + defaultMsg;
    }

    if(msg !== "")
    {
        res.status(401).json({ message: msg })
        return
    }


    const existingUser = await User.findOne({ username })
  
    if (existingUser) {
        res.status(401).json({ message: "El username ya existe" })
        return
    }
  
    const hashPwd = hashSync(password, genSaltSync(saltRounds))
  
    await User.create({
        username,
        password: hashPwd
    })
    .then(() => {
        res.status(200).json({ message: "Usuario creado" })
    })
    .catch(err => {
        res.status(500).json({ message: "Algo sucedio al crear el usuario" })
    })     
}

exports.getLogOut = (req, res, next) => {
    req.logout()
    res.status(200).json({ message: "Usuario cerro sesion satisfactoriamente" })
}

exports.getCurrentUser = (req,res,next) => {
    res.status(200).json({ user: req.user })
}