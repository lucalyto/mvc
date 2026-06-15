var programacao = {
    "Mario Galaxy": { sala: "SALA 01 VIP EXPERIENCE", horarios: ["22:45"] },
    "Eles Vao Te Matar": { sala: "SALA 02 VIP EXPERIENCE", horarios: ["19:45"] },
    "Velhos Bandidos": { sala: "SALA 03", horarios: ["19:00"] },
    "Uma Segunda Chance": { sala: "SALA 04 KIDS", horarios: ["16:30"] },
    "Nuremberg": { sala: "SALA 05", horarios: ["00:00"] },
    "Maldição da Múmia": { sala: "SALA 06", horarios: ["21:00"] }
};

window.onload = function() {
    var parametros = new URLSearchParams(window.location.search)
    var filmeNome = parametros.get('filme')

    var titulo = document.getElementById('exibicaoTitulo')
    var sala = document.getElementById('exibicaoSala')
    var divBotoes = document.getElementById('containerHorarios')

    var dadosDoFilme = programacao[filmeNome]

    if (dadosDoFilme) {
        titulo.innerText = filmeNome;
        sala.innerText = dadosDoFilme.sala
        divBotoes.innerHTML = ""

        for (var i = 0; i < dadosDoFilme.horarios.length; i++) {
            var hora = dadosDoFilme.horarios[i]

            var botao = document.createElement('a')
            botao.className = "btn-horario"

            botao.href = "assentos.html?filme=" + encodeURIComponent(filmeNome) + "&hora=" + hora + "&sala=" + encodeURIComponent(dadosDoFilme.sala)
            botao.innerText = hora

            divBotoes.appendChild(botao)
        }
    } else {
        titulo.innerText = "Filme não encontrado"
        sala.innerText = "-"
        divBotoes.innerHTML = "<p class='text-danger'>Selecione um filme válido no menu anterior.</p>"
    }
}