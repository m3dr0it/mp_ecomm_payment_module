const cartLineItems = (sequelize,DataTypes)=>{
    const CartLineItems = sequelize.define('cart_line_items', {
      clit_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      clit_qty: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      clit_subweight: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      clit_subtotal: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      clit_prod_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'product',
          key: 'prod_id'
        }
      },
      clit_cart_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'cart',
          key: 'cart_id'
        }
      },
      clit_stat_name: {
        type: DataTypes.STRING(15),
        allowNull: true,
        references: {
          model: 'status',
          key: 'stat_name'
        }
      }
    }, {
      sequelize,
      tableName: 'cart_line_items',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "cart_line_items_pkey",
          unique: true,
          fields: [
            { name: "clit_id" },
          ]
        },
      ]
    });
    CartLineItems.associate = (model) => {
      CartLineItems.belongsTo(model.cart,{foreignKey:'clit_cart_id'})
      CartLineItems.belongsTo(model.product,{foreignKey:'clit_prod_id'})
    }
      return CartLineItems
}
export default cartLineItems
