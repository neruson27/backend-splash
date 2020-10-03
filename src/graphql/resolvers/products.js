import { authorize } from '../../utils/authorize-resolvers';
import { UserInputError, withFilter } from 'apollo-server-express';
import {
  Categories,
  Branch,
  Tags,
  Subcategories,
  Tagsgroup,
  Products
} from '../../models/products'
import { processUpload } from './commons'
import pubsub from '../pubsub'
import config from '../../config'

export const Query = {
  /* 
    AllCategories: [Categories]
    AllSubcategories: [Subcategories]
    AllBranchs: [Branch]
    AllTags: [Tag]
    AllTagsgroup: [Tagsgroup]
    AllProducts: [Product]
    OneProduct(id: ID): Product
  */
  AllCategories: authorize([], async (_, __, { credentials: { user }, dirBase }) => {
    try {
      return Categories.find({}).then((categories) => {
        if (!categories) throw 'not-categories-for-show'
        return categories
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AllSubcategories: authorize([], async (_, __, { credentials: { user }, dirBase }) => {
    try {
      return Subcategories.find({}).then((subcategories) => {
        if (!subcategories) throw 'not-subcategories-for-show'
        return subcategories
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AllBranchs: authorize([], async (_, __, { credentials: { user }, dirBase }) => {
    try {
      return Branch.find({}).then((branch) => {
        if (!branch) throw 'not-branch-for-show'
        return branch
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AllTags: authorize([], async (_, __, { credentials: { user }, dirBase }) => {
    try {
      return Tags.find({}).then((tags) => {
        if (!tags) throw 'not-tags-for-show'
        return tags
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AllTagsgroup: authorize([], async (_, __, { credentials: { user }, dirBase }) => {
    try {
      return Tagsgroup.find({}).then((tagsgroup) => {
        if (!tagsgroup) throw 'not-tagsgroup-for-show'
        return tagsgroup
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AllProducts: authorize([], async (_, __, { credentials: { user }, dirBase }) => {
    try {
      return Products.find({}).then((products) => {
        if (!products) throw 'not-products-for-show'
        return products
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  OneProduct: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      return Products.findOne({ _id: id }).then((product) => {
        if (!product) throw 'invalid-id'
        return product
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  })
}

export const Mutation = {
  /* 
    AddCategories(data: CategoriesInput): Categories
    AddSubcategories(data: OneThingInput): Subcategories
    AddBranch(data: OneThingInput): Branch
    AddTag(data: OneThingInput): Tag
    AddTagsgroup(data: TagsgroupInput): Tagsgroup
    AddProduct(data: ProductInput): Product

    DelCategories(id: ID): Response
    DelSubcategories(id: ID): Response
    DelBranch(id: ID): Response
    DelTag(id: ID): Response
    DelTagsgroup(id: ID): Response
    DelProduct(id: ID): Response

    UpdateCategories(id: ID, data: CategoriesInput): Categories
    UpdateTagsgroup(id: ID, data: TagsgroupInput): Tagsgroup
    UpdateProduct(id: ID, data: ProductInput): Product
  */

  // ADD
  AddCategories: authorize([], async (_, { data }, { credentials: { user }, dirBase }) => {
    try {
      console.log(data)
      if(!data) throw 'data-is-undefined'
      if(data.tagsgroup && data.tagsgroup.length > 0) {
        let tagsgroup = []
        for (let tag of data.tagsgroup) {
          let t = await Tagsgroup.findOne({name: tag.name})
          tagsgroup.push(t)
        }
        data.tagsgroup = tagsgroup
        console.log(data.tagsgroup)
      }
      if(data.subcategory && data.subcategory.length > 0) {
        let subcategories = []
        for (let subcategory of data.subcategory) {
          let t = await Subcategories.findOne({name: subcategory.name})
          subcategories.push(t)
        }
        data.subcategory = subcategories
      }
      return Categories.create(data)
      .then((categories) => {
        return categories
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AddSubcategories: authorize([], async (_, { data }, { credentials: { user }, dirBase }) => {
    try {
      return Subcategories.create(data).then((categories) => {
        return categories
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AddBranch: authorize([], async (_, { data }, { credentials: { user }, dirBase }) => {
    try {
      if(data.image) {
        let tempImageDir = await processUpload(data.image, dirBase)
        console.log('Imagen destacada guardada en: ', tempImageDir)
        data.image = tempImageDir.relativePath
      }
      return Branch.create(data).then((categories) => {
        return categories
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AddTag: authorize([], async (_, { data }, { credentials: { user }, dirBase }) => {
    try {
      return Tags.create(data).then((categories) => {
        return categories
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AddTagsgroup: authorize([], async (_, { data }, { credentials: { user }, dirBase }) => {
    try {
      console.log(data)
      if(!data) throw 'data-is-undefined'
      if(data.tags && data.tags.length > 0) {
        let tags = []
        for (let tag of data.tags) {
          let t = await Tags.findOne({name: tag.name})
          t = {
            _id: t._id,
            name: t.name
          }
          tags.push(t)
        }
        data.tags = tags
      }
      return Tagsgroup.create(data).then((categories) => {
        return categories
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  AddProduct: authorize([], async (_, { data }, { credentials: { user }, dirBase }) => {
    try {
      if(!data) throw 'data-is-undefined'
      if(data.highlight && typeof data.highlight === 'object') {
        let tempImageDir = await processUpload(data.highlight, dirBase)
        console.log('Imagen destacada guardada en: ', tempImageDir)
        data.highlight = tempImageDir.relativePath
      }
      if(data.image && data.image.length > 0) {
        console.log('----: cantidad de imagenes: ', data.image.length)
        let imageDir = []
        for (let image of data.image) {
          let tempImageDir = await processUpload(image, dirBase)
          imageDir.push(tempImageDir.relativePath)
        }
        data.image = imageDir
      }
      if(data.tags && data.tags.length > 0) {
        let tags = []
        for (let tag of data.tags) {
          let t = await Tags.findOne({name: tag.name})
          t = {
            _id: t._id,
            name: t.name
          }
          tags.push(t)
        }
        data.tags = tags
      }
      return Products.create(data).then((categories) => {
        return categories
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),

  //Del
  DelCategories: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      let producto = await Products.find({"category._id":id})
      if(producto.length > 0) throw 'Hay Productos asociados con esa categoria'      
      return Categories.findByIdAndDelete(id)
      .then((res) => {
        console.log(res)
          return {
            status: 'Ok',
            message: 'Categoria Borrada!'
          }
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  DelSubcategories: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      let categoria = await Categories.find({"subcategory._id":id})
      if(categoria.length > 0) throw 'Hay Categorias asociados con esta subcategoria'
      return Subcategories.findByIdAndDelete(id).then((res) => {
        console.log(res)
        return {
          status: 'Ok',
          message: 'Subcategoria Borrada!'
        }
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  DelBranch: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      let producto = await Products.find({"branch._id":id})
      if(producto.length > 0) throw 'Hay Productos asociados con esta marca'
      return Branch.findByIdAndDelete(id).then((res) => {
        console.log(res)
        return {
          status: 'Ok',
          message: 'Marca Borrada!'
        }
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  DelTag: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      let categoria = await Tagsgroup.find({"tags._id":id})
      if(categoria.length > 0) throw 'Hay Categorias asociados con esta etiqueta'
      let producto = await Products.find({"tags._id":id})
      if(producto.length > 0) throw 'Hay Productos asociados con esta etiqueta'
      return Tags.findByIdAndDelete(id).then((res) => {
        console.log(res)
        return {
          status: 'Ok',
          message: 'Etiqueta Borrada!'
        }
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  DelTagsgroup: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      let categoria = await Categories.find({"tagsgroup._id":id})
      if(categoria.length > 0) throw 'Hay Categorias asociados con este grupo de etiquetas'
      return Tagsgroup.findByIdAndDelete(id).then((res) => {
        console.log(res)
        return {
          status: 'Ok',
          message: 'Grupo de etiquetas Borrado!'
        }
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  DelProduct: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      return Products.findByIdAndDelete(id).then((res) => {
        console.log(res)
        return {
          status: 'Ok',
          message: 'Producto Borrado!'
        }
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),

  //Update
  UpdateCategories: authorize([], async (_, { id, data }, { credentials: { user }, dirBase }) => {
    try {
      console.log(data)
      return Categories.findById(id)
      .then((res) => {
        if(!data) throw 'data-is-undefined'
        if(data.name) res.name = data.name
        if(data.subcategory) res.subcategory = data.subcategory
        if(data.tagsgroup) res.tagsgroup = data.tagsgroup
        res.save()
        return res
      }).then(res => {
        return Products.find({"category._id": res.id})
        .then(product => {
          if(product.length > 0) {
            for(let productos of product) {
              productos.category = res
              productos.save()
            }
          }
          return res
        })
      })
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  UpdateSubcategories: authorize([], async (_, { id, data }, { credentials: { user }, dirBase }) => {
    try {
      return Subcategories.findById(id)
      .then((res) => {
        if(!data) throw 'data-is-undefined'
        if(data.name) res.name = data.name
        res.save()
        return res
      }).then(res => {
        return Categories.find({"subcategory._id":res._id})
        .then(async category => {
          if(category.length > 0) {
            for(let categoria of category) {
              for(let i = 0; i < categoria.subcategory.length; i++) {
                if(res.id == categoria.subcategory[i]._id) {
                  categoria.subcategory[i] = res
                  await Categories.updateOne({"_id":categoria._id}, {$set:{"subcategory": categoria.subcategory}})
                }
              }
            }
          }
          return res
        })
      })
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  UpdateBranch: authorize([], async (_, { id, data }, { credentials: { user }, dirBase }) => {
    try {
      if(data.image) {
        let tempImageDir = await processUpload(data.image, dirBase)
        console.log('Imagen destacada guardada en: ', tempImageDir)
        data.image = tempImageDir.relativePath
      }
      return Branch.findById(id)
      .then((res) => {
        console.log(res)
        if(!data) throw 'data-is-undefined'
        if(data.name) res.name = data.name
        if(data.image) res.image = data.image
        res.save()
        return res
      }).then(res => {
        return Products.find({"branch._id": res.id})
        .then(product => {
          if(product.length > 0) {
            for(let productos of product) {
              productos.branch = res
              productos.save()
            }
          }
          return res
        })
      })
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  UpdateTag: authorize([], async (_, { id, data }, { credentials: { user }, dirBase }) => {
    try {
      return Tags.findById(id)
      .then((res) => {
        console.log(res)
        if(!data) throw 'data-is-undefined'
        if(data.name) res.name = data.name
        res.save()
        return res
      }).then(res => {
        return Tagsgroup.find({"tags._id":res._id})
        .then(async tagsgroup => {
          if(tagsgroup.length > 0) {
            for(let grupo of tagsgroup) {
              for(let i = 0; i < grupo.tags.length; i++) {
                if(res.id == grupo.tags[i]._id) {
                  grupo.tags[i] = res
                  await Tagsgroup.updateOne({"_id":grupo._id}, {$set:{"tags": grupo.tags}})
                }
              }
            }
          }
          return res
        }).then(res => {
          return Products.find({"tags._id":res._id})
          .then(async producto => {
            if(producto.length > 0) {
              for(let producto of producto) {
                for(let i = 0; i < producto.tags.length; i++) {
                  if(res.id == producto.tags[i]._id) {
                    producto.tags[i] = res
                    await Products.updateOne({"_id":producto._id}, {$set:{"tags": producto.tags}})
                  }
                }
              }
            }
            return res
          })
        })
      })
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  UpdateTagsgroup: authorize([], async (_, { id, data }, { credentials: { user }, dirBase }) => {
    try {
      return Tagsgroup.findById(id)
      .then((res) => {
        console.log(res)
        if(!data) throw 'data-is-undefined'
        if(data.name) res.name = data.name
        if(data.tags) res.tags = data.tags
        res.save()
        return res
      }).then(res => {
        return Categories.find({"tagsgroup._id":res._id})
        .then(async category => {
          if(category.length > 0) {
            for(let categoria of category) {
              for(let i = 0; i < categoria.tagsgroup.length; i++) {
                if(res.id == categoria.tagsgroup[i]._id) {
                  categoria.tagsgroup[i] = res
                  await Categories.updateOne({"_id":categoria._id}, {$set:{"tagsgroup": categoria.tagsgroup}})
                }
              }
            }
          }
          return res
        })
      })
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  UpdateProduct: authorize([], async (_, { id, data }, { credentials: { user }, dirBase }) => {
    try {
      console.log(`
      ########################
      typeof highlight ${typeof data.highlight}
      typeof image ${typeof data.image}
      ########################
      `)
      if(data.highlight && typeof data.highlight !== 'string') {
        let tempImageDir = await processUpload(data.highlight, dirBase)
        console.log('Imagen destacada guardada en: ', tempImageDir)
        if(tempImageDir.relativePath) data.highlight = tempImageDir.relativePath
      }
      if(data.image && typeof data.image !== 'string') {
        console.log('----: cantidad de imagenes: ', data.image.length)
        let imageDir = []
        for (let image of data.image) {
          let tempImageDir = await processUpload(image, dirBase)
          if(tempImageDir.relativePath) imageDir.push(tempImageDir.relativePath)
        }
        if(imageDir > 0) data.image = imageDir
      }
      return Products.findById(id)
      .then((res) => {
        console.log(res)
        if(!data) throw 'data-is-undefined'
        if(data.name && res.name !== data.name) res.name = data.name
        if(data.description && res.description !== data.description) res.description = data.description
        if(data.description_long && res.description_long !== data.description_long) res.description_long = data.description_long
        if(data.price && res.price !== data.price) res.price = data.price
        if(data.branch && res.branch !== data.branch) res.branch = data.branch
        if(data.model && res.model !== data.model) res.model = data.model
        if(data.category && res.category !== data.category) res.category = data.category
        if(data.subcategory && res.subcategory !== data.subcategory) res.subcategory = data.subcategory
        if(data.tag && res.tag !== data.tag) res.tag = data.tag
        if(data.ref && res.ref !== data.ref) res.ref = data.ref
        if(data.ctd && res.ctd !== data.ctd) res.ctd = data.ctd
        if(data.important && res.important !== data.important) res.important = data.important
        if(data.highlight && res.highlight !== data.highlight) res.highlight = data.highlight
        if(data.image && res.image !== data.image) res.image = data.image
        res.save()
        return res
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
}