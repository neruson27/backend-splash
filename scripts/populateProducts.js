import initMongo from '../src/utils/mongodb'
import {
  Categories,
  Branch,
  Tags,
  Subcategories,
  Tagsgroup,
  Products
} from '../src/models/products'
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-male-sprites';
 
let options = {};
let avatars = new Avatars(sprites, options);
let svg = avatars.create('custom-seed');

console.log(svg)

async function init() {
  await initMongo()
  let product = {
    name:'Producto',
    description: 'Descripcion',
    description_long: 'Descripcion mas larga',
    price: '200',
    highlight: 'https://avatars.dicebear.com/api/male/'+Math.ceil(Math.random()*10000)+'.svg',
    category: await Categories.findOne({}).lean(),
    subcategory: await Subcategories.findOne({}).lean(),
    tags: await Tags.findOne({}).lean(),
    ref: Date.now(),
  }

  return Products.create(product)
}

async function naada() {
  for (let index = 0; index < 40; index++) {
    await init()
  }
}

naada()