// script principal
import { divisaoInteira, criarElemComID, quantosFilhosComAClasse, editarmatriz } from "./moduloAuxiliar.js"
import { criarMatrizDoCampo, colocarbombas, mostrarNumero } from "./moduloPrincipal.js"

// funcao geral para quando o jogador clicar em quadrado qualquer
// ela e usada tambem para identificar o primeiro quadrado clicado e depois criar o campo
export const clicar = (elem) => () => {
    const campo = document.getElementById("campo")
    const coordx = parseInt(elem.id[0])
    const coordy = parseInt(elem.id[2])

    // faz uma verificacao para saber se esse clique foi o primeiro
    // a area de isencao é identificado como um 2
    if(quantosFilhosComAClasse(campo)('verificado') == 0) {
        // aqui nao conseguimos fazer de uma forma funcional tivemos que usar variavel
        // a area de isencao é identificada por um 0 numa string
        matrizPrincipal = editarmatriz(matrizPrincipal)(coordx)(coordy)('0')
        
        // depois do primeiro clique ai sim coloca as bombas de acordo com a dificuldade
        if(matrizPrincipal.length == 10) { matrizPrincipal = colocarbombas(matrizPrincipal)((matrizPrincipal.length ** 2) * 0.15)() }
        else if(matrizPrincipal.length == 20) { matrizPrincipal = colocarbombas(matrizPrincipal)((matrizPrincipal.length ** 2) * 0.20)() }
        else if(matrizPrincipal.length == 30) { matrizPrincipal = colocarbombas(matrizPrincipal)((matrizPrincipal.length ** 2) * 0.25)() }

        matrizPrincipal = editarmatriz(matrizPrincipal)(coordx)(coordy)(0) // dps volta com o zero numero para nao quebrar os calculos das outras funcoes
    }
    
    console.log(matrizPrincipal)
    mostrarNumero(elem)(matrizPrincipal)()
}


// Essa função é usada para carregar os N quadrados para formar a grade do campo minado
// para não ter que escrever N DIVs no código HTML
const carregar = (elementoHTML) => (dimensao) => (cont=0) => {
    if(cont == dimensao ** 2) { return }

    //Define o elemento com ID baseado na coordenada
    const novoElem = criarElemComID("div")(`${(cont) % dimensao} ${divisaoInteira(cont)(dimensao)}`)

    // Insere o novo elemento dentro do elemento passado como parametro
    novoElem.addEventListener("click", clicar(novoElem))
    elementoHTML.appendChild(novoElem)

    carregar(elementoHTML)(dimensao)(cont + 1)
}

// Reutilização de carregar 
const carregarCampo = carregar(document.getElementById("campo"))

// Função usada nos botões de dificuldade para escolher a dificuldade
// Para mudar o arquivo CSS não adianta tem que furar o paradigma
const escolherdificuldade = (id) => {
    const style = document.documentElement.style

    if (id == "facil")  {
        carregarCampo(10)() 
        style.setProperty("--dimensao", 10)

    } else if (id == "intermediario") {
        carregarCampo(20)() 
        style.setProperty("--dimensao", 20)

    } else if (id == "dificil") {
        carregarCampo(30)() 
        style.setProperty("--dimensao", 30)

    }

    document.getElementById("menu").style.visibility ="hidden"
    document.getElementById("campo").style.visibility="visible"
}

window.escolherdificuldade = escolherdificuldade // precisa ser feito isso para onclick no html funcionar

// a gente nao acho uma forma de criar uma area de isencao sem quebrar o paradigma
// e para isso e preciso declarar essa variavel
let matrizPrincipal = criarMatrizDoCampo(10)()
