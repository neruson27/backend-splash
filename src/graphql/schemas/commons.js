const types = `
  scalar Date
  scalar Object
  
  enum Order {
    asc
    desc
  }

  type Pagination {
    total: Int
    page: Int
    pages: Int
    limit: Int
    sort: Object
  } 

  type Social {
    facebook: String
    instagram: String
    web: String
  }

  type Image {
    name: String
    image: String
  }

  type File {
    filename: String
    mimetype: String
    encoding: String
    relativePath: String
  }

`

const queries = `

`

const mutations = `
  singleUpload(file: Upload!): File
`


export { types, queries, mutations }
