import User from './User.js';
import Question from './Question.js';

export function init(sequelize) {
  const models = {
    User: User(sequelize),
    Question: Question(sequelize),
  };

  return models;
}