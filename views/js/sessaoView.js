var programacao = {
    "Obsessao": { sala: "SALA 01 VIP EXPERIENCE", horarios: ["22:45"] },
    "Supergirl": { sala: "SALA 02 VIP EXPERIENCE", horarios: ["19:45"] },
    "Panico 7": { sala: "SALA 03", horarios: ["19:00"] },
    "Devoradores de Estrelas": { sala: "SALA 04 KIDS", horarios: ["16:30"] },
    "Backrooms": { sala: "SALA 05", horarios: ["00:00"] },
    "Dia D": { sala: "SALA 06", horarios: ["21:30"] },
    "Circo Digital": { sala: "SALA 07", horarios: ["19:15"] },
    "Toy Store 5": { sala: "SALA 08", horarios: ["16:45"] },
    "Diabo Veste Prada": { sala: "SALA 09", horarios: ["23:30"] },
    "Michael": { sala: "SALA 10", horarios: ["21:30"] }
};

window.onload = function() {
    var parametros = new URLSearchParams(window.location.search);
    var filmeNome = parametros.get('filme');

    var titulo = document.getElementById('exibicaoTitulo');
    var salaElemento = document.getElementById('exibicaoSala');
    var divBotoes = document.getElementById('containerHorarios');
    var pageContainer = document.getElementById('pageContainer');

    var dadosDoFilme = programacao[filmeNome];

    if (dadosDoFilme) {
        titulo.innerText = filmeNome;
        salaElemento.innerText = dadosDoFilme.sala;
        divBotoes.innerHTML = "";

        var nomeDaSala = dadosDoFilme.sala;
        if (nomeDaSala && nomeDaSala.toUpperCase().includes('VIP')) {
            pageContainer.classList.add('vip-experience');
            console.log("Experiência VIP ativada para: " + filmeNome);
        } else {
            pageContainer.classList.remove('vip-experience');
        }
        for (var i = 0; i < dadosDoFilme.horarios.length; i++) {
            var hora = dadosDoFilme.horarios[i];

            var botao = document.createElement('a');
            botao.className = "btn-horario";

            botao.href = "assentos.html?filme=" + encodeURIComponent(filmeNome) + 
                         "&hora=" + hora + 
                         "&sala=" + encodeURIComponent(dadosDoFilme.sala);
            botao.innerText = hora;

            divBotoes.appendChild(botao);
        }
    } else {
        titulo.innerText = "Filme não encontrado";
        salaElemento.innerText = "-";
        divBotoes.innerHTML = "<p class='text-danger'>Selecione um filme válido no menu anterior.</p>";
        pageContainer.classList.remove('vip-experience');
    }
};