import mongoose from 'mongoose'
import moment from 'moment'
import { mongoError } from '../utils/handle-errors'

const TaxSchemas = new mongoose.Schema({
  tax: {
    type: Number,
    unique: true
  },
  defaultTax: {
    type: Boolean,
    default: false
  },
  cities: {
    type: [mongoose.Schema.Types.Mixed]
  },
}, {_id: true})

const CitiesSchemas = new mongoose.Schema({
  name: {
    type: String
  },
  departamento: {
    type: String
  }
}, {_id: true})

TaxSchemas.pre('save', function (next) {
  this.createdAt = moment()
  next()
})

const City = mongoose.model('city', TaxSchemas)
const Cities = mongoose.model('cities', CitiesSchemas)

export { City,Cities }