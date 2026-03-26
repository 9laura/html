function jogar(escolha) {
let opcoes = ['pedra', 'papel', 'tesoura' ]
//             0          1         2
//Computador escolhendo de forma aleatória
let computador = opcoes[Math.floor(Math.random()*3)]

let resultado = ""

if (escolha == computador) {

    resultado = "Empate!"

} else if ((escolha=="pedra" && computador=="tesoura")
    
    || (escolha=="papel" && computador=="pedra")
   
    || (escolha=="tesoura" && computador=="papel")) {

    resultado = "Jogador ganhou!"
} else {
    resultado = "Computador ganhou!"
}
let resultado1 = document.getElementById("resultado")
resultado1.innerText = "Jogador: " + escolha + "| Computador: " + computador + " | = " + resultado


}

