import mongoose from 'mongoose'
import './models/Users'
import bcrypt from 'bcrypt'
import { insertBuyer, insertUser } from './fake'
import log from './utils/log'

export default callback => {
  const mongoAddress = 'mongodb://db:27017/db'
  mongoose.connect(mongoAddress, { useMongoClient: true })
  mongoose.Promise = global.Promise

  mongoose.connection.on('open', async () => {
    console.log('Connected to mongo server.')
    mongoose
      .model('Users')
      .findOne({})
      .then(res => {
        if (!res) {
          const defaultCreds = {
            email: 'test@test.com',
            password: 'password'
          }
          const salt = bcrypt.genSaltSync(10)
          const hash = bcrypt.hashSync(defaultCreds.password, salt)
          mongoose.model('Users').create({
            email: defaultCreds.email,
            password: hash
          })
        }
      })
      .catch(err => console.error(err))

    let [buyers, users] = await Promise.all([
      mongoose.model('Buyers').findOne({}),
      mongoose.model('Users').findOne({})
    ])

    if (__DEV__) {
      try {
        if (!buyers) {
          await insertBuyer()
        }
        if (!users) {
          await insertUser()
        }
      } catch (err) {
        console.error(err)
        log.err(err)
      }
    }
  })

  mongoose.connection.on('error', err => {
    console.log('Could not connect to mongo server!', err)
  })

  callback(mongoose)
}
