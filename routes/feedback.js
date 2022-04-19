const express = require('express')

const router = express.Router()


const {emailFeedback,verify,nuevoEmailValidar,validar,prueba} = require('../controllers/feedback')

router.post('/feedback',emailFeedback)
router.post('/verificar-email',nuevoEmailValidar)
router.get('/validar/:id',validar)
router.get('/verify/:id',verify)
router.post('/prueba',prueba)

module.exports = router