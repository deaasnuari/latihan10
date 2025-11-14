const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', userController.getAllUsers);        //get all users
router.get('/:id', userController.getUserById);     //search by id
router.post('/', userController.createUser);        // new data
router.put('/:id', userController.updateUser);      //update  by id
router.delete('/:id', userController.deleteUser);   //delete user by id


module.exports = router;
