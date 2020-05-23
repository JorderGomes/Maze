const altura = 10, largura = 10;
var tabuleiro = document.getElementById("maze");
var jogo = true;
// var playerCasa;

const vazia = 'vazia';
const personagem = 'personagem';
const parede = 'parede';
const aberto = 'aberto';
const embusca = 'embusca';
const caminho = 'caminho';
const abatido = 'abatido';

var pilha = [], labrintoCompleto = [];

function gerarId(x, y){
    return "casa-" + x + "-" + y;
}

const Jogador = {
    construtor(casa, x, y){
        this.casa = casa;
        this.x = x;
        this. y = y;
    },

    atualizarCasa(novoX, novoY){
        this.x = novoX;
        this.y = novoY;
        let novoIdCasa = gerarId(this.x, this.y);
        let novaCasa = document.getElementById(novoIdCasa);

        swapCasaClass(this.casa, personagem, vazia);
        swapCasaClass(novaCasa, vazia, personagem);

        this.casa = novaCasa;
        
    }
}

const eventosPlayer = {
    ArrowUp(){
        if(Jogador.x == 0){
            return;
        }
        Jogador.atualizarCasa(Jogador.x - 1, Jogador.y);
        console.log("Andando para cima");
    },

    ArrowDown(){
        if(Jogador.x == altura - 1){
            return;
        }
        Jogador.atualizarCasa(Jogador.x + 1, Jogador.y);
        console.log("Andando para baixo");
    },

    ArrowLeft(){
        if(Jogador.y == 0){
            return;
        }
        Jogador.atualizarCasa(Jogador.x, Jogador.y - 1);
        console.log("Andando para esquerda");
    },

    ArrowRight(){
        if(Jogador.y == largura - 1){
            return;
        }
        Jogador.atualizarCasa(Jogador.x, Jogador.y + 1);
        console.log("Andando para direita");
    }
}


function montarTabuleiro(){
    for(i = 0; i < largura; i++){
        for(j = 0; j < altura; j++){
        let idCasa = gerarId(i, j);
        let casa = document.createElement("div");
        casa.classList.add('casa');
        casa.classList.add('vazia');
        casa.id = idCasa;
        tabuleiro.appendChild(casa);
        }
    }
    atribuirCasaInicial();
}
 
function escolherCasaAleatoria(){
    let linha = parseInt ((Math.random() * (altura - 1)));
    let coluna = parseInt ((Math.random() * (largura - 1)));
    let idCasa = gerarId(linha, coluna);
    return document.getElementById(idCasa);
    // let playerCasa = document.getElementById(idCasa);
    

}

function atribuirCasaInicial(){
    playerCasa = escolherCasaAleatoria();
    swapCasaClass(playerCasa, vazia, personagem);
    Jogador.construtor(playerCasa, linha, coluna);
}

function swapCasaClass(casa, remClass, addClass){
    casa.classList.remove(remClass);
    casa.classList.add(addClass);
}


document.addEventListener("keydown", function(e){
    if (!jogo){
        return;
    }
    const moveFunction = eventosPlayer[e.key];
    if(moveFunction){
        moveFunction();
    }
});



function gerarLabirinto(){

}


























$("#btn-menu").click(function(){
    $("#menu").fadeIn();
    $("#menu").show();
    
    $("#btn-menu").hide();
    $("#btn-close").show();
    // $("#btn-menu").removeClass("btn-menu");
    // $("#btn-menu").addClass("btn-close");
    console.log("menu aparecendo");
});

$("#btn-close").click(function(){
    $("#menu").fadeOut();
    $("#menu").hide();
    $("#btn-menu").show();
    $("#btn-close").hide();
    // $("#btn-menu").removeClass("btn-close");
    // $("#btn-menu").addClass("btn-menu");
    console.log("menu sumido");
});
