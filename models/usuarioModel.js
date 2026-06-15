const conexao = require('../config/database');

const UsuarioModel = {
    async cadastrar(usuario, senha) {
        const [result] = await conexao.query(
            'INSERT INTO Usuarios (usuario, senha, tipo_usuario) VALUES (?, ?, ?)', 
            [usuario, senha, 'comum']  
        );
        return result;
    },

    async buscarPorUsuarioESenha(usuario) {
        const [rows] = await conexao.query(
            'SELECT id, usuario, senha, tipo_usuario FROM Usuarios WHERE usuario = ?', 
            [usuario]
        );
        return rows; 
    },

    async buscarIdPorNome(usuario) {
        const [rows] = await conexao.query(
            'SELECT id FROM Usuarios WHERE usuario = ?', 
            [usuario]
        );
        return rows[0]; 
    }
};

module.exports = UsuarioModel;