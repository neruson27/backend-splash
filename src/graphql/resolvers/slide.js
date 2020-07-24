import { authorize } from '../../utils/authorize-resolvers';
import { UserInputError, withFilter } from 'apollo-server-express';
import { processUpload } from './commons'
import { Slide } from '../../models/slide'

export const Query = {
  AllSlide: authorize([], async (_, __, { credentials: { user }, dirBase }) => {
    try {
      return Slide.find({}).then((slide) => {
        if (!slide) throw 'not-slide-for-show'
        return slide
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
  AddSlide: authorize([], async (_, { data }, { credentials: { user }, dirBase }) => {
    try {
      if(data.image) {
        let tempImageDir = await processUpload(data.image, dirBase)
        console.log('Imagen destacada guardada en: ', tempImageDir)
        data.image = tempImageDir.relativePath
      } else {
        throw 'image-es-necesaria'
      }
      return Slide.create(data).then((slide) => {
        return slide
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
  DelSlide: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      return Slide.findByIdAndDelete(id).then((res) => {
        console.log(res)
        return {
          status: 'Ok',
          message: 'Slide Borrado!'
        }
      }).catch((err) => {
        throw err
      });
    } catch (err) {
      console.error(err)
      return new UserInputError(err)
    }
  }),
}