import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { NavBar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../'
import { localizer, getMessagesES } from '../../helpers'
import { useState } from 'react'
import { useUiStore, useCalendarStore } from '../../hooks'

export const CalendarPage = () => {
  const { openDateModal } = useUiStore()
  const [lastView, setLastView] = useState(
    localStorage.getItem('lastView') || 'week'
  )
  const { events, setActiveEvent } = useCalendarStore()

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#347CF7',
      borderRadius: '0px',
      opacity: 0.8,
      border: '15px',
      color: 'white'
    }

    if (isSelected) {
      style.backgroundColor = '#10387d'
    }

    return {
      style
    }
  }

  const onDoubleClick = (event) => {
    openDateModal()
  }

  const onSelect = (event) => {
    setActiveEvent(event)
  }

  const onViewChange = (event) => {
    localStorage.setItem('lastView', event)
    setLastView(event)
  }

  return (
    <>
      <NavBar />

      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChange}
      />

      <CalendarModal />
      <FabAddNew />
      <FabDelete />

    </>
  )
}
