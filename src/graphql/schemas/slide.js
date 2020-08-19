const types = `

type Slide {
  _id: ID
  image: String
  url: String
}

input SlideInput {
  _id: ID
  image: Upload
  url: String
}

`

const queries = `
AllSlide: [Slide]
`

const mutations = `
AddSlide(data: SlideInput): Slide
DelSlide(id: ID): Response
`

export {types, queries, mutations}