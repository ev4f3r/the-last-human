// Tipos de inimigos
const ENEMY_TYPES = {
  NORMAL: {
    health: 100,
    speed: 2,
    damage: 10,
    points: 100,
    radius: 20,
    color: [255, 0, 0]
  },
  FAST: {
    health: 50,
    speed: 4,
    damage: 5,
    points: 150,
    radius: 15,
    color: [255, 165, 0]
  },
  STRONG: {
    health: 200,
    speed: 1,
    damage: 20,
    points: 200,
    radius: 25,
    color: [128, 0, 0]
  }
};

function createEnemy(type = 'NORMAL') {
  // Posição aleatória fora da tela
  let spawnSide = floor(random(4));
  let x, y;
  
  switch(spawnSide) {
    case 0: // Topo
      x = random(width);
      y = -50;
      break;
    case 1: // Direita
      x = width + 50;
      y = random(height);
      break;
    case 2: // Baixo
      x = random(width);
      y = height + 50;
      break;
    case 3: // Esquerda
      x = -50;
      y = random(height);
      break;
  }
  
  let enemyType = ENEMY_TYPES[type];
  
  return {
    x: x,
    y: y,
    type: type,
    health: enemyType.health,
    speed: enemyType.speed,
    damage: enemyType.damage,
    points: enemyType.points,
    radius: enemyType.radius,
    color: enemyType.color,
    lastHit: 0
  };
}

function updateEnemy(enemy) {
  // Movimento em direção ao jogador
  let dx = player.x - enemy.x;
  let dy = player.y - enemy.y;
  let distance = sqrt(dx * dx + dy * dy);
  
  if (distance > 0) {
    enemy.x += (dx / distance) * enemy.speed;
    enemy.y += (dy / distance) * enemy.speed;
  }
}

function drawEnemy(enemy) {
  push();
  translate(enemy.x, enemy.y);
  
  // Efeito de hit
  if (millis() - enemy.lastHit < 100) {
    fill(255);
  } else {
    fill(enemy.color);
  }
  
  // Desenhar inimigo
  if (enemy.img) {
    image(enemy.img, 0, 0);
  } else {
    // Fallback se a imagem não estiver carregada
    noStroke();
    circle(0, 0, enemy.radius * 2);
  }
  
  // Barra de vida
  let healthPercent = enemy.health / ENEMY_TYPES[enemy.type].health;
  if (healthPercent < 1) {
    noStroke();
    fill(255, 0, 0);
    rect(-enemy.radius, -enemy.radius - 10, enemy.radius * 2, 5);
    fill(0, 255, 0);
    rect(-enemy.radius, -enemy.radius - 10, enemy.radius * 2 * healthPercent, 5);
  }
  
  pop();
}

function damageEnemy(enemy, damage) {
  enemy.health -= damage;
  enemy.lastHit = millis();
  
  if (enemy.health <= 0) {
    // Aumentar pontuação
    score += enemy.points;
    enemiesKilled++;
    
    // Chance de dropar power-up
    if (random() < 0.1) {
      spawnPowerup(enemy.x, enemy.y);
    }
    
    // Remover inimigo
    let index = enemies.indexOf(enemy);
    if (index > -1) {
      enemies.splice(index, 1);
    }
  }
}

function spawnEnemies() {
  // Quantidade de inimigos baseada na dificuldade
  let maxEnemies = 5 + floor(difficultyLevel / 2);
  
  while (enemies.length < maxEnemies) {
    let type;
    let rand = random();
    
    // Probabilidade de cada tipo baseada na dificuldade
    if (rand < 0.6) {
      type = 'NORMAL';
    } else if (rand < 0.9) {
      type = 'FAST';
    } else {
      type = 'STRONG';
    }
    
    enemies.push(createEnemy(type));
  }
} 