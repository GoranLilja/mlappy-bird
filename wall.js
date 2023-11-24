class Wall {
    constructor(w = 20) {
        this.x = width
        this.h = random(20, 300)
        this.gap = random(20, 80)
        this.w = w
    }

    update() {
        this.x -= difficulty
    }

    draw() {
        fill(255, 0, 0)
        rect(this.x, 0, this.w, this.h)
        const lowerHeight = height - this.h - this.gap
        rect(this.x, height - lowerHeight, this.w, lowerHeight)
    }
}
