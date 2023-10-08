// funcoes não tao relacionadas com o jogo em si


export const editarmatriz = (matriz)=>(coodx)=>(coody)=>(novoelem)=>{
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



// retorna um true se todos os filhos de um elemento estão sem classe, caso pelo menos um tenha ele retorna false
export const quantosFilhosComAClasse = (elem) => (nomeClasse) => {
    const listaFilhos = [...elem.children] // precisa fazer uma copia aqui senao nao funciona
    const temp = listaFilhos.filter(
        (x) => x.className == nomeClasse
    )

    return temp.length
}



// Gera um número aleatório entre min e max, btw essa func não é pura
export const randint = (min) => (max) => Math.floor(Math.random() * (max - min + 1) + min)



// Autoexplicativo
export const divisaoInteira = (dividendo) => (divisor) => Math.floor(dividendo / divisor)



// Cria elemento com já uma ID, este foi o melhor jeito de fazer que achei de fazer os dois ao mesmo tempo sem furar o paradigma
export const criarElemComID = (tipo) => (id) => Object.assign(document.createElement(tipo), {id: id})



//timer: infelizmente não é possivel fazer de forma funcional. utilizei o setInterval()
var timer;
var ele = document.getElementById('timer');

(function () {
  var sec = 0
  timer = setInterval(() => {
    var minutos = Math.floor(sec / 60) // calcula os minutos
    var segundos = sec % 60 // calcula os segundos

    // formatação para exibir minutos e segundos com dois dígitos cada
    var tempoFormat = String(minutos).padStart(2, '0') + ':' + String(segundos).padStart(2, '0')
    ele.innerHTML = tempoFormat

    sec++
  }, 1000)
})();



export const compararLista = (lista1) => (lista2) => JSON.stringify(lista1) === JSON.stringify(lista2)