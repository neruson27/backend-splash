import { authorize } from '../../utils/authorize-resolvers';
import { UserInputError, withFilter } from 'apollo-server-express';
import Orders from '../../models/orders'
var nodemailer = require('nodemailer');
var BootstrapEmail = require('bootstrap-email');
var swig = require('swig')
var EmailTemplates = require('swig-email-templates');
var templates = new EmailTemplates();
var singleTemplate = new BootstrapEmail(__dirname + '/../../email/page.html')
singleTemplate.compileAndSave(__dirname + '/../../email/pageB.html')
var tmpl = swig.compileFile(__dirname + '/../../email/page.html')

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'damiangonz2702@gmail.com',
      pass: 'Luisana2702'
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
  OneOrder: authorize([], async (_, { id }, {credentials: { user }, dirBase}) => {
    return Orders.findOne({"_id": id}).then((order) => {
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
    /* console.log(data.checkout)
    { name: 'Nelson',
      dni: '23224123',
      total: '33.624',
      concept: 'Esto',
      tlf: '0414741768',
      dir: 'asdasdasd',
      email: 'kaironelson@gmial.com' } */
    let numberOfOrders = (await Orders.find({})).length
    if (numberOfOrders === 0 || numberOfOrders === undefined) data.orderNumber = 1
    else data.orderNumber = numberOfOrders + 1
    var renderedHtml = tmpl({
      products: data.products,
      orden: '0000'+data.orderNumber,
      nombre: data.checkout.name,
      dni: data.checkout.dni,
      tlf: data.checkout.tlf,
      dir: data.checkout.dir,
      email: data.checkout.email,
      fecha: new Date().toDateString(),
      total: data.checkout.total,
    });

    var mailOptions1 = {
      from: 'damiangonz2702@gmail.com',
      to: data.checkout.email,
      subject: 'Compra exitosa!',
      html: renderedHtml,
    }

    var mailOptions2 = {
      from: 'damiangonz2702@gmail.com',
      to: "kaironelson@gmail.com",
      subject: 'Compra exitosa!',
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
    
    
    return Orders.create(data).then(order => {
      return order
    }).catch((err) => {
      throw err
    });
  }),

  UpdateOrdersStatus: authorize([], async (_, { id, status }, {credentials: { user }, dirBase}) => {
    if(!status) throw new UserInputError()
    return Orders.findOne({"_id": id}).then((order) => {
      if (!order) throw 'not-order-for-show'
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