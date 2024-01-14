class Snake {
  constructor() {
    this.body = [{ x: 0, y: 0 }];
    this.direction = "right";
    this.food = new Foog();
  }

  move() {
    const head = { ...this.body[0] };
    switch (this.direction) {
      case "up":
        head.y -= 1;
        break;
      case "down":
        head.y += 1;
        break;
      case "left":
        head.x -= 1;
        break;
      case "right":
        head.x += 1;
        break;
    }

    this.body.unshift(head);
    this.body.pop();
  }
  eat(food) {
    const head = this.body[0];
    if (head.x === this.food.location.x && head.y === this.food.y) {
      food.replace();
    }
  }
  changeDirection(newDirection) {
    if (["up", "down", "left", "right"].includes(newDirection)) {
      this.direction = newDirection;
    }
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
    this.snake = new Snake();
    this.food = new Food();
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

        board.appendChild(cell);
      }
    }
  }
  hitSelf() {
    for (let i = 1; i < this.snake.body.length; i++) {
      if (
        this.snake.body[i].x === this.snake.body[0].x &&
        this.snake.body[i].y === this.snake.body[0].y
      ) {
        return true;
      }
    }
    return false;
  }
  update() {
    this.snake.move();
  }

  reset() {
    this.snake = new Snake();
    this.food = new Food();
    this.render();
  }
}

let game = new Game();

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

setInterval(() => {
  game.update();
}, 100);
