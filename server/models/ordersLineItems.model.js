const ordersLineItems = (sequelize, DataTypes) => {
    const ordersLineItems = sequelize.define('orders_line_items', {
        orit_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        orit_qty: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        orit_subtotal: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        orit_prod_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'product',
            key: 'prod_id'
          }
        },
        orit_order_name: {
          type: DataTypes.STRING(25),
          allowNull: true,
          references: {
            model: 'orders',
            key: 'order_name'
          }
        }
      }, {
        sequelize,
        tableName: 'orders_line_items',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: "order_line_items_pkey",
            unique: true,
            fields: [
              { name: "orit_id" },
            ]
          },
        ]
      });
      return ordersLineItems;
}
export default ordersLineItems;