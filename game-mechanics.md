# Game Mechanics - AI Apocalypse Shooter

## Jogador

### Características
- Velocidade de movimento: 3px por frame
- Vida inicial: 100 pontos
- Hitbox: círculo com raio de 16px
- Ataque automático (mobile) ou direcionado pelo mouse (desktop)

### Movimentação
- **Mobile:** Toque na tela para mover na direção do toque
- **Desktop:** Teclas WASD ou setas direcionais

### Ataque
- **Mobile:** Ataque automático a cada segundo (60 frames) na direção do movimento
- **Desktop:** Ataque na direção do mouse quando pressionado o botão esquerdo
- Velocidade das balas: 5px por frame
- Dano padrão: 1 ponto de vida do inimigo por tiro

## Inimigos

### Tipos de Inimigos

#### Normal
- Velocidade: 1.5px por frame
- Vida: 1 ponto
- Dano ao jogador: 10 pontos
- Comportamento: Persegue o jogador diretamente

#### Fast
- Velocidade: 2.5px por frame
- Vida: 1 ponto
- Dano ao jogador: 5 pontos
- Comportamento: Movimenta-se rapidamente, perseguindo o jogador em ziguezague

#### Strong
- Velocidade: 1px por frame
- Vida: 3 pontos
- Dano ao jogador: 20 pontos
- Comportamento: Movimento lento, mas resistente e causa alto dano

### Sistema de Spawn
- Inimigos normais: Aparecem desde o início
- Inimigos rápidos: Começam a aparecer a partir do nível de dificuldade 3
- Inimigos fortes: Começam a aparecer a partir do nível de dificuldade 5
- Frequência de spawn: `120/difficultyLevel` frames
- Posição de spawn: Aleatoriamente nas bordas da tela

## Sistema de Dificuldade

- Nível inicial: 1
- Aumento: A cada 30 segundos de sobrevivência
- Efeitos por nível:
  - Maior frequência de spawn de inimigos
  - Introdução de novos tipos de inimigos
  - Maior probabilidade de inimigos mais fortes

## Sistema de Colisões

### Bala-Inimigo
- Detectada quando a distância entre os centros for menor que a soma dos raios
- Resultado: Inimigo perde 1 ponto de vida, bala é removida
- Se a vida do inimigo chegar a 0, ele é removido e o jogador ganha 1 ponto

### Inimigo-Jogador
- Detectada quando a distância entre os centros for menor que a soma dos raios
- Resultado: Jogador perde pontos de vida igual ao dano do inimigo, inimigo é removido
- Se a vida do jogador chegar a 0, o jogo termina

## Sistema de Pontuação

- 1 ponto por inimigo derrotado
- Tempo de sobrevivência registrado em segundos
- Sem pontuação bônus por power-ups (a ser implementado posteriormente)

## Loop de Jogo

1. Atualiza nível de dificuldade baseado no tempo decorrido
2. Gera inimigos conforme regras de spawn
3. Processa entrada do usuário e movimenta jogador
4. Atualiza posição de balas e inimigos
5. Verifica colisões
6. Atualiza pontuação e estado do jogo
7. Renderiza fundo, jogador, inimigos, balas e UI
8. Verifica condição de Game Over

## Game Over

- Condição: Vida do jogador chega a 0
- Ação: Jogo para de atualizar (noLoop())
- Exibe tela com pontuação final e tempo de sobrevivência
- Opção para reiniciar o jogo
- Formulário para submissão de pontuação ao leaderboard

## Sistema de Leaderboard

- Após Game Over, o jogador pode submeter sua pontuação inserindo seu email
- A pontuação é registrada em um banco de dados Supabase
- Os dados armazenados incluem:
  - Email do jogador (parcialmente oculto na exibição pública)
  - Pontuação final
  - Tempo de sobrevivência
  - Nível de dificuldade alcançado
  - Data/hora da pontuação

### Fluxo do Leaderboard
1. Jogador perde (health <= 0)
2. Tela de Game Over exibe formulário para inserção de email
3. Após validação do email, pontuação é enviada ao Supabase
4. Sistema exibe o leaderboard com as melhores pontuações
5. A posição do jogador atual é destacada, mesmo que não esteja no top 10
6. Opção para jogar novamente é apresentada

### Segurança
- Validação do formato de email no cliente
- Limitação de submissões por email
- Mascaramento parcial de emails na exibição do leaderboard
- Proteção contra manipulação de pontuações no servidor

## Implementações Futuras (Extensões)

- **Power-ups:**
  - Vida extra: Recupera pontos de vida
  - Escudo: Invulnerabilidade temporária
  - Tiro rápido: Aumenta frequência de disparos
  - Tiro múltiplo: Dispara em múltiplas direções
  - Bomba: Elimina todos os inimigos na tela

- **Armas Especiais:**
  - Diferentes tipos de armas com padrões de disparo únicos
  - Munição limitada para armas especiais

- **Sistema de Progressão:**
  - Níveis/ondas definidas com padrões de inimigos específicos
  - Chefes ao final de cada nível

- **Expansões do Leaderboard:**
  - Filtragem por período (diário, semanal, mensal)
  - Integração com perfis de jogadores
  - Conquistas e emblemas exclusivos 