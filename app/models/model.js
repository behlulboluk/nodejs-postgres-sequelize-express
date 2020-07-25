// import mongoose from 'mongoose';

// let GeoLocationSchema = mongoose.Schema({
//     name: { type: String, required: true },
//     year: { type: Number, required: true },
//     time : { type : Date, default: Date.now },
//     activate: { type: String, required: true },
//     location : {
//         lat: { type: Number, required: true },
//         long: { type: Number, required: true },
//     }
// }, {
//     timestamps: true
// });

// export default mongoose.model('GeoLocation', GeoLocationSchema);
import { Sequelize, DataTypes } from 'sequelize';
import { dbConfig } from '../config/config.js';

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

export const usersModel = sequelize.define(
  'users_4',
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
  'books_4',
  {
    // Model attributes are defined here
    // id: {
    //   type: DataTypes.UUID,
    //   defaultValue: Sequelize.UUIDV1,
    //   allowNull: false,
    //   primaryKey: true
    // },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
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

// const sequelize = new Sequelize(process.env.POSTGRES_CONNECT_STRING);

// export const usersModel = DataTypes => {
//   const users = sequelize.define('users', {
//     id: {
//       type: DataTypes.UUID,
//       allowNull: false
//     },
//     name: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     created_at: {
//       type: DataTypes.TIMESTAMP_WITH_TIME_ZONE,
//       allowNull: false
//     },
//     updated_at: {
//       type: DataTypes.TIMESTAMP_WITH_TIME_ZONE
//     }
//   });

//   return users;
// };
