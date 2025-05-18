# Estratégia Mobile-First - AI Apocalypse Shooter

## Visão Geral

O jogo está sendo desenvolvido com uma abordagem mobile-first, garantindo que a experiência seja ótima em dispositivos móveis, enquanto mantém compatibilidade com desktop. Isso significa que todas as decisões de design, controles e otimizações são pensadas primeiramente para o ambiente móvel.

## Controles Touch

### Movimentação
- **Implementação:** Sistema de toque simples onde o jogador se move na direção do toque
- **Código:**
```js
if (touches.length > 0) {
  let dx = touches[0].x - player.x;
  let dy = touches[0].y - player.y;
  let d = sqrt(dx*dx + dy*dy);
  if (d > 5) {
    player.x += (dx/d) * player.speed;
    player.y += (dy/d) * player.speed;
  }
}
```

### Ataque Automático
- Em dispositivos móveis, o jogador ataca automaticamente na direção do movimento
- Frequência de ataque ajustada para balancear a jogabilidade
- **Código:**
```js
if (frameCount % 60 === 0) {
  // Usa a última direção de movimento para atirar
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
```

### Prevenção de Comportamentos Indesejados
- Impedir scroll da página quando o usuário interage com o jogo
- **Código:**
```js
function touchMoved() {
  return false;
}

function touchStarted() {
  return false;
}
```

## Design Responsivo

### Redimensionamento do Canvas
- Canvas adapta-se automaticamente ao tamanho da tela
- Redimensionamento quando o dispositivo é girado
- **Código:**
```js
function setup() {
  createCanvas(windowWidth, windowHeight);
  // ...
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Ajustar posições e dimensões de elementos com base no novo tamanho
}
```

### Posicionamento de Elementos
- HUD posicionado com base em percentuais da tela, não valores fixos
- Proporção dos elementos ajustada ao tamanho da tela
- Margem de segurança para áreas de toque (evitando botões muito pequenos)

### Tratamento de Diferentes Proporções
- Manter o jogador no centro da tela
- Ajustar área visível com base na proporção da tela
- Considerar "safe areas" para dispositivos com notch ou cantos arredondados

## Otimizações de Performance

### Renderização Eficiente
- `pixelDensity(1)` para reduzir carga de renderização
- `noSmooth()` para manter a estética pixel art e melhorar performance
- Uso de `p5.min.js` para reduzir tamanho do download

### Gerenciamento de Objetos
- Limitar número máximo de inimigos e projéteis simultâneos
- Remover objetos fora da tela
- Object pooling para reutilização de objetos (reduz coleta de lixo)
- **Código exemplo para limitar inimigos:**
```js
if (enemies.length < 100) {
  // Adicionar novo inimigo
}
```

### Otimização de Assets
- Sprites pequenos e otimizados
- Paleta limitada (8-16 cores)
- Background único, carregado uma vez (sem paralaxe)
- Spritesheet único para tipos similares de objetos

### Simplificação para Dispositivos de Baixo Desempenho
- Detecção de FPS para ajustar automaticamente qualidade
- Redução de partículas e efeitos visuais
- Limitar quantidade de inimigos em dispositivos mais lentos

## Testes Cross-Device

### Estratégia de Testes
- Testar em diferentes tamanhos de tela
- Verificar desempenho em dispositivos de diferentes capacidades
- Testar diferentes tipos de entrada (touch múltiplo, toque único)

### Problemas Comuns a Evitar
- Diferenças de proporção entre Android e iOS
- Inconsistências no comportamento de touch entre navegadores
- Variações de desempenho entre dispositivos

## Compatibilidade Desktop

Mesmo com foco mobile, o jogo mantém controles alternativos para desktop:

- Movimentação via teclado (WASD/setas)
- Mira e tiro com mouse
- Interface ajustada para interação não-touch
- Tamanho do HUD proporcional à resolução 