// funcoes importates para o jogo
import { editarmatriz, quantosFilhosComAClasse, randint } from "./moduloAuxiliar.js"

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

                if(adjacente.className != "verificado") { mostrarNumero(adjacente)(matriz)(0) }

                return

            } catch(err) { return }
            
        }

        try{
            // Pega o quadrado adjacente da vez
            const adjacente = document.getElementById(`${idint[0] + ordem[cont][0]} ${idint[1] + ordem[cont][1]}`)

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





