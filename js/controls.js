// controls.js
// Sistema de controles (mobile e desktop)

// Variáveis para controle
let lastAttackTime = 0;
const BASE_ATTACK_COOLDOWN = 500; // 500ms entre ataques no estado normal

// Controles virtuais para mobile
let joystick = null;
let attackButton = null;

// Inicializar controles
function initControls() {
  if (isMobile()) {
    joystick = new VirtualJoystick();
    attackButton = new AttackButton(width - 80, height - 80);
  }
}

// Processar controles de toque (mobile)
function processTouchControls() {
  if (!isMobile()) return;

  // Atualizar joystick com todos os toques
  for (let i = 0; i < touches.length; i++) {
    let touch = touches[i];
    
    // Se o toque está na metade esquerda da tela e o joystick não está ativo
    if (!joystick.active && touch.x < width/2) {
      joystick.activate(touch.x, touch.y, touch.id);
    }
    // Se o toque corresponde ao joystick ativo
    else if (joystick.active && touch.id === joystick.touchId) {
      joystick.update(touch.x, touch.y);
    }
    
    // Verificar botão de ataque
    if (attackButton.contains(touch.x, touch.y)) {
      if (!attackButton.active) {
        attackButton.activate(touch.id);
      }
    }
  }

  // Aplicar movimento do joystick
  if (joystick.active) {
    let dir = joystick.getDirection();
    player.x += dir.x * player.speed;
    player.y += dir.y * player.speed;
    
    // Atualizar ângulo do último movimento para os ataques
    if (dir.x !== 0 || dir.y !== 0) {
      player.lastMoveAngle = atan2(dir.y, dir.x);
    }
  }

  // Processar ataque
  if (attackButton.active) {
    autoAttack();
  }

  // Desenhar controles virtuais
  drawVirtualControls();
}

// Desenhar controles virtuais
function drawVirtualControls() {
  if (!isMobile()) return;
  
  joystick.draw();
  attackButton.draw();
}

// Processar controles de teclado (desktop)
function processKeyboardControls() {
  let moving = false;
  let dx = 0;
  let dy = 0;
  
  // Detecção de movimento
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { dx -= 1; moving = true; } // Esquerda ou 'A'
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { dx += 1; moving = true; } // Direita ou 'D'
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) { dy -= 1; moving = true; } // Cima ou 'W'
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { dy += 1; moving = true; } // Baixo ou 'S'

  // Normalizar diagonal
  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071; // 1/sqrt(2)
    dy *= 0.7071;
  }
  
  // Aplicar movimento
  if (moving) {
    player.x += dx * player.speed;
    player.y += dy * player.speed;
    player.lastMoveAngle = atan2(dy, dx);
  }
}

// Processar controles de mouse (desktop)
function processMouseControls() {
  // Atualizar a direção de mira com base na posição do mouse
  let dx = mouseX - player.x;
  let dy = mouseY - player.y;
  player.aimAngle = atan2(dy, dx);
}

// Função de ataque automático para mobile
function autoAttack() {
  let currentTime = millis();
  
  // Obter o cooldown atual (pode ser afetado por power-ups)
  let currentCooldown = player.weaponBoost ? BASE_ATTACK_COOLDOWN / 2 : BASE_ATTACK_COOLDOWN;
  
  // Verificar se passou tempo suficiente desde o último ataque
  if (currentTime - lastAttackTime > currentCooldown) {
    // Criar um novo projétil
    createBullet(player.x, player.y, player.lastMoveAngle);
    lastAttackTime = currentTime;
  }
}

// Tiro manual para desktop
function shoot() {
  let currentTime = millis();
  
  // Obter o cooldown atual (pode ser afetado por power-ups)
  let currentCooldown = player.weaponBoost ? BASE_ATTACK_COOLDOWN / 2 : BASE_ATTACK_COOLDOWN;
  
  // Verificar cooldown
  if (currentTime - lastAttackTime > currentCooldown) {
    // Criar um novo projétil na direção do mouse
    createBullet(player.x, player.y, player.aimAngle);
    lastAttackTime = currentTime;
  }
}

// Eventos de toque e mouse
function touchStarted() {
  // Iniciar o jogo a partir do menu com toque na tela
  if (gameState === GAME_STATE.MENU) {
    startGame();
    return false;
  }
  
  // Reiniciar o jogo na tela de game over com toque na tela
  if (gameState === GAME_STATE.GAME_OVER) {
    if (touches[0].y > height/2) {
      startGame();
    }
    return false;
  }
  
  // Prevenir comportamento padrão em dispositivos móveis
  return false;
}

function touchEnded() {
  if (!isMobile()) return false;

  // Verificar qual toque foi removido
  for (let i = 0; i < touches.length; i++) {
    let touch = touches[i];
    
    // Se o toque removido era do joystick
    if (joystick.active && touch.id === joystick.touchId) {
      joystick.deactivate();
    }
    
    // Se o toque removido era do botão de ataque
    if (attackButton.active && touch.id === attackButton.touchId) {
      attackButton.deactivate();
    }
  }
  
  return false;
}

function touchMoved() {
  // Prevenir scroll na tela
  return false;
}

function mousePressed() {
  // Atirar ao clicar com o mouse (apenas no desktop)
  if (!isMobile() && gameState === GAME_STATE.PLAYING) {
    shoot();
  }
  return false;
}

// Verificar se o dispositivo é mobile
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
} 