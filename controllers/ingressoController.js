const IngressoModel = require('../models/ingressoModel');
const UsuarioModel = require('../models/usuarioModel');

const IngressoController = {
    async finalizarReserva(req, res) {
        const { usuario, filme, assentos } = req.body;
        try {
            const user = await UsuarioModel.buscarIdPorNome(usuario);
            if (!user) return res.status(404).send("Usuário não encontrado");
            
            const listaAssentos = assentos.split(', ');
            for (let umAssento of listaAssentos) {
                await IngressoModel.salvarIngresso(user.id, filme, umAssento);
            }
            res.status(200).send("Ingressos salvos com sucesso!");
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao salvar no banco.");
        }
    },

    async meusIngressos(req, res) {
        const usuario = req.query.usuario;
        try {
            const ingressos = await IngressoModel.buscarPorUsuario(usuario);
            res.json(ingressos);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar ingressos");
        }
    },

    async assentosOcupados(req, res) {
        const filme = req.query.filme;
        try {
            const assentos = await IngressoModel.buscarAssentosOcupados(filme);
            res.json(assentos);
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro ao buscar assentos ocupados");
        }
    }
};

module.exports = IngressoController;