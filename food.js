
class FoodArea {

    constructor(x, y, capacity, radius) {
        this.position = createVector(x, y)
        this.initialRadius = radius
        this.minRadius = this.initialRadius / 3
        this.radius = radius
        this.initialCapacity = capacity
        this.capacity = capacity
        this.alive = true
    }

    update() {
        if (this.capacity < this.initialCapacity / 5) {
            this.alive = false
        }

        this.radius = this.initialRadius * (this.capacity / this.initialCapacity)
        if (this.radius < this.minRadius) {
            this.radius = this.minRadius
        }
    }
    
    draw() {
        push()
        noStroke()
        fill(color('rgba(64, 209, 56, 0.3)'))
        circle(this.position.x, this.position.y, this.radius)
        pop()
    }


}