const express = require('express');
const router = express.Router();
const {body,validationResult} = require('express-validator');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 5 }),
    body('username').trim().notEmpty(),
    body('password').trim().isLength({ min: 6 }),
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    const { username, email, password } = req.body;

     
    
    if (username && email && password) {
        res.status(200).send('User registered successfully!');
    } else {
        res.status(400).send('All fields are required.');
    }
})


module.exports = router;