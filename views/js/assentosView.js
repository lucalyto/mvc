var precoPorAssento = 42.00;
var filmeAtual = "";

window.onload = async function() {
    var parametros = new URLSearchParams(window.location.search);
    filmeAtual = parametros.get('filme');
    
    document.getElementById('displayFilme').innerText = filmeAtual;
    document.getElementById('displayHora').innerText = parametros.get('hora');
    document.getElementById('displaySala').innerText = parametros.get('sala');
    
    await carregarEMapearAssentos();
};

async function carregarEMapearAssentos() {
    var assentosOcupados = [];
    try {
        var response = await fetch('/assentos-ocupados?filme=' + encodeURIComponent(filmeAtual));
        if (response.ok) {
    
            var dadosBrutos = await response.json(); 
            
            assentosOcupados = dadosBrutos.join(',').split(',').map(function(a) {
                return a.trim();
            });
            
            console.log("Assentos processados com sucesso:", assentosOcupados);
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
        alert("Selecione pelo menos um assento!");
        return;
    }

    var assentosArray = [];
    for (var i = 0; i < selecionados.length; i++) {
        assentosArray.push(selecionados[i].innerText);
    }

    var filme = document.getElementById('displayFilme').innerText;
    var hora = document.getElementById('displayHora').innerText;
    var sala = document.getElementById('displaySala').innerText;

    var destino = "ingressos.html?filme=" + encodeURIComponent(filme) + 
                  "&hora=" + encodeURIComponent(hora) + 
                  "&sala=" + encodeURIComponent(sala) + 
                  "&assentos=" + encodeURIComponent(assentosArray.join(','));
                  
    window.location.href = destino;
}