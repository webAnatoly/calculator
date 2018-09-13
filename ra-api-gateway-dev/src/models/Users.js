import mongoose from 'mongoose'
const Schema = mongoose.Schema

const schema = new Schema({
  created: { type: Date, required: true, default: Date.now() },
  email: { type: String, required: true },
  password: { type: String, required: true }
})

const model = mongoose.model('Users', schema)

export default model
