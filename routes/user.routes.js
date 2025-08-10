const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 5 }),
    body('username').trim().notEmpty(),
    body('password').trim().isLength({ min: 6 }),
    async(req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        //this 10 is for the salt rounds, it can be adjusted for security
        
        // Create a new user instance
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword
            
        });

        // Save the user to the database
        await newUser.save()
        res.status(201).json({ data:newUser });

    // if (username && email && password) {
    //     res.status(200).send('User registered successfully!');
    // } else {
    //     res.status(400).send('All fields are required.');
    // }
})


module.exports = router;