const express = require('express')

const router = express.Router()


const {emailFeedback,verify} = require('../controllers/feedback')

router.post('/feedback',emailFeedback)
router.get('/verify/:id',verify)

module.exports = router