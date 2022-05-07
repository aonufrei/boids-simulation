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
let showFoodViewValue = false

let showView;
let showNeibours;
let showFoodView;

const NEXT_FOOD_TIMER = 200
let foodGenerated = false
let lastFoodGeneration = 0

function setup() {
    createCanvas(800, 800);
    ui()
    for(let i = 0; i < BOIDS_NUMBER; i++) {
        boids.push(new Boid(width / 2 + random(-400, 400), height / 2 + random(-400, 400), maxSpeedSlider.value()))
    }
}

let foodArea

function draw() {
    background(10);
    if (foodArea !== undefined && foodArea.alive) {
        lastFoodGeneration = 0
        foodArea.update()
        foodArea.draw()
    } else {
        lastFoodGeneration++
        foodGenerated = false
    }

    if (!foodGenerated && lastFoodGeneration >= NEXT_FOOD_TIMER) {
        foodArea = new FoodArea(random(0, width), random(0, height), 200, random(100, 200))
        foodGenerated = true
    }

    for (let b of boids) {
        b.vision = boidViewSlider.value()

        b.maxSpeed = maxSpeedSlider.value()
        b.maxForce = maxForceSlider.value() / 100
        
        b.showVisible = showViewValue
        b.showNeibours = showNeiboursValue
        b.showFoodView = showFoodViewValue

        let nearest = b.nearest(boids)
        b.flock(nearest)
        if (foodArea != undefined && foodArea.alive) {
            b.seekFood(foodArea)
        }
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

    showView = createCheckbox('Show boids view', showViewValue)
    showNeibours = createCheckbox('Show boids neibours', showNeiboursValue)
    showFoodView = createCheckbox('Show food view', showFoodViewValue)

    showView.changed(() => showViewValue = !showViewValue)
    showNeibours.changed(() => showNeiboursValue = !showNeiboursValue)
    showFoodView.changed(() => showFoodViewValue = !showFoodViewValue)
    maxSpeedSlider.style('width', '160px');
    maxForceSlider.style('width', '160px');
}