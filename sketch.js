// Variáveis globais
let player;
let enemies = [];
let bullets = [];
let powerups = [];
let score = 0;
let gameState;
let startTime;
let enemiesKilled = 0;
let difficultyLevel = 1;

// Estados do jogo
const GAME_STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAME_OVER: 'game_over'
};

// Configuração inicial
function setup() {
  createCanvas(windowWidth, windowHeight);
  // Em dispositivos móveis, forçar a densidade de pixels para 1 para melhor desempenho
  if (isMobile()) {
    pixelDensity(1);
  }
  
  // Configurações para melhorar a renderização de imagens
  noSmooth(); // Desabilitar suavização para manter o visual pixel art nítido
  imageMode(CENTER); // Todas as imagens serão centralizadas em sua posição x,y
  
  // Iniciar no menu
  gameState = GAME_STATE.MENU;
}

// Loop principal do jogo
function draw() {
  background(0);
  
  switch (gameState) {
    case GAME_STATE.MENU:
      drawMenu();
      break;
    case GAME_STATE.PLAYING:
      updateGame();
      drawGame();
      break;
    case GAME_STATE.GAME_OVER:
      drawGameOver();
      break;
  }
}

// Atualizar o jogo
function updateGame() {
  if (player) {
    // Atualizar jogador
    updatePlayer();
    
    // Atualizar inimigos
    for (let i = enemies.length - 1; i >= 0; i--) {
      updateEnemy(enemies[i]);
    }
    
    // Atualizar projéteis
    for (let i = bullets.length - 1; i >= 0; i--) {
      updateBullet(bullets[i]);
    }
    
    // Verificar colisões
    checkCollisions();
    
    // Atualizar power-ups
    updatePowerups();
    
    // Aumentar dificuldade com o tempo
    updateDifficulty();
  }
}

// Desenhar o jogo
function drawGame() {
  // Desenhar projéteis
  for (let bullet of bullets) {
    drawBullet(bullet);
  }
  
  // Desenhar inimigos
  for (let enemy of enemies) {
    drawEnemy(enemy);
  }
  
  // Desenhar power-ups
  for (let powerup of powerups) {
    drawPowerup(powerup);
  }
  
  // Desenhar jogador
  if (player) {
    drawPlayer();
  }
  
  // Desenhar UI
  drawUI();
}

// Redimensionar canvas quando a janela for redimensionada
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Reposicionar elementos da UI se necessário
  if (attackButton) {
    attackButton.x = width - 80;
    attackButton.y = height - 80;
  }
} 