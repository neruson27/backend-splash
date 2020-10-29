import { authorize } from '../../utils/authorize-resolvers';
import { UserInputError, withFilter } from 'apollo-server-express';
import { processUpload } from './commons'
import { City } from '../../models/cities'
import mongoose from 'mongoose'

export const Query = {
  AllTax: authorize([], async (_, __, { credentials: { user }, dirBase }) => {
    try {
      return City.find({}).then((response) => {
        if (!response) throw 'not-city-for-show'
        return response
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  OneTax: authorize([], async (_, { citiesName }, { credentials: { user }, dirBase }) => {
    try {
      return City.findOne({'cities.name':citiesName.name,'cities.departamento':citiesName.departamento}).then((response) => {
        if (!response) {
          return City.findOne({'defaultTax':true})
          .then((res) => {
            if(!res) throw 'no-default-value'
            return res.tax
          })
          .catch((err) => {
            throw err
          })
        }
        return response.tax
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
}

export const Mutation = {
  NewTax: authorize([], async (_, { data }, { credentials: { user }, dirBase }) => {
    try {
      if(data.defaultTax){
        let respuesta = await City.find({defaultTax: true})
          if(respuesta.length > 0){
            respuesta[0].defaultTax = false
            respuesta[0].save()
          }
      }
      return City.create(data).then((response) => {
        return response
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  UpdTax: authorize([], async (_, { id,data }, { credentials: { user }, dirBase }) => {
    try {
      return City.findById(id).then(async (response) => {
        if(!data) throw 'data-is-undefined'
        if(data.cities && data.cities.length > 0) {
          let res = await City.findOne({'cities.name':data.cities[0].name,'cities.departamento':data.cities[0].departamento})
            console.log(res)
            if(!res){
              data.cities.forEach(arr => {
                arr._id = mongoose.Types.ObjectId() //Agregar id directamente
                response.cities.push(arr)
              })
            } else {
              return new UserInputError('No se puede registrar esta ciudad en otro precio de envio')
            }
        }
        if(data.tax){
          response.tax = data.tax
        }
        response.save()
        return response
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  DelCitiesTax: authorize([], async (_, { id,idCities }, { credentials: { user }, dirBase }) => {
    try {
      return City.findById(id).then((response) => {
        if(!idCities) throw 'IdCiudad-is-undefined'
        if(response.cities.length > 0) {
          for (let index = 0; index < response.cities.length; index++) {
            if(String(response.cities[index]._id) === idCities) response.cities.splice(index,1)  
          }
        }
        response.save()
        return response
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  DelTax: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      if(!id) throw 'Id-is-undefined'
      return City.findByIdAndDelete(id).then((response) => {
        return 'Borrado con exito'
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
}