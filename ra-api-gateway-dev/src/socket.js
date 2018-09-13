import socketIo from 'socket.io'
import api from './api'
import log from './utils/log'
import EventEmitter from './EventEmitter'
import tokenizer, { jwtMiddlware } from './utils/tokenizer'

export default (server, port, hostname, db) => {
  const io = socketIo(server)
  const connectedUsers = new Map()
  io.use(jwtMiddlware())
  io.on('connection', async socket => {
    try {
      const eventEmitter = new EventEmitter({ socket })
      log.debug('new connection')
      const sessionData = new Map()
      socket.emit('connected')
      const emitAction = (...args) => eventEmitter.emit(...args)
      if (socket.authorizationData.clientType === 'mobile') {
        socket.on('token', async token => {
          let res = await tokenizer.verify(token)
          console.log('token: ', token)
          if (res.success) {
            if (res.newToken !== token) {
              socket.emit('token', res.newToken)
            }
            try {
              let user = await db.model('Users').findById(res._id)
              if (!user) {
                emitAction('SESSION_STATE', { isLoggedIn: false })
                return
              }
              const { _id, email, name, updatedAt } = user
              sessionData.set('_id', _id.toString())

              connectedUsers.set(socket.id, sessionData.get('_id'))
              emitAction('SESSION_STATE', {
                isLoggedIn: true,
                updatedAt,
                email,
                name
              })
            } catch (error) {
              log.err(error)
              emitAction('SNACK', { message: `${error}` })
            }
          } else {
            emitAction('SESSION_STATE', { isLoggedIn: false })
          }
        })
      } else if (socket.authorizationData.isLoggedIn) {
        const user = await db
          .model('Users')
          .findById(socket.authorizationData._id)

        if (!user) {
          emitAction('SESSION_STATE', { isLoggedIn: false })
          emitAction('SNACK')
          return
        }

        const { _id, email, name } = user
        sessionData.set('_id', _id.toString())
        connectedUsers.set(socket.id, sessionData.get('_id'))
        emitAction('SESSION_STATE', {
          isLoggedIn: true,
          role: 'admin',
          email,
          name
        })
      }

      socket.on('action', (action = {}) => {
        const { type, payload } = action
        if (!type) {
          return socket.emit('err', { code: 1 })
        }
        const actionType = type.substr(7, type.length)
        log.debug(
          `${sessionData.get(
            '_id'
          )} | Action: ${actionType}. Payload: ${JSON.stringify(payload)}`
        )
        if (!sessionData.get('_id')) {
          if (
            ['SIGN_IN', 'SIGN_UP', 'FORGOT_PASSWORD'].indexOf(actionType) === -1
          ) {
            console.log(`Not authorized, abort action: ${actionType}`)
            return
          }
        }
        if (api[actionType]) {
          api[actionType]({
            payload,
            socket,
            emitAction,
            db,
            sessionData,
            connectedUsers
          })
        } else {
          return socket.emit('err', { code: 1 })
        }
      })
      socket.on('disconnect', () => {
        connectedUsers.delete(socket.id)
      })
    } catch (error) {
      log.err(error)
    }
  })
}
