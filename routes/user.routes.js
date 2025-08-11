const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login',
    body('username').trim().isLength({ min: 5 }),
    body('password').trim().isLength({ min: 6 }),
    async (req, res) => { 
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } // Validate the request body - this checks if the email and password are provided and valid
        const { username, password } = req.body;
        const user = await userModel.findOne({
            username: username
        });//user ko find kar re hai through username

        if (!user) {
            return res.status(404).json({ message: 'Username or password is incorrect' });
        }

        // Compare the provided password with the hashed password in the database.
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Username or password is incorrect' 
                
            });


        }
        // If the user is found and the password is valid, send a success response.
        // res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email } });

        // Generate a JWT token
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            email:user.email
        },
            process.env.JWT_SECRET,
        )

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                username: user.username,
                email: user.email
                
            }
        });

        res.cookie('token', token);
        res.send('logged in');


    }
)



module.exports = router;