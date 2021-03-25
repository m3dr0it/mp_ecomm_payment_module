const address = (sequelize, DataTypes) => {
    const address = sequelize.define('address', {
      addr_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      addr_address: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      addr_optional: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      addr_is_primary: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      addr_langitude: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      addr_latitude: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      addr_kodepos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'kodepos',
          key: 'kodepos'
        }
      },
      addr_accu_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'account',
          key: 'acco_id'
        }
      }
    }, {
      sequelize,
      tableName: 'address',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "address_pkey",
          unique: true,
          fields: [
            { name: "addr_id" },
          ]
        },
      ]
    });
    address.associate = models =>  {
    //   address.belongsTo(models.kodepos,{foreignKey:'addr_kodepos' })
      address.belongsTo(models.account,{foreignKey:'addr_accu_id' })
    }
  
    return address;
  
  };
  
  export default address;