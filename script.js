const divisaoInteira = (dividendo) => (divisor) => Math.floor(dividendo / divisor)

// Cria elemento com já uma ID, este foi o melhor jeito de fazer que achei de fazer os dois ao mesmo tempo sem furar o paradigma
const criarElemComID = (tipo) => (id) => Object.assign(document.createElement("div"), {id: id})

// Essa função é usada para carregar os N quadrados para formar a grade do campo minado
// para não ter que escrever N DIVs no código HTML
const carregar = (elementoHTML) => (dimensao) => (cont=0) => {
    if(cont == dimensao ** 2) { return }

    //Define o elemento com ID baseado na coordenada
    const novoElem = criarElemComID("div")(`${divisaoInteira(cont)(10)} ${(cont) % 10}`)

    // Insere o novo elemento dentro do elemento passado como parametro
    elementoHTML.appendChild(novoElem)

    carregar(elementoHTML)(dimensao)(cont + 1)
}

// Reutilização de carregar
const carregarCampo = carregar(document.getElementById("campo"))

// Dificudades: fácil - 10, médio - 20, dificil - 30
const dimensao = 30

// Para mudar o arquivo CSS não adianta tem que furar o paradigma
document.documentElement.style.setProperty("--dimensao", dimensao)

carregarCampo(dimensao)()
