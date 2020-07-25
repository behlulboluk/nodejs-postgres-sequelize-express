import { usersModel, booksModel } from '../models/model';
import apiqueryparameters from 'api-query-params';
import Util from '../util/util';
import { v1 as uuidv1 } from 'uuid';
import { validateCreate } from '../validations/UserTemplate';
import { getAllBooks, getBook, postBook } from './books.controller';

const util = new Util();

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await usersModel.findAll({ attributes: ['id', 'name'] });
    if (allUsers.length > 0) {
      util.setSuccess(200, 'Users retrieved', allUsers);
    } else {
      util.setError(404, 'No users found');
    }
    return util.send(res);
  } catch (error) {
    util.setError(500, 'Err', error);
    return util.send(res);
  }
  // let query = apiqueryparameters(req.query);
  // if (req.query.sortBy === "createdAt") {
  //     query.sortBy = { createdAt: -1 }
  // }
  // console.log(req.query.sort)
  // console.log(query.sort)
  // console.log(query)
};

export const getUser = async (req, res, internal) => {
  // console.log('req', req);
  // console.log('res', res);
  const userId = req.params.userId;
  console.log('userId', typeof userId);
  // console.log('userId', userId);
  // if (!userId) {
  //   util.setError(400, 'empty id');
  //   return util.send(res);
  // }

  // try {
  //   const user = await usersModel.findOne({
  //     where: { id: userId },
  //     attributes: ['id', 'name', 'past', 'present']
  //   });
  //   // console.log('user', user.dataValues);
  //   console.log('internal', internal);
  //   if (internal != true) {
  //     if (!user) {
  //       util.setError(404, `Cannot find user with the id ${userId}`);
  //     } else {
  //       let userPast = user.dataValues.past;
  //       let userPresent = user.dataValues.present;
  //       user.dataValues.books = {
  //         past: userPast,
  //         present: userPresent
  //       };
  //       delete user.dataValues.past;
  //       delete user.dataValues.present;
  //       // console.log(user);
  //       util.setSuccess(200, 'Found User', user);
  //     }
  //     return util.send(res);
  //   } else {
  //     return user;
  //   }
  // } catch (error) {
  //   util.setError(500, error);
  //   return util.send(res);
  // }

  let findOneParams = {
    where: { id: userId },
    attributes: ['id', 'name', 'past', 'present']
  };
  if (internal == true) {
    delete findOneParams.attributes;
    const user = await usersModel.findOne(findOneParams);
    return user;
  } else {
    try {
      const user = await usersModel.findOne(findOneParams);
      if (!user) {
        util.setError(404, `Cannot find user with the id ${userId}`);
      } else {
        let userPast = user.dataValues.past;
        let userPresent = user.dataValues.present;
        user.dataValues.books = {
          past: userPast,
          present: userPresent
        };
        delete user.dataValues.past;
        delete user.dataValues.present;
        // console.log(user);
        util.setSuccess(200, 'Found User', user);
      }
      return util.send(res);
    } catch (error) {
      util.setError(500, error);
      return util.send(res);
    }
  }
};

export const postUser = async (req, res) => {
  try {
    let data = req.body;
    // if (!data) {
    //   return util.setError(400, 'empty request body');
    // }
    console.log('before validation: ', data);
    var valid = validateCreate(data);

    if (!valid) {
      var errorMessage = validateCreate.errors.map(err => JSON.stringify(err)).join(', ');
      console.log('Error Message: ', errorMessage);
      util.setError(400, errorMessage);
      return util.send(res);
    }
    console.log('after Validation', data);

    // data.id = uuidv1();
    data.past = [];
    data.present = [];
    console.log('after added id', data);

    const createUser = await usersModel.create(data);
    let returnValues = {
      id: createUser.dataValues.id,
      name: createUser.dataValues.name
    };
    util.setSuccess(201, 'User created', returnValues);
    return util.send(res);
  } catch (error) {
    util.setError(500, 'Err', error);
    return util.send(res);
  }
};

export const borrowBookFromUser = async (req, res) => {
  try {
    const { userId, bookId } = req.params;
    console.log('userId and bookId', userId, bookId);
    const getUserFunc = await getUser(req, res, true);
    console.log('getUserFunc', getUserFunc);
    const getBookFunc = await getBook(req, res, true);
    console.log('getBookFunc', getBookFunc);
    if (getUserFunc == null) {
      util.setError(404, 'does not exist user id');
      return util.send(res);
    }
    if (getBookFunc == null) {
      util.setError(404, 'does not exist book id');
      return util.send(res);
    }
    if (getUserFunc != null && getBookFunc != null && getBookFunc.dataValues.current_borrow_user != null) {
      util.setError(400, 'you cannot borrow the book that because the book currently in someone else');
      return util.send(res);
    }
    if (getUserFunc != null && getBookFunc != null && getBookFunc.dataValues.current_borrow_user == null) {
      let updateUserPresent;
      if (getUserFunc._previousDataValues.present != []) {
        updateUserPresent = getUserFunc._previousDataValues.present;
        updateUserPresent.push({
          id: getBookFunc.dataValues.id,
          name: getBookFunc.dataValues.name
        });
        console.log('updateUserPresent', updateUserPresent);
      } else {
        updateUserPresent = [{ id: getBookFunc.dataValues.id, name: getBookFunc.dataValues.name }];
      }
      await usersModel.update(
        {
          present: updateUserPresent
        },
        { where: { id: userId } }
      );
      let new_borrow_count;
      if (getBookFunc._previousDataValues.borrow_count != null) {
        new_borrow_count = getBookFunc._previousDataValues.borrow_count + 1;
      } else {
        new_borrow_count = 1;
      }
      await booksModel.update(
        {
          current_borrow_user: getUserFunc.dataValues.id,
          borrow_count: new_borrow_count
        },
        { where: { id: bookId } }
      );
      util.setSuccess(200, 'borrow the book process is successful');
      return util.send(res);
    }
  } catch (error) {
    console.log('err', error);
    util.setError(500, 'Err', error);
    return util.send(res);
  }
};
// import GeoLocation from '../models/Location.model';
// import mongoose from 'mongoose';
// import apiqueryparameters from 'api-query-params';

