// @flow

import uuid from 'uuid-js';
import encrypt from '../utilities/encrypt';

const minLength = 3;
const maxLength = 20;

const errorMessages = {
  notEmpty: () => 'The field should be filled',
  len: (min, max) => `Min string length ${min} characters, max string length ${max} characters`,
  isEmail: () => 'Not a valid email format',
};

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    uid: {
      type: DataTypes.STRING,
      defaultValue: uuid.create().hex,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: errorMessages.notEmpty(),
        },
        len: {
          msg: errorMessages.len(minLength, maxLength),
          min: minLength,
          max: maxLength,
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: errorMessages.notEmpty(),
        },
        len: {
          msg: errorMessages.len(minLength, maxLength),
          min: minLength,
          max: maxLength,
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: errorMessages.notEmpty(),
        },
        isEmail: {
          args: true,
          msg: errorMessages.isEmail(),
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: errorMessages.notEmpty(),
        },
      },
      set(password) {
        if (password !== '') {
          this.setDataValue('password', encrypt(password));
        } else {
          this.setDataValue('password', '');
        }
      },
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Task, { foreignKey: 'creatorId', as: 'creator' });
    User.hasMany(models.Task, { foreignKey: 'assignedToId', as: 'assignedTo' });
  };
  User.prototype.getFullName = function getFullName() {
    return `${this.lastName} ${this.firstName}`;
  };
  return User;
};
