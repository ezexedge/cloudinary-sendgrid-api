const express = require('express')

const router = express.Router()


const {emailFeedback} = require('../controllers/feedback')

router.get('/',emailFeedback)

module.exports = router