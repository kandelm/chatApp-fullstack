const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Message', { id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true}, conversationId:{type:DataTypes.INTEGER,allowNull:false}, senderId:{type:DataTypes.INTEGER,allowNull:false}, text:{type:DataTypes.TEXT,allowNull:true}, imageUrl:{type:DataTypes.STRING,allowNull:true} }, { timestamps:true });
