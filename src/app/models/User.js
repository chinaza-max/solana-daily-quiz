// models/User.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    wallet: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return User;
};

