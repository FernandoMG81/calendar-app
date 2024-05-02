/*
 * Event Routes
 * /api/events
 */

const express = require("express");
const router = express.Router();
const { jwtValidator } = require('../middlewares/jwt-validator')
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events')
const { check } = require('express-validator')
const { fieldValidator } = require('../middlewares/field-validator')
const { isDate } = require('../helpers/isDate')

// Todas tienes que pasar por la validación del JWT
router.use( jwtValidator )

router.get('/', getEvents )

router.post('/',
[
  check('title', 'El título es obligatorio').notEmpty(),
  check('start', 'Fecha de inicio es obligatorio').custom( isDate ),
  check('end', 'Fecha de finalización es obligatorio').custom( isDate ),
  fieldValidator
] ,createEvent )

router.put('/:id', updateEvent)

router.delete('/:id', deleteEvent)



module.exports = router