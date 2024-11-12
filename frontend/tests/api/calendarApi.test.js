import calendarApi from '../../api/calendarApi'

describe('Pruebas en el CalendarApi', () => {
  test('debe de tener la configuración por defecto', () => {
    // console.log(calendarApi)
    // console.log(process.env)
    expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL)
  })

  test('Debe de tener el x-token en el header de todas las peticiones', async () => {
    localStorage.setItem('token', 'ABC-123-XYZ')

    const res = await calendarApi.get('/auth').then(res => res).catch(res => res)

    expect(res.config.headers['x-token']).toBe('ABC-123-XYZ')
  })
})
