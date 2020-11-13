import moment from 'moment';

import Orders from '../models/orders';


function callback() {
  const datetime = moment()
  try {
    // statements
    console.log('--: job canceledTransaction ejecutado');
    // busca las transacciones donde la fecha de expiración del status es menor que la actual y donde el status es igual a pending
    Orders.find({'status': 'Creada'})
    .then(transactions => {
      console.log('---: transactions en estado creada: ', transactions.length);
      if (transactions.length > 0) {
        transactions.forEach(async (transaction) => {
          console.log('Creado a las')
          console.log(transaction.createdAt)
          let creado = moment(transaction.createdAt)
          let duration = moment.duration(datetime.diff(creado)).minutes()
          console.log(`Tiene: ${duration} minutos de creada`)
          if(duration > 30) {
            await Orders.deleteOne({"_id":transaction._id})
          }
        })

      } else {
        return null
      }
    })
  } catch(e) {
    // statements
    console.log(e);
  }

}


export default [
  {
    name: 'canceledTransaction',
    // sec min hour day month year => 00 30 01 * * *
    // '01 */05 * * * *' -> en el segundo 01 cada 5 minutos en todo momento
    time: '*/01 */05 * * * *',
    callback: callback
  }
]