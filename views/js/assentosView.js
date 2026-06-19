var precoPorAssento = 36.00; 
var filmeAtual = "";
const baseUrl = 'https://mvc-3rqy.onrender.com';

window.onload = async function() {
    var parametros = new URLSearchParams(window.location.search);
    filmeAtual = parametros.get('filme');
    var salaAtual = parametros.get('sala');

    document.getElementById('displayFilme').innerText = filmeAtual;
    document.getElementById('displayHora').innerText = parametros.get('hora');
    document.getElementById('displaySala').innerText = salaAtual;

    if (salaAtual && salaAtual.toUpperCase().includes('VIP')) {
        precoPorAssento = 76.00;

        document.body.classList.add('vip-theme');

        var elementoTela = document.getElementById('barraTela') || document.querySelector('.screen') || document.querySelector('.tela');
        if (elementoTela) {
            elementoTela.style.background = '#c19b33';
            elementoTela.style.backgroundColor = '#c19b33';
            elementoTela.style.boxShadow = '0 4px 20px rgba(193, 155, 51, 0.7)';
        }

        var badgeSala = document.getElementById('displaySala');
        if (badgeSala) {
            badgeSala.style.backgroundColor = '#c19b33';
            badgeSala.style.color = '#050505';
            badgeSala.style.padding = '4px 8px';
            badgeSala.style.borderRadius = '4px';
        }

        var badgeHora = document.getElementById('displayHora');
        if (badgeHora && badgeHora.parentElement) {
            badgeHora.parentElement.style.borderColor = '#c19b33';
            badgeHora.parentElement.style.color = '#c19b33';
            var iconeRelogio = badgeHora.parentElement.querySelector('i');
            if (iconeRelogio) {
                iconeRelogio.style.color = '#c19b33';
            }
        }

        var contadorTexto = document.getElementById('seatCount');
        if (contadorTexto) {
            contadorTexto.style.color = '#c19b33';
        }

        var precoTexto = document.getElementById('totalPrice');
        if (precoTexto) {
            precoTexto.style.color = '#ffffff';
            precoTexto.style.textShadow = 'none';
        }

        var botaoConfirmar = document.querySelector('.btn-finalizar') || document.querySelector('.btn-confirmar') || document.querySelector('button[onclick*="finalizarReserva"]');
        if (botaoConfirmar) {
            botaoConfirmar.style.backgroundColor = '#c19b33';
            botaoConfirmar.style.color = '#050505';
            botaoConfirmar.style.border = 'none';
            botaoConfirmar.style.fontWeight = '800';

            botaoConfirmar.onmouseenter = function() { this.style.backgroundColor = '#ffffff'; };
            botaoConfirmar.onmouseleave = function() { this.style.backgroundColor = '#c19b33'; };
        }
    } else {
        precoPorAssento = 36.00;
        document.body.classList.remove('vip-theme');
    }
    
    await carregarEMapearAssentos();
};

async function carregarEMapearAssentos() {
    var assentosOcupados = [];
    try {
        var response = await fetch(`${baseUrl}/assentos-ocupados?filme=` + encodeURIComponent(filmeAtual));
        if (response.ok) {
            var dadosBrutos = await response.json(); 
            
            assentosOcupados = dadosBrutos.join(',').split(',').map(function(a) {
                return a.trim();
            });
            
        }
    } catch (error) {
        console.error("Erro ao buscar assentos do banco:", error);
    }

    var grid = document.getElementById('seatsGrid');
    grid.innerHTML = "";
    var letras = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (var i = 0; i < letras.length; i++) {
        var linhaDiv = document.createElement('div');
        linhaDiv.className = 'row';
        
        for (var j = 1; j <= 10; j++) {
            var assento = document.createElement('div');
            assento.className = 'seat';
            var nomeAssento = letras[i] + j;
            assento.innerText = nomeAssento;

            if (assentosOcupados.includes(nomeAssento)) {
                assento.className = 'seat occupied';
            } else { 
                assento.onclick = function() {
                    clicarNoAssento(this);
                };
            }
            linhaDiv.appendChild(assento);
        }
        grid.appendChild(linhaDiv);
    }
}

function clicarNoAssento(elemento) {
    if (elemento.classList.contains('selected')) {
        elemento.classList.remove('selected');
    } else {
        elemento.classList.add('selected');
    }
    var listaDeSelecionados = document.querySelectorAll('.seat.selected');
    var quantity = listaDeSelecionados.length;
    var conta = quantity * precoPorAssento;
    var totalFormatado = conta.toFixed(2);
    document.getElementById('seatCount').innerText = quantity + " Assento(s) selecionado(s)";
    document.getElementById('totalPrice').innerText = "R$ " + totalFormatado.replace('.', ',');
}

function finalizarReserva() {
    var selecionados = document.querySelectorAll('.seat.selected');
    if (selecionados.length === 0) {
        return;
    }

    var assentosArray = [];
    for (var i = 0; i < selecionados.length; i++) {
        assentosArray.push(selecionados[i].innerText);
    }

    var filme = document.getElementById('displayFilme').innerText;
    var hora = document.getElementById('displayHora').innerText;
    var sala = document.getElementById('displaySala').innerText;

    var destino = "./ingressos.html?filme=" + encodeURIComponent(filme) + 
                  "&hora=" + encodeURIComponent(hora) + 
                  "&sala=" + encodeURIComponent(sala) +  
                  "&assentos=" + encodeURIComponent(assentosArray.join(','));
                  
    window.location.href = destino;
}