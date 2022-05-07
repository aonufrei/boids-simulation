
class Boid {

    constructor(x, y, maxSpeed) {
        this.position = createVector(x, y)
        this.velocity = p5.Vector.random2D()
        this.acceleration = createVector()
        this.vision = random(50, 100)
        this.maxSpeed = maxSpeed
        this.maxForce = 0.01
        this.showVisible = false
        this.showNeibours = false
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
        push()
        for (let other of boids) {

            if (other != this && p5.Vector.sub(other.position, this.position).mag() <= this.vision) {
                nearestBoids.push(other)

                if (this.showNeibours) {
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

    update() {
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
        this.position.add(this.velocity)

        this.mirror()
    }

    draw() {
        let triangleSize = 4

        push()
        color(240)
        stroke(255, 255, 255)
        strokeWeight(3)
        fill('rgba(255, 255, 255, 0.4)')
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
        pop()
    }


}