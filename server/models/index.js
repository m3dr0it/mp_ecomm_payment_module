import Sequelize from 'sequelize';
import config from '../../config/config'
// database remote
// export const sequelize = new Sequelize(
//     process.env.DATABASE,
//     process.env.DATABASE_USER,
//     process.env.DATABASE_PASSWORD,
//     {
//         host : "192.168.100.254",
//         dialect: 'postgres',
//     },
//   );

export const sequelize = new Sequelize(
    config.db_name,
    config.db_username,
    config.db_password,
    {
      dialect: 'postgres',
      host: '192.168.100.254'
    },
  );
const Op = Sequelize.Op;    

const models = {
    product : sequelize.import('./product.model'),
    account : sequelize.import('./account.model'),
    orders : sequelize.import('./orders.model'),
    cart : sequelize.import('./cart.model'),
    cartLineItems : sequelize.import('./cartLineItems.model'),
    bank : sequelize.import('./bank.model'),
    bankAccount : sequelize.import('./bankAccount.model'),
    wallet : sequelize.import('./wallet.model'),
    paymentType : sequelize.import('./paymentType.model'),
    walletTransaction : sequelize.import('./walletTransaction.model')
};

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
      models[key].associate(models);
    }
  });


export {Op };
export default models;
// // export { sequelize };
// export default models;
