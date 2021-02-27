const Orders = (sequelize, DataTypes)=>{
    const Orders = sequelize.define('orders', {
      order_name: {
        type: DataTypes.STRING(25),
        allowNull: false,
        primaryKey: true
      },
      order_created_on: {
        type: DataTypes.DATE,
        allowNull: true
      },
      order_status: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      order_subtotal: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      order_shipping: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      order_discount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      order_tax: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      order_total_due: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      order_total_qty: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      order_watr_numbers: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      order_is_receive: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      order_acco_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'account',
          key: 'acco_id'
        }
      },
      order_stat_name: {
        type: DataTypes.STRING(15),
        allowNull: true,
        references: {
          model: 'status',
          key: 'stat_name'
        }
      },
      order_weight: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      sequelize,
      tableName: 'orders',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "orders_pkey",
          unique: true,
          fields: [
            { name: "order_name" },
          ]
        },
      ]
    });
    return Orders;
}

export default Orders;