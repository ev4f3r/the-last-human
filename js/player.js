// Funções relacionadas ao jogador
function drawPlayer() {
  push();
  translate(player.x, player.y);
  
  // Efeito de invulnerabilidade
  if (player.invulnerable) {
    if (frameCount % 10 < 5) {
      tint(255, 128);
    }
  }
  
  // Desenhar o jogador
  if (player.img) {
    image(player.img, 0, 0);
  } else {
    // Fallback se a imagem não estiver carregada
    fill(0, 255, 0);
    noStroke();
    circle(0, 0, player.radius * 2);
  }
  
  // Desenhar escudo se ativo
  if (player.shield) {
    noFill();
    stroke(0, 150, 255, 128 + sin(frameCount * 0.1) * 64);
    strokeWeight(2);
    circle(0, 0, player.radius * 2.5);
  }
  
  pop();
}

function updatePlayer() {
  // Processar os controles com base no tipo de dispositivo
  if (isMobile()) {
    processTouchControls();
  } else {
    processKeyboardControls();
    processMouseControls();
  }
  
  // Verificar limites da tela
  checkPlayerBounds();
  
  // Atualizar estado de invulnerabilidade
  updateInvulnerability();
  
  // Atualizar power-ups
  updatePlayerPowerups();
}

function checkPlayerBounds() {
  // Manter o jogador dentro dos limites da tela
  player.x = constrain(player.x, player.radius, width - player.radius);
  player.y = constrain(player.y, player.radius, height - player.radius);
}

function updateInvulnerability() {
  if (player.invulnerable) {
    if (millis() - player.invulnerableTime > player.invulnerableDuration) {
      player.invulnerable = false;
    }
  }
}

function updatePlayerPowerups() {
  // Atualizar escudo
  if (player.shield) {
    if (millis() - player.shieldTime > player.shieldDuration) {
      player.shield = false;
    }
  }
  
  // Atualizar boost de arma
  if (player.weaponBoost) {
    if (millis() - player.weaponBoostTime > player.weaponBoostDuration) {
      player.weaponBoost = false;
    }
  }
}

function damagePlayer(damage) {
  // Se o jogador estiver invulnerável ou com escudo, não recebe dano
  if (player.invulnerable || player.shield) return;
  
  // Aplicar dano
  player.health -= damage;
  
  // Ativar invulnerabilidade temporária
  player.invulnerable = true;
  player.invulnerableTime = millis();
  
  // Verificar game over
  if (player.health <= 0) {
    gameState = GAME_STATE.GAME_OVER;
  }
}

function healPlayer(amount) {
  player.health = min(player.health + amount, 100);
} 