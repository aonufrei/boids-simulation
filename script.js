const BOIDS_NUMBER = 100;
const boids = []

let mousePosX = 0
let mousePosY = 0

let boidViewSlider

let maxSpeedSlider
let maxForceSlider

let cohesionSlider
let alignmentSlider
let sparationSlider

let showViewValue = false
let showNeiboursValue = false

let showView;
let showNeibours;

function setup() {
    createCanvas(800, 800);
    ui()
    for(let i = 0; i < BOIDS_NUMBER; i++) {
        boids.push(new Boid(width / 2 + random(-400, 400), height / 2 + random(-400, 400), maxSpeedSlider.value()))
    }
}

function draw() {
    background(10);

    for (let b of boids) {
        b.vision = boidViewSlider.value()

        b.maxSpeed = maxSpeedSlider.value()
        b.maxForce = maxForceSlider.value() / 100
        
        b.showVisible = showViewValue
        b.showNeibours = showNeiboursValue

        b.flock(b.nearest(boids))
        b.update()
        b.draw()
    }

}


function ui() {
    maxSpeedSlider = createSlider(1, 40, 5, 0.1);
    maxForceSlider = createSlider(1, 10, 3, 0.1);

    boidViewSlider = createSlider(30, 150, 80, 0.1)

    cohesionSlider = createSlider(0.01, 10, 1, 0.01)
    alignmentSlider = createSlider(0.01, 10, 1, 0.01)
    sparationSlider = createSlider(0.01, 10, 1, 0.01)


    showView = createCheckbox('Show boids view', false)
    showNeibours = createCheckbox('Show boids neibours', false)
    showView.changed(showViewPressed)
    showNeibours.changed(showNeiboursPressed)
    maxSpeedSlider.style('width', '160px');
    maxForceSlider.style('width', '160px');
}


function showViewPressed() {
    showViewValue = !showViewValue
}

function showNeiboursPressed() {
    showNeiboursValue = !showNeiboursValue
}