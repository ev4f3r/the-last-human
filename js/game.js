// Iniciar o jogo
function startGame() {
  // Resetar estado do jogo
  gameState = GAME_STATE.PLAYING;
  score = 0;
  enemies = [];
  bullets = [];
  powerups = [];
  startTime = millis();
  enemiesKilled = 0;
  difficultyLevel = 1;
  
  // Inicializar jogador
  player = {
    x: width/2,
    y: height/2,
    speed: 3,
    health: 100,
    radius: 16,
    img: playerImg,
    lastMoveAngle: 0,
    aimAngle: 0,
    shield: false,
    shieldTime: 0,
    shieldDuration: 0,
    weaponBoost: false,
    weaponBoostTime: 0,
    weaponBoostDuration: 0,
    attackCooldown: 500,
    invulnerable: false,
    invulnerableTime: 0,
    invulnerableDuration: 1000
  };
  
  // Inicializar controles
  initControls();
  
  // Iniciar música de fundo
  if (bgMusic && !bgMusic.isPlaying()) {
    bgMusic.loop();
  }
}

// ... resto do código existente ... 