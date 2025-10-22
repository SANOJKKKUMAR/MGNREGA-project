const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('manrega', 'root', 'Sanoj@500r7', {
//     host: 'localhost',
//     dialect: 'mysql'
// });


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

const DistrictData = sequelize.define('DistrictData', {
    district: { type: DataTypes.STRING, allowNull: false },
    month: { type: DataTypes.STRING, allowNull: false },
    works_completed: { type: DataTypes.INTEGER, allowNull: false },
    payments: { type: DataTypes.FLOAT, allowNull: false }
}, {
    tableName: 'district_data'
});

module.exports = { DistrictData, sequelize };
