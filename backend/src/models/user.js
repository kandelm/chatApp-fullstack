const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('User', { id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true}, username:{type:DataTypes.STRING,allowNull:false,unique:true}, email:{type:DataTypes.STRING,allowNull:false,unique:true}, passwordHash:{type:DataTypes.STRING,allowNull:false} }, { timestamps:true });
