let stateManager = {
    state: 'menu',
    gameStarted: false,
    paused: false,
    gameOver: false,
    speed: 10,
    setState(newState) {
      this.state = newState;
      this.updateUI();
    },
    startGame(speed) {
      this.speed = speed;
      this.state = 'playing';
      this.gameStarted = false;
      this.paused = true;
      this.gameOver = false;
      frameRate(speed);
      score = 0;
      snake = new Snake();
      fruit = new Fruit(snake.body);
      blueFruit = null;
      blackFruit = null;
      blueFruitTime = 0;
      blackFruitTime = 0;
      gameCount++;
      localStorage.setItem('gameCount', gameCount);
      this.updateUI();
    },
    showMenu() {
      this.state = 'menu';
      this.gameStarted = false;
      this.paused = false;
      this.gameOver = false;
      score = 0;
      snake = new Snake();
      fruit = new Fruit(snake.body);
      blueFruit = null;
      blackFruit = null;
      blueFruitTime = 0;
      blackFruitTime = 0;
      this.updateUI();
    },
    showStats() {
      this.state = 'stats';
      this.updateUI();
    },
    togglePause() {
      if (!this.gameStarted) {
        this.gameStarted = true;
        this.paused = false;
        pauseButton.html('Pause');
      } else if (this.gameOver) {
        this.gameStarted = true;
        this.paused = false;
        this.gameOver = false;
        score = 0;
        snake = new Snake();
        fruit = new Fruit(snake.body);
        blueFruit = null;
        blackFruit = null;
        blueFruitTime = 0;
        blackFruitTime = 0;
        gameCount++;
        localStorage.setItem('gameCount', gameCount);
        pauseButton.html('Pause');
      } else {
        this.paused = !this.paused;
      }
      this.updateUI();
    },
    endGame() {
      this.gameOver = true;
      this.paused = true;
      pauseButton.html('Retry');
      let highScore = localStorage.getItem('highScore' + this.speed) || 0;
      if (score > highScore) localStorage.setItem('highScore' + this.speed, score);
      gameOverSound?.play();
      this.updateUI();
    },
    updateUI() {
      let scoreDiv = document.getElementById('score');
      let pauseDiv = document.getElementById('pause');
      let errorDiv = document.getElementById('error');
      let statsDiv = select('#statsDiv');
      if (this.state === 'menu') {
        easyButton.show();
        normalButton.show();
        hardButton.show();
        statsButton.show();
        returnButton.hide();
        pauseButton.hide();
        scoreDiv.style.display = 'none';
        pauseDiv.style.display = 'none';
        backButton.hide();
        if (statsDiv) statsDiv.remove();
      } else if (this.state === 'stats') {
        easyButton.hide();
        normalButton.hide();
        hardButton.hide();
        statsButton.hide();
        returnButton.hide();
        pauseButton.hide();
        scoreDiv.style.display = 'none';
        pauseDiv.style.display = 'none';
        backButton.show();
        if (!statsDiv) {
          statsDiv = createDiv('');
          statsDiv.id('statsDiv');
          statsDiv.class('stats-container');
          statsDiv.html(`
            <h2>Game Statistics</h2>
            <p>Games Played: ${gameCount}</p>
            <p>High Score (Easy): ${localStorage.getItem('highScore3') || 0}</p>
            <p>High Score (Normal): ${localStorage.getItem('highScore7') || 0}</p>
            <p>High Score (Hard): ${localStorage.getItem('highScore10') || 0}</p>
          `);
        }
      } else {
        easyButton.hide();
        normalButton.hide();
        hardButton.hide();
        statsButton.hide();
        returnButton.show();
        pauseButton.show();
        backButton.hide();
        scoreDiv.style.display = 'block';
        pauseDiv.style.display = (this.paused && !this.gameOver) ? 'block' : 'none';
      }
      scoreDiv.innerText = `Score: ${score}`;
    }
  };
  
  let snake, fruit, blueFruit, blackFruit, gridSize, tileCount = 20, score = 0;
  let joystick = { active: false, x: 0, y: 0, startX: 0, startY: 0 };
  let blueFruitTime = 0, blackFruitTime = 0;
  const fruitDuration = 7000;
  let eatSound, gameOverSound, startscreenImg;
  let gameCount = localStorage.getItem('gameCount') ? parseInt(localStorage.getItem('gameCount')) : 0;
  let easyButton, normalButton, hardButton, statsButton, returnButton, pauseButton, backButton;
  
  function preload() {
    try {
      eatSound = loadSound('mange.wav');
      gameOverSound = loadSound('game_over.wav');
      startscreenImg = loadImage('startscreen1.jpeg');
      console.log('Resources loaded successfully');
    } catch (e) {
      console.error('Error loading resources:', e);
      document.getElementById('error').innerText = 'Failed to load game resources. Using fallback graphics.';
      document.getElementById('error').style.display = 'block';
    }
  }
  
  function setup() {
    let canvasWidth = min(windowWidth, 500);
    let canvasHeight = canvasWidth * 1.5;
    if (canvasHeight > windowHeight) {
      canvasHeight = windowHeight;
      canvasWidth = canvasHeight / 1.5;
    }
    createCanvas(canvasWidth, canvasHeight);
    gridSize = width / tileCount;
    frameRate(stateManager.speed);
    snake = new Snake();
    fruit = new Fruit(snake.body);
    textAlign(CENTER, CENTER);
  
    easyButton = select('#easyButton');
    easyButton.mousePressed(() => stateManager.startGame(3));
    easyButton.touchStarted(() => { stateManager.startGame(3); return false; });
  
    normalButton = select('#normalButton');
    normalButton.mousePressed(() => stateManager.startGame(7));
    normalButton.touchStarted(() => { stateManager.startGame(7); return false; });
  
    hardButton = select('#hardButton');
    hardButton.mousePressed(() => stateManager.startGame(10));
    hardButton.touchStarted(() => { stateManager.startGame(10); return false; });
  
    statsButton = select('#statsButton');
    statsButton.mousePressed(() => stateManager.showStats());
    statsButton.touchStarted(() => { stateManager.showStats(); return false; });
  
    returnButton = select('#returnButton');
    returnButton.mousePressed(() => stateManager.showMenu());
    returnButton.touchStarted(() => { stateManager.showMenu(); return false; });
  
    pauseButton = select('#pauseButton');
    pauseButton.mousePressed(() => stateManager.togglePause());
    pauseButton.touchStarted(() => { stateManager.togglePause(); return false; });
  
    backButton = createButton('Back');
    backButton.addClass('back-button');
    backButton.mousePressed(() => stateManager.showMenu());
    backButton.touchStarted(() => { stateManager.showMenu(); return false; });
    backButton.hide();
  
    stateManager.updateUI();
  }
  
  function windowResized() {
    let canvasWidth = min(windowWidth, 500);
    let canvasHeight = canvasWidth * 1.5;
    if (canvasHeight > windowHeight) {
      canvasHeight = windowHeight;
      canvasWidth = canvasHeight / 1.5;
    }
    resizeCanvas(canvasWidth, canvasHeight);
    gridSize = width / tileCount;
    stateManager.updateUI();
  }
  
  function draw() {
    if (stateManager.state === 'menu') {
      drawWelcomeScreen();
    } else if (stateManager.state === 'stats') {
      drawStatsScreen();
    } else {
      background(255);
      fill(240, 240, 240);
      noStroke();
      rect(0, height * 0.67, width, height * 0.33);
      stroke(200, 200, 200, 50);
      for (let x = 0; x < tileCount; x++) {
        line(x * gridSize, 0, x * gridSize, tileCount * gridSize);
      }
      for (let y = 0; y < tileCount; y++) {
        line(0, y * gridSize, width, y * gridSize);
      }
      noFill();
      stroke(0, 0, 100);
      strokeWeight(width * 0.01);
      rect(0, 0, width, tileCount * gridSize);
      noStroke();
  
      if (stateManager.gameStarted && !stateManager.paused && !stateManager.gameOver) {
        snake.update();
        if (score >= 15 && frameCount % Math.round(120 * (10 / stateManager.speed)) === 0 && !blueFruit && !blackFruit) {
          let spawnChance = random();
          if (spawnChance < 0.3) {
            blueFruit = new BlueFruit(snake.body, fruit);
            blueFruitTime = millis();
          } else if (spawnChance < 0.6) {
            blackFruit = new BlackFruit(snake.body, fruit);
            blackFruitTime = millis();
          }
        }
        if (blueFruit && millis() - blueFruitTime >= fruitDuration) {
          blueFruit = null;
          blueFruitTime = 0;
        }
        if (blackFruit && millis() - blackFruitTime >= fruitDuration) {
          blackFruit = null;
          blackFruitTime = 0;
        }
      }
      snake.show();
      fruit.show();
      if (blueFruit) blueFruit.show();
      if (blackFruit) blackFruit.show();
  
      if (joystick.active) {
        fill(100, 100, 255, 100);
        ellipse(joystick.startX, joystick.startY, width * 0.2, width * 0.2);
        fill(50, 50, 200, 200);
        ellipse(joystick.x, joystick.y, width * 0.1, width * 0.1);
      }
  
      if (stateManager.gameOver) {
        fill(255, 0, 0);
        textSize(width * 0.1);
        textFont('Roboto');
        textStyle(BOLD);
        text('Game Over', width / 2, height * 0.4);
      }
    }
  }
  
  function drawWelcomeScreen() {
    if (startscreenImg) {
      image(startscreenImg, 0, 0, width, height);
    } else {
      background(255);
      fill(255, 0, 0);
      textSize(width * 0.05);
      text('Failed to load startscreen.png', width / 2, height / 2);
    }
    fill(255);
    textSize(width * 0.08);
    textFont('Roboto');
    textStyle(BOLD);
    textWrap(WORD);
    text('Snake Touch', width / 2, height * 0.12);
  }
  
  function drawStatsScreen() {
    if (startscreenImg) {
      image(startscreenImg, 0, 0, width, height);
      fill(0, 0, 0, 100);
      rect(0, 0, width, height);
    } else {
      background(255);
    }
  }
  
  function touchStarted() {
    if (stateManager.state === 'playing' && touches.length > 0 && touches[0].y > height * 0.75) {
      joystick.active = true;
      joystick.startX = touches[0].x;
      joystick.startY = touches[0].y;
      joystick.x = joystick.startX;
      joystick.y = joystick.startY;
    }
    return false;
  }
  
  function touchMoved() {
    if (stateManager.state === 'playing' && joystick.active && touches.length > 0) {
      let dx = touches[0].x - joystick.startX;
      let dy = touches[0].y - joystick.startY;
      let dist = Math.min(Math.sqrt(dx * dx + dy * dy), width * 0.1);
      let angle = Math.atan2(dy, dx);
      joystick.x = joystick.startX + Math.cos(angle) * dist;
      joystick.y = joystick.startY + Math.sin(angle) * dist;
      if (!stateManager.paused) {
        let absAngle = Math.abs(angle);
        if (absAngle < Math.PI/4 || absAngle > 3*Math.PI/4) {
          snake.dir(absAngle < Math.PI/4 ? 1 : -1, 0);
        } else {
          snake.dir(0, angle > 0 ? 1 : -1);
        }
      }
    }
    return false;
  }
  
  function touchEnded() {
    joystick.active = false;
    return false;
  }
  
  function keyPressed() {
    if (keyCode === 32 && stateManager.state === 'playing') {
      stateManager.togglePause();
    } else if (stateManager.state === 'playing' && stateManager.gameStarted && !stateManager.paused && !stateManager.gameOver) {
      if (keyCode === LEFT_ARROW) {
        snake.dir(-1, 0);
      } else if (keyCode === RIGHT_ARROW) {
        snake.dir(1, 0);
      } else if (keyCode === UP_ARROW) {
        snake.dir(0, -1);
      } else if (keyCode === DOWN_ARROW) {
        snake.dir(0, 1);
      }
    }
  }
  
  class Snake {
    constructor() {
      this.body = [{ x: 10, y: 10 }];
      this.dirX = 1;
      this.dirY = 0;
    }
  
    dir(x, y) {
      if (this.body.length > 1 && (x !== 0 && x === -this.dirX || y !== 0 && y === -this.dirY)) return;
      this.dirX = x;
      this.dirY = y;
    }
  
    update() {
      let head = { x: this.body[0].x + this.dirX, y: this.body[0].y + this.dirY };
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        stateManager.endGame();
        return;
      }
      for (let i = 1; i < this.body.length; i++) {
        if (head.x === this.body[i].x && head.y === this.body[i].y) {
          stateManager.endGame();
          return;
        }
      }
      this.body.unshift(head);
      if (head.x === fruit.x && head.y === fruit.y) {
        score += 1;
        let scoreDiv = document.getElementById('score');
        scoreDiv.style.transform = 'scale(1.2)';
        setTimeout(() => scoreDiv.style.transform = 'scale(1)', 200);
        fruit = new Fruit(this.body, blueFruit, blackFruit);
        eatSound?.play();
      } else if (blueFruit && head.x === blueFruit.x && head.y === blueFruit.y) {
        score += 3;
        let scoreDiv = document.getElementById('score');
        scoreDiv.style.transform = 'scale(1.2)';
        setTimeout(() => scoreDiv.style.transform = 'scale(1)', 200);
        if (score >= 15) {
          let newLength = Math.max(1, Math.floor(this.body.length * 0.7));
          this.body.splice(newLength);
        }
        blueFruit = null;
        blueFruitTime = 0;
        eatSound?.play();
      } else if (blackFruit && head.x === blackFruit.x && head.y === blackFruit.y) {
        score = Math.max(0, score - 5);
        let scoreDiv = document.getElementById('score');
        scoreDiv.style.transform = 'scale(1.2)';
        setTimeout(() => scoreDiv.style.transform = 'scale(1)', 200);
        if (score >= 15) {
          let additionalSegments = Math.floor(this.body.length * 0.2);
          for (let i = 0; i < additionalSegments; i++) {
            this.body.push({ ...this.body[this.body.length - 1] });
          }
        }
        blackFruit = null;
        blackFruitTime = 0;
        eatSound?.play();
      } else {
        this.body.pop();
      }
    }
  
    show() {
      if (this.body.length > 1) {
        stroke(0, 128, 0);
        strokeWeight(gridSize * 0.8);
        drawingContext.shadowBlur = 5;
        drawingContext.shadowColor = "rgba(0, 0, 0, 0.3)";
        for (let i = 0; i < this.body.length - 1; i++) {
          let seg1 = this.body[i];
          let seg2 = this.body[i + 1];
          line(
            seg1.x * gridSize + gridSize / 2,
            seg1.y * gridSize + gridSize / 2,
            seg2.x * gridSize + gridSize / 2,
            seg2.y * gridSize + gridSize / 2
          );
        }
        noStroke();
        drawingContext.shadowBlur = 0;
      }
      let head = this.body[0];
      push();
      translate(head.x * gridSize + gridSize / 2, head.y * gridSize + gridSize / 2);
      if (this.dirX === 1) rotate(0);
      else if (this.dirX === -1) rotate(PI);
      else if (this.dirY === 1) rotate(HALF_PI);
      else if (this.dirY === -1) rotate(-HALF_PI);
      fill(0, 150, 0);
      drawingContext.shadowBlur = 5;
      drawingContext.shadowColor = "rgba(0, 0, 0, 0.3)";
      ellipse(0, 0, gridSize * 0.8, gridSize * 0.8);
      fill(255);
      ellipse(-gridSize / 4, -gridSize / 8, gridSize / 8, gridSize / 8);
      ellipse(gridSize / 4, -gridSize / 8, gridSize / 8, gridSize / 8);
      pop();
      drawingContext.shadowBlur = 0;
    }
  }
  
  class Fruit {
    constructor(snakeBody, blueFruit = null, blackFruit = null) {
      do {
        this.x = floor(random(tileCount));
        this.y = floor(random(tileCount));
      } while (
        snakeBody.some(segment => segment.x === this.x && segment.y === this.y) ||
        (blueFruit && blueFruit.x === this.x && blueFruit.y === this.y) ||
        (blackFruit && blackFruit.x === this.x && blackFruit.y === this.y)
      );
    }
  
    show() {
      fill(200, 0, 0);
      drawingContext.shadowBlur = 5;
      drawingContext.shadowColor = "rgba(0, 0, 0, 0.3)";
      ellipse(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2, gridSize * 0.8, gridSize * 0.8);
      drawingContext.shadowBlur = 0;
    }
  }
  
  class BlueFruit {
    constructor(snakeBody, fruit) {
      do {
        this.x = floor(random(tileCount));
        this.y = floor(random(tileCount));
      } while (
        snakeBody.some(segment => segment.x === this.x && segment.y === this.y) ||
        (fruit && fruit.x === this.x && fruit.y === this.y)
      );
    }
  
    show() {
      fill(0, 0, 255);
      drawingContext.shadowBlur = 5;
      drawingContext.shadowColor = "rgba(0, 0, 0, 0.3)";
      ellipse(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2, gridSize * 0.8, gridSize * 0.8);
      drawingContext.shadowBlur = 0;
    }
  }
  
  class BlackFruit {
    constructor(snakeBody, fruit) {
      do {
        this.x = floor(random(tileCount));
        this.y = floor(random(tileCount));
      } while (
        snakeBody.some(segment => segment.x === this.x && segment.y === this.y) ||
        (fruit && fruit.x === this.x && fruit.y === this.y)
      );
    }
  
    show() {
      fill(0, 0, 0);
      drawingContext.shadowBlur = 5;
      drawingContext.shadowColor = "rgba(0, 0, 0, 0.3)";
      ellipse(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2, gridSize * 0.8, gridSize * 0.8);
      drawingContext.shadowBlur = 0;
    }
  }