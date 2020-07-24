
// schema
const types = `
  type Admin {
    id: ID
    fullName: String
    email: String
    lastConection: Date
  }

  input AdminInput {
    fullName: String
    email: String
    pass: String
  }
`

const queries = `
adminInfo(id: ID): Admin
`

const mutations = `
`

export { types, queries, mutations }