// models/Question.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Question = sequelize.define('Question', {
    question: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON, 
      allowNull: false,
    },
    answer: {      
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activeUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    timestamps: true,
  });

  return Question;
};

