function checkCollisions() {
  // Verificar colisões entre jogador e inimigos
  checkPlayerEnemyCollisions();
  
  // Verificar colisões entre projéteis e inimigos
  checkBulletCollisions();
  
  // Verificar colisões entre jogador e power-ups
  checkPowerupCollisions();
}

function checkPlayerEnemyCollisions() {
  if (!player) return;
  
  for (let enemy of enemies) {
    let d = dist(player.x, player.y, enemy.x, enemy.y);
    
    if (d < player.radius + enemy.radius) {
      // Aplicar dano ao jogador
      damagePlayer(enemy.damage);
      
      // Knockback no inimigo
      let angle = atan2(enemy.y - player.y, enemy.x - player.x);
      enemy.x += cos(angle) * 50;
      enemy.y += sin(angle) * 50;
    }
  }
}

function checkPowerupCollisions() {
  if (!player) return;
  
  for (let i = powerups.length - 1; i >= 0; i--) {
    let powerup = powerups[i];
    let d = dist(player.x, player.y, powerup.x, powerup.y);
    
    if (d < player.radius + powerup.radius) {
      // Aplicar efeito do power-up
      applyPowerup(powerup);
      
      // Remover power-up
      powerups.splice(i, 1);
    }
  }
}

function applyPowerup(powerup) {
  switch (powerup.type) {
    case 'health':
      healPlayer(25);
      break;
      
    case 'shield':
      player.shield = true;
      player.shieldTime = millis();
      player.shieldDuration = 5000; // 5 segundos
      break;
      
    case 'weapon':
      player.weaponBoost = true;
      player.weaponBoostTime = millis();
      player.weaponBoostDuration = 5000; // 5 segundos
      break;
  }
} 