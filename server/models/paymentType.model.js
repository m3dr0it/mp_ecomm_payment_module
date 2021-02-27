const paymentType = (sequelize,DataTypes) => {
  const PaymentType = sequelize.define('payment_type',{
      paty_name: {
        type: DataTypes.STRING(3),
        primaryKey : true
      },
      paty_desc: {
        type: DataTypes.STRING(100)
      }
    },{
        sequelize,
        freezeTableName:true,
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: "paymentType_pkey",
            unique: true,
            fields: [
              { name: "paty_name" },
            ]
          },
        ]
      })
  return PaymentType
}
export default paymentType