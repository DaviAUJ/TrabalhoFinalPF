// funcoes importates para o jogo
import { editarmatriz, randint, timer } from "./moduloAuxiliar.js"

// Cria a matriz do campo, que é a representação dele no código usando 1 para bombas e 0 para espaços vazios
export const criarMatrizDoCampo = (dimensao) => (cont=1) => {
    const gerarLinha = (tamanho) => (cont=1) => {
        if(cont == tamanho) {  
            return [ 0 ]
        }
        
        return [ 0, ...gerarLinha(tamanho)(cont + 1) ]
    }
    
    if(dimensao == cont) { return [ gerarLinha(dimensao)() ] }
    
    return [ gerarLinha(dimensao)(), ...criarMatrizDoCampo(dimensao)(cont + 1)]
}



// Essa função basicamente se resume ao clique, ele verifica quantas bombas tem ao redor, dps 
// espalha ela mesmo caso o quadrado clicado seja 0, fazendo um efeito dominó até encontrar uma casa com pelo menos uma bomba ao redor
export const mostrarNumero = (elemento) => (matriz) => (cont=0) => {
    // Esta função é usada para "olhar" quantas bombas existem ao redor de um certo quadrado
    const verificar = (id) => (matriz) => (contagem=0) => {
        const coordx = parseInt(id.split(' ')[0]) // Formatação da coordenada x
        const coordy = parseInt(id.split(' ')[1]) // Formatação da coordenada y

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

        // Para acessar a matriz a ordem das coordenadas é (Y, X)

        // try catch usado para saber se o jogador clicou em alguma aresta/canto
        if(contagem==7)   {
            try{
                const tembomba = matriz[coordy + ordem[contagem][1]][coordx + ordem[contagem][0]]
                
                if(typeof tembomba == "undefined") { return 0 } // tive que fazer essa gambiarra aqui desculpa

                return tembomba

            }catch(err){
                return 0 

            }
        }
    
        try{
            const tembomba = matriz[coordy + ordem[contagem][1]][coordx + ordem[contagem][0]]
            
            if(typeof tembomba == "undefined") { return verificar(id)(matriz)(contagem+1) } // aqui tbm

            return verificar(id)(matriz)(contagem+1) + tembomba
            
        }catch(err){
            return verificar(id)(matriz)(contagem+1)

        }
    }
    
    const bombasAdj = verificar(elemento.id)(matriz)()

    elemento.style.backgroundColor = "#25253a"
    elemento.firstChild.innerHTML = bombasAdj
    elemento.setAttribute("class", "verificado") // classe necessaria, se ela não existe nn teria como saber se o quadrado já foi verificado criando um loop infinito
    colorirNumero(elemento)
    
    // Caso seja a casa tenha zero bombas ao redor a função vai se replicar nos quadrados proximos até encontrar um quadrado com 
    
    // mais de uma bomba proxima
    if(bombasAdj == 0) {
        elemento.firstChild.innerHTML = ''

        const coordx = parseInt(elemento.id.split(' ')[0]) // Formatação da coordenada x
        const coordy = parseInt(elemento.id.split(' ')[1]) // Formatação da coordenada y

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
    
        // try catch usado para saber se o jogador clicou em alguma aresta/canto
        if(cont == 7) {
            try {
                // Pega o quadrado adjacente da vez
                const adjacente = document.getElementById(`${coordx + ordem[cont][0]} ${coordy + ordem[cont][1]}`)

                if(adjacente.className != "verificado") { mostrarNumero(adjacente)(matriz)(0) }

                return

            } catch(err) { return }
            
        }

        try{
            // Pega o quadrado adjacente da vez
            const adjacente = document.getElementById(`${coordx + ordem[cont][0]} ${coordy + ordem[cont][1]}`)

            if(adjacente.className != "verificado") { mostrarNumero(adjacente)(matriz)(0) }

            mostrarNumero(elemento)(matriz)(cont + 1)

        } catch(err) {
            mostrarNumero(elemento)(matriz)(cont + 1)

        }
    }
}



// Não consegui fazer de um jeito funcional usando sistema de seed
// funcao que server pra posicionar as bombas em locais aleatorios
export const colocarbombas = (matriz) => (nbombas) => (contagem=1) => {
    const x = randint(0)(matriz.length-1)
    const y = randint(0)(matriz.length-1)

    if(nbombas==contagem) {
        if(matriz[y][x]==0 && typeof matriz[y][x] != 'string'){return editarmatriz(matriz)(x)(y)(1)}

        else {return colocarbombas(matriz)(nbombas)(contagem)}
    }
    if(matriz[y][x]==0 && typeof matriz[y][x] != 'string'){return colocarbombas(editarmatriz(matriz)(x)(y)(1))(nbombas)(contagem+1)}
    else {return colocarbombas(matriz)(nbombas)(contagem)}

}



