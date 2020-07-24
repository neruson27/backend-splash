const nameid = `
  id: ID
  name: String
`
const types = `

  type Categories {
    _id: ID
    name: String
    subcategory: [Subcategories]
    tagsgroup: [Tagsgroup]
  }

  type Subcategories {
    _id: ID
    name: String
  }

  type Branch {
    _id: ID
    name: String
    image: String
  }

  type Tag {
    _id: ID
    name: String
  }

  type Tagsgroup {
    _id: ID
    name: String
    tags: [Tag]
  }

  type Product {
    _id: ID
    name: String
    description: String
    description_long: String
    price: String
    highlight: String
    image: [String]
    audio: String
    branch: Branch
    model: String
    category: Categories
    subcategory: Subcategories
    tags: [Tag]
    ref: String
    ctd: Int
    quantity: Int
    important: Boolean
    createdAt: Date
  }

  input CategoriesInput {
    _id: ID
    name: String
    subcategory: [SubCategoryInput]
    tagsgroup: [TagsgroupInput]
  }

  input OneThingInput {
    name: String
  }

  input BranchInput {
    _id: ID
    name: String
    image: Upload
  }

  input SubCategoryInput {
    _id: ID
    name: String
  }

  input TagsInput {
    _id: ID
    name: String
  }

  input TagsgroupInput {
    _id: ID
    name: String
    tags: [TagsInput]
  }

  input ProductInput {
    name: String!
    description: String!
    description_long: String
    price: String!
    highlight: Upload
    image: [Upload]
    audio: Upload
    branch: BranchInput
    model: String
    category: CategoriesInput
    subcategory: SubCategoryInput
    tags: [TagsInput]
    ref: String!
    ctd: Int!
    important: Boolean
  }
`
const queries = `
  AllCategories: [Categories]
  AllSubcategories: [Subcategories]
  AllBranchs: [Branch]
  AllTags: [Tag]
  AllTagsgroup: [Tagsgroup]
  AllProducts: [Product]
  OneProduct(id: ID): Product
`
const mutations = `
  AddCategories(data: CategoriesInput): Categories
  DelCategories(id: ID): Response
  UpdateCategories(id: ID, data: CategoriesInput): Categories
  AddSubcategories(data: OneThingInput): Subcategories
  DelSubcategories(id: ID): Response
  UpdateSubcategories(id: ID, data: OneThingInput): Subcategories
  AddBranch(data: BranchInput): Branch
  DelBranch(id: ID): Response
  UpdateBranch(id: ID, data: BranchInput): Branch
  AddTag(data: OneThingInput): Tag
  DelTag(id: ID): Response
  UpdateTag(id: ID, data: OneThingInput): Tag
  AddTagsgroup(data: TagsgroupInput): Tagsgroup
  DelTagsgroup(id: ID): Response
  UpdateTagsgroup(id: ID, data: TagsgroupInput): Tagsgroup
  AddProduct(data: ProductInput): Product
  DelProduct(id: ID): Response
  UpdateProduct(id: ID, data: ProductInput): Product
`

export {types, queries, mutations}