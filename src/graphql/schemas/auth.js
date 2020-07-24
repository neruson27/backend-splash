// schema
const types = `

  type Token {
    code: String
    expire: Int
  }

  type Response {
    code: Int
    status: String
    message: String
    token: Token
    admin: Admin
  }

  type Account {
    id: ID!
    email: String
    fullName: String
    lastConection: Date
  }

  input Auth {
    email: String
    password: String
  }

  input SignUpAdmin {
    email: String
    password: String
  }

`;
const queries = `
  Login(data: Auth): Response
  AdminExist: Boolean
`;

const mutations = `
  SignUp(data: SignUpAdmin): Response
`;

export { types, queries, mutations };
