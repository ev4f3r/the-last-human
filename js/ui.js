// Desenhar o menu principal
function drawMenu() {
  // Fundo com gradiente semitransparente
  drawGradientBackground();
  
  // Título
  push();
  fill(0, 255, 0);
  textAlign(CENTER, CENTER);
  
  // Ajustar tamanho do texto com base na tela
  let titleSize = min(45, width / 15);
  let subtitleSize = min(50, width / 14);
  
  textSize(titleSize);
  textStyle(BOLD);
  text("AI APOCALYPSE", width/2, height/3 - 40);
  textSize(subtitleSize);
  text("SHOOTER", width/2, height/3 + 10);
  // Efeito de sombra
  fill(0, 150, 0, 150);
  text("SHOOTER", width/2 + 3, height/3 + 13);
  pop();
  
  // Subtítulo
  push();
  fill(200, 200, 200);
  textAlign(CENTER, CENTER);
  textSize(isMobile() ? 14 : 18);
  textStyle(ITALIC);
  text("O último sobrevivente contra as IAs rebeldes", width/2, height/3 + 60);
  pop();
  
  // Botões maiores para dispositivos móveis
  let buttonWidth = isMobile() ? 260 : 240;
  let buttonHeight = isMobile() ? 80 : 60;
  
  // Botão para iniciar
  drawButton(
    width/2 - buttonWidth/2,
    height/2 + 20,
    buttonWidth,
    buttonHeight,
    "INICIAR JOGO",
    startGame
  );
  
  // Instruções
  push();
  fill(180, 180, 180);
  textAlign(CENTER, CENTER);
  let instructionSize = isMobile() ? 16 : 15;
  textSize(instructionSize);
  
  if (isMobile()) {
    text("Toque na tela para mover e atirar", width/2, height/2 + 120);
    text("Toque no botão acima para iniciar", width/2, height/2 + 150);
  } else {
    text("WASD/Setas para mover", width/2, height/2 + 120);
    text("Mouse para mirar, Clique para atirar", width/2, height/2 + 150);
    text("ESC para voltar ao menu, F para mostrar FPS", width/2, height/2 + 180);
  }
  pop();
}

// Desenhar o HUD (informações durante o jogo)
function drawUI() {
  // Ajustar tamanho do HUD para dispositivos móveis
  let fontSize = isMobile() ? 14 : 16;
  let marginX = isMobile() ? 5 : 10;
  let marginY = isMobile() ? 15 : 20;
  
  // Área de fundo semitransparente para melhor legibilidade
  fill(0, 0, 0, 150);
  noStroke();
  rect(0, 0, width / 2, 90);
  
  // Exibir informações do jogo
  fill(255);
  textAlign(LEFT, TOP);
  textSize(fontSize);
  text("Pontuação: " + score, marginX, marginY);
  text("Vida: " + player.health, marginX, marginY * 2);
  text("Nível: " + difficultyLevel, marginX, marginY * 3);
  
  // Barra de vida
  let healthBarWidth = 200;
  let healthBarHeight = 10;
  let healthX = marginX;
  let healthY = marginY * 4;
  
  // Fundo da barra
  fill(100, 0, 0);
  rect(healthX, healthY, healthBarWidth, healthBarHeight);
  
  // Vida atual
  fill(255, 0, 0);
  rect(healthX, healthY, healthBarWidth * (player.health / 100), healthBarHeight);
  
  // Status de power-ups
  if (player.shield) {
    fill(0, 150, 255);
    let shieldTime = floor((player.shieldTime + player.shieldDuration - millis()) / 1000);
    text("Escudo: " + shieldTime + "s", marginX, marginY * 5);
  }
  
  if (player.weaponBoost) {
    fill(255, 200, 0);
    let boostTime = floor((player.weaponBoostTime + player.weaponBoostDuration - millis()) / 1000);
    text("Boost de Arma: " + boostTime + "s", marginX, marginY * 6);
  }
}

// Desenhar tela de game over
function drawGameOver() {
  // Fundo escuro semitransparente
  background(0, 0, 0, 200);
  
  push();
  textAlign(CENTER, CENTER);
  
  // Game Over
  textSize(48);
  fill(255, 0, 0);
  text("GAME OVER", width/2, height/3);
  
  // Pontuação final
  textSize(24);
  fill(255);
  text("Pontuação: " + score, width/2, height/2);
  text("Inimigos eliminados: " + enemiesKilled, width/2, height/2 + 40);
  
  // Tempo de sobrevivência
  let elapsedTime = floor((millis() - startTime) / 1000);
  let minutes = floor(elapsedTime / 60);
  let seconds = elapsedTime % 60;
  text(
    "Tempo de sobrevivência: " + nf(minutes, 2) + ":" + nf(seconds, 2),
    width/2,
    height/2 + 80
  );
  
  // Instruções para reiniciar
  textSize(18);
  fill(200, 200, 200);
  if (isMobile()) {
    text("Toque na tela para tentar novamente", width/2, height * 0.7);
  } else {
    text("Pressione ESPAÇO para tentar novamente", width/2, height * 0.7);
  }
  pop();
}

// Desenhar um botão interativo
function drawButton(x, y, w, h, label, callback) {
  // Verificar se o mouse está sobre o botão
  let hover = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  
  push();
  // Efeito de animação
  let animOffset = sin(frameCount * 0.05) * 2;
  
  // Desenhar sombra
  fill(0, 0, 0, 100);
  noStroke();
  rect(x + 3, y + 3, w, h, 5);
  
  // Desenhar o fundo do botão
  if (hover) {
    fill(100, 255, 100);
    stroke(50, 200, 50);
  } else {
    fill(50, 150, 50);
    stroke(30, 100, 30);
  }
  
  strokeWeight(2);
  rect(x, y + animOffset, w, h, 5);
  
  // Desenhar brilho no topo
  if (hover) {
    noStroke();
    fill(150, 255, 150, 150);
    rect(x, y + animOffset, w, h/4, 5, 5, 0, 0);
  }
  
  // Desenhar o texto do botão
  if (hover) {
    fill(0, 50, 0);
  } else {
    fill(255);
  }
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(label, x + w/2, y + h/2 + animOffset);
  pop();
  
  // Registrar o callback para quando o botão for clicado
  if (hover && mouseIsPressed) {
    callback();
  }
}

// Desenhar fundo com gradiente
function drawGradientBackground() {
  push();
  noFill();
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(
      color(0, 0, 0, 200),
      color(0, 50, 0, 200),
      inter
    );
    stroke(c);
    line(0, i, width, i);
  }
  pop();
} 