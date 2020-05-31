const altura = 10, largura = 10;
var tabuleiro = document.getElementById("maze");
var jogo = true;
var houseFruit;
var alcanceMaximo = 5;
// var playerCasa;

const vazia = 'vazia';
const personagem = 'personagem';
const parede = 'parede';
const aberto = 'aberto';
const embusca = 'embusca';
const caminho = 'caminho';
const abatido = 'abatido';
const fruta = 'fruta';
const luz = 'luz';

var pilha = [], labrintoCompleto = [], tabuleiroCompleto = [], labrintoDisponivel = [];
var alcanceCasas = [];


function gerarId(x, y){
    return "casa-" + x + "-" + y;
}

class posicao {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class House  {
    constructor(casa, x, y){
        this.casa = casa;
        this.x = x;
        this.y = y;
        this.furavel = false;
    }

    atualizarCasa(novoX, novoY){

        let novoIdCasa = gerarId(novoX, novoY);
        let novaCasa = document.getElementById(novoIdCasa);

        if(novaCasa.classList.contains(vazia)){
            finalJogo(false);
            return;
        }

        this.x = novoX;
        this.y = novoY;
        // let novoIdCasa = gerarId(this.x, this.y);
        // let novaCasa = document.getElementById(novoIdCasa);

        

        swapCasaClass(this.casa, personagem, aberto);
        swapCasaClass(novaCasa, aberto, personagem);

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
        apagarLuzes();
        Jogador.house.atualizarCasa(Jogador.house.x - 1, Jogador.house.y);
        acenderLuzes();
        detectarColisao();
        // console.log(houseFruit);
        console.log("Andando para cima");
    },

    ArrowDown(){
        if(Jogador.house.x == altura - 1){
            return;
        }
        apagarLuzes();
        Jogador.house.atualizarCasa(Jogador.house.x + 1, Jogador.house.y);
        acenderLuzes();
        detectarColisao();
        console.log("Andando para baixo");
    },

    ArrowLeft(){
        if(Jogador.house.y == 0){
            return;
        }
        apagarLuzes();
        Jogador.house.atualizarCasa(Jogador.house.x, Jogador.house.y - 1);
        acenderLuzes();
        detectarColisao();
        console.log("Andando para esquerda");
    },