// mongoose.set('useFindAndModify', false);

// // Retrieve and return all notes from the database.
// export const getAllLocation = (req, res) => {

//     let query = apiqueryparameters(req.query);

//     if (req.query.sortBy === "createdAt") {
//         query.sortBy = { createdAt: -1 }
//     }
//     console.log(req.query.sort)
//     console.log(query.sort)
//     console.log(query)
//     let { filter, page, limit, sortBy, projection, population } = query;
//     GeoLocation.find(filter)
//         .skip(page)
//         .limit(limit)
//         .sort(sortBy)
//         .select(projection)
//         .exec((err, geoLocation) => {
//             if (err) {
//                 return res.status(500).send({
//                     message: err.message || "Some error occurred while retrieving notes."
//                 });
//             }
//             if (geoLocation.length === 0) {
//                 return res.status(404).send({
//                     message: "Note not found"
//                 });
//             }
//             return res.status(200).send(geoLocation);
//         });
// };

// // Create and Save a new Location
// export const postLocation = (req, res) => {
//     // Validate request
//     if (!req.body.name) {
//         return res.status(400).send({
//             message: "Location name can not be empty"
//         });
//     }
//     if (!req.body.year) {
//         return res.status(400).send({
//             message: "Location year can not be empty"
//         });
//     }

//     // Create a Location
//     let geoLocation = new GeoLocation({
//         name: req.body.name,
//         year: req.body.year,
//         activate: req.body.activate,
//         location: {
//             lat: req.body.location.lat,
//             long: req.body.location.long
//         }
//     });

//     // Save Location in the database
//     geoLocation.save()
//         .then(geoLocation => {
//             return res.status(200).send({
//                 message: "location added successfully",
//                 geoLocation
//             });
//         }).catch(err => {
//             return res.status(500).send({
//                 message: err.message || "Some error occurred while creating the Location."
//             });
//         });
// };

// // Find a single Location with a LocationId
// export const getLocation = (req, res) => {
//     GeoLocation.findById(req.params.locationId)
//         .then(geoLocation => {
//             if (!geoLocation) {
//                 return res.status(404).send({
//                     message: "Location not found with id " + req.params.locationId
//                 });
//             }
//             return res.status(200).send(geoLocation);
//         }).catch(err => {
//             if (err.kind === 'ObjectId') {
//                 return res.status(404).send({
//                     message: "Location not found with id " + req.params.locationId
//                 });
//             }
//             return res.status(500).send({
//                 message: "Error retrieving Location with id " + req.params.locationId
//             });
//         });
// };

// // Update a Location identified by the LocationId in the request
// export const updateLocation = (req, res) => {
//     // Validate Request
//     if (!req.body.name) {
//         return res.status(400).send({
//             message: "Location name can not be empty"
//         });
//     }
//     if (!req.body.year) {
//         return res.status(400).send({
//             message: "Location year can not be empty"
//         });
//     }

//     // Find Location and update it with the request body
//     GeoLocation.findByIdAndUpdate(req.params.locationId, {
//         name: req.body.name,
//         year: req.body.year,
//         activate: req.body.activate,
//         location: {
//             lat: req.body.location.lat,
//             long: req.body.location.long
//         }
//     }, { new: true })
//         .then(geoLocation => {
//             if (!geoLocation) {
//                 return res.status(404).send({
//                     message: "Location not found with id " + req.params.locationId
//                 });
//             }
//             return res.status(201).send(geoLocation);
//         }).catch(err => {
//             if (err.kind === 'ObjectId') {
//                 return res.status(404).send({
//                     message: "Location not found with id " + req.params.locationId
//                 });
//             }
//             return res.status(500).send({
//                 message: "Error updating Location with id " + req.params.locationId
//             });
//         });
// };

// // Delete a Location with the specified LocationId in the request
// export const deleteLocation = (req, res) => {
//     GeoLocation.findByIdAndRemove(req.params.locationId)
//         .then(geoLocation => {
//             if (!geoLocation) {
//                 return res.status(404).send({
//                     message: "Location not found with id " + req.params.locationId
//                 });
//             }
//             return res.status(200).send({ message: "Location deleted successfully" });
//         }).catch(err => {
//             if (err.kind === 'ObjectId' || err.name === 'NotFound') {
//                 return res.status(404).send({
//                     message: "Location not found with id " + req.params.locationId
//                 });
//             }
//             return res.status(500).send({
//                 message: "Could not delete Location with id " + req.params.locationId
//             });
//         });
