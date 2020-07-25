import { booksModel } from '../models/model';
import Util from '../util/util';
import { validateCreateBook } from '../validations/BookTemplate';

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
};

export const getBook = async (req, res, internal) => {
  const bookId = req.params.bookId;
  console.log('bookId', typeof bookId);

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

    console.log('before validation: ', data);
    var valid = validateCreateBook(data);
    if (!valid) {
      var errorMessage = validateCreateBook.errors.map(err => JSON.stringify(err)).join(', ');
      console.log('Error Message: ', errorMessage);
      util.setError(400, errorMessage);
      return util.send(res);
    }
    console.log('after Validation', data);

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
