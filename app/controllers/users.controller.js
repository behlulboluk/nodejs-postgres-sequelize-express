import { usersModel, booksModel } from '../models/model';
import Util from '../util/util';
import { validateCreateUser } from '../validations/UserTemplate';
import { validateCreateScore } from '../validations/returnBookTemplate';
import { getBook } from './books.controller';

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
};

export const getUser = async (req, res, internal) => {
  const userId = req.params.userId;
  console.log('userId', typeof userId);

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

    console.log('before validation: ', data);
    var valid = validateCreateUser(data);

    if (!valid) {
      var errorMessage = validateCreateUser.errors.map(err => JSON.stringify(err)).join(', ');
      console.log('Error Message: ', errorMessage);
      util.setError(400, errorMessage);
      return util.send(res);
    }
    console.log('after Validation', data);

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
      util.setSuccess(204, 'borrow the book process is successful');
      return util.send(res);
    }
  } catch (error) {
    console.log('err', error);
    util.setError(500, 'Err', error);
    return util.send(res);
  }
};

export const returnBookFromUserWithScore = async (req, res) => {
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
    if (
      getUserFunc != null &&
      getBookFunc != null &&
      getBookFunc.dataValues.current_borrow_user != getUserFunc.dataValues.id
    ) {
      util.setError(400, 'this book is not yours');
      return util.send(res);
    }

    if (
      getUserFunc != null &&
      getBookFunc != null &&
      getBookFunc.dataValues.current_borrow_user == getUserFunc.dataValues.id
    ) {
      let data = req.body;
      console.log('before validation: ', data);
      var valid = validateCreateScore(data);
      if (!valid) {
        var errorMessage = validateCreateScore.errors.map(err => JSON.stringify(err)).join(', ');
        console.log('Error Message: ', errorMessage);
        util.setError(400, errorMessage);
        return util.send(res);
      }
      console.log('after Validation', data);

      if (data.score && data.score <= 10 && data.score > 0) {
        let updateUserPast;
        let updateUserPresent;

        if (getUserFunc._previousDataValues.past != []) {
          updateUserPast = getUserFunc._previousDataValues.past;
          updateUserPast.push({
            id: getBookFunc.dataValues.id,
            name: getBookFunc.dataValues.name,
            userScore: data.score
          });
          console.log('updateUserPast', updateUserPast);
        } else {
          updateUserPast = [{ id: getBookFunc.dataValues.id, name: getBookFunc.dataValues.name }];
        }

        updateUserPresent = getUserFunc._previousDataValues.present;
        let updateUserPresentFindId = updateUserPresent.findIndex(item => item.id == getBookFunc.dataValues.id);
        if (updateUserPresentFindId !== -1) {
          updateUserPresent.splice(updateUserPresentFindId, 1);
        }

        console.log('updateUserPresent', updateUserPresent);
        console.log('updateUserPast', updateUserPast);

        await usersModel.update(
          {
            past: updateUserPast,
            present: updateUserPresent
          },
          { where: { id: userId } }
        );

        let new_score;
        let total_score;
        if (getBookFunc._previousDataValues.score != -1) {
          new_score =
            (getBookFunc._previousDataValues.total_score + data.score) / getBookFunc._previousDataValues.borrow_count;
        } else {
          new_score = data.score;
        }

        if (getBookFunc._previousDataValues.total_score != null) {
          total_score = getBookFunc._previousDataValues.total_score + data.score;
        } else {
          total_score = data.score;
        }

        await booksModel.update(
          {
            current_borrow_user: null,
            score: new_score,
            total_score: total_score
          },
          { where: { id: bookId } }
        );
        util.setSuccess(204, 'return and score the book process is successful');
        return util.send(res);
      } else {
        util.setError(400, 'you can input score between 0 to 10');
        return util.send(res);
      }
    }
  } catch (error) {
    console.log('err', error);
    util.setError(500, 'Err', error);
    return util.send(res);
  }
};
