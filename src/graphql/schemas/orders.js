const types = `
  type Orders {
    _id: ID
    id_buyer: String
    ref_payco: String
    orderNumber: Int
    products: [Product]
    checkout: UserData
    price: Float
    status: String
    createdAt: Date
  }

  type UserData {
    name: String
    dni: String
    total: String
    concept: String
    tlf: String
    city: String
    dir: String
    email: String
  }

  type OrdenResponse {
    orders: [Orders]
    pagination: Pagination
  }

  input OrdersInput {
    id_buyer: String
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
    city: String
    dirExt: String
    department: String
    dir: String
    email: String
  }

  input ProductsInput {
    _id: ID
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
  AllOrders(pagination: PaginationInput, filter: FilterInput): OrdenResponse
  NumOrders: Int
  OneOrder(id: ID, id_buyer: String): Orders
`

const mutations = `
  CreateOrder(data: OrdersInput): Orders
  UpdateOrdersStatus(id: ID!, status: String, ref: String): Orders
  DeleteOrder(id: ID!): Response
`


export { types, queries, mutations }
