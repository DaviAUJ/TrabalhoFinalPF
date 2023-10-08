// funcoes importates para o jogo
import { editarmatriz, randint } from "./moduloAuxiliar.js"

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

    elemento.firstChild.innerHTML = bombasAdj
    elemento.setAttribute("class", "verificado") // classe necessaria, se ela não existe nn teria como saber 
                                                 // se o quadrado já foi verificado criando um loop infinito

    // Caso seja a casa tenha zero bombas ao redor a função vai se replicar nos quadrados proximos até encontrar um quadrado com 
    
    // mais de uma bomba proxima
    if(bombasAdj == 0) {
        elemento.style.backgroundColor = "#FFFFFF"
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
export const colocarbombas = (matriz) =>(nbombas)=>(contagem=1)=>{
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
    elementoBandeiras.textContent = `🚩: ${num}`
}



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
}



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
}