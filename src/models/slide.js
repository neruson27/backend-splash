import mongoose from 'mongoose'
import moment from 'moment'
import { mongoError } from '../utils/handle-errors'

const SlideSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  url: {
    type: String
  }
}, {_id: true})

SlideSchema.pre('save', function (next) {
  this.createdAt = moment()
  next()
})

const Slide = mongoose.model('slide', SlideSchema)

export { Slide }