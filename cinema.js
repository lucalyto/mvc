const express = require('express')
const sql = require('mssql/msnodesqlv8')
const path = require('path') 
const app = express()

let usuarioLogado = false

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const config = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=TBS0676772W11-1\\SQLEXPRESS;Database=ProjetoCinema;Trusted_Connection=yes;'
}

app.post('/cadastrar', async (req, res) => {
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

app.post('/logar', async (req, res) => {
    const { usuario, senha } = req.body
    try {
        let pool = await sql.connect(config)
        let result = await pool.request()
            .input('user', sql.VarChar, usuario)
            .input('pass', sql.VarChar, senha)
            .query('SELECT * FROM Usuarios WHERE usuario = @user AND senha = @pass')

        if (result.recordset.length > 0) {
            usuarioLogado = true
            res.send(`
                <script>
                    localStorage.setItem('usuarioLogado', 'true')
                    localStorage.setItem('nomeUsuario', '${usuario}')
                    const url = localStorage.getItem('urlPretendida') || 'menu.html'
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

app.post('/finalizar-reserva', async (req, res) => {
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

app.get('/sessao.html', (req, res) => {
    if (usuarioLogado) res.sendFile(path.join(__dirname, 'sessao.html'))
    else res.redirect('/login.html')
})

app.get('/assentos.html', (req, res) => {
    if (usuarioLogado) res.sendFile(path.join(__dirname, 'assentos.html'))
    else res.redirect('/login.html')
})

app.get('/ingressos.html', (req, res) => {
    if (usuarioLogado) res.sendFile(path.join(__dirname, 'ingressos.html'))
    else res.redirect('/login.html')
})

app.use(express.static(__dirname))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'))
})

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'))
})

app.get('/cadastro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'cadastro.html'))
})

app.get('/em-breve.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'em-breve.html'))
})

app.get('/sessoes-vip.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sessoes-vip.html'))
})

app.get('/nossos-cinemas.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'nossos-cinemas.html'))
})

app.get('/promocoes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'promocoes.html'))
})

app.get('/precos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'precos.html'))
})

const PORT = 4000
app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:' + PORT)
})