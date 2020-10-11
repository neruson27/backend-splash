import { authorize } from '../../utils/authorize-resolvers';
import { UserInputError, withFilter } from 'apollo-server-express';
import Orders from '../../models/orders'
import { Products } from '../../models/products'
import dotenv from 'dotenv'
dotenv.config()
var nodemailer = require('nodemailer');
var swig = require('swig')
var tmpl = swig.compileFile(__dirname + '/../../email/page.html')

var transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

export const Query = {
  /*
  AllOrders: [Orders]
  NumOrders: Int
  OneOrder(id: ID): Orders
  */
  AllOrders: authorize([], async (_, { }, {credentials: { user }, dirBase}) => {
    return Orders.find({}).then((orders) => {
      if (!orders) throw 'not-orders-for-show'
      return orders
    }).catch((err) => {
      return err
    });
  }),
  NumOrders: authorize([], async (_, { }, {credentials: { user }, dirBase}) => {
    return Orders.find({}).then((orders) => {
      if (!orders) throw 'not-orders-for-show'
      return orders.length
    }).catch((err) => {
      return err
    });
  }),
  OneOrder: authorize([], async (_, { id, id_buyer }, {credentials: { user }, dirBase}) => {
    let consulta = id ? { "_id": id } : { "id_buyer": id_buyer }
    return Orders.findOne(consulta).then((order) => {
      if (!order) throw 'not-order-for-show'
      return order
    }).catch((err) => {
      return err
    });
  })
}

export const Mutation = {
  /* 
  CreateOrder(data: OrdersInput): Orders
  UpdateOrdersStatus(id: ID, status: String): Orders
  */
 CreateOrder: authorize([], async(_, { data }, {credentials: { user }, dirBase}) => {
    if(!data) throw 'invalid-data'
    if(!data.products[0]._id) throw 'invalid-product-id'
    let products = data.products
    data.products = []
    data.ref_payco = data.id_buyer
    for (let i = 0; i < products.length; i++) {
      let product = await Products.findOneById({_id: products[i]._id})
      product.quantity = products[i].quantity
      data.products.push(product)
    }
    let numberOfOrders = (await Orders.find({ status: 'Creada' })).length
    if (numberOfOrders === 0 || numberOfOrders === undefined) data.orderNumber = 1
    else data.orderNumber = numberOfOrders + 1
    return Orders.create(data).then(order => {
      return order
    }).catch((err) => {
      throw err
    });
  }),

  UpdateOrdersStatus: authorize([], async (_, { id, status, ref }, {credentials: { user }, dirBase}) => {
    if(!status) throw new UserInputError()
    if(!id) throw new UserInputError()
    return Orders.findOne({"_id": id}).then(async (order) => {
      if (status === 'Por Despachar') {
        /* console.log(data.checkout)
        { name: 'Nelson',
          dni: '23224123',
          total: '33.624',
          concept: 'Esto',
          tlf: '0414741768',
          dir: 'asdasdasd',
          email: 'kaironelson@gmial.com' } */
        let numberOfOrders = (await Orders.find({ status: 'Por Despachar' })).length
        if (numberOfOrders === 0 || numberOfOrders === undefined) order.orderNumber = 1
        else order.orderNumber = numberOfOrders + 1
        var renderedHtml = tmpl({
          products: order.products,
          orden: '0000'+order.orderNumber,
          nombre: order.checkout.name,
          dni: order.checkout.dni,
          city: order.checkout.city,
          tlf: order.checkout.tlf,
          dir: order.checkout.dir,
          email: order.checkout.email,
          fecha: new Date().toDateString(),
          total: order.checkout.total,
        });
        
          var mailOptions1 = {
            from: 'comercial@perfumesysplash.com',
            to: order.checkout.email,
            subject: 'Compra exitosa!',
            html: renderedHtml,
          }
      
          var mailOptions2 = {
            from: 'comercial@perfumesysplash.com',
            to: "gerencia@perfumesysplash.com",
            subject: 'Un usuario ha comprado!',
            html: renderedHtml,
          }
      
          console.log("sending email", mailOptions1)
      
          transporter.sendMail(mailOptions1, function (error, info) {
            console.log("senMail returned!");
            if (error) {
              console.log("ERROR!!!!!!", error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          })
          console.log("sending email", mailOptions2)
          transporter.sendMail(mailOptions2, function (error, info) {
            console.log("senMail returned!");
            if (error) {
              console.log("ERROR!!!!!!", error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          })
        
        
      }
      if (!order) throw 'not-order-for-show'
      if (ref) {
        order.ref_payco = ref
        order.orderNumber = numberOfOrders
      }
      order.status = status
      order.save()
      return order
    }).catch((err) => {
      console.error(err)
      return err
    });
  }),
  
  DeleteOrder: authorize([], async (_, { id }, { credentials: { user }, dirBase }) => {
    try {
      return Orders.findByIdAndDelete(id).then((res) => {
        console.log(res)
        return {
          status: 'Ok',
          message: 'Orden Borrada!'
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