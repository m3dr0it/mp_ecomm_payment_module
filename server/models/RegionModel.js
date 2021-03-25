/*  Jika database already exist, gunakan module sequalize-auto
    untuk generate schema database secara reverse-engineering,
    buat arrow function regions lalu deklarasikan class model. 
    constructo sequalize(modelName, attributes,options)
 */



const regions = (sequelize, DataTypes) => {
    const Regions = sequelize.define('regions', {
        region_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        region_name: {
            type: DataTypes.STRING(25),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'regions', // nama table di database
        schema: 'public',
        timestamps: false,
        indexes: [
            {
                name: "region_id_pk", //format pk : kolomid_id_pk
                unique: true,
                fields: [
                    { name: "region_id" },
                ]
            },
        ]
    });

    return Regions;
};

export default regions;
