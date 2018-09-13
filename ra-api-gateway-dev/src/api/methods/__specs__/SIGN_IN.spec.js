import { findUser, compareUser, emitToken, catchError } from '../SIGN_IN'
import bcrypt from 'bcrypt'
import config from '../../../config'

describe('SIGN_IN api method', () => {
  let socket, emitAction, db, payload, sessionData, connectedUsers
  beforeEach(() => {
    // create variables for all tests
    socket = {
      id: 123,
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
    connectedUsers = new Map()
  })

  it('find user with given email in mongodb findUser()', () => {
    const resolve = jest.fn()
    const reject = jest.fn()
    findUser(payload, db)(resolve, reject)
    expect(resolve).toHaveBeenCalledWith(db.model().findOne())
    findUser({ email: '' }, db)(resolve, reject)
    expect(reject).toHaveBeenCalledWith({
      snack: 'Email or password is invalid'
    })
  })

  it('should reject if email was incorrect compareUser()', done => {
    compareUser({})().catch(err => {
      expect(err).toEqual({ snack: 'Email is not recognized' })
      done()
    })
  })

  it('should reject if password was incorrect compareUser()', done => {
    compareUser(payload)(payload).catch(err => {
      expect(err).toEqual({ snack: 'Incorrect password' })
      done()
    })
  })

  it('when everything goes right compareUser()', done => {
    // get hash for passing isPasswordMatch rule
    let hash = bcrypt.hashSync(payload.password, config.bcryptSaltRounds)
    compareUser(payload)({ password: hash }).then(arr => {
      expect(arr).toBeInstanceOf(Array)
      done()
    })
  })

  it('should emit user token emitToken()', () => {
    let user = db.model().create(payload)
    const expected = ['', user]
    emitToken(socket, sessionData, connectedUsers, emitAction)(expected)
    expect(sessionData.get('_id')).toEqual('123')
    expect(connectedUsers.get(socket.id)).toEqual('123')
    expect(socket.emit.mock.calls.length).toEqual(1)
    expect(emitAction).toHaveBeenCalledWith('SESSION_STATE', {
      isLoggedIn: true
    })
    expect(emitAction).toHaveBeenCalledWith('SPINNER', { SignIn: false })
  })

  it('should catch sign in error catchError()', done => {
    let err = {
      code: 'auth/wrong-password'
    }
    catchError(emitAction)(err)
    expect(emitAction).toHaveBeenCalledWith('SNACK', {
      message: 'Wrong password'
    })
    err = {
      snack: true
    }
    catchError(emitAction)(err)
    expect(emitAction).toHaveBeenCalledWith('SNACK', { message: err.snack })
    err = {
      otherErr: true
    }
    expect(emitAction).toHaveBeenCalledWith('SPINNER', { SignIn: false })
    done()
  })
})
