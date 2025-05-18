# Sistema de Leaderboard - AI Apocalypse Shooter

## Visão Geral

O sistema de leaderboard permitirá que jogadores registrem suas pontuações para competir globalmente. Quando o jogador é derrotado, será apresentada uma tela para inserir seu email antes de submeter a pontuação para o leaderboard global. O Supabase será utilizado como backend para armazenar e consultar as pontuações.

## Estrutura de Dados no Supabase

### Tabela `leaderboard`

| Coluna         | Tipo      | Descrição                                      |
|----------------|-----------|------------------------------------------------|
| id             | uuid      | Identificador único (PK)                       |
| email          | string    | Email do jogador                               |
| score          | integer   | Pontuação obtida                               |
| survival_time  | integer   | Tempo de sobrevivência em segundos             |
| created_at     | timestamp | Data e hora do registro                        |
| player_name    | string    | Nome do jogador (opcional)                     |
| difficulty     | integer   | Nível de dificuldade alcançado                 |

### Código SQL para Criar a Tabela

```sql
-- Criação da tabela de leaderboard
CREATE TABLE public.leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  score INTEGER NOT NULL,
  survival_time INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  player_name TEXT,
  difficulty INTEGER NOT NULL DEFAULT 1,
  
  -- Validações básicas
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_score CHECK (score >= 0),
  CONSTRAINT valid_survival_time CHECK (survival_time >= 0),
  CONSTRAINT valid_difficulty CHECK (difficulty >= 1)
);

-- Índice para consultas por pontuação
CREATE INDEX leaderboard_score_idx ON public.leaderboard (score DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção anônima
CREATE POLICY "Permitir inserções anônimas" ON public.leaderboard
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública" ON public.leaderboard
  FOR SELECT USING (true);

-- Restringir atualizações e exclusões (somente admin pode fazer isso)
CREATE POLICY "Restringir atualizações" ON public.leaderboard
  FOR UPDATE USING (false);
CREATE POLICY "Restringir exclusões" ON public.leaderboard
  FOR DELETE USING (false);

-- Comentário na tabela para documentação
COMMENT ON TABLE public.leaderboard IS 'Tabela de pontuações do jogo AI Apocalypse Shooter';
```

Para usar este código:
1. Acesse o painel do Supabase do seu projeto
2. Vá para a seção "SQL Editor"
3. Crie uma nova query
4. Cole o código SQL acima
5. Execute a query

## Fluxo de Funcionamento

1. Jogador é derrotado (player.health <= 0)
2. O jogo pausa e apresenta a tela de Game Over com:
   - Pontuação final
   - Tempo de sobrevivência
   - Campo para inserir email
   - Botão para submeter score
3. Após submeter, o sistema:
   - Valida o email
   - Envia os dados para o Supabase
   - Exibe o leaderboard com a posição do jogador destacada
4. Opção para reiniciar o jogo é apresentada

## Implementação no Frontend

### Atualização da função `drawGameOver()`

```js
function drawGameOver() {
  background(0, 0, 0, 200);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("GAME OVER", width/2, height/2 - 60);
  
  textSize(18);
  text("Pontuação: " + score, width/2, height/2 - 20);
  text("Tempo de sobrevivência: " + floor(millis()/1000) + "s", width/2, height/2 + 10);
  
  // Campo de email
  drawEmailInput(width/2 - 150, height/2 + 50, 300, 30);
  
  // Botão de submissão
  drawSubmitButton(width/2 - 100, height/2 + 100, 200, 40, "ENVIAR PONTUAÇÃO");
  
  textAlign(LEFT, BASELINE);
}
```

### Componentes de UI para Leaderboard

```js
// Campo de input para email
function drawEmailInput(x, y, w, h) {
  fill(255);
  rect(x, y, w, h);
  
  if (emailInputActive) {
    fill(0);
  } else {
    fill(150);
  }
  
  textAlign(LEFT, CENTER);
  if (playerEmail === "") {
    text("Digite seu email", x + 10, y + h/2);
  } else {
    text(playerEmail, x + 10, y + h/2);
  }
}

// Botão de submissão
function drawSubmitButton(x, y, w, h, label) {
  if (playerEmail !== "" && validateEmail(playerEmail)) {
    fill(0, 255, 0);
  } else {
    fill(150);
  }
  
  rect(x, y, w, h);
  fill(0);
  textAlign(CENTER, CENTER);
  text(label, x + w/2, y + h/2);
}

// Validação de email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
```

### Tratamento de Eventos para Submissão

```js
function touchStarted() {
  if (gameOver) {
    // Verificar clique no campo de email
    if (mouseX > width/2 - 150 && mouseX < width/2 + 150 &&
        mouseY > height/2 + 50 && mouseY < height/2 + 80) {
      emailInputActive = true;
      // Abrir teclado virtual em dispositivos móveis
      if (touches.length > 0) {
        openKeyboard();
      }
    } else {
      emailInputActive = false;
    }
    
    // Verificar clique no botão de submissão
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
        mouseY > height/2 + 100 && mouseY < height/2 + 140) {
      if (playerEmail !== "" && validateEmail(playerEmail)) {
        submitScore();
      }
    }
  }
  return false;
}

// Entrada de teclado para desktop
function keyPressed() {
  if (gameOver && emailInputActive) {
    if (keyCode === BACKSPACE) {
      playerEmail = playerEmail.slice(0, -1);
    } else if (keyCode === ENTER) {
      if (validateEmail(playerEmail)) {
        submitScore();
      }
    } else if (keyCode >= 32 && keyCode <= 126) {
      playerEmail += key;
    }
    return false;
  }
}
```

## Integração com Supabase

### Configuração Inicial

```js
// No início do código
let supabase;

// Na função setup
function setup() {
  // Configurações existentes...
  
  // Inicialização do Supabase
  supabase = createClient(
    'https://sua-url-do-supabase.supabase.co',
    'sua-chave-publica-do-supabase'
  );
}
```

### Submissão de Pontuação

```js
async function submitScore() {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([
        {
          email: playerEmail,
          score: score,
          survival_time: floor(millis()/1000),
          difficulty: difficultyLevel
        }
      ]);
      
    if (error) {
      console.error('Erro ao enviar pontuação:', error);
      return;
    }
    
    // Mostrar leaderboard após submissão bem-sucedida
    showLeaderboard();
  } catch (err) {
    console.error('Erro na comunicação com o Supabase:', err);
  }
}
```

### Exibição do Leaderboard

```js
async function showLeaderboard() {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);
      
    if (error) {
      console.error('Erro ao buscar leaderboard:', error);
      return;
    }
    
    // Alterar estado do jogo para exibir leaderboard
    gameState = 'leaderboard';
    leaderboardData = data;
    
    // Encontrar posição do jogador atual
    const { data: playerRank } = await supabase
      .from('leaderboard')
      .select('*')
      .gte('score', score)
      .order('score', { ascending: false });
    
    currentPlayerRank = playerRank ? playerRank.length : 0;
    
  } catch (err) {
    console.error('Erro na comunicação com o Supabase:', err);
  }
}

function drawLeaderboard() {
  background(0);
  
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("LEADERBOARD", width/2, 50);
  
  textSize(18);
  textAlign(LEFT, CENTER);
  
  for (let i = 0; i < leaderboardData.length; i++) {
    const entry = leaderboardData[i];
    const y = 120 + i * 40;
    
    // Destacar o jogador atual
    if (entry.email === playerEmail && entry.score === score) {
      fill(255, 255, 0);
    } else {
      fill(255);
    }
    
    // Posição
    text(`${i + 1}.`, width/2 - 180, y);
    
    // Email (ocultar parcialmente por privacidade)
    const maskedEmail = maskEmail(entry.email);
    text(maskedEmail, width/2 - 150, y);
    
    // Pontuação
    textAlign(RIGHT, CENTER);
    text(entry.score, width/2 + 150, y);
    textAlign(LEFT, CENTER);
  }
  
  // Mostrar posição do jogador atual se não estiver no top 10
  if (!leaderboardData.some(entry => entry.email === playerEmail && entry.score === score)) {
    fill(255, 255, 0);
    textAlign(CENTER, CENTER);
    text(`Sua posição: ${currentPlayerRank}`, width/2, height - 80);
  }
  
  // Botão para voltar
  drawBackButton(width/2 - 100, height - 50, 200, 40, "JOGAR NOVAMENTE");
}

function maskEmail(email) {
  const parts = email.split('@');
  if (parts.length === 2) {
    const name = parts[0];
    const domain = parts[1];
    if (name.length > 2) {
      return name.substring(0, 2) + '*'.repeat(name.length - 2) + '@' + domain;
    }
  }
  return email;
}
```

## Segurança e Armazenamento

### Permissões no Supabase

- Configurar a tabela `leaderboard` para permitir inserções anônimas (sem autenticação)
- Restringir seleções para apenas os campos necessários na visualização pública
- Implementar validações RLS (Row Level Security) para evitar manipulação de dados

### Prevenção de Fraudes

- Validar scores no servidor antes de aceitar submissões
- Limitar número de submissões por email/IP
- Implementar honeypots para detectar submissões automatizadas

## Integração com o Sistema de Jogo Existente

### Estados de Jogo Adicionais

```js
// No início do código
let gameState = 'menu'; // menu, playing, gameOver, leaderboard
let leaderboardData = [];
let playerEmail = '';
let emailInputActive = false;
let currentPlayerRank = 0;

// Na função draw principal
function draw() {
  switch (gameState) {
    case 'menu':
      drawMenu();
      break;
    case 'playing':
      // Lógica de jogo existente
      break;
    case 'gameOver':
      drawGameOver();
      break;
    case 'leaderboard':
      drawLeaderboard();
      break;
  }
}
```

## Considerações Mobile-First

- Campo de email otimizado para teclados virtuais
- Tamanho adequado dos elementos touch
- Implementação do teclado virtual simplificada
- Validação em tempo real para feedback imediato

## Futuras Expansões

- Filtragem de leaderboard por período (dia, semana, mês, todos os tempos)
- Adicionar avatares personalizados
- Implementar sistemas de conquistas
- Integração com autenticação completa do Supabase para perfis de jogadores 