import { authorize } from '../../utils/authorize-resolvers';
import { UserInputError, withFilter } from 'apollo-server-express';
import Orders from '../../models/orders'

export const Query = {
  /*
  AllOrders: [Orders]
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
    let numberOfOrders = (await Orders.find({})).length
    if (numberOfOrders === 0 || numberOfOrders === undefined) data.orderNumber = 1
    else data.orderNumber = numberOfOrders + 1
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