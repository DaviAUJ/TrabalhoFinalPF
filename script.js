// Gera um número aleatório entre min e max, btw essa func não é pura
const randint = (min) => (max) => Math.floor(Math.random() * (max - min + 1) + min)

const divisaoInteira = (dividendo) => (divisor) => Math.floor(dividendo / divisor)

// Cria elemento com já uma ID, este foi o melhor jeito de fazer que achei de fazer os dois ao mesmo tempo sem furar o paradigma
const criarElemComID = (tipo) => (id) => Object.assign(document.createElement("div"), {id: id})



const mostrarNumero = (elemento) => (matriz) => {
    const verificar = (id) => (matriz) =>(contbomba=0)=>(contagem=0) => {
        const idarray = id.split(" ")
        //console.log(idarray)
        const ordem = [
            [0,1],
            [1,1],
            [1,0],
            [1,-1],
            [0,-1],
            [-1,-1],
            [-1,0],
            [-1,1]
        ]
        if(contagem==7)   {
            try{
                const tembomba = matriz[idarray[0]+ordem[contagem][0]][idarray[1]+ordem[contagem][1]] 
                return contbomba+tembomba
            }finally{
            return contbomba
            }
        }
    
        try{
            const tembomba = matriz[idarray[0]+ordem[contagem][0]][idarray[1]+ordem[contagem][1]]
            console.log(tembomba)
            verificar(id)(matriz)(contbomba+tembomba)(contagem+1)
            
        }finally{
            verificar(id)(matriz)(contbomba)(contagem+1)
        }
    }
elemento.innerHTML = verificar(elemento.id)(matriz)()()
}

// Essa função é usada para carregar os N quadrados para formar a grade do campo minado
// para não ter que escrever N DIVs no código HTML
const carregar = (elementoHTML) => (dimensao) => (cont=0) => {
    if(cont == dimensao ** 2) { return }


    
    //Define o elemento com ID baseado na coordenada
    const novoElem = criarElemComID("div")(`${divisaoInteira(cont)(dimensao)} ${(cont) % dimensao}`)

    // Insere o novo elemento dentro do elemento passado como parametro
    novoElem.addEventListener("click",mostrarNumero(novoElem)(teste))
    elementoHTML.appendChild(novoElem)

    carregar(elementoHTML)(dimensao)(cont + 1)
}


// TODO = a fazer
// TODO: uma forma de fazer essa função ser pura pq nn consegui fazer usando sistema de seed, ent o jeito é usar randint()
// TODO: também tentar fazer uma forma de fazer com o tanto de bombas sejam uniformes pq do jeito q tá fica variando, 10 - 20%, 20 - 25%, 30 - 30%
//       se o cara der azar pode até pegar um campo inteiro
// TODO: Fazer uma forma de o quadrado que o jogador clicar seja livre de bombas e que seus quadrados vizinhos tbm não tenham
// TODO: tentar fazer uma forma de que bombas nunca façam um anel, onde a quadrado do meio fique isolado
//       Esse nn tem tanta urgencia pq no original isso podia acontecer

// Função usada para gerar uma matriz que representa o campo no código, 1 para bombas, 0 para espaços vazia, vou dormir agora boa noite
const criarMatrizDoCampo = (dimensao) => (percentual) => (cont=1) => {
    const gerarLinha = (tamanho) => (percentual) => (cont=1) => {
        if(cont == tamanho) {
            if(randint(1)(100) > percentual) {
                return [ 0 ]
            }
            
            return [ 1 ]
        }
        
        if(randint(1)(100) > percentual) {
            return [ 0, ...gerarLinha(tamanho)(percentual)(cont + 1) ]
        }
        
        return [ 1, ...gerarLinha(tamanho)(percentual)(cont + 1) ]
    }
    
    if(dimensao == cont) { return [ gerarLinha(dimensao)(percentual)() ] }
    
    return [ gerarLinha(dimensao)(percentual)(), ...criarMatrizDoCampo(dimensao)(percentual)(cont + 1)]
}



// Reutilização de carregar 
const carregarCampo = carregar(document.getElementById("campo"))

// Função usada nos botões de dificuldade para escolher a dificuldade
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


const teste = criarMatrizDoCampo(10)(20)()