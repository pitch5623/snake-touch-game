let gameState = "start";
let buttons = [];
let bgImg;

function preload() {
  bgImg = loadImage('startscreen.png'); // Assure-toi que l’image s’appelle bien comme ça
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Crée les boutons de niveaux
  const labels = ['EASY', 'NORMAL', 'HARD'];
  const levels = [1, 2, 3];
  const buttonWidth = 120;
  const spacing = 30;
  const totalWidth = labels.length * buttonWidth + (labels.length - 1) * spacing;
  const startX = width / 2 - totalWidth / 2;
  const y = height - 150;

  for (let i = 0; i < labels.length; i++) {
    let btn = createButton(labels[i]);
    btn.position(startX + i * (buttonWidth + spacing), y);
    btn.size(buttonWidth, 50);
    btn.style('font-size', '20px');
    btn.style('border-radius', '20px');
    btn.style('background-color', '#f3f1dd');
    btn.style('color', '#1c2d14');
    btn.style('border', 'none');
    btn.mousePressed(() => startGame(levels[i]));
    buttons.push(btn);
  }
}

function draw() {
  if (gameState === "start") {
    drawStartScreen();
  } else {
    // ton jeu principal ici (snake loop)
  }
}

function drawStartScreen() {
  image(bgImg, 0, 0, width, height);
}

function startGame(level) {
  gameState = "playing";
  buttons.forEach(btn => btn.hide());

  // Initialise ton jeu ici selon le niveau choisi
  console.log("Niveau choisi :", level);
}
