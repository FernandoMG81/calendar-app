const { response } = require("express");
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { generateJWT } = require('../helpers/jwt')

const createUser = async(req, res = response) => {
  const { email, password } = req.body;

  try {

    let user = await User.findOne({ email })

    if ( user ){
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario existe con ese correo'
      })
    }
    
    user = new User( req.body )

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync( password, salt )

    await user.save()

    const token = await generateJWT( user.id, user.name )


    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })
    
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }

};

const loginUser = async(req, res = response) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email })

    if ( !user ){
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email'
      })
    }

    // Confirmar password

    const validPassword = bcrypt.compareSync( password, user.password )

    if(!validPassword){
      return res.status(400).json({
        ok: false,
        msg: 'Password incorrecto'
      })
    }

    // Generar JWT

    const token = await generateJWT( user.id, user.name )

    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }

  
};

const renewToken = async(req, res) => {

  const { uid, name } = req

  const token = await generateJWT(uid, name)


  res.json({
    ok: true,
    name, uid,
    token
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