//atualizar a exibição do contador
export function atualizarNumeroDeBandeiras(num) {
    const elementoBandeiras = document.getElementById("bandeiraF")
    elementoBandeiras.textContent = `🚩 ${num}`
}



// Função para determinar o fim de jogo, quando o jogador perde
export const gameOver = (matriz) => {
    const campo = document.getElementById("campo")
    const filhos = campo.children
    const bandeiras = document.getElementById("bandeiraF")
    const botaoReiniciar = document.getElementById("btnDific")

    bandeiras.innerHTML = "🤓" // Nerd
    botaoReiniciar.innerHTML = "Reiniciar"

    // Coloca emoji de bombas onde tem bomba e tira eventListener
    const aux = ([x, ...xs]) => {
        const coordx = parseInt(x.id.split(' ')[0]) // Formatação da coordenada x
        const coordy = parseInt(x.id.split(' ')[1]) // Formatação da coordenada y

        if(xs.length === 0) { 
            if(matriz[coordy][coordx] === 1) {
                x.firstChild.innerHTML = "💣"
            }

            // Gambiarra pra remover EventListener
            x.replaceWith(x.cloneNode(true))

            return
        }
        
        if(matriz[coordy][coordx] === 1) {
            x.firstChild.innerHTML = "💣"
        }

        // Gambiarra pra remover EventListener
        x.replaceWith(x.cloneNode(true))
        
        aux(xs)
    }

    aux(filhos)

    clearInterval(timer) // Para o timer
}



// Função para determinar o fim de jogo, quando o jogador ganha
export const win = (matriz) => {
    const campo = document.getElementById("campo")
    const filhos = campo.children
    const bandeiras = document.getElementById("bandeiraF")
    const botaoReiniciar = document.getElementById("btnDific")

    bandeiras.innerHTML = "😎"
    botaoReiniciar.innerHTML = "Reiniciar"

    // Coloca emoji de trofeu onde tem bandeira e tira eventListener
    const aux = ([x, ...xs]) => {
        const coordx = parseInt(x.id.split(' ')[0]) // Formatação da coordenada x
        const coordy = parseInt(x.id.split(' ')[1]) // Formatação da coordenada y

        if(xs.length === 0) { 
            if(matriz[coordy][coordx] === 1) {
                x.firstChild.innerHTML = "🏆"
            }

            // Gambiarra pra remover EventListener
            x.replaceWith(x.cloneNode(true))

            return
        }
        
        if(matriz[coordy][coordx] === 1) {
            x.firstChild.innerHTML = "🏆"
        }

        // Gambiarra pra remover EventListener
        x.replaceWith(x.cloneNode(true))
        
        aux(xs)
    }

    aux(filhos)

    clearInterval(timer) // Para o timer
}



// Função para colorir os números dentro das celulas conforme seu número
export const colorirNumero = (elem) => {
    // Códigos hex das cores em ordem de 1-8
    const listaCor = [
        "1C7290",
        "21901C",
        "901C1C",
        "3F51AD",
        "90641C",
        "1C9084",
        "1A5921",
        "727777"
    ]

    // Pega o texto
    const num = parseInt(elem.firstChild.innerHTML)

    if(num !== 0) {
        // Muda a cor dele
        elem.firstChild.style.color = `#${listaCor[num - 1]}`
    }
}



// Cria área de isenção 3x3 onde o jogador clica pela primeira vez determinado por um 0 string
// Eles servem apenas para a função de colocarbombas saber onde ela nn deve colocar
export const criarAreaDeIsencao = (elem) => (matriz) => (cont=0) => {
    const coordx = parseInt(elem.id.split(' ')[0]) // Formatação da coordenada x
    const coordy = parseInt(elem.id.split(' ')[1]) // Formatação da coordenada y

    const ordem = [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
        [-1, 0],
        [-1, 1]
    ]

    // try catch usado para saber se o jogador clicou em alguma aresta/canto
    try {
        if(cont === 8) { return editarmatriz(matriz)(coordx + ordem[cont][0])(coordy + ordem[cont][1])('0') }
    
        return criarAreaDeIsencao(elem)(editarmatriz(matriz)(coordx + ordem[cont][0])(coordy + ordem[cont][1])('0'))(cont + 1)

    } catch(err) {
        if(cont === 8) { return matriz}

        return criarAreaDeIsencao(elem)(matriz)(cont + 1)
    }
    
}



// Remove os zeros string para poder a lógica do resto do código funcionar
export const removerAreaDeIsencao = (matriz) => {
    // Percorre a matriz toda, se encontrar um '0' ele troca por um 0 número
    return matriz.map(
        (lista) => {
            return lista.map(
                (item) => item === '0' ? 0 : item
            )
        }
    )
}