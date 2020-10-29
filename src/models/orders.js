import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import moment from 'moment'
import { mongoError } from '../utils/handle-errors'

const StatusEnum = ['Despachado', 'Por Despachar', 'Creada', 'Orden Invalida']

const OrderSchema = new mongoose.Schema({
  id_buyer: {
    type: String
  },
  ref_payco: {
    type: String,
    unique: true
  },
  orderNumber: {
    type: Number,
  },
  products: {
    type: [mongoose.Schema.Types.Mixed]
  },
  checkout: {
    type: mongoose.Schema.Types.Mixed
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: StatusEnum,
    required: true,
    default: 'Creada'
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
}, { _id: true })

OrderSchema.plugin(mongoosePaginate);

const Orders = mongoose.model('orders', OrderSchema)

export default Orders 