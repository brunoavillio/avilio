export class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvasWidth - this.canvasWidth/2;
        this.y = Math.random() * this.canvasHeight - this.canvasHeight/2;
        this.z = Math.random() * 2000 + 1000;
        this.baseSpeed = 1.5 + Math.random() * 0.8; // Restored original base speed
        this.currentSpeed = this.baseSpeed;
        this.acceleration = 0;
        this.size = 1.5;
    }

    update(intensity) {
        const targetSpeed = this.baseSpeed * (1 + intensity * 6.2); // Slightly increased from 6.0
        const accelerationFactor = 0.13; // Slightly increased from 0.12
        
        this.acceleration += (targetSpeed - this.currentSpeed) * accelerationFactor;
        this.acceleration *= 0.9;
        
        this.currentSpeed += this.acceleration;
        this.z -= this.currentSpeed;

        if (this.z <= 0.1) {
            this.reset();
        }

        const perspective = 600;
        const scale = perspective / (perspective + this.z);
        
        return {
            x: this.x * scale + this.canvasWidth/2,
            y: this.y * scale + this.canvasHeight/2,
            size: Math.max(0.5, this.size * scale * (1 + intensity))
        };
    }
}