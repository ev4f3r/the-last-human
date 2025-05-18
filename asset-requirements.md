# Requisitos de Assets - AI Apocalypse Shooter

## Visão Geral

O jogo utiliza um estilo visual de pixel art 2D com uma paleta limitada de cores e visão top-down. Os assets devem seguir uma estética retro-futurista que represente um mundo devastado por IAs rebeldes.

## Paleta de Cores

- Paleta limitada de 8-16 cores
- Alto contraste para melhor visibilidade em dispositivos móveis
- Tons de azul e ciano para elementos tecnológicos
- Tons de vermelho e laranja para elementos de perigo/dano
- Tons de verde para power-ups e elementos de recuperação
- Fundo escuro para melhor destaque dos sprites

## Sprites Necessários

### Jogador
- Dimensões recomendadas: 32x32 pixels
- Representa o último sobrevivente humano
- Visual: Humano com equipamento improvisado contra IAs
- Animação: Ideal ter 2-4 frames de animação para movimento
- Arquivo: `player.png`

### Inimigos

#### Inimigo Normal
- Dimensões recomendadas: 32x32 pixels
- Visual: Drone de combate básico ou robô patrulha
- Animação: 2-4 frames
- Arquivo: `enemy_normal.png`

#### Inimigo Rápido
- Dimensões recomendadas: 24x24 pixels (menor que o normal)
- Visual: Drone pequeno e ágil ou unidade de reconhecimento
- Animação: 2-4 frames, transmitindo sensação de velocidade
- Arquivo: `enemy_fast.png`

#### Inimigo Forte
- Dimensões recomendadas: 48x48 pixels (maior que o normal)
- Visual: Unidade blindada ou robô de assalto pesado
- Animação: 2-4 frames, movimento mais lento
- Arquivo: `enemy_strong.png`

### Projéteis
- Dimensões recomendadas: 8x8 pixels
- Visual: Projétil de energia ou bala
- Animação: 2-4 frames, opcional efeito de trilha
- Arquivo: `bullet.png`

### Background
- Dimensões: 512x512 pixels (será escalado para preencher a tela)
- Visual: Cidade futurista em ruínas
- Elementos para incluir:
  - Arranha-céus danificados
  - Cabos e circuitos expostos
  - Luzes de neon quebradas
  - Drones e robôs caídos/destruídos
  - Sinais de batalha (crateras, marcas de queimadura)
- Arquivo: `background.png`

## Extensões Futuras (Opcional)

### Power-ups
- Dimensões recomendadas: 16x16 pixels
- Tipos:
  - Vida (visual: kit médico ou bateria de energia)
  - Escudo (visual: campo de força ou barreira de energia)
  - Arma avançada (visual: melhoria de arma ou munição especial)
- Animação: Pulsar ou brilhar para chamar atenção
- Arquivos: `powerup_health.png`, `powerup_shield.png`, `powerup_weapon.png`

### Efeitos
- Explosão (quando inimigos são destruídos)
- Impacto de projétil
- Indicador de dano no jogador
- Arquivos: `effect_explosion.png`, `effect_impact.png`, `effect_damage.png`

## Especificações Técnicas

### Formato
- PNG com transparência
- Otimizado para web (tamanho de arquivo reduzido)
- Sem suavização (manter estética pixel perfect)

### Organização
- Sprites individuais ou spritesheet organizada
- Se utilizar spritesheet, documentar layout das animações
- Recomendação: manter cada tipo de objeto em arquivo separado para facilitar carregamento

### Responsividade
- Assets devem funcionar bem quando escalados em diferentes resoluções
- Evitar detalhes muito pequenos que podem desaparecer em dispositivos móveis
- Manter contraste adequado para visualização em telas menores

## Estilo Visual de Referência

- Estética retro-futurista
- Inspiração em jogos clássicos de arcade dos anos 80/90
- Efeitos de brilho/neon para elementos tecnológicos
- Contraste entre elementos tecnológicos (inimigos) e improvisados (jogador)
- Sensação de desolação e destruição no cenário de fundo 

## Boas Práticas para Fornecimento dos Assets

### Como Fornecer os Sprites
1. **Nomeação exata dos arquivos:**
   - Use exatamente os nomes especificados (ex: `player.png`, `enemy_normal.png`)
   - Mantenha a nomenclatura em minúsculas e sem espaços

2. **Localização dos arquivos:**
   - Coloque todos os arquivos na pasta `/assets/` do projeto
   - Não crie subpastas adicionais, a menos que especificado

3. **Processo de implementação:**
   - O jogo carregará automaticamente os sprites através da função `preload()` do p5.js
   - Não é necessário editar código para carregar os sprites, desde que os nomes e localizações estejam corretos

### Formato e Preparação
- **Resolução e dimensões:**
  - Siga as dimensões recomendadas para cada sprite
  - Mantenha a proporção indicada (não distorça as imagens)
  
- **Transparência:**
  - Fundo transparente (alpha channel) para todos os sprites (exceto background)
  - Evite anti-aliasing nas bordas para manter a estética pixel art

- **Otimização:**
  - Compresse as imagens para reduzir o tamanho dos arquivos
  - Use ferramentas como TinyPNG ou ImageOptim se necessário

### Spritesheets para Animações
- Se optar por fornecer animações como spritesheets:
  - Organize os frames em uma única linha horizontal
  - Mantenha espaçamento igual entre cada frame
  - Documente o número total de frames e o tamanho de cada um
  - Exemplo de formato: `player.png` contendo 4 frames de 32x32px = 128x32px total

### Testes Visuais
- Verifique seus sprites no jogo antes da finalização
- Teste em diferentes tamanhos de tela para garantir visibilidade em dispositivos móveis
- Confirme que os sprites mantêm a coerência visual com o resto do jogo 