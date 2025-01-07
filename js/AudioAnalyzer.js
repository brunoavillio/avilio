export class AudioAnalyzer {
    constructor(audio) {
        this.audio = audio;
        this.isPlaying = false;
        this.audioContext = null;
        this.analyser = null;
        this.smoothedIntensity = 0;
        this.previousIntensities = new Array(5).fill(0); // Store previous intensities
    }

    async init() {
        this.audioContext = new AudioContext();
        const source = this.audioContext.createMediaElementSource(this.audio);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 1024; // Higher resolution
        this.analyser.smoothingTimeConstant = 0.5;
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    getIntensity() {
        if (!this.analyser || !this.isPlaying) return 0;
    
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
    
        // Ampliar el rango de frecuencias
        const totalRange = dataArray.slice(0, 50); // Foco en graves y medios
        const averageIntensity = totalRange.reduce((sum, value) => sum + value, 0) / totalRange.length;
    
        // Escalar intensidad entre 0 y 1
        const scaledIntensity = Math.min(1, averageIntensity / 150);
    
        // Reducir el suavizado para mejorar la respuesta
        this.smoothedIntensity += (scaledIntensity - this.smoothedIntensity) * 0.5;
    
        return this.smoothedIntensity;
    }
    
    

    async togglePlay() {
        if (!this.audioContext) {
            await this.init();
        }
    
        if (this.isPlaying) {
            this.audio.pause();
            this.audioContext.suspend();
            console.log('Audio paused');
        } else {
            await this.audio.play();
            this.audioContext.resume();
            console.log('Audio playing');
        }
    
        this.isPlaying = !this.isPlaying;
    }
    
}