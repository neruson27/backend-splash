const types = `
  type Orders {
    _id: ID
    ref_payco: String
    orderNumber: Int
    products: [Product]
    price: Float
    status: String
    createdAt: Date
  }

  input OrdersInput {
    ref_payco: String
    products: [ProductsInput]
    price: Float
  }

  input ProductsInput {
    name: String
    description: String
    price: String
    highlight: String
    image: [String]
    audio: String
    branch: BranchInput
    model: String
    category: CategoriesInput
    subcategory: SubCategoryInput
    tags: [TagsInput]
    ref: String
    ctd: Int
    important: Boolean
    createdAt: Date
    quantity: Int
  }

`

const queries = `
  AllOrders: [Orders]
  OneOrder(id: ID): Orders
`

const mutations = `
  CreateOrder(data: OrdersInput): Orders
  UpdateOrdersStatus(id: ID!, status: String): Orders
  DeleteOrder(id: ID!): Response
`


export { types, queries, mutations }
