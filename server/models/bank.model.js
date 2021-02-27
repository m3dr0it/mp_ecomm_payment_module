const bank = (sequelize,DataTypes) => {
  const Bank = sequelize.define('bank',{
      bank_id : {
          type: DataTypes.STRING(3),
          allowNull:false,
          primaryKey : true
      },
      bank_name: {
          type: DataTypes.STRING(25),
          allowNull:true
      }
  },{
    sequelize,
    freezeTableName:true,
    schema: 'public',
    timestamps:false,
    indexes: [
      {
        name: "bank_pkey",
        unique: true,
        fields: [
          { name: "bank_id" },
        ]
      },
    ]
  })

  Bank.associate = (models) => {
    Bank.hasMany(models.bankAccount,{foreignKey:'bacc_bank_id'})
  }

  return Bank
}
export default bank