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
        this.furavel = false;
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
    let i = parseInt ( (Math.random() * (tabuleiroCompleto.length - 1)) );
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
    let casaInicial = new House (
        document.getElementById(gerarId(1,  1)),
        1,
        1
    );


    // = escolherCasaAleatoria();




    // let casaDois = escolherCasaAleatoria();
    swapCasaClass(casaInicial.casa, vazia, aberto);
    pilha.push(casaInicial);
    // pilha.push(casaDois);
    let iteracoes = 0;
    while(!pilha.empty){
        let neibs = getNeibs(pilha.slice(-1)[0]);
        // pegarFuraveis(pilha.slice(-1));
        
        let furaveis = [];
        for(let i = 0; i < neibs.length; i++){
            neibs[i].furavel = furavel(neibs[i]);
        }
        
        const furavell = el => { return el.furavel === true; }
        furaveis = neibs.filter(furavell);

        // console.log(furaveis);
        if(furaveis.length == 0){
            pilha.pop();
        }
        else{
            let indice = sortearFurado(furaveis.length);
            let sorteado = furaveis[indice];
            swapCasaClass(sorteado.casa, vazia, aberto);
            pilha.push(sorteado);
            // console.log(sorteado);
        }
        iteracoes++;
    }
    
}


function sortearFurado(furaveisSize){
    return parseInt ( (Math.random() * (furaveisSize)) );
}



function furavel(vizinho){
    let cont = 0;
    
    if(!vizinho.casa.classList.contains(vazia)){
        return false;
    }
    console.log("get neibs segunda camada")
    let vizinhosSegCamada = getNeibs(vizinho);
    console.log(vizinhosSegCamada);
    
    if(vizinhosSegCamada.length <= 2){
        return false;
    }

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
    console.log(casa);
    let vizinhos = [];
    const x = casa.x;
    const y = casa.y;
    
    
    
    // vizinhos.push(vizinhoAcima(casa.x, casa.y));
    
    if(x - 1 >= 0 && y < largura){
        let provX = x - 1;
        let casaAcima = new House (
            document.getElementById(gerarId(x - 1, y)),
            casa.x - 1,
            y
        );
        if(!casaAcima.casa.classList.contains(aberto)){
            vizinhos.push(
                casaAcima
            );
        }
    }
    
   
    // vizinhos.push(vizinhoAbaixo(casa.x, casa.y));
    if(x + 1 < altura && y < largura){
        
        let casaAbaixo = new House (
                document.getElementById(gerarId(x + 1, y)),
                x + 1,
                y
            );
        if(!casaAbaixo.casa.classList.contains(aberto)){
            vizinhos.push(
                casaAbaixo
            );
        }
            
    }
    
    //  x = casa.x;
    //  y = casa.y;

    if(x < altura && y - 1 >= 0){
        
        let casaEsquerda = new House (
                document.getElementById(gerarId(x, y - 1)),
                x,
                y - 1
            );
        if(!casaEsquerda.casa.classList.contains(aberto)){
            vizinhos.push(
                casaEsquerda
            );
        }
    }

    //  x = casa.x;
    //  y = casa.y;

    if(x < altura && y + 1 < largura){
        
        let casaDireita = new House (
                document.getElementById(gerarId(x, y + 1)),
                x,
                y + 1
            );
        if(!casaDireita.casa.classList.contains(aberto)){
            vizinhos.push(
                casaDireita
            );
        }
    }

    //  x = casa.x;
    //  y = casa.y;

    for(viz of vizinhos){
        if(viz == null){
            vizinhos.splice(1,1,viz);
        }
    }
    // console.log(vizinhos);
    return vizinhos;
}






























function vizinhoAcima(x, y){
    if(x >= 0 && y < largura){
        
        let casaAcima = new House (
            document.getElementById(gerarId(x - 1, y)),
            x,
            y
        );
        if(!casaAcima.casa.classList.contains(aberto)){
            // vizinhos.push(
                return casaAcima;
            // );
        }
    }
}





























function vizinhoAbaixo(x, y){
    console.log(x + " " + y);
    if(x + 1 < altura && y < largura){
        console.log(x + " pos if " + y);
        casaAbaixo = new House (
                document.getElementById(gerarId(x + 1, y)),
                x + 1,
                y
            );
        return casaAbaixo;
    }
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
