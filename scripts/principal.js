// script principal
import { divisaoInteira, criarElemComID, quantosFilhosComAClasse, editarmatriz, compararLista, iniciarTimer } from "./moduloAuxiliar.js"
import { criarMatrizDoCampo, colocarbombas, mostrarNumero, atualizarNumeroDeBandeiras, gameOver, win, criarAreaDeIsencao, removerAreaDeIsencao } from "./moduloPrincipal.js"

// Variáveis importantes para o jogo
// Acreditamos que essas aqui não sejam possíveis serem aplicadas funcionalmente
let densidadeDeBombas
let contador
let matrizPrincipal
let matrizBandeiras // funciona como a matrizPrincipal só que para bandeiras

// funcao geral para quando o jogador clicar em quadrado qualquer
// ela e usada tambem para identificar o primeiro quadrado clicado e depois criar o campo
const cliqueEsquerdo = (elem) => () => {
    const campo = document.getElementById("campo")
    const coordx = parseInt(elem.id.split(' ')[0]) // Formatação da coordenada x
    const coordy = parseInt(elem.id.split(' ')[1]) // Formatação da coordenada y
    const textoDiv = elem.firstChild

    // faz uma verificacao para saber se esse clique foi o primeiro
    // a area de isencao é identificado como um 2
    if(quantosFilhosComAClasse(campo)('verificado') == 0) {
        // a area de isencao é identificada por um 0 numa string
        matrizPrincipal = criarAreaDeIsencao(elem)(matrizPrincipal)()
        
        // depois do primeiro clique ai sim coloca as bombas de acordo com a dificuldade
        matrizPrincipal = colocarbombas(matrizPrincipal)(densidadeDeBombas)()

        // dps volta com o zero numero para nao quebrar os calculos das outras funcoes
        matrizPrincipal = removerAreaDeIsencao(matrizPrincipal) 
    }
    
    // Verifica se a celula clicada é uma bomba
    if(matrizPrincipal[coordy][coordx] === 1) {
        gameOver(matrizPrincipal) // Função da derrota

    // Impede que o jogador clique em uma celula com bandeira
    } else if(textoDiv.innerHTML !== '🚩') {
        mostrarNumero(elem)(matrizPrincipal)() 
    }
}

// Função usada para definir as ações do botão direito
const cliqueDireito = (elem) => {
    const coordx = parseInt(elem.id.split(' ')[0]) // Formatação da coordenada x
    const coordy = parseInt(elem.id.split(' ')[1]) // Formatação da coordenada y
    const textoDiv = elem.firstChild

    if(textoDiv.innerHTML == '' && contador > 0) {
        textoDiv.innerHTML = "🚩"

        // Salvar posição na matriz de bandeiras
        matrizBandeiras = editarmatriz(matrizBandeiras)(coordx)(coordy)(1)

        // Decrementa do contador
        contador--

    } else if(textoDiv.innerHTML == '🚩') {
        textoDiv.innerHTML = ''

        // Tirar posição na matriz de bandeiras
        matrizBandeiras = editarmatriz(matrizBandeiras)(coordx)(coordy)(0)

        // Adicione de volta ao contador
        contador++
    }

    //atualize a exibição do contador
    atualizarNumeroDeBandeiras(contador)
    
    if(compararLista(matrizBandeiras)(matrizPrincipal)) {
        win(matrizPrincipal) // Função da vitória
    }
}

// Essa função é usada para carregar os N quadrados para formar a grade do campo minado
// para não ter que escrever N DIVs no código HTML
const carregar = (elementoHTML) => (dimensao) => (cont=0) => {
    if(cont == dimensao ** 2) { return }

    //Define o elemento com ID baseado na coordenada
    const novoElem = criarElemComID("div")(`${(cont) % dimensao} ${divisaoInteira(cont)(dimensao)}`)

    // Lugar onde o texto vai ficar armazenado
    novoElem.appendChild(criarElemComID("span")("textoCentro"))

    // Event Listener do botão esquerdo
    novoElem.addEventListener("click", cliqueEsquerdo(novoElem))
    
    //ouvinte de evento para o clique com o botão direito do mouse
    novoElem.addEventListener("contextmenu", function (event) {
        event.preventDefault()
        cliqueDireito(novoElem)
    });
    
    elementoHTML.appendChild(novoElem)
    carregar(elementoHTML)(dimensao)(cont + 1)
}

// Reutilização de carregar 
const carregarCampo = carregar(document.getElementById("campo"))

// Função usada nos botões de dificuldade para escolher a dificuldade
// Para mudar o arquivo CSS não adianta tem que furar o paradigma
const escolherdificuldade = (id) => {
    const style = document.documentElement.style

    // Ajusta o jogo conforme a dificuldade escolhida
    if (id == "facil")  {
        style.setProperty("--dimensao", 10)

        matrizPrincipal = criarMatrizDoCampo(10)()
        matrizBandeiras = criarMatrizDoCampo(10)()
        densidadeDeBombas = 15

        carregarCampo(10)() 
        
    } else if (id == "intermediario") {
        style.setProperty("--dimensao", 20)

        matrizPrincipal = criarMatrizDoCampo(20)()
        matrizBandeiras = criarMatrizDoCampo(20)()
        densidadeDeBombas = 80

        carregarCampo(20)() 

    } else if (id == "dificil") {
        style.setProperty("--dimensao", 30)

        matrizPrincipal = criarMatrizDoCampo(30)()
        matrizBandeiras = criarMatrizDoCampo(30)()
        densidadeDeBombas = 200

        carregarCampo(30)() 

    }

    // Começa com a quantidade de bandeiras igual ao tanto de bombas
    contador = densidadeDeBombas
    
    atualizarNumeroDeBandeiras(contador) // Inicialização do contador
    iniciarTimer()

    // Serve para trocar a tela de dificuldade pela tela do jogo
    document.getElementById("menu").style.visibility ="hidden"
    document.getElementById("campo").style.visibility="visible"

    document.getElementById("btnDific").style.visibility="visible"
    document.getElementById("timer").style.visibility="visible"
    document.getElementById("bandeiraF").style.visibility="visible"
}

// precisa ser feito isso para a função escolherdificuldade funcionar no onclick
window.escolherdificuldade = escolherdificuldade 
