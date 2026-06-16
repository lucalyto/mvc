const IngressoModel = require('../models/ingressoModel');
const UsuarioModel = require('../models/usuarioModel');

const IngressoController = {
    async finalizarReserva(req, res) {
        const { usuario, filme, assentos } = req.body;
        try {
            const user = await UsuarioModel.buscarIdPorNome(usuario);
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            
            const listaAssentos = assentos.split(', ');
            for (let umAssento of listaAssentos) {
                await IngressoModel.salvarIngresso(user.id, filme, umAssento);
            }

            res.status(200).json({ message: "Ingressos salvos com sucesso!" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao salvar no banco.", message: err.message });
        }
    },

    async meusIngressos(req, res) {
        const usuario = req.query.usuario;
        try {
            const ingressos = await IngressoModel.buscarPorUsuario(usuario);
            res.json(ingressos);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao buscar ingressos." });
        }
    },

    async assentosOcupados(req, res) {
        const filme = req.query.filme;
        try {
            const assentos = await IngressoModel.buscarAssentosOcupados(filme);
            res.json(assentos);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao buscar assentos ocupados." });
        }
    }
};

module.exports = IngressoController;