window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search)
    const filme = urlParams.get('filme')
    const hora = urlParams.get('hora')
    const sala = urlParams.get('sala')
    const assentos = urlParams.get('assentos');

    if (filme) document.getElementById('resumoFilme').innerText = filme
    if (hora) document.getElementById('resumoHora').innerText = hora
    if (sala) document.getElementById('resumoSala').innerText = sala
    if (assentos) document.getElementById('resumoAssentos').innerText = assentos

    if (assentos) {
        const qtdAssentos = assentos.split(',').length
        const precoUnitario = 42.00
        const total = (qtdAssentos * precoUnitario).toFixed(2).replace('.', ',')
        document.getElementById('resumoTotal').innerText = `R$ ${total}`
    }
};

async function pagar() {
    const urlParams = new URLSearchParams(window.location.search)

    const dadosReserva = {
        usuario: localStorage.getItem('nomeUsuario'),
        filme: urlParams.get('filme'),
        assentos: urlParams.get('assentos')
    };

    if (!dadosReserva.usuario || !dadosReserva.filme || !dadosReserva.assentos) {
        alert("Erro: Dados da reserva incompletos.")
        return
    }

    try {
        const response = await fetch('/finalizar-reserva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosReserva)
        });

        if (response.ok) {
            alert("Reserva confirmada e salva no sistema!")
            window.location.href = "menu.html"
        } else {
            const erroMsg = await response.text()
            alert("Erro ao salvar: " + erroMsg)
        }
    } catch (err) {
        console.error(err)
        alert("Erro na conexão com o servidor.")
    }
}