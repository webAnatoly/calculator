import tokenizer from '../../utils/tokenizer'
import log from '../../utils/log'
import bcrypt from 'bcrypt'
import inspector from 'schema-inspector'

const payloadValidationSchema = {
  type: 'object',
  strict: true,
  properties: {
    email: { type: 'string', pattern: 'email' },
    password: { type: 'string', minLength: 6, maxLength: 16 }
  }
}

export default async ({
  payload,
  socket,
  emitAction,
  db,
  sessionData,
  connectedUsers
}) => {
  let user = null
  let { email } = payload

  try {
    const result = inspector.validate(payloadValidationSchema, payload)
    if (!result.valid) {
      log.info(`Failed attempt to log in: ${result.format()}`)
      const message = 'Email or password is invalid'
      emitAction('SNACK', { message })
      log.err(`SIGN_IN, ${message}`)
      emitAction('SPINNER', { SignIn: false })
      return false
    }

    user = await db.model('Users').findOne({ email: email.toLowerCase() })
    if (!user) {
      // if user not found, then notify client about wrong email
      const message = 'Email is not recognized'
      emitAction('SNACK', { message })
      log.err(`SIGN_IN, ${message}`)
      emitAction('SPINNER', { SignIn: false })
      return false
    }

    // compare passwords
    const { password } = payload
    log.info(user)

    const isPasswordMatch = bcrypt.compareSync(password, user.password)

    log.info(isPasswordMatch)

    if (!isPasswordMatch) {
      const message = 'Incorrect password'
      emitAction('SNACK', { message })
      log.err(`SIGN_IN, ${message}`)
      emitAction('SPINNER', { SignIn: false })
      return false
    }

    let [token, { name, _id }] = await Promise.all([
      tokenizer.new(user._id),
      Promise.resolve(user)
    ])
    sessionData.set('_id', _id.toString())

    connectedUsers.set(socket.id, sessionData.get('_id'))

    socket.emit('token', token)
    emitAction('SESSION_STATE', {
      isLoggedIn: true,
      email,
      name
    })

    emitAction('SPINNER', { SignIn: false })
  } catch (err) {
    emitAction('SNACK', { message: err })
    log.err(`SIGN_IN, ${err}`)
    emitAction('SPINNER', { SignIn: false })
  }
}
