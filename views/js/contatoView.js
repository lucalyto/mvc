
(function() {
    emailjs.init("OZggRxusa8DQ5K1re") 
})();

document.getElementById('meuFormulario').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    emailjs.sendForm('service_vh17aoa', 'template_u9po4ep', this)
        .then(function() {
            document.getElementById('meuFormulario').reset()
        }, function(error) {
        })
})