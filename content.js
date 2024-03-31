document.addEventListener("keydown", function(event) {
    fetch(chrome.runtime.getURL('testGPT.csv'))
        .then(response => response.text())
        .then(csvContent => {

            var standardMessage = "\n\nSupport: jvnogueira2010@gmail.com";
            var index = 0;
            var arrayStorage = []; // Variável arrayStorage definida aqui para estar acessível em todo o escopo de percorrer

            if (document.location.href.includes('openai')) {
                if (event.keyCode === 113) {
                    var question = confirm("Começar automação?" + standardMessage)
                    if (question) {
                        getSheetDate()
                    }
                }
            }

            function getSheetDate(){
            // Pegar dados da coluna A do arquivo CSV
                    var line = index;
                    var columnA = 0;
                    var getCell = csvContent.split('\n')[line].split(';')[columnA];
                    
                    if(getCell!=""){
                        setTimeout(()=>{
                            var textArea = document.querySelectorAll("[id='prompt-textarea']")[0];
                            var eventoInput = new Event('input', { bubbles: true });
                            textArea.value = getCell;
                            // Setar dados do CSV na textArea
                            textArea.dispatchEvent(eventoInput); 
                            setTimeout(()=>{
                                document.querySelectorAll("[data-testid='send-button']")[0].click();
                                setTimeout(()=>{
                                    waitAnswerComplete(getCell)
                                },3000)
                            },1000)
                        },3000)
                    }else{
                        // Criar o conteúdo do TXT
                        var txtContent = "\uFEFFQuestion;Answer\n";
                        arrayStorage.forEach(function (item) {
                        txtContent += item.getCell + ";" + item.currentMessage + "\n";
                        });
                        // Criar um Blob com o conteúdo do TXT
                        var blob = new Blob([txtContent], { type: "text/csv" });
                        // Criar um link para o Blob
                        var link = document.createElement("a");
                        link.href = window.URL.createObjectURL(blob);
                        // Definir o nome do arquivo
                        link.download = "listStorage.csv";
                        // Adicionar o link à página e clicar automaticamente para iniciar o download
                        document.body.appendChild(link);
                        link.click();
                        // Remover o link da página
                        document.body.removeChild(link);
                    }
            }

// Dar F2 > Pausa 3 > Setar dados na textArea > Pausa 1 > Clicar no botão enviar > Pausa 3 > Aguardar que a atual resposta seja igual a resposta anterior > Pausa 3 > Armazenar a resposta no Array > Pausa 3 > Setar dados na textArea

   

function waitAnswerComplete(getCell) {
    var lastIndex = document.querySelectorAll("[data-message-author-role='assistant']").length;
    var lastMessageElement = document.querySelectorAll("[data-message-author-role='assistant']")[lastIndex - 1]; // Seleciona o elemento da mensagem
    var initialMessage = lastMessageElement.textContent; // Obtém o conteúdo inicial da mensagem

    // Espera até que a mensagem seja totalmente carregada
    var checkMessageInterval = setInterval(function() {
            var currentMessage = lastMessageElement.textContent; // Obtém a mensagem atualizada
            if (currentMessage === initialMessage) { // Verifica se a mensagem foi carregada completamente
                clearInterval(checkMessageInterval);
                clearInterval(teste)
                var getMessage = { currentMessage, getCell };
                arrayStorage.push(getMessage);
                index++
                getSheetDate()
            }else{
                var teste = setInterval(function() {
                clearInterval(teste)
                clearInterval(checkMessageInterval)
                waitAnswerComplete(getCell)
            }, 1000); 
            }
    }, 3000); // Verifica a cada segundo
}

            
        });
    });
