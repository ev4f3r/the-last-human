// Configurações dos projéteis
const BULLET_SPEED = 10;
const BULLET_RADIUS = 4;
const BULLET_DAMAGE = 25;

function createBullet(x, y, angle) {
  return {
    x: x,
    y: y,
    vx: cos(angle) * BULLET_SPEED,
    vy: sin(angle) * BULLET_SPEED,
    radius: BULLET_RADIUS,
    damage: BULLET_DAMAGE
  };
}

function updateBullet(bullet) {
  // Atualizar posição
  bullet.x += bullet.vx;
  bullet.y += bullet.vy;
  
  // Remover se estiver fora da tela
  if (bullet.x < -bullet.radius || 
      bullet.x > width + bullet.radius ||
      bullet.y < -bullet.radius || 
      bullet.y > height + bullet.radius) {
    let index = bullets.indexOf(bullet);
    if (index > -1) {
      bullets.splice(index, 1);
    }
  }
}

function drawBullet(bullet) {
  push();
  translate(bullet.x, bullet.y);
  
  if (bullet.img) {
    image(bullet.img, 0, 0);
  } else {
    // Fallback se a imagem não estiver carregada
    fill(255, 255, 0);
    noStroke();
    circle(0, 0, bullet.radius * 2);
    
    // Efeito de brilho
    fill(255, 255, 0, 50);
    circle(0, 0, bullet.radius * 3);
  }
  
  pop();
}

function checkBulletCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];
    
    // Verificar colisão com inimigos
    for (let j = enemies.length - 1; j >= 0; j--) {
      let enemy = enemies[j];
      let d = dist(bullet.x, bullet.y, enemy.x, enemy.y);
      
      if (d < bullet.radius + enemy.radius) {
        // Aplicar dano ao inimigo
        damageEnemy(enemy, bullet.damage);
        
        // Remover projétil
        bullets.splice(i, 1);
        break;
      }
    }
  }
} 