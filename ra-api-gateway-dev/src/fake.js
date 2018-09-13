import mongoose from 'mongoose'
import './models/Buyers'
import dummy from 'mongoose-dummy'
import faker from 'faker'
import { generatePass } from './utils/generateDefaultPass'

/* dummy offten generates nonsense data, and if you want data to be more accurate - use faker */

export const insertBuyer = () => {
  const buyerModel = mongoose.model('Buyers')
  let buyers = generateRandomData({ model: buyerModel, iterationNumber: 100 })
  return mongoose.model('Buyers').insertMany(buyers)
}

export const insertUser = () => {
  const userModel = mongoose.model('Users')
  let users = generateRandomData({ model: userModel, iterationNumber: 100 })
  return mongoose.model('Users').insertMany(users)
}

const generateRandomData = ({ model, iterationNumber = 10 }) => {
  let itemsArray = []
  for (let i = 0; i < iterationNumber; i++) {
    let item = dummy(model, {
      ignore: ['name']
    })
    item.name = faker.name.findName()
    item.password = generatePass()
    itemsArray.push(item)
  }
  return itemsArray
}
