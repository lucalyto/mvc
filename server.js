const express = require('express')
const path = require('path')
const app = express()
const rotasCinema = require('./routes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(path.join(__dirname, 'imagens')))
app.use(express.static(__dirname))

app.use('/', rotasCinema)

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'menu.html'))
// })

// app.get('/:page.html', (req, res) => {
//     const page = req.params.page
//     res.sendFile(path.join(__dirname, 'views', `${page}.html`))
// })

const PORT = 3000 
app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:' + PORT)
})