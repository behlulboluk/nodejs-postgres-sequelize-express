import { Sequelize, DataTypes } from 'sequelize';
import { dbConfig } from '../config/config.js';

export const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

export const usersModel = sequelize.define(
  'users_behlul_case',
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    past: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true
    },
    present: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true
    }
  }
  // {
  //   // Other model options go here
  // }
);

export const booksModel = sequelize.define(
  'books_behlul_case',
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    total_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrow_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrow_count_for_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    current_borrow_user: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }
  // {
  //   // Other model options go here
  // }
);
usersModel.sync().then(() => {
  console.log('table created for user');
});
booksModel.sync().then(() => {
  console.log('table created for book');
});
