const { response } = require('express')
const Event = require('../models/Event')

const getEvents = async (req, res=response) => {

  const events = await Event.find()
                            .populate('user', 'name')


  res.json({
    ok: true,
    events
  })
}

const createEvent = async(req, res=response) => {

  const event = new Event( req.body )

  try {

    event.user = req.uid
    const savedEvent = await event.save()
    res.status(201).json({
      ok: true,
      event: savedEvent
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }

}


const updateEvent = async(req, res=response) => {

  const eventID = req.params.id
  const uid = req.uid

  try {
    
    const event = await Event.findById( eventID )

    if(!event) {
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe por ese id'
      })
    }


    if( event.user.toString() !== uid ){
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de editar este evento'
      })
    }

    const newEvent = {
      ...req.body,
      user: uid
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventID, newEvent, {new: true})

    res.json({
      ok: true,
      event: updatedEvent
    })

  } catch (error) {
    //TODO: grabar un txt con fecha y hora
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }

}


const deleteEvent = async(req, res=response) => {

  const eventID = req.params.id
  const uid = req.uid

  try {
    
    const event = await Event.findById( eventID )

    if(!event) {
      return res.status(404).json({
        ok: false,
        msg: 'Evento no existe por ese id'
      })
    }


    if( event.user.toString() !== uid ){
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de eliminar este evento'
      })
    }

    await Event.findByIdAndDelete(eventID)

    res.json({
      ok: true,
    })

  } catch (error) {
    //TODO: grabar un txt con fecha y hora
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}



module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
}