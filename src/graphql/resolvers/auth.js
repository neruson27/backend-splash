import { createToken } from "../../utils/token-generator";
import { authorize } from "../../utils/authorize-resolvers";
import Admin from "../../models/admin";
import moment from "moment";
import { UserInputError } from "apollo-server-express";

export const Query = {
  Login: authorize([], (obj, { data }, context) => {
    console.log(data)
    return Admin.validatePassword(data.email, data.password)
      .then(res => {
        console.log(res)
        if (res === "user-dont-find")
          return new UserInputError("Usuario no encontrado");
        if (res === "password-incorrecto")
          return new UserInputError("Contraseña incorrecta");

        const token = createToken({
          id: res._id,
          username: res.email,
        });
        return {
          token: {
            code: token.code,
            expire: token.payload.exp
          },
          admin: res
        };
      })
      .catch(e => {
        console.error(e);
        return new UserInputError(e);
      });
  }),
  AdminExist: authorize([], (obj, _, context) => {
    return Admin.find({})
    .then(res => {
      if(res && res.length > 0) {
        return true
      } else {
        return false
      }
    }).catch(err => false)
  }),
};

export const Mutation = {
  SignUp: authorize([], async (obj, { data }, context) => {
    try {
      console.log(data)
      let exist = await Admin.find({})
      if (exist.length > 0) throw 'admin-exist'
      return Admin.create(data)
        .then(async admin => {
          return {
            admin: admin
          };
        })
        .catch(err => {
          console.error(err);
          throw err;
        });
    } catch (error) {
      console.error(error)
      return new UserInputError(error)
    }
  })
};
