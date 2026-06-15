
(function() {
    emailjs.init("OZggRxusa8DQ5K1re") 
})();

document.getElementById('meuFormulario').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    emailjs.sendForm('service_vh17aoa', 'template_u9po4ep', this)
        .then(function() {
            alert('Mensagem enviada com sucesso para o Gmail!')
            document.getElementById('meuFormulario').reset()
        }, function(error) {
            alert('Erro ao enviar a mensagem: ' + JSON.stringify(error))
        })
})