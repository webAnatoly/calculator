import {
  createUser,
  createUserToken,
  emitToken,
  catchError,
  validateUser
} from '../SIGN_UP'

describe('SIGN_UP api method', () => {
  let socket, emitAction, db, payload, sessionData
  beforeEach(() => {
    // create variables for all tests
    socket = {
      emit: jest.fn()
    }
    emitAction = jest.fn()
    db = {
      model: () => ({
        findOne: () => {},
        create: user => Object.assign({}, user, { _id: 123, password: {} })
      })
    }
    payload = { email: 'test@example.com', password: 'test_pass' }
    sessionData = new Map()
  })

  it('should validate user validateUser()', () => {
    const resolve = jest.fn()
    const reject = jest.fn()
    validateUser(payload, db)(resolve, reject)
    expect(resolve).toHaveBeenCalledWith(db.model().findOne())
    validateUser({}, db)(resolve, reject)
    expect(reject).toHaveBeenCalledWith({
      snack: 'Email or password is invalid'
    })
  })

  it('should reject if user is already exists with createUser()', done => {
    expect.assertions(1)
    return createUser(payload, db)('user').catch(err => {
      expect(err).toMatchObject({
        snack: 'User with this email already exists'
      })
      done()
    })
  })

  it('should return user model with createUser()', done => {
    expect.assertions(1)
    expect(createUser(payload, db)(undefined)).toMatchObject(
      db.model().create(payload)
    )
    done()
  })

  it('should return user token createUserToken()', done => {
    const user = db.model().create(payload)
    createUserToken(sessionData)(user).then(arr => {
      expect(arr).toBeInstanceOf(Array)
      done()
    })
    expect(sessionData.get('_id')).toEqual('123')
  })

  it('should emit user token emitToken()', () => {
    const expected = ['', {}]
    emitToken(socket, emitAction)(expected)
    expect(socket.emit.mock.calls.length).toEqual(1)
    expect(emitAction).toHaveBeenCalledWith('SESSION_STATE', {
      isLoggedIn: true
    })
    expect(emitAction).toHaveBeenCalledWith('SPINNER', { SignUp: false })
  })

  it('should catch sign up error catchError()', done => {
    let err = {
      code: 'auth/email-already-in-use'
    }
    catchError(emitAction)(err)
    expect(emitAction).toHaveBeenCalledWith('SNACK', {
      message: 'User with this email already exists'
    })
    err = {
      snack: true
    }
    catchError(emitAction)(err)
    expect(emitAction).toHaveBeenCalledWith('SNACK', { message: err.snack })
    err = {
      otherErr: true
    }
    expect(emitAction).toHaveBeenCalledWith('SPINNER', { SignUp: false })
    done()
  })
})
