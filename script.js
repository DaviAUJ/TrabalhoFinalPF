// Gera um número aleatório entre min e max, btw essa func não é pura
const randint = (min) => (max) => Math.floor(Math.random() * (max - min + 1) + min)

// Autoexplicativo
const divisaoInteira = (dividendo) => (divisor) => Math.floor(dividendo / divisor)

// Cria elemento com já uma ID, este foi o melhor jeito de fazer que achei de fazer os dois ao mesmo tempo sem furar o paradigma
const criarElemComID = (tipo) => (id) => Object.assign(document.createElement(tipo), {id: id})


const editarmatriz = (matriz)=>(coodx)=>(coody)=>(novoelem)=>{
    return matriz.map(
        (elem,index)=>{
            if(index==coody){
                return elem.map(
                    (elem2,index2)=>{
                        if(index2 == coodx){
                            return novoelem
                        }else {return elem2}
                    }
                )
            }else {return elem}
        }
    )
}

// Cria a matriz do campo, que é a representação dele no código usando 1 para bombas e 0 para espaços vazios
// Não consegui fazer de um jeito funcional usando sistema de seed
const criarMatrizDoCampo = (dimensao) => (cont=1) => {
    const gerarLinha = (tamanho) => (cont=1) => {
        if(cont == tamanho) {  
            return [ 0 ]
        }
        
        return [ 0, ...gerarLinha(tamanho)(cont + 1) ]
    }
    
    if(dimensao == cont) { return [ gerarLinha(dimensao)() ] }
    
    return [ gerarLinha(dimensao)(), ...criarMatrizDoCampo(dimensao)(cont + 1)]
}


const colocarbombas = (matriz) =>(nbombas)=>(contagem=1)=>{
    const x = randint(0)(matriz.length-1)
    const y = randint(0)(matriz.length-1)
    if(nbombas==contagem) {
        if(matriz[y][x]==0){return editarmatriz(matriz)(x)(y)(1)}

        else if (matriz[y][x]==1){return colocarbombas(matriz)(nbombas)(contagem)}
    }
    if(matriz[y][x]==0){return colocarbombas(editarmatriz(matriz)(x)(y)(1))(nbombas)(contagem+1)}
    else if (matriz[y][x]==1){return colocarbombas(matriz)(nbombas)(contagem)}

}

// Essa função basicamente se resume ao clique, ele verifica quantas bombas tem ao redor, dps 
// espalha ela mesmo caso o quadrado clicado seja 0, fazendo um efeito dominó até encontrar uma casa com pelo menos uma bomba ao redor
const mostrarNumero = (elemento) => (matriz) => (cont=0) => () => {
    // Esta função é usada para "olhar" quantas bombas existem ao redor de um certo quadrado
    const verificar = (id) => (matriz) => (contagem=0) => {
        const idint = [ parseInt(id[0]), parseInt(id[2]) ]

        // Ordem de checagem
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
                const tembomba = matriz[idint[1]+ordem[contagem][1]][idint[0]+ordem[contagem][0]]
                
                if(typeof tembomba == "undefined") { return 0 } // tive que fazer essa gambiarra aqui desculpa

                return tembomba

            }catch(err){
                return 0

            }
        }
    
        try{
            const tembomba = matriz[idint[1]+ordem[contagem][1]][idint[0]+ordem[contagem][0]]
            
            if(typeof tembomba == "undefined") { return verificar(id)(matriz)(contagem+1) } // aqui tbm

            return verificar(id)(matriz)(contagem+1) + tembomba
            
        }catch(err){
            return verificar(id)(matriz)(contagem+1)

        }
    }

    const bombasAdj = verificar(elemento.id)(matriz)()

    elemento.innerHTML = bombasAdj
    elemento.setAttribute("class", "verificado") // classe necessaria, se ela não existe nn teria como saber 
                                                 // se o quadrado já foi verificado criando um loop infinito

    // Caso seja a casa tenha zero bombas ao redor a função vai se replicar nos quadrados proximos até encontrar um quadrado com 
    // mais de uma bomba proxima
    if(bombasAdj == 0) {
        elemento.style.backgroundColor = "#FFFFFF"

        const idint = [ parseInt(elemento.id[0]), parseInt(elemento.id[2]) ]

        // Ordem de checagem
        const ordem = [
            [0,1],
            [1,0],
            [0,-1],
            [-1,0],
        ]
    
        if(cont == 3) {
            try {
                // Pega o quadrado adjacente da vez
                const adjacente = document.getElementById(`${idint[0] + ordem[cont][0]} ${idint[1] + ordem[cont][1]}`)

                if(adjacente.className != "verificado") { mostrarNumero(adjacente)(matriz)(0)() }

                return

            } catch(err) { return }
            
        }

        try{
            // Pega o quadrado adjacente da vez
            const adjacente = document.getElementById(`${idint[0] + ordem[cont][0]} ${idint[1] + ordem[cont][1]}`)

            if(adjacente.className != "verificado") { mostrarNumero(adjacente)(matriz)(0)() }

            mostrarNumero(elemento)(matriz)(cont + 1)()

        } catch(err) {
            mostrarNumero(elemento)(matriz)(cont + 1)()

        }
    }
}

// Essa função é usada para carregar os N quadrados para formar a grade do campo minado
// para não ter que escrever N DIVs no código HTML
const carregar = (elementoHTML) => (dimensao) => (cont=0) => {
    if(cont == dimensao ** 2) { return }

    //Define o elemento com ID baseado na coordenada
    const novoElem = criarElemComID("div")(`${(cont) % dimensao} ${divisaoInteira(cont)(dimensao)}`)

    // Insere o novo elemento dentro do elemento passado como parametro
    novoElem.addEventListener("click", mostrarNumero(novoElem)(teste)())
    elementoHTML.appendChild(novoElem)

    carregar(elementoHTML)(dimensao)(cont + 1)
}

// Reutilização de carregar 
const carregarCampo = carregar(document.getElementById("campo"))

// Função usada nos botões de dificuldade para escolher a dificuldade
// Para mudar o arquivo CSS não adianta tem que furar o paradigma
const escolherdificuldade = (id) => {
    const style =  document.documentElement.style

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

const teste = colocarbombas(criarMatrizDoCampo(10)())(10)()
console.log(teste)