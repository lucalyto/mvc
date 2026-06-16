const UsuarioModel = require('../models/usuarioModel')
const bcrypt = require('bcryptjs')

const AuthController = {
    async cadastrar(req, res) {
        const { usuario, senha } = req.body;
        try {
            const senhaCriptografada = await bcrypt.hash(senha, 10)
            await UsuarioModel.cadastrar(usuario, senhaCriptografada)
            res.redirect('/login.html');
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao cadastrar", message: err.message });
        }
    },

    async logar(req, res) {
        const { usuario, senha } = req.body;
        try {
            const usuarios = await UsuarioModel.buscarPorUsuarioESenha(usuario)
            
            if (usuarios.length > 0) {
                const userBanco = usuarios[0]
                const senhaCorreta = await bcrypt.compare(senha, userBanco.senha);

                if (senhaCorreta) {
                    res.send(`
                        <script>
                            localStorage.setItem('usuarioLogado', 'true');
                            localStorage.setItem('nomeUsuario', '${userBanco.usuario}');
                            localStorage.setItem('tipoUsuario', '${userBanco.tipo_usuario}');
                            window.location.href = '${userBanco.tipo_usuario === 'admin' ? '/admin.html' : '/menu.html'}';
                        </script>
                    `);
                } else {
                    res.status(401).redirect('/login.html?error=invalid_credentials');
                }
            } else {
                res.status(401).redirect('/login.html?error=user_not_found');
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro interno no servidor" });
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