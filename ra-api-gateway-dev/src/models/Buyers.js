import mongoose from 'mongoose'

const Schema = mongoose.Schema

const schema = new Schema({
  name: String,
  route: String,
  volume: {
    thisYear: Number,
    lastYear: Number,
    diff: Number
  },
  customId: { type: String, required: true }
})

const model = mongoose.model('Buyers', schema)

export default model
