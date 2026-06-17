const baseUrl = 'https://mvc-3rqy.onrender.com';
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const filme = urlParams.get('filme');
    const hora = urlParams.get('hora');
    const sala = urlParams.get('sala');
    const assentos = urlParams.get('assentos');
    

    if (filme) document.getElementById('resumoFilme').innerText = filme;
    if (hora) document.getElementById('resumoHora').innerText = hora;
    if (sala) document.getElementById('resumoSala').innerText = sala;
    if (assentos) document.getElementById('resumoAssentos').innerText = assentos;

    if (assentos) {
        const qtdAssentos = assentos.split(',').length;
        
        let precoUnitario = 36.00;

        if (sala && sala.toUpperCase().includes('VIP')) {
            precoUnitario = 76.00;

            const checkoutStep = document.getElementById('checkoutStep');
            const iconAssento = document.getElementById('iconAssento');
            const summaryBox = document.getElementById('summaryBox');
            const btnPay = document.getElementById('btnPay');

            if (checkoutStep) checkoutStep.style.color = '#c19b33';
            if (iconAssento) iconAssento.style.color = '#c19b33';
            if (summaryBox) summaryBox.classList.add('vip-summary');
            if (btnPay) btnPay.classList.add('btn-vip-pay');
        }

        const total = (qtdAssentos * precoUnitario).toFixed(2).replace('.', ',');
        document.getElementById('resumoTotal').innerText = `R$ ${total}`;
    }
};

async function pagar() {
    const urlParams = new URLSearchParams(window.location.search);

    const dadosReserva = {
        usuario: localStorage.getItem('nomeUsuario'),
        filme: urlParams.get('filme'),
        assentos: urlParams.get('assentos')
    };

    if (!dadosReserva.usuario || !dadosReserva.filme || !dadosReserva.assentos) {
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/finalizar-reserva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosReserva)
        });

        if (response.ok) {
            window.location.href = "./menu.html";
        } else {
            const erroMsg = await response.text();
        }
    } catch (err) {
        console.error(err);
    }
}