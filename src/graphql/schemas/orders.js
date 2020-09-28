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
    checkout: UserDataInput
    price: Float
  }

  input UserDataInput {
    name: String
    dni: String
    total: String
    concept: String
    tlf: String
    dir: String
    email: String
  }

  input ProductsInput {
    name: String
    description: String
    price: String
    highlight: String
    image: [String]
    branch: BranchInput
    model: String
    category: CategoriesInput
    subcategory: SubCategoryInput
    tags: [TagsInput]
    ref: String
    createdAt: Date
    quantity: Int
  }

`

const queries = `
  AllOrders: [Orders]
  NumOrders: Int
  OneOrder(id: ID): Orders
`

const mutations = `
  CreateOrder(data: OrdersInput): Orders
  UpdateOrdersStatus(id: ID!, status: String): Orders
  DeleteOrder(id: ID!): Response
`


export { types, queries, mutations }
