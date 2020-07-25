import { booksModel } from '../models/model';
import apiqueryparameters from 'api-query-params';
import Util from '../util/util';
import { v1 as uuidv1 } from 'uuid';
import { validateCreate } from '../validations/BookTemplate';

const util = new Util();

export const getAllBooks = async (req, res) => {
  try {
    const allBooks = await booksModel.findAll({ attributes: ['id', 'name'] });
    if (allBooks.length > 0) {
      util.setSuccess(200, 'Books retrieved', allBooks);
    } else {
      util.setError(404, 'No books found');
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

export const getBook = async (req, res, internal) => {
  const bookId = req.params.bookId;
  console.log('bookId', typeof bookId);
  // console.log('userId', userId);
  // if (!userId) {
  //   util.setError(400, 'empty id');
  //   return util.send(res);
  // }
  let findOneParams = {
    where: { id: bookId },
    attributes: ['id', 'name', 'score']
  };
  if (internal == true) {
    delete findOneParams.attributes;
    const book = await booksModel.findOne(findOneParams);
    return book;
  } else {
    try {
      const book = await booksModel.findOne(findOneParams);

      if (!book) {
        util.setError(404, `Cannot find book with the id ${bookId}`);
      } else {
        util.setSuccess(200, 'Found Book', book);
      }
      return util.send(res);
    } catch (error) {
      util.setError(500, error);
      return util.send(res);
    }
  }
};

export const postBook = async (req, res) => {
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
    data.score = -1;
    console.log('after added id', data);

    const createBook = await booksModel.create(data);
    let returnValues = {
      id: createBook.dataValues.id,
      name: createBook.dataValues.name
    };
    util.setSuccess(201, 'Book created', returnValues);
    return util.send(res);
  } catch (error) {
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
