import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '../../src/store'
import { useAuthStore } from '../../src/hooks'
import { act, renderHook } from '@testing-library/react'
import { initialState, notAuthenticatedState } from '../fixtures/authStates'
import { testUser } from '../fixtures/testUser'
import calendarApi from '../../api/calendarApi'

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer
    },
    preloadedState: {
      auth: { ...initialState }
    }
  })
}

describe('Pruebas en useAuthStore', () => {
  beforeEach(() => localStorage.clear())

  test('Debe de regresar los valores por defecto', async () => {
    const mockStore = getMockStore({ ...initialState })
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
    })

    expect(result.current).toEqual({
      status: 'checking',
      user: {},
      errorMessage: undefined,
      startLogin: expect.any(Function),
      startRegister: expect.any(Function),
      checkAuthToken: expect.any(Function),
      startLogout: expect.any(Function)
    })
  })

  test('startLogin debe de realizar el login correctamente', async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState })
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
    })

    await act(async () => {
      await result.current.startLogin(testUser)
    })

    const { status, user, errorMessage } = result.current
    expect({ status, user, errorMessage }).toEqual({
      status: 'authenticated',
      user: { name: 'test', uid: '66ccf68ba598e0bba36f193e' },
      errorMessage: undefined
    })
    expect(localStorage.getItem('token')).toEqual(expect.any(String))
    expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String))
  })

  test('startLogin debe de fallar la autenticación', async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState })
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockStore }>{children}</Provider>
    })

    await act(async () => {
      await result.current.startLogin({ email: 'fallar@gmail.com', password: '1234569898' })
    })

    const { status, user, errorMessage } = result.current
    expect(localStorage.getItem('token')).toBe(null)
    expect({ status, user, errorMessage }).toEqual({
      status: 'not-authenticated',
      user: {},
      errorMessage: 'Credenciales incorrectas'
    })

    // Test no valido, al estado actual de la app
    // await waitFor(
    //   () => {
    //     expect(result.current.errorMessage).toEqual(undefined)
    //   }
    // )
  })

  test('startRegister debe de crear un usuario', async () => {
    const newUser = { email: 'algo@google.com', password: '123456789', name: 'Test User 2' }

    const mockStore = getMockStore({ ...notAuthenticatedState })
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
    })

    const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
      data: {
        ok: true,
        uid: '1263781293',
        name: 'Test User',
        token: 'ALGUN-TOKEN'
      }
    })

    await act(async () => {
      await result.current.startRegister(newUser)
    })

    const { errorMessage, status, user } = result.current

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'Test User', uid: '1263781293' }
    })

    spy.mockRestore()
  })

  test('startRegister debe de fallar la creación', async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState })
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
    })

    await act(async () => {
      await result.current.startRegister(testUserCredentials)
    })

    const { errorMessage, status, user } = result.current

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: 'El usuario ya existe',
      status: 'not-authenticated',
      user: {}
    })
  })

  test('checkAuthToken debe de fallar si no hay token', async () => {
    const mockStore = getMockStore({ ...initialState })
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
    })

    await act(async () => {
      await result.current.checkAuthToken()
    })

    const { errorMessage, status, user } = result.current
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'not-authenticated',
      user: {}
    })
  })

  test('checkAuthToken debe de autenticar el usuario si hay un token', async () => {
    const { data } = await calendarApi.post('/auth', testUserCredentials)
    localStorage.setItem('token', data.token)

    const mockStore = getMockStore({ ...initialState })
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
    })

    await act(async () => {
      await result.current.checkAuthToken()
    })

    const { errorMessage, status, user } = result.current
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: 'authenticated',
      user: { name: 'Test User', uid: '62a10a4954e8230e568a49ab' }
    })
  })
})
