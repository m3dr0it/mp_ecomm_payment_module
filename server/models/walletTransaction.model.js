import paymentType from "./paymentType.model";
import wallet from "./wallet.model";

const walletTransaction = (sequelize, DataTypes) => {
    const WalletTransaction = sequelize.define('wallet_transaction',{
          watr_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
          watr_numbers: {
            type: DataTypes.STRING(100)
          },
          watr_date: {
            type: DataTypes.DATE
          },
          watr_debet: {
            type: DataTypes.INTEGER
          },
          watr_credit: {
            type: DataTypes.INTEGER
          },
          watr_acc_target: {
            type: DataTypes.STRING(150)
          },
          watr_wale_id : {
            type : DataTypes.INTEGER,
            references:{
              model: 'wallet',
              key : 'wale_id'
            }
          },
          watr_paty_name :{
            type: DataTypes.STRING(3),
            references : {
              model : 'payment_type',
              key : 'paty_name'
            }
          },
          watr_order_name : {
            type: DataTypes.STRING(25),
            references: {
              model : 'orders',
              key : 'order_name'
            }
          }
        },{
          sequelize,
          freezeTableName : true,
          schema: 'public',
          timestamps: false,
          indexes: [
            {
              name: "watr_pkey",
              unique: true,
              fields: [
                { name: "watr_id" },
              ]
            },
          ]
        });
        WalletTransaction.associate = (models) => {
          WalletTransaction.belongsTo(models.wallet,{foreignKey:'watr_wale_id'})
        }
        return WalletTransaction;
};

export default walletTransaction