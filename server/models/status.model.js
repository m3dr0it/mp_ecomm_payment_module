const Status = (sequelize, DataTypes)=> {
    const Status = sequelize.define('status', {
      stat_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
        primaryKey: true
      }
    }, {
      sequelize,
      tableName: 'status',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: "status_pkey",
          unique: true,
          fields: [
            { name: "stat_name" },
          ]
        },
      ]
    });

    Status.associatee = models =>{
      Status.hasMany(models.orders,{foreignKey:'order_state_name'})
    }
    return Status;
  };
  export default Status;