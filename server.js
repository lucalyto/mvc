const express = require('express');
const cors = require('cors'); 
const app = express();
const rotasCinema = require('./routes');

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/', rotasCinema)

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'menu.html'))
// })

// app.get('/:page.html', (req, res) => {
//     const page = req.params.page
//     res.sendFile(path.join(__dirname, 'views', `${page}.html`))
// })

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});