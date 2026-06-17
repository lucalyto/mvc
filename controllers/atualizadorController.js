const UsuarioModel = require('../models/usuarioModel')
const bcrypt = require('bcryptjs')

const AuthController = {
    async cadastrar(req, res) {
        const { usuario, senha } = req.body;
        try {
            const senhaCriptografada = await bcrypt.hash(senha, 10);
            await UsuarioModel.cadastrar(usuario, senhaCriptografada);

            return res.status(201).json({ success: true, message: "Usuário cadastrado com sucesso!" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro ao cadastrar", message: err.message });
        }
    },

    async logar(req, res) {
        const { usuario, senha } = req.body;
        try {
            const usuarios = await UsuarioModel.buscarPorUsuarioESenha(usuario);
            
            if (usuarios.length > 0) {
                const userBanco = usuarios[0];
                const senhaCorreta = await bcrypt.compare(senha, userBanco.senha);

                if (senhaCorreta) {
                    return res.status(200).json({
                        success: true,
                        usuario: userBanco.usuario,
                        tipo_usuario: userBanco.tipo_usuario
                    });
                } else {
                    return res.status(401).json({ error: "Credenciais inválidas" });
                }
            } else {
                return res.status(401).json({ error: "Utilizador não encontrado" });
            }
        } catch (err) { 
            console.error(err);
            return res.status(500).json({ error: "Erro interno no servidor" });
        }
    },

    async listarUsuarios(req, res) {
        const solicitante = req.query.solicitante; 

        if (solicitante !== 'admin') {
            return res.status(403).json({ error: "Acesso negado. Permissão insuficiente." });
        }

        try {
            const lista = await UsuarioModel.listarTodosOsLogins();
            res.json(lista);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao buscar utilizadores." });
        }
    }
};

module.exports = AuthController;