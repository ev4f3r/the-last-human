# Estrutura de Código - AI Apocalypse Shooter

## Visão Geral dos Arquivos

### `/index.html`
- Estrutura HTML básica
- Carregamento de p5.min.js
- Carregamento de sketch.js e demais scripts
- Metadados para responsividade mobile

### `/sketch.js`
- Arquivo principal com setup, preload e draw
- Gerencia estados do jogo
- Coordena outras classes e sistemas

### `/js/game.js`
- Classe principal do jogo
- Gerencia estados (menu, jogando, game over)
- Inicializa e coordena outros componentes

### `/js/player.js`
- Classe do jogador
- Atributos: posição, velocidade, vida, raio
- Métodos: movimentação, disparo, detecção de dano

### `/js/enemy.js`
- Classes de inimigos
- Variações para cada tipo (normal, fast, strong)
- Sistema de geração (spawn) e perseguição (AI)

### `/js/bullet.js`
- Classe de projéteis
- Movimentação baseada em velocidade vetorial
- Detecção de saída da tela

### `/js/controls.js`
- Sistema de controles
- Detecção e processamento de touch (mobile)
- Detecção e processamento de teclado/mouse (desktop)

### `/js/collision.js`
- Sistema de colisões
- Detecção entre círculos (player-enemy, bullet-enemy)
- Aplicação de dano

### `/js/ui.js`
- Sistema de UI
- HUD durante o jogo
- Tela de game over
- Menus e instruções

## Funções Principais

### `preload()`
```js
function preload() {
  playerImg       = loadImage('assets/player.png');
  enemyNormalImg  = loadImage('assets/enemy_normal.png');
  enemyFastImg    = loadImage('assets/enemy_fast.png');
  enemyStrongImg  = loadImage('assets/enemy_strong.png');
  bulletImg       = loadImage('assets/bullet.png');
  backgroundImg   = loadImage('assets/background.png');
}
```

### `setup()`
```js
function setup() {
  p5.disableFriendlyErrors = true;
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noSmooth();
  imageMode(CENTER);
  background(0);
  
  // Inicialização de objetos
  player = {
    x: width/2,
    y: height/2,
    speed: 3,
    health: 100,
    radius: 16,
    img: playerImg
  };
  
  enemies = [];
  bullets = [];
  score = 0;
  gameOver = false;
  difficultyLevel = 1;
}
```

### `draw()`
```js
function draw() {
  // 1. Limpa o canvas
  background(0);
  
  // 2. Desenha o background
  image(backgroundImg, width/2, height/2, width, height);
  
  // 3. Atualiza dificuldade
  let survivedSec = floor(millis()/1000);
  difficultyLevel = 1 + floor(survivedSec/30);
  
  // 4. Gera inimigos
  if (frameCount % int(120/difficultyLevel) === 0) {
    enemies.push(spawnEnemy('normal'));
    if (difficultyLevel > 3 && random() < 0.3) enemies.push(spawnEnemy('fast'));
    if (difficultyLevel > 5 && random() < 0.2) enemies.push(spawnEnemy('strong'));
  }
  
  // 5. Atualiza jogador (baseado em input)
  updatePlayer();
  
  // 6. Atualiza projeteis
  updateBullets();
  
  // 7. Atualiza inimigos
  updateEnemies();
  
  // 8. Verifica colisões
  checkCollisions();
  
  // 9. Desenha objetos
  drawBullets();
  drawEnemies();
  drawPlayer();
  
  // 10. Desenha UI
  drawUI();
  
  // 11. Verifica game over
  if (player.health <= 0 && !gameOver) {
    gameOver = true;
    drawGameOver();
  }
}
```

### `updatePlayer()`
```js
function updatePlayer() {
  // Movimentação mobile
  if (touches.length > 0) {
    let dx = touches[0].x - player.x;
    let dy = touches[0].y - player.y;
    let d = sqrt(dx*dx + dy*dy);
    if (d > 5) {
      player.x += (dx/d) * player.speed;
      player.y += (dy/d) * player.speed;
      player.lastMoveAngle = atan2(dy, dx);
    }
  }
  
  // Movimentação desktop
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) player.x -= player.speed;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) player.x += player.speed;
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) player.y -= player.speed;
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) player.y += player.speed;
  
  // Tiro automático (mobile)
  if (touches.length > 0 && frameCount % 60 === 0) {
    let dir = player.lastMoveAngle || 0;
    bullets.push({
      x: player.x,
      y: player.y,
      vx: cos(dir) * 5,
      vy: sin(dir) * 5,
      radius: 4,
      img: bulletImg
    });
  }
  
  // Limites da tela
  player.x = constrain(player.x, player.radius, width - player.radius);
  player.y = constrain(player.y, player.radius, height - player.radius);
}
```

### `spawnEnemy(type)`
```js
function spawnEnemy(type) {
  let e = {
    x: 0,
    y: 0,
    speed: 1.5,
    health: 1,
    damage: 10,
    radius: 16,
    img: enemyNormalImg
  };
  
  // Posiciona aleatoriamente nas bordas
  let edge = floor(random(4));
  switch(edge) {
    case 0: // topo
      e.x = random(width);
      e.y = -e.radius;
      break;
    case 1: // direita
      e.x = width + e.radius;
      e.y = random(height);
      break;
    case 2: // baixo
      e.x = random(width);
      e.y = height + e.radius;
      break;
    case 3: // esquerda
      e.x = -e.radius;
      e.y = random(height);
      break;
  }
  
  // Define características por tipo
  if (type === 'fast') {
    e.speed = 2.5;
    e.img = enemyFastImg;
    e.damage = 5;
  }
  if (type === 'strong') {
    e.health = 3;
    e.speed = 1;
    e.img = enemyStrongImg;
    e.damage = 20;
  }
  
  return e;
}
```

### `checkCollisions()`
```js
function checkCollisions() {
  // Verifica colisões bala-inimigo
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      let e = enemies[j];
      let d = dist(b.x, b.y, e.x, e.y);
      if (d < b.radius + e.radius) {
        e.health--;
        bullets.splice(i, 1);
        if (e.health <= 0) {
          enemies.splice(j, 1);
          score++;
        }
        break;
      }
    }
  }
  
  // Verifica colisões jogador-inimigo
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    let d = dist(player.x, player.y, e.x, e.y);
    if (d < player.radius + e.radius) {
      player.health -= e.damage;
      enemies.splice(i, 1);
      if (player.health <= 0) {
        gameOver = true;
        noLoop();
      }
    }
  }
}
```

### `drawUI()`
```js
function drawUI() {
  fill(255);
  textSize(16);
  text("Pontuação: " + score, 10, 20);
  text("Tempo: " + floor(millis()/1000) + "s", 10, 40);
  
  // Barra de vida
  let pct = player.health/100;
  fill(255, 0, 0);
  rect(10, 50, 100*pct, 10);
  noFill();
  stroke(255);
  rect(10, 50, 100, 10);
  noStroke();
}
```

### `drawGameOver()`
```js
function drawGameOver() {
  background(0, 0, 0, 200);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("GAME OVER", width/2, height/2 - 40);
  textSize(18);
  text("Pontuação: " + score, width/2, height/2);
  text("Tempo de sobrevivência: " + floor(millis()/1000) + "s", width/2, height/2 + 30);
  text("Toque para reiniciar", width/2, height/2 + 80);
  textAlign(LEFT, BASELINE);
  noLoop();
}
```

### Funções de Eventos

```js
function touchStarted() {
  if (gameOver) {
    resetGame();
  }
  return false;
}

function mousePressed() {
  if (gameOver) {
    resetGame();
  }
  return false;
}

function resetGame() {
  setup();
  loop();
}

function touchMoved() {
  return false;
}
``` 