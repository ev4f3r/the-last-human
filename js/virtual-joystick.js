// virtual-joystick.js
// Implementação do joystick virtual para controles mobile

class VirtualJoystick {
  constructor() {
    this.baseX = 0;
    this.baseY = 0;
    this.stickX = 0;
    this.stickY = 0;
    this.active = false;
    this.radius = 50;
    this.innerRadius = 30;
    this.maxDistance = this.radius;
    this.touchId = null;
  }

  activate(x, y, id) {
    this.baseX = x;
    this.baseY = y;
    this.stickX = x;
    this.stickY = y;
    this.active = true;
    this.touchId = id;
  }

  update(x, y) {
    if (!this.active) return;
    
    let dx = x - this.baseX;
    let dy = y - this.baseY;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance > this.maxDistance) {
      // Normalizar para a distância máxima
      dx = (dx / distance) * this.maxDistance;
      dy = (dy / distance) * this.maxDistance;
    }
    
    this.stickX = this.baseX + dx;
    this.stickY = this.baseY + dy;
  }

  getDirection() {
    if (!this.active) return { x: 0, y: 0 };
    
    let dx = this.stickX - this.baseX;
    let dy = this.stickY - this.baseY;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance < 5) return { x: 0, y: 0 };
    
    return {
      x: dx / this.maxDistance,
      y: dy / this.maxDistance
    };
  }

  deactivate() {
    this.active = false;
    this.touchId = null;
  }

  draw() {
    if (!this.active) return;
    
    push();
    // Base do joystick
    noFill();
    stroke(255, 255, 255, 100);
    strokeWeight(2);
    circle(this.baseX, this.baseY, this.radius * 2);
    
    // Stick
    fill(255, 255, 255, 150);
    noStroke();
    circle(this.stickX, this.stickY, this.innerRadius * 2);
    pop();
  }
}

class AttackButton {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 40;
    this.active = false;
    this.touchId = null;
  }

  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.radius;
  }

  activate(id) {
    this.active = true;
    this.touchId = id;
  }

  deactivate() {
    this.active = false;
    this.touchId = null;
  }

  draw() {
    push();
    if (this.active) {
      fill(255, 0, 0, 150);
    } else {
      fill(255, 0, 0, 100);
    }
    noStroke();
    circle(this.x, this.y, this.radius * 2);
    
    // Ícone de tiro
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("🎯", this.x, this.y);
    pop();
  }
} 