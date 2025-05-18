# Plano de Implementação - AI Apocalypse Shooter

## Estrutura do Projeto

```
/
├── index.html
├── sketch.js
├── js/
│   ├── game.js        # Classe principal do jogo
│   ├── player.js      # Classe do jogador
│   ├── enemy.js       # Classes de inimigos
│   ├── bullet.js      # Classe de projéteis
│   ├── powerup.js     # Sistema de power-ups
│   ├── collision.js   # Sistema de colisões
│   ├── controls.js    # Sistema de controles (mobile e desktop)
│   ├── ui.js          # Interface do usuário
│   └── leaderboard.js # Sistema de leaderboard e integração com Supabase
└── assets/
    ├── player.png
    ├── enemy_normal.png
    ├── enemy_fast.png
    ├── enemy_strong.png
    ├── bullet.png
    └── background.png
```

## Fases de Implementação

### Fase 1: Estrutura Base e Rendering
- Configuração inicial do projeto (index.html, p5.js)
- Implementação do sketch.js com configuração básica
- Sistema de carregamento de assets
- Renderização do background e sprites básicos
- Implementação da classe Player com movimentação básica

### Fase 2: Sistema de Controles Mobile-First
- Implementação do sistema de touch para dispositivos móveis
- Movimento do jogador baseado em toque
- Sistema de ataques automáticos
- Implementação de controles alternativos para desktop (teclado + mouse)

### Fase 3: Inimigos e Colisões
- Implementação das classes de inimigos (Normal, Fast, Strong)
- Sistema de spawn de inimigos baseado em dificuldade
- Implementação do sistema de colisões
- Lógica de perseguição dos inimigos

### Fase 4: Mecânicas de Jogo
- Sistema de pontuação
- Sistema de vida do jogador
- Lógica de game over
- Implementação do sistema de dificuldade progressiva

### Fase 5: UI e Polish
- Interface do usuário (HUD) com pontuação, tempo e vida
- Tela de game over com reinício
- Otimizações de performance
- Ajustes finais e testes em diferentes dispositivos

### Fase 6: Sistema de Leaderboard
- Configuração da integração com Supabase
- Criação da tabela de leaderboard no Supabase
- Implementação do formulário de submissão de pontuação
- Desenvolvimento da visualização do leaderboard
- Sistema de validação de e-mail
- Proteção contra fraudes e submissões inválidas
- Testes de integração entre o jogo e o Supabase

## Detalhes Técnicos

### Configuração Inicial
```js
p5.disableFriendlyErrors = true;
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noSmooth();
  imageMode(CENTER);
  background(0);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
```

### Carregamento de Assets
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

### Estruturas de Dados Principais
```js
let player = {
  x: width/2, y: height/2, speed: 3,
  health: 100, radius:16, img: playerImg
};
let enemies = [];
let bullets = [];
let score = 0;
let gameOver = false;
let difficultyLevel = 1;
let gameState = 'menu'; // menu, playing, gameOver, leaderboard
let leaderboardData = [];
let playerEmail = '';
```

### Considerações Mobile-First
- Controles touch intuitivos
- Performance otimizada para dispositivos móveis
- Interface adaptativa para diferentes tamanhos de tela
- Prevenção de comportamentos indesejados (como scroll da página)
- Redimensionamento automático ao girar o dispositivo
- Input de e-mail otimizado para dispositivos móveis

### Otimizações
- Uso de p5.min.js
- pixelDensity(1) para reduzir carga de renderização
- Limitação da quantidade de objetos simultâneos
- Reutilização de objetos quando possível
- Limitação de partículas e efeitos especiais em dispositivos de baixo desempenho
- Requisições assíncronas para não bloquear a interface durante operações de leaderboard 