import mongoose from 'mongoose'
import moment from 'moment'
import { passwordMatch, createPassword } from '../utils/password';
import { mongoError } from '../utils/handle-errors'

const matchEmail = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'invalid-email-format']

const AccessTokenSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  expire: {
    type: Number,
    required: true
  },
}, { _id: false })

const AdminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: 'Admin Admin',
    // required: true
  },
  email: {
    type: String,
    match: matchEmail,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String, // pendiente definir un patron para la constraseña segura
    required: true
  },
  accessToken: AccessTokenSchema,
  lastConection: {
    type: Date
  },
}, { timestamps: true })

AdminSchema.statics.validatePassword = function (email, password) { // statics y methods no soportan arrow functions
  return this.model('admin').findOne({ email: email.toLowerCase() })
  .then(admin => {
    // si el admin no existe
    if (!admin) return 'user-dont-find'

    // si el password es distinto
    // if (!bcrypt.compare(password, admin.password)) return null
    if (!passwordMatch(password, admin.password)) return 'password-incorrecto'
    // si pasa la prueba se retorna el admin
    return admin
  })
  .then(response => {
    return response
  })
}

AdminSchema.pre('save', function (next) {
  var user = this
  // user.wasNew = user.isNew
  // user.isAuthenticatedModified = user.isModified('isAuthenticated')

  if (user.isNew || user.isModified('password')) {
    user.password = createPassword(user.password)

    next()
  }
  else {
    next()
  }
})

// UserSchema.post('validate',mongoError)
// UserSchema.post('save',mongoError)
// UserSchema.post('update',mongoError)
// UserSchema.post('findOneAndUpdate',mongoError)

const Admin = mongoose.model('admin', AdminSchema)

export default Admin