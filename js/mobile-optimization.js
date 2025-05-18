// Configurações de otimização mobile
const MobileOptimization = {
  // Detecta se é dispositivo mobile
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  
  // Configurações de qualidade baseadas no dispositivo
  quality: {
    maxEnemies: 0,
    particleMultiplier: 1,
    frameRate: 60
  },

  // Inicializa otimizações
  init() {
    if (this.isMobile) {
      // Detecta performance do dispositivo
      const performance = this.detectDevicePerformance();
      this.adjustQuality(performance);
      this.setupTouchHandling();
      this.preventDefaultBehaviors();
    }
  },

  // Detecta capacidade do dispositivo
  detectDevicePerformance() {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    return (memory * cores) / 8; // Score de 0 a 1
  },

  // Ajusta qualidade baseado na performance
  adjustQuality(performanceScore) {
    if (performanceScore < 0.3) {
      this.quality.maxEnemies = 10;
      this.quality.particleMultiplier = 0.5;
      this.quality.frameRate = 30;
    } else if (performanceScore < 0.7) {
      this.quality.maxEnemies = 15;
      this.quality.particleMultiplier = 0.75;
      this.quality.frameRate = 45;
    } else {
      this.quality.maxEnemies = 20;
      this.quality.particleMultiplier = 1;
      this.quality.frameRate = 60;
    }
  },

  // Configura manipulação de eventos touch
  setupTouchHandling() {
    document.addEventListener('touchstart', (e) => {
      if (e.target.nodeName !== 'BUTTON') {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  },

  // Previne comportamentos padrão indesejados
  preventDefaultBehaviors() {
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());
    
    // Previne zoom com duplo toque
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  },

  // Retorna configurações atuais
  getSettings() {
    return this.quality;
  }
};

// Inicializa otimizações
MobileOptimization.init(); 