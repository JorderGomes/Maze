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

var pilha = [], labrintoCompleto = [], tabuleiroCompleto = [];

function gerarId(x, y){
    return "casa-" + x + "-" + y;
}

class House  {
    constructor(casa, x, y){
        this.casa = casa;
        this.x = x;
        this.y = y;
    }

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


const Jogador = {
    construtor(house){
        this.house = house;
    }
}

const eventosPlayer = {
    ArrowUp(){
        if(Jogador.house.x == 0){
            return;
        }
        Jogador.house.atualizarCasa(Jogador.house.x - 1, Jogador.house.y);
        console.log("Andando para cima");
    },

    ArrowDown(){
        if(Jogador.house.x == altura - 1){
            return;
        }
        Jogador.house.atualizarCasa(Jogador.house.x + 1, Jogador.house.y);
        console.log("Andando para baixo");
    },

    ArrowLeft(){
        if(Jogador.house.y == 0){
            return;
        }
        Jogador.house.atualizarCasa(Jogador.house.x, Jogador.house.y - 1);
        console.log("Andando para esquerda");
    },

    ArrowRight(){
        if(Jogador.house.y == largura - 1){
            return;
        }
        Jogador.house.atualizarCasa(Jogador.house.x, Jogador.house.y + 1);
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
        
        let house = new House(casa, i, j);

        tabuleiro.appendChild(casa);
        tabuleiroCompleto.push(house);
        }
    }
    gerarLabirinto();
    // escolherCasaAleatoria();
    // console.log(tabuleiroCompleto[0]);
    // atribuirCasaInicial();
}
 
function escolherCasaAleatoria(){
    let i = parseInt ((Math.random() * (tabuleiroCompleto.length - 1)));
    return tabuleiroCompleto[i];
}

function atribuirCasaInicial(){
    let houseNow = escolherCasaAleatoria();
    swapCasaClass(houseNow.casa, vazia, personagem);
    Jogador.construtor(houseNow);
    console.log(Jogador);
   
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
    let casaInicial = escolherCasaAleatoria();
    // let casaDois = escolherCasaAleatoria();
    swapCasaClass(casaInicial.casa, vazia, aberto);
    pilha.push(casaInicial);
    // pilha.push(casaDois);

    // while(!pilha.empty){
        pegarFuraveis(pilha.slice(-1));

    // }
    
    
    
    // console.log(pilha.slice(-1));
}


function pegarFuraveis(casa){
    console.log(casa);
    let vizinhos = getNeibs(casa[0]);
    // console.log(vizinhos);
    for(viz of vizinhos){
        let fur = furavel(viz);
        if(!fur){
            vizinhos.splice(1,1,viz);
        }
    }
    
    console.log(vizinhos);
}

function furavel(vizinho){
    let cont = 0;
    
    if(!vizinho.casa.classList.contains(vazia)){
        return false;
    }
    let vizinhosSegCamada = getNeibs(vizinho);
    
    
    for(vizinhoSeg of vizinhosSegCamada){
        if(vizinhoSeg.casa.classList.contains(vazia)){
            cont++;
        }
    }

    if(cont >= 3){
        return true;
    }
    else{
        return false;
    }
}

function getNeibs(casa){
    let vizinhos = [];
    
    if(casa.x - 1 >= 0 && casa.y < largura){
        casaAcima = new House (
            document.getElementById(gerarId(casa.x - 1, casa.y)),
            casa.x - 1,
            casa.y
        );
        vizinhos.push(
            casaAcima
        );
    }

    if(casa.x + 1 < altura && casa.y < largura){
        vizinhos.push(
            new House (
                document.getElementById(gerarId(casa.x + 1, casa.y)),
                casa.x + 1,
                casa.y
            )
        );
    }

    if(casa.x < altura && casa.y - 1 >= 0){
        vizinhos.push(
            new House (
                document.getElementById(gerarId(casa.x, casa.y - 1)),
                casa.x,
                casa.y - 1
            )
        );
    }

    if(casa.x < altura && casa.y + 1 < largura){
        vizinhos.push(
            new House (
                document.getElementById(gerarId(casa.x, casa.y + 1)),
                casa.x,
                casa.y + 1
            )
        );
    }
    for(viz of vizinhos){
        if(viz == null){
            vizinhos.splice(1,1,viz);
        }
    }

    return vizinhos;
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
