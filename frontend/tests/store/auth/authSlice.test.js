import { authSlice, clearErrorMessage, onLogin, onLogout } from '../../../src/store/auth/authSlice'
import { authenticatedState, initialState } from '../../fixtures/authStates'
import { testUser } from '../../fixtures/testUser'

describe('pruebas en authSlice', () => {
  test('debe de regresar el estado inicial', () => {
    expect(authSlice.getInitialState()).toEqual(initialState)
  })

  test('debe de realizar el login', () => {
    const state = authSlice.reducer(initialState, onLogin(testUser))
    expect(state).toEqual({
      status: 'authenticated',
      user: testUser,
      errorMessage: undefined
    })
  })

  test('debe de realizar el logout', () => {
    const state = authSlice.reducer(authenticatedState, onLogout())
    expect(state).toEqual({
      status: 'not-authenticated',
      user: {},
      errorMessage: undefined
    })
  })

  test('debe de realizar el logout', () => {
    const errorMessage = 'Credenciales no validas'
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage))
    expect(state).toEqual({
      status: 'not-authenticated',
      user: {},
      errorMessage
    })
  })

  test('debe limpiar el mensaje de error', () => {
    const errorMessage = 'Credenciales no validas'
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage))
    const newState = authSlice.reducer(state, clearErrorMessage())

    expect(newState.errorMessage).toBe(undefined)
  })
})
