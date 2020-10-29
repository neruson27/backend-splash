const types = `

type City {
  _id: ID
  name: String
  departamento: String
}

type Tax {
  _id: ID
  defaultTax: Boolean
  tax: Float
  cities: [City]
}

input CityInput {
  name: String
  departamento: String
}

input TaxInput {
  tax: Float
  defaultTax: Boolean
  cities: [CityInput]
}
`

const queries = `
AllTax: [Tax]
OneTax(citiesName: CityInput): Float
`

const mutations = `
NewTax(data: TaxInput): Tax
UpdTax(id: ID,data: TaxInput): Tax
DelCitiesTax(id: ID,idCities: ID): Tax
DelTax(id: ID): String
`

export {types, queries, mutations}