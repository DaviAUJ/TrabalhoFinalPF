const divisaoInteira = (dividendo) => (divisor) => Math.floor(dividendo / divisor)

// Cria elemento com já uma ID, este foi o melhor jeito de fazer que achei de fazer os dois ao mesmo tempo sem furar o paradigma
const criarElemComID = (tipo) => (id) => Object.assign(document.createElement("div"), {id: id})

// Essa função é usada para carregar os N quadrados para formar a grade do campo minado
// para não ter que escrever N DIVs no código HTML
const carregar = (elementoHTML) => (dimensao) => (cont=0) => {
    if(cont == dimensao ** 2) { return }

    //Define o elemento com ID baseado na coordenada
    const novoElem = criarElemComID("div")(`${divisaoInteira(cont)(dimensao)} ${(cont) % dimensao}`)

    // Insere o novo elemento dentro do elemento passado como parametro
    elementoHTML.appendChild(novoElem)

    carregar(elementoHTML)(dimensao)(cont + 1)
}

// Reutilização de carregar 
const carregarCampo = carregar(document.getElementById("campo"))


//
// Para mudar o arquivo CSS não adianta tem que furar o paradigma
const escolherdificuldade = (id) => {
    const style =  document.documentElement.style
    if (id == "facil")  {carregarCampo(10)() 
        style.setProperty("--dimensao", 10)}
    else if (id == "intermediario") {carregarCampo(20)() 
        style.setProperty("--dimensao", 20)}
    else if (id == "dificil") {carregarCampo(30)() 
        style.setProperty("--dimensao", 30)}
    document.getElementById("menu").style.visibility ="hidden"
    document.getElementById("campo").style.visibility="visible"
}

