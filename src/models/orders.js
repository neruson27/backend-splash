import mongoose from 'mongoose'
import moment from 'moment'
import { mongoError } from '../utils/handle-errors'

const StatusEnum = ['Despachado', 'Por Despachar', 'Orden Invalida']

const OrderSchema = new mongoose.Schema({
  ref_payco: {
    type: String,
    required: true,
    unique: true
  },
  orderNumber: {
    type: Number,
    required: true,
    unique: true
  },
  products: {
    type: [mongoose.Schema.Types.Mixed]
  },
  checkout: {
    type: [mongoose.Schema.Types.Mixed]
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: StatusEnum,
    required: true,
    default: 'Por Despachar'
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
}, { _id: true })

const Orders = mongoose.model('orders', OrderSchema)

export default Orders 