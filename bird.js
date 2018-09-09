function mutate(x) {
    if (random(1) < 0.1) {
        let offset = randomGaussian() * 0.5
        let newx = x + offset
        return newx
    } else {
        return x
    }
}

class Bird {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.r = 20
        this.score = 0
        this.dead = false

        this.vel = 0
        this.acc = 0

        // Inputs: 
        // - y location of bird
        // - x location of closest wall
        // - y location of upper wall
        // - y location of lower wall
        // - velocity of bird
        // Hidden nodes: 4
        // Output: Jump?
        this.nn = new NeuralNetwork(4, 2, 1)
    }

    setNetwork(nn) {
        this.nn = nn.copy();
        this.nn.mutate(mutate);
    }

    decide(walls) {
        const inputs = []
        inputs[0] = this.y / height
        inputs[1] = walls[0].x / width
        inputs[2] = walls[0].h / height
        inputs[3] = (walls[0].gap + walls[0].h) / height
        //inputs[4] = this.vel // TODO: Normalize somehow

        const output = this.nn.predict(inputs)[0]
        if (output > 0.5) {
            this.flap()
        }
    }

    flap() {
        this.applyForce(UP_FORCE)
    }

    applyForce(f) {
        this.acc += f
        this.vel += this.acc
        this.y += this.vel
        this.acc = 0
    }

    update() {
        if (this.y + this.r / 2 >= height) {
            this.y = height - this.r / 2
        } else if (this.y - this.r / 2 <= 0) {
            this.y = this.r / 2
        }
    }

    draw() {
        fill(100, 250, 100, 150)
        noStroke()
        ellipse(this.x, this.y, this.r)
        if (this.dead === false) {
            this.score++
        }
    }

    checkCollision(walls) {
        if (this.y + this.r / 2 >= height || this.y - this.r / 2 <= 0) {
            this.dead = true
        }
        if (walls.length === 0) this.dead = false
        const wall = walls[0]
        // Check for distance
        if (wall.x <= this.x + this.r/2 && wall.x + wall.w >= this.x - this.r/2) {
            // Check upper wall
            if (this.y - this.r/2 <= wall.h) this.dead = true
            // Check lower wall
            if (this.y + this.r/2 >= wall.h + wall.gap) this.dead = true
        }
    }
}