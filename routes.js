const express = require('express');
const router = express.Router();
const { sql, config } = require('./config/database'); 

router.post('/cadastrar', async (req, res) => {
    const { usuario, senha } = req.body
    try {
        let pool = await sql.connect(config)
        await pool.request()
            .input('user', sql.VarChar, usuario)
            .input('pass', sql.VarChar, senha)
            .query('INSERT INTO Usuarios (usuario, senha) VALUES (@user, @pass)')

        console.log("Usuário cadastrado com sucesso!")
        res.send("<script>alert('Utilizador registado com sucesso!'); window.location.href='/login.html'</script>")
    } catch (err) {
        console.error("Erro detalhado:", err.message)
        res.status(500).send("Erro ao cadastrar: " + err.message)
    }
})

router.post('/logar', async (req, res) => {
    const { usuario, senha } = req.body
    try {
        let pool = await sql.connect(config)
        let result = await pool.request()
            .input('user', sql.VarChar, usuario)
            .input('pass', sql.VarChar, senha)
            .query('SELECT * FROM Usuarios WHERE usuario = @user AND senha = @pass')

        if (result.recordset.length > 0) {
            res.send(`
                <script>
                    localStorage.setItem('usuarioLogado', 'true')
                    localStorage.setItem('nomeUsuario', '${usuario}')
                    const url = localStorage.getItem('urlPretendida') || '/menu.html'
                    localStorage.removeItem('urlPretendida')
                    window.location.href = url
                </script>
            `)
        } else {
            res.send("<script>alert('Usuário ou senha incorretos'); window.location.href='/login.html'</script>")
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Erro no servidor")
    }
})

router.post('/finalizar-reserva', async (req, res) => {
    const { usuario, filme, assentos } = req.body
    try {
        let pool = await sql.connect(config)
        let userResult = await pool.request()
            .input('nome', sql.VarChar, usuario)
            .query('SELECT id FROM Usuarios WHERE usuario = @nome')

        if (userResult.recordset.length === 0) return res.status(404).send("Usuário não encontrado")
        const userId = userResult.recordset[0].id

        const listaAssentos = assentos.split(', ')
        for (let umAssento of listaAssentos) {
            await pool.request()
                .input('uid', sql.Int, userId)
                .input('filme', sql.VarChar, filme)
                .input('seat', sql.VarChar, umAssento)
                .query('INSERT INTO Ingressos (usuario_id, nome_filme, assento) VALUES (@uid, @filme, @seat)')
        }
        res.status(200).send("Ingressos salvos com sucesso!")
    } catch (err) {
        console.error(err)
        res.status(500).send("Erro ao salvar no banco.")
    }
})

router.get('/meus-ingressos', async (req, res) => {
    const usuario = req.query.usuario
    try {
        let pool = await sql.connect(config)
        let result = await pool.request()
            .input('nome', sql.VarChar, usuario)
            .query(`
                SELECT I.nome_filme, I.assento, I.data_compra 
                FROM Ingressos I
                JOIN Usuarios U ON I.usuario_id = U.id
                WHERE U.usuario = @nome
                ORDER BY I.data_compra DESC
            `)
        res.json(result.recordset)
    } catch (err) {
        console.error(err)
        res.status(500).send("Erro ao buscar ingressos")
    }
})

module.exports = router;