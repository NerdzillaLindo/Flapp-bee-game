var jogador;
var jogador2;

var texturaPassaro;
var texAbelinhaDeCria;

var texturaCanoCima;
var texturaCanoBaixo;
var texturaChao;
var texLogo;

var edges;
var chao;
var logo;
var bg;

var canoCima;
var canoBaixo;

var playerCount = 0;
var score = 0;
var gameState = "start";

var largura;
var altura;
var morreu;

var musica;
var somMorte;

var musicButton;
var resetButton;
var multiplayerButton;
var startButton;

var dataBaseDeCria;

var allPlayers;

var jogadores;


function preload() {

    texturaCanoCima = loadImage("cano flap passaro.png");
    texLogo = loadImage("logo do jogo.png");
    texturaCanoBaixo = loadImage("template (1).png");
    texturaPassaro = loadAnimation("passaro do jogo.png", "passaro do jogo 2.png");
    bg = loadImage("cidade.png");

    morreu = loadAnimation("explosao 1.png", "explosao 2.png", "explosao 3.png", "explosao 4.png", "explosao 5.png", "explosao 6.png", "explosao 7.png");
    texAbelinhaDeCria = loadAnimation("pixil-frame-0.png", "pixil-frame (2)-0.png", "pixil-frame (3)-0.png", "pixil-frame (2)-0.png", "pixil-frame-0.png",);

    musica = loadSound("sound1.mp3");
    somMorte = loadSound("230753659.mp3");

    texturaPassaro.playing = true;
    morreu.playing = true;
    morreu.looping = false;
}


function setup() {

    var mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (mobile) {
        largura = displayWidth
        altura = displayHeight
    }
    else {
        largura = windowWidth
        altura = windowHeight
    }
    createCanvas(largura, altura);

    dataBaseDeCria = firebase.database();

    musicButton = createImg('mute.png');
    musicButton.position(15, 50);
    musicButton.size(60, 60);
    musicButton.mouseClicked(mute);

    startButton = createImg('StartFlap.png');
    startButton.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
    startButton.size(180, 65);
    startButton.mouseClicked(starting);

    resetButton = createImg('restartPassaro.png');
    resetButton.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
    resetButton.size(160, 60);
    resetButton.mouseClicked(restart);

    multiplayerButton = createImg('multiplayerFlap.png');
    multiplayerButton.position(windowWidth / 2 - 172, windowHeight / 2 - 20);
    multiplayerButton.size(320, 65);
    multiplayerButton.mouseClicked(Amigos);

    jogador = createSprite(600, 235, 10, 10)
    //jogador.debug=true
    jogador.setCollider("rectangle", 0, 0, 300, 300)

    jogador.addAnimation("morteMortifera", morreu);
    jogador.addAnimation("beeMovie", texAbelinhaDeCria);
    jogador.scale = 0.2

    jogador2 = createSprite(450, 235, 10, 10);
    //jogador.debug=true
    jogador2.setCollider("rectangle", 0, 0, 300, 300);

    jogador2.addAnimation("passaro do jogo.png", texturaPassaro);
    jogador2.addAnimation("morteMortifera", morreu);
    jogador2.scale = 0.2

    jogador2.visible = false;

    texAbelinhaDeCria.frameDelay = 5;
    texturaPassaro.frameDelay = 10;
    morreu.frameDelay = 3;

    jogador.addAnimation("morteMortifera", morreu);

    canoCima = createSprite(300, 140, 10, 10)
    canoCima.addImage("cano flap passaro.png", texturaCanoCima);
    canoCima.velocityX = -0
    canoCima.scale = 0.6

    canoBaixo = createSprite(300, 525, 40, 10)
    canoBaixo.addImage("template (1).png", texturaCanoBaixo);
    canoBaixo.velocityX = -0
    canoBaixo.scale = 0.6

    logo = createSprite(windowWidth / 2, windowHeight / 2 - 300, 20, 20)
    logo.addImage("nomezinho", texLogo);
    logo.scale = 0.5

    edges = createEdgeSprites();


    playerCountRef = dataBaseDeCria.ref("playerCount");
    playerCountRef.on("value", data => {
        playerCount = data.val()
    });

    gameStateRef = dataBaseDeCria.ref("gameState");
    gameStateRef.on("value", data => {
        gameState = data.val()
    });

    jogadores = [jogador, jogador2];

    musica.play();
    musica.setVolume(0.0);
}


function draw() {
    background(bg);
    drawSprites()

    //playersPos();
    updatePlayers();

    if (gameState == "start") {

        gameStateUpdate("start");

        canoCima.x = 300;
        canoBaixo.x = 300;

        jogador.x = 600;
        jogador.y = 235;

        jogador.velocityX = 0;

        jogador.rotation = 0;

        jogador2.x = 450;
        jogador2.y = 235;

        jogador2.velocityX = 0;

        jogador2.rotation = 0;

        startButton.show();
        resetButton.hide();

        logo.visible = true;
        jogador.visible = true;
        jogador2.visible = false;

        fill("red")
        textSize(45);

            jogador.changeAnimation("beeMovie", texAbelinhaDeCria);
            jogador.scale = 3.3;
            jogador.setCollider("rectangle", 0, 0, 10, 10)

            jogador2.changeAnimation("passaro do jogo.png", texturaPassaro);
            jogador2.scale = 0.2;
            jogador2.setCollider("rectangle", 0, 0, 10, 10)
        }


    if (gameState == "play") {

        getAllPlayers();

        gameStateUpdate("play");

        jogador.visible = true;

        if(allPlayers != undefined || allPlayers != null) {
        let index = 0;
        let y;

        for(let p in allPlayers) {
            index += 1;
            y = allPlayers[p].PosY;

            jogadores[index - 1].position.y = y
        }

        }

        jogador.velocityY += 0.7;
        if(jogador.rotation <= 20) {
            jogador.rotation = jogador.rotation + 1.5;
            }

            jogador2.velocityY += 0.7;
        if(jogador2.rotation <= 20) {
            jogador2.rotation = jogador.rotation + 1.5;
            }

        canoCima.velocityX = -6;
        canoBaixo.velocityX = -6;

        if (jogador.collide(edges)) {
            jogador.velocityY = 0

            gameState = "end";

            somMorte.play()
        }

        if (jogador.collide(canoCima) || jogador.collide(canoBaixo)) {
            gameState = "end";

            somMorte.play()
        }

        if(playerCount == 2) {
            if (jogador2.collide(edges)) {
                jogador2.velocityY = 0
    
                gameState = "end";
    
                somMorte.play()

                jogador2.changeAnimation("morteMortifera");
            }
    
            if (jogador2.collide(canoCima) || jogador2.collide(canoBaixo)) {
                gameState = "end";
    
                somMorte.play()

                jogador2.changeAnimation("morteMortifera");
            }
        }

        if (canoCima.collide(edges[0])) {
            canoBaixo.x = largura
            canoCima.x = largura

            canoCima.velocityX = -6

            canoCima.y = Math.round(random(80, 160))
            canoBaixo.y = canoCima.y + 550
        }

        score = score + Math.round(getFrameRate() / 60)

        logo.visible = false;

        startButton.hide();
    }

    if (gameState == "end") {

        gameStateUpdate("end");

        resetButton.show();

        jogador.velocityY = 0;

        fill("red")
        textSize(40)
        text("VOCÊ MORREU!", windowWidth / 2 - 170, 350)

        jogador.scale = 1
        jogador.changeAnimation("morteMortifera");

        logo.visible = false;
        jogador.visible = true;
        jogador2.visible = false;
    }

    fill("red");
    textSize(40)
    text("Pontos: " + score, 5, 40)

    if (playerCount == 2) {
        gameStateUpdate("play");
        jogador2.visible = true;
    }

}


function mute() {
    if (musica.isPlaying()) {
        musica.stop()
    }
    else {
        musica.play()
    }
}


function restart() {

    gameState = "start";

    resetButton.hide();
    multiplayerButton.show();

    score = 0;

    dataBaseDeCria.ref("/").update({
        playerCount: 0, gameState: "start"
    })
    dataBaseDeCria.ref("Players/Player1").update({
        PosY: 235
    })
    dataBaseDeCria.ref("Players/Player2").update({
        PosY: 235
    })

    playerCount = 0;

    jogador.changeAnimation("passaro do jogo.png", texturaPassaro);
    jogador.scale = 0.23;
}


function starting() {
    gameState = "play";

    startButton.hide();
    multiplayerButton.hide();
}


function Amigos() {
    multiplayerButton.hide();

    dataBaseDeCria.ref("/").update({
        playerCount: playerCount + 1
    });
}


function gameStateUpdate(state) {
    dataBaseDeCria.ref("/").update({
        gameState: state
    });
}


function updatePlayers() {
    dataBaseDeCria.ref("Players/Player1").set({
        PosY: jogador.y
    });

    dataBaseDeCria.ref("Players/Player2").set({
        PosY: jogador2.y
    });
}


//function playersPos() {
  //  let player1 = dataBaseDeCria.ref("Players/Player1").on("value", dados => {
//jogador.y = dados.val().PosY
//})

//let player2 = dataBaseDeCria.ref("Players/Player2").on("value", dados => {
//jogador2.y = dados.val().PosY
//})
//}


function keyPressed(){
    if(keyCode == 38){
      jogador.velocityY = -8;

      if(jogador.rotation >= -20) {
      jogador.rotation = jogador.rotation - 40;
      }
    }

    if(keyCode == 87){
        jogador2.velocityY = -8;
  
        if(jogador2.rotation >= -20) {
        jogador2.rotation = jogador2.rotation - 40;
        }
      }
  }


  function getAllPlayers() {

    dataBaseDeCria.ref("Players").on("value", dados => {
        allPlayers = dados.val()
    });
  }