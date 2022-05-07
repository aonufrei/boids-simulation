
class Boid {

    constructor(x, y, maxSpeed) {
        this.linedWith = []
        this.position = createVector(x, y)
        this.velocity = p5.Vector.random2D()
        this.acceleration = createVector()
        this.vision = random(50, 100)
        this.maxSpeed = maxSpeed
        this.maxForce = 0.01
        this.showVisible = false
        this.showNeibours = false
        this.showFoodView = false
        this.foodVision = random(250, 600)
        this.maxHungerForce = 0.5
        this.hungerForce = this.maxHungerForce
    }

    mirror() {
        if (this.position.x > width) {
            this.position.x = 0
        } else if (this.position.x < 0) {
            this.position.x = width
        }

        if (this.position.y > height) {
            this.position.y = 0
        } else if (this.position.y < 0) {
            this.position.y = height
        }
    }

    nearest(boids) {
        let nearestBoids = []
        this.linedWith = []
        push()
        for (let other of boids) {
            if (other != this && p5.Vector.sub(other.position, this.position).mag() <= this.vision) {
                nearestBoids.push(other)

                if (this.showNeibours && other.linedWith.indexOf(this) === -1) {
                    this.linedWith.push(other)
                    stroke('rgba(255, 255, 255, 0.4)')
                    strokeWeight(2);
                    line(this.position.x, this.position.y, other.position.x, other.position.y);
                }
            }
        }
        pop()

        return nearestBoids
    }

    align(boids) {
        let steering = createVector()
        if (boids.length === 0) return steering

        for (let other of boids) {
            steering.add(other.velocity)
        }

        steering.div(boids.length)
        steering.setMag(this.maxSpeed)
        steering.sub(this.velocity)
        steering.limit(this.maxForce)

        return steering
    }

    cohesion(boids) {
        let steering = createVector()
        if (boids.length === 0) return steering

        for (let other of boids) {
            steering.add(other.position)
        }

        steering.div(boids.length)
        steering.sub(this.position)
        steering.setMag(this.maxSpeed)
        steering.sub(this.velocity)
        steering.limit(this.maxForce)

        return steering
    }

    separation(boids) {
        let steering = createVector()
        if (boids.length === 0) return steering

        for (let other of boids) {
            let fromOtherToBoid = p5.Vector.sub(this.position, other.position)
            fromOtherToBoid.div(fromOtherToBoid.mag() * fromOtherToBoid.mag())
            steering.add(fromOtherToBoid)
        }

        steering.div(boids.length)
        steering.setMag(this.maxSpeed)
        steering.sub(this.velocity)
        steering.limit(this.maxForce)

        return steering
    }

    flock(boids) {
        this.acceleration.set(0, 0)
        let alignment = this.align(boids)
        let cohesion = this.cohesion(boids)
        let separation = this.separation(boids)

        alignment.mult(cohesionSlider.value())
        cohesion.mult(alignmentSlider.value())
        separation.mult(sparationSlider.value())

        this.acceleration.add(alignment)
        this.acceleration.add(cohesion)
        this.acceleration.add(separation)
    }

    eat(food) {
        food.capacity -= 0.4
        this.hungerForce -= 0.1
        if (this.hungerForce < 0) this.hungerForce = 0
    }

    seekFood(food) {
        let steering = p5.Vector.sub(food.position, this.position)
        if (steering.mag() <= this.foodVision) {
            if (steering.mag() < food.radius) {
                this.eat(food)
            } else {
                steering.sub(this.velocity)
                steering.limit(this.hungerForce)
                this.acceleration.add(steering)
            }
            
        }
    }

    update() {
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
        this.position.add(this.velocity)

        this.hungerForce += this.maxHungerForce / 1000
        if (this.hungerForce > this.maxHungerForce) {
            this.hungerForce = this.maxHungerForce
        }
        this.mirror()
    }

    draw() {
        let triangleSize = 4
        push()
        color(240)
        stroke(255, 255, 255)
        strokeWeight(3)
        let hungerFactor = 1 - this.hungerForce / this.maxHungerForce
        fill(`rgba(255, 0, 0, ${hungerFactor})`)
        translate(this.position.x, this.position.y)
        rotate(createVector(0, 1).angleBetween(this.velocity))
        triangle(-triangleSize, -triangleSize, triangleSize, -triangleSize, 0, triangleSize * 4)
        stroke(0, 255, 0)
        strokeWeight(3)
        if (this.showVisible) {
            noFill()
            stroke('rgba(0, 255, 0, 0.1)')
            strokeWeight(2);
            circle(0, 0, this.vision * 2)
        }
        if (this.showFoodView) {
            noFill()
            stroke('rgba(0, 0, 255, 0.1)')
            strokeWeight(2);
            circle(0, 0, this.foodVision * 2)
        }

        pop()
    }


}