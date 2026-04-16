let portaPremiada = 2;

function jogar(escolha){

 let imagemClicada = document.getElementById("p" + escolha)
let texto = document.getElementById("mensagem")

if (escolha === portaPremiada) {
        imagemClicada.src= "hogwarts.jpg"
      texto.innerText= "PARABÉNS! Você chegou a Hogwarts!"
        texto.style.color= "#2ecc71"

    } else if (escolha === 1) {
    imagemClicada.src= "carro.jpg"
        texto.innerText = "Você perdeu seu trem! Vá de carro voador!"
        texto.style.color = "#d81600"
    } 

 else {
        imagemClicada.src= "harryroom.png"
   texto.innerText = "Você perdeu seu trem! Tente ano que vem!"
        texto.style.color = "#eb1801"
    }

}