class Snake {
  constructor(rows, cols) {
    this.body = [{ x: 0, y: 0 }];
    this.direction = "right";
    this.food = new Food();
    this.rows = rows;
    this.cols = cols;
  }

  move() {
    const head = { ...this.body[0] };
    switch (this.direction) {
      case "up":
        head.y = (head.y - 1 + this.rows) % this.rows;
        break;
      case "down":
        head.y = (head.y + 1) % this.rows;
        break;
      case "left":
        head.x = (head.x - 1 + this.cols) % this.cols;
        break;
      case "right":
        head.x = (head.x + 1) % this.cols;
        break;
    }

    this.body.unshift(head);

    if (head.x === this.food.location.x && head.y === this.food.location.y) {
      this.food.replace();
    } else {
      this.body.pop();
    }
  }

  eat(food) {
    const head = this.body[0];
    if (head.x === food.location.x && head.y === food.location.y) {
      this.body.push({ ...this.body[this.body.length - 1] });
      return true;
    }
    return false;
  }

  changeDirection(newDirection) {
    if (["up", "down", "left", "right"].includes(newDirection)) {
      this.direction = newDirection;
    }
  }
}

class Score {
  constructor() {
    this.currentScore = 0;
    this.highScore = 0;
  }

  save() {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      localStorage.setItem("highScore", this.highScore);
    }
  }

  updateDisplay() {
    const currentScoreElement = document.getElementById("current-score");
    const highScoreElement = document.getElementById("high-score");

    currentScoreElement.innerText = `Current Score:  + ${this.currentScore}`;
    highScoreElement.innerText = `High Score: ${this.highScore}`;
  }
}

class Food {
  constructor() {
    this.location = this.generateLocation();
  }
  generateLocation() {
    return {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    };
  }
  replace() {
    this.location = this.generateLocation();
  }
}

class Game {
  constructor() {
    this.snake = new Snake(20, 20);
    this.food = new Food();
    this.score = new Score();
    this.rows = 20;
    this.columns = 20;
  }
  render() {
    const board = document.querySelector(".game-board");

    board.innerHTML = "";

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");

        for (let i = 0; i < this.snake.body.length; i++) {
          if (this.snake.body[i].x === col && this.snake.body[i].y === row) {
            cell.classList.add("snake");
          }
        }

        if (this.food.location.x === col && this.food.location.y === row) {
          cell.classList.add("food");
        }

        board.appendChild(cell);
      }
    }
  }

  reset() {
    console.log("Game reset!");
    this.snake = new Snake(this.rows, this.columns);
    this.food = new Food();

    this.render();
  }

  hitSelf() {
    const head = this.snake.body[0];

    for (let i = 1; i < this.snake.body.length; i++) {
      if (head.y === this.snake.body[i].y && head.x === this.snake.body[i].x) {
        console.log("Collision detected!");
        console.log("Head coordinates:", head.x, head.y);
        console.log(
          "Colliding body coordinates:",
          this.snake.body[i].x,
          this.snake.body[i].y
        );
        this.reset();
        return true;
      }
    }
    return false;
  }
  update() {
    this.snake.move();

    if (this.hitSelf()) {
      alert(`Game Over! Current Score: ${this.snake.score.currentScore}`);
      console.log("Hit self detected!");
      this.reset();
      return;
    }
    this.render();

    if (this.snake.eat(this.food)) {
      this.food.replace();
      console.log(this.snake.score.currentScore);
      this.score.currentScore += 1;
      this.score.updateDisplay();
      this.score.save();
    }
  }
}

let game = new Game();
game.render();
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      game.snake.changeDirection("up");
      break;
    case "ArrowDown":
      game.snake.changeDirection("down");
      break;
    case "ArrowLeft":
      game.snake.changeDirection("left");
      break;
    case "ArrowRight":
      game.snake.changeDirection("right");
      break;
  }
});
game.render();

setInterval(() => {
  game.update();
}, 100);