    ArrowRight(){
        if(Jogador.house.y == largura - 1){
            return;
        }
        apagarLuzes();
        Jogador.house.atualizarCasa(Jogador.house.x, Jogador.house.y + 1);
        acenderLuzes();
        detectarColisao();
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
    // console.log(labrintoCompleto);
    // escolherCasaAleatoria();
    // console.log(tabuleiroCompleto[0]);
    atribuirCasaInicial();
    atribuirCasaFruta();
    acenderLuzes();
}

function escolherCasaInicialAleatoria(){
    let x = parseInt ( (Math.random() * (altura - 1) + 1) );
    let y = parseInt ( (Math.random() * (largura - 1) + 1) );
    
    let primeiraCasa =  new House (
        document.getElementById(gerarId(x , y)),
        x ,
        y
    );
    
    return primeiraCasa;
}

function escolherCasaAleatoria(listaCasas){
    let i = parseInt ( (Math.random() * (listaCasas.length - 1)) );
    return listaCasas[i];
}

function escolherCasaAleatoriaDoLabirinto(){
    let i = parseInt ( (Math.random() * (labrintoCompleto.length - 1)) );
    console.log(i);
    // console.log(tabu)
    return labrintoCompleto[i];
}

function atribuirCasaInicial(){
    let houseNow = escolherCasaAleatoriaDoLabirinto();
    swapCasaClass(houseNow.casa, aberto, personagem);
    
    Jogador.construtor(houseNow);
    
    const disponivel = el => { return !el.casa.classList.contains(personagem); }
    // console.log(labrintoCompleto);
    labrintoDisponivel = labrintoCompleto.filter(disponivel);
    
}


function atribuirCasaFruta(){
    houseFruit = escolherCasaAleatoria(labrintoDisponivel);
    // console.log(houseFruit);
    swapCasaClass(houseFruit.casa, aberto, fruta);

    const disponivel = el => { return !el.casa.classList.contains(fruta); }
    // console.log(labrintoCompleto);
    labrintoDisponivel = labrintoCompleto.filter(disponivel);

}

function swapCasaClass(casa, remClass, addClass){
    casa.classList.remove(remClass);
    casa.classList.add(addClass);
}

function acenderLuzes(){
    let maximo = alcanceMaximo;
    alcanceCasas = [];
    let alcance = getNeibs(Jogador.house);
    for(viz of alcance){
        
        pos = new posicao(
            viz.x - Jogador.house.x,
            viz.y - Jogador.house.y
        );
        desenharAlcance(viz, maximo, pos);
    }
    for(al of alcanceCasas){
        al.casa.classList.add(luz);
    }
    // console.log(alcanceCasas);
    // apagarLuzes();
    // desenharAlcance
}

function apagarLuzes(){
    for(al of alcanceCasas){
        al.casa.classList.remove(luz);
    }
    
    
    
}

function desenharAlcance(viz, max, pos){
    if(viz.casa == null){
        return;
    }
    if(max == 0){
        return;
    }
    if(viz.casa.classList.contains(vazia)){
        return;
    }
    if(viz.casa.classList.contains(fruta)){
        return;
    }
    
    // console.log("desenhar");
    
    // viz.casa.classList.add(luz);
    alcanceCasas.push(viz);
    // console.log(viz);
    let auX = pos.x + viz.x;
    let auY = pos.y + viz.y;
    
    viz = new House(
        document.getElementById(gerarId(auX, auY)),
        auX,
        auY
    );
    
    max--;

    desenharAlcance(viz, max, pos);



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



function finalJogo(resultado){
    jogo = false;
    if(resultado){
        window.alert("Você venceu!");
    } 
    else if(!resultado){
        window.alert("Você perdeu!");
    } else{
        console.error("Chame esta funcção com um valor boolean");
    }
}



function detectarColisao(){
    console.log(houseFruit);
    if(houseFruit.casa.classList.contains(fruta) 
        &&
        houseFruit.casa.classList.contains(personagem)){
            finalJogo(true);
        } 
}
























function gerarLabirinto(){
    let casaInicial =  escolherCasaInicialAleatoria();
    // =  escolherCasaAleatoria();
    
    // new House (
    //     document.getElementById(gerarId(1,  1)),
    //     1,
    //     1
    // );


    // = escolherCasaAleatoria();




    // let casaDois = escolherCasaAleatoria();
    swapCasaClass(casaInicial.casa, vazia, aberto);
    pilha.push(casaInicial);
    // pilha.push(casaDois);
    let iteracoes = 0;
    while(!pilha.empty){
        let neibs = getNeibs(pilha.slice(-1)[0]);
        if(neibs == undefined){
            return;
        }
        // pegarFuraveis(pilha.slice(-1));
        
        let furaveis = [];
        for(let i = 0; i < neibs.length; i++){
            neibs[i].furavel = furavel(neibs[i]);
        }
        
        const furavell = el => { return el.furavel === true; }
        furaveis = neibs.filter(furavell);

        
        if(furaveis.length == 0){
            pilha.pop();
        }
        else{
            let indice = sortearFurado(furaveis.length);
            let sorteado = furaveis[indice];
            labrintoCompleto.push(sorteado);
            swapCasaClass(sorteado.casa, vazia, aberto);
            pilha.push(sorteado);
            
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
    
    let vizinhosSegCamada = getNeibs(vizinho);
    
    
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
    if (casa == undefined){
        return;
    }

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
        // if(!casaAcima.casa.classList.contains(aberto)){
            vizinhos.push(
                casaAcima
            );
        // }
    }
    
   
    // vizinhos.push(vizinhoAbaixo(casa.x, casa.y));
    if(x + 1 < altura && y < largura){
        
        let casaAbaixo = new House (
                document.getElementById(gerarId(x + 1, y)),
                x + 1,
                y
            );
        // if(!casaAbaixo.casa.classList.contains(aberto)){
            vizinhos.push(
                casaAbaixo
            );
        // }
            
    }
    
    //  x = casa.x;
    //  y = casa.y;

    if(x < altura && y - 1 >= 0){
        
        let casaEsquerda = new House (
                document.getElementById(gerarId(x, y - 1)),
                x,
                y - 1
            );
        // if(!casaEsquerda.casa.classList.contains(aberto)){
            vizinhos.push(
                casaEsquerda
            );
        // }
    }

    //  x = casa.x;
    //  y = casa.y;

    if(x < altura && y + 1 < largura){
        
        let casaDireita = new House (
                document.getElementById(gerarId(x, y + 1)),
                x,
                y + 1
            );
        // if(!casaDireita.casa.classList.contains(aberto)){
            vizinhos.push(
                casaDireita
            );
        // }
    }

    //  x = casa.x;
    //  y = casa.y;

    for(viz of vizinhos){
        if(viz == null){
            vizinhos.splice(1,1,viz);
        }
    }
    
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
    // console.log(x + " " + y);
    if(x + 1 < altura && y < largura){
        // console.log(x + " pos if " + y);
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
