const conexao = require('../config/database');

const IngressoModel = {
    async salvarIngresso(userId, filme, assento) {
        const [result] = await conexao.query(
            'INSERT INTO Ingressos (usuario_id, nome_filme, assento) VALUES (?, ?, ?)', 
            [userId, filme, assento]
        );
        return result;
    },

    async buscarPorUsuario(usuario) {
        const [rows] = await conexao.query(`
            SELECT I.nome_filme, I.assento, I.data_compra 
            FROM Ingressos I
            JOIN Usuarios U ON I.usuario_id = U.id
            WHERE U.usuario = ?
            ORDER BY I.data_compra DESC
        `, [usuario]);
        
        return rows; 
    },

    async buscarAssentosOcupados(filme) {
        const [rows] = await conexao.query(
            'SELECT assento FROM Ingressos WHERE nome_filme = ?', 
            [filme]
        );

        return rows.map(row => row.assento);
    }
};

module.exports = IngressoModel;