document.addEventListener("DOMContentLoaded", function() {
    const usuarioLogado = localStorage.getItem('usuarioLogado')
    const nomeUsuario = localStorage.getItem('nomeUsuario')

    if (usuarioLogado === 'true' && nomeUsuario) {
        const elementoNome = document.getElementById('nomeUsuarioSessao')
        if (elementoNome) {
            elementoNome.innerText = nomeUsuario.toUpperCase()
        }
    }
})

function verificarAcesso(nomeFilme) {
    console.log("Função verificarAcesso chamada para:", nomeFilme)
    const statusLogin = localStorage.getItem('usuarioLogado')

    const urlDestino = `sessao.html?filme=${encodeURIComponent(nomeFilme)}`

    if (statusLogin === 'true') {
        window.location.href = urlDestino
    } else {
        localStorage.setItem('urlPretendida', urlDestino)
        window.location.href = 'login.html'
    }
}