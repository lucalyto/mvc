const express = require('express')
const router = express.Router()

const AuthController = require('./controllers/atualizadorController')
const IngressoController = require('./controllers/ingressoController')

router.post('/cadastrar', AuthController.cadastrar)
router.post('/logar', AuthController.logar)

router.post('/finalizar-reserva', IngressoController.finalizarReserva)
router.get('/meus-ingressos', IngressoController.meusIngressos)
router.get('/assentos-ocupados', IngressoController.assentosOcupados)
router.get('/usuarios', AuthController.listarUsuarios)

module.exports = router