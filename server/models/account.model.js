const account = (sequelize, DataTypes) => {
  const Account = sequelize.define('account', {
    acco_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    acco_username: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    acco_nama: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    acco_phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    acco_shopname: {
      type: DataTypes.STRING(85),
      allowNull: true
    },
    acco_gender: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    acco_birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    acco_avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    acco_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'account',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "account_pkey",
        unique: true,
        fields: [
          { name: "acco_id" },
        ]
      },
    ]
  });

  Account.associate = (models) => {
    Account.hasMany(models.bankAccount,{foreignKey:'bacc_acco_id'})
    Account.hasOne(models.wallet,{foreignKey:'wale_acco_id'})
    Account.hasMany(models.account,{foreignKey:'prod_acco_id'})
  }

  return Account;
};

export default account;
