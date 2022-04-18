const express = require('express')

const router = express.Router()


const {emailFeedback,verify,nuevoEmailValidar,validar} = require('../controllers/feedback')

router.post('/feedback',emailFeedback)
router.post('/verificar-email',nuevoEmailValidar)
router.get('/validar/:id',validar)
router.get('/verify/:id',verify)

module.exports = router