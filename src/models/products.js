import mongoose from 'mongoose'
import moment from 'moment'
import { mongoError } from '../utils/handle-errors'

const CategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  subcategory: {
    type: [mongoose.Schema.Types.Mixed]
  },
  tagsgroup: {
    type: [mongoose.Schema.Types.Mixed]
  }
}, { _id: true })

const SubcategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, { _id: true })

const BranchSchema = new mongoose.Schema({
  image: {
    type: String
  },
  name: {
    type: String,
    required: true,
    unique: true
  }
}, {_id: true})

const TagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, { _id: true })

const TagsgroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tags: {
    type: [mongoose.Schema.Types.Mixed]
  }
}, { _id: true })

const ProductSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  description_long: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  highlight: {
    type: String
  },
  image:{
    type: [String]
  },
  audio: {
    type: String
  },
  branch: {
    type: {BranchSchema},
    required: true
  },
  model: {
    type: String,
    required: true
  },
  category: {
    type: {CategoriesSchema}
  },
  subcategory: {
    type: {SubcategoriesSchema}
  },
  tags: {
    type: [mongoose.Schema.Types.Mixed]
  },
  ref: {
    type: String,
    unique: true
  },
  ctd: {
    type: Number
  },
  important: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    index: true
  }
}, {
  timestamps: true
})

ProductSchema.virtual('id').set(function(){
  return this._id;
})

ProductSchema.pre('save', function (next) {
  this.createdAt = moment()
  next()
})

CategoriesSchema.pre('save', function(next) {
  next()
})

const Categories = mongoose.model('categories', CategoriesSchema)

const Branch = mongoose.model('branch', BranchSchema)

const Tags = mongoose.model('tags', TagsSchema)

const Subcategories = mongoose.model('subcategories', SubcategoriesSchema)

const Tagsgroup = mongoose.model('tagsgroup', TagsgroupSchema)

const Products = mongoose.model('products', ProductSchema)


export {
  Categories,
  Branch,
  Tags,
  Subcategories,
  Tagsgroup,
  Products
}