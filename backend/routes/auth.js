/**
 * Rutas de usuarios / Auth
 * host + /api/auth
 */

const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { createUser, loginUser, renewToken } = require("../controllers/auth");
const { fieldValidator } = require('../middlewares/field-validator')
const { jwtValidator } = require('../middlewares/jwt-validator')

router.post(
  "/new",
  [
    // middlewares
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    fieldValidator
  ],
  createUser
);

router.post(
  "/",
  [
    // middlewares
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    fieldValidator
  ],
  loginUser
);

router.get("/renew", jwtValidator ,renewToken);

module.exports = router;
