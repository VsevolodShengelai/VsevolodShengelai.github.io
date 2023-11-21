//Массив, хранящий состояние игры
let gameState = [];

let reserveGameState = [];

let playerScore = 0; // Счетчик для человека
let algorithmScore = 0; // Счетчик для алгоритма

//Пути к "Пришельцам"
const alienImages = [
    "/images/aliens/alien-1.png",
    "/images/aliens/alien-2.png",
    "/images/aliens/alien-3.png",
];

document.addEventListener("DOMContentLoaded", function () {
    const startGameButton = document.getElementById("start-game");
    startGameButton.addEventListener("click", startGame);

    const clearGameButton = document.getElementById("clear-game");
    clearGameButton.addEventListener("click", clearGame);

    const algoGameButton = document.getElementById("algorithm-game");
    algoGameButton.addEventListener("click", calculateGame);

    function clearGame() {
        // Восстанавливаем состояние игры из reserveGameState
        gameState = JSON.parse(JSON.stringify(reserveGameState));

        console.log(JSON.stringify(gameState, null, 2));
        console.log(JSON.stringify(reserveGameState, null, 2));

        /*Обнулим счётчик игрока на случай, если он хочет прйти поле ещё раз*/
        playerScore = 0;
        algorithmScore = 0;
        // Обновляем сетку с восстановленным состоянием
        updateGrid();
    }

    function startGame() {
        const rows = parseInt(document.getElementById("rows").value);
        const columns = parseInt(document.getElementById("columns").value);

        if (rows < 2 || columns < 2 || rows > 8 || columns > 8) {
            alert("Пожалуйста, выберите размеры поля от 2x2 до 8x8.");
            return;
        }

        createGameGrid(rows, columns);
    }

    function calculateGame() {
        clearGame()
        /*
        gameField = [
            [
                { score: 5, image: null, isEmpty: false },
                { score: -3, image: null, isEmpty: false },
                { score: 2, image: null, isEmpty: false },
                { score: 1, image: "/images/treasure.png", isEmpty: false },
            ],
            [
                { score: -1, image: null, isEmpty: false },
                { score: 7, image: null, isEmpty: false },
                { score: 1, image: null, isEmpty: false },
                { score: 2, image: null, isEmpty: false },
            ],
            [
                { score: -5, image: null, isEmpty: false },
                { score: -2, image: null, isEmpty: false },
                { score: 1, image: null, isEmpty: false },
                { score: 3, image: null, isEmpty: false },
            ],
            [
                { score: 4, image: "/images/hero.png", isEmpty: false },
                { score: 2, image: null, isEmpty: false },
                { score: 3, image: null, isEmpty: false },
                { score: 5, image: null, isEmpty: false },
            ],
        ];
        */

        gameField = gameState;

        //Посчитаем первую строку
        for (let j = gameField[0].length - 2; j >= 0; j--) {
            gameField[0][j].score += gameField[0][j + 1].score;
            //console.log(j);
        }
        //Посчитаем последний столбец
        for (let i = 0; i <= gameField.length - 2; i++) {
            gameField[i + 1][gameField.length - 1].score +=
                gameField[i][gameField.length - 1].score;
            //console.log(i);
        }

        let rows = gameField.length;
        let columns = gameField[0].length;

        //Считаем остальные клетки

        for (let i = 1; i < rows; i++) {
            for (let j = columns - 2; j >= 0; j--) {
                console.log(
                    gameField[i][j].score,
                    gameField[i][j + 1].score,
                    gameField[i - 1][j].score
                );

                if (gameField[i][j + 1].score >= gameField[i - 1][j].score) {
                    gameField[i][j].score += gameField[i][j + 1].score;
                } else {
                    gameField[i][j].score += gameField[i - 1][j].score;
                }
                //console.log(j);
            }
        }
        algorithmScore = gameField[rows-1][0].score;
        gameState = gameField;
        updateGrid();

        /*
        console.log(JSON.stringify(gameState, null, 2));
        console.log("шиза!");
        */
    }

    function generateRandomScore() {
        return Math.floor(Math.random() * 11) - 5;
    }

    function createGameGrid(rows, columns) {
        playerScore = 0;
        document.getElementById("player-score").textContent = playerScore;
        const gridContainer = document.getElementById("game-field");
        gridContainer.innerHTML = ""; // Очищаем существующее поле

        gameState = []; //Очищаем предыдущее состояние игры

        const alienImages = [
            "/images/aliens/alien-1.png",
            "/images/aliens/alien-2.png",
            "/images/aliens/alien-3.png",
        ];

        for (let i = 0; i < rows; i++) {
            gameState[i] = [];
            const row = document.createElement("div");
            row.className = "row";
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";

                let score;
                // Генерируем случайное число от -5 до 5
                if (i == rows - 1 && j == 0) {
                    score = 0;
                } else if (j == columns - 1 && i == 0) {
                    score = 0;
                } else {
                    score = generateRandomScore();
                }

                //Объект для отображения состояния ячейки
                const cellState = {
                    score: score,
                    image: null,
                    isEmpty: false,
                };
                cellState.score = score;

                // Создаем элемент для отображения очков
                const scoreElement = document.createElement("div");
                scoreElement.className = "score";
                scoreElement.textContent = score;

                // Добавляем элемент с очками в карточку
                cell.appendChild(scoreElement);

                if (score < 0) {
                    const randomAlienIndex = Math.floor(
                        Math.random() * alienImages.length
                    );
                    const alienImage = document.createElement("img");
                    alienImage.src = alienImages[randomAlienIndex];
                    alienImage.alt = "Alien";
                    alienImage.className = "alien-image"; // Применяем стили для изображения пришельца

                    cellState.image = alienImages[randomAlienIndex];

                    // Добавляем изображение пришельца в карточку
                    cell.appendChild(alienImage);
                } else if (i == rows - 1 && j == 0) {
                    const alienImage = document.createElement("img");
                    alienImage.src = "/images/hero.png";
                    alienImage.alt = "Hero";
                    alienImage.className = "hero-image"; // Применяем стили для изображения героя

                    cellState.image = "/images/hero.png";

                    // Добавляем изображение героя в карточку
                    cell.appendChild(alienImage);
                } else if (j == columns - 1 && i == 0) {
                    const alienImage = document.createElement("img");
                    alienImage.src = "/images/treasure.png";
                    alienImage.alt = "Treasure";
                    alienImage.className = "treasure-image"; // Применяем стили для изображения сокровища

                    cellState.image = "/images/treasure.png";

                    // Добавляем изображение сокровища в карточку
                    cell.appendChild(alienImage);
                }

                gameState[i][j] = cellState;

                row.appendChild(cell);
            }
            gridContainer.appendChild(row);
        }
        reserveGameState = JSON.parse(JSON.stringify(gameState));

        //alert(JSON.stringify(gameState, null, 2));
    }

    function updateGrid() {
        const gridContainer = document.getElementById("game-field");
        gridContainer.innerHTML = ""; // Очищаем существующее поле

        const rows = gameState.length;
        const columns = gameState[0].length;

        for (let i = 0; i < rows; i++) {
            const row = document.createElement("div");
            row.className = "row";
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement("div");
                if (gameState[i][j].isEmpty == true) {
                    cell.className = "cell empty";
                } else {
                    cell.className = "cell";
                }

                let score = gameState[i][j].score;

                // Создаем элемент для отображения очков
                const scoreElement = document.createElement("div");
                scoreElement.className = "score";
                scoreElement.textContent = score;

                // Добавляем элемент с очками в карточку
                cell.appendChild(scoreElement);

                if (gameState[i][j].image != null) {
                    const alienImage = document.createElement("img");
                    alienImage.src = gameState[i][j].image;
                    //alert(alienImage.src);

                    if (alienImage.src.includes("/images/hero.png")) {
                        alienImage.alt = "Hero";
                        alienImage.className = "hero-image";
                    } else if (alienImage.src.includes("/images/treasure.png")) {
                        alienImage.alt = "Treasure";
                        alienImage.className = "treasure-image";
                    } else {
                        alienImage.alt = "Alien";
                        alienImage.className = "alien-image";
                    }

                    // Добавляем изображение пришельца в карточку
                    cell.appendChild(alienImage);
                }

                row.appendChild(cell);
            }
            gridContainer.appendChild(row);
        }
        document.getElementById("algorithm-score").textContent = algorithmScore;
        //alert(gridContainer.outerHTML);
        //alert(JSON.stringify(gameState, null, 2));
    }

    function moveHero(direction) {
        const rows = gameState.length;
        const columns = gameState[0].length;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (gameState[i][j].image === "/images/hero.png") {
                    let newI = i;
                    let newJ = j;

                    if (direction === "right" && j < columns - 1) {
                        newJ = j + 1;
                    } else if (direction === "up" && i > 0) {
                        newI = i - 1;
                    }
                    else{
                        return;
                    }

                    console.log("current i: " + i, "current j: " + j);
                    console.log("New i: " + newI, "New j: " + newJ);

                    // Move the hero to the new position
                    gameState[newI][newJ].image = "/images/hero.png";
                    //gameState[newI][newJ].score = 0;

                    playerScore += gameState[newI][newJ].score;
                    document.getElementById("player-score").textContent = playerScore;

                    // Clear the cell where the hero was
                    gameState[i][j].image = null;
                    //gameState[i][j].score = 0;
                    gameState[i][j].isEmpty = true;

                    if (j == newJ) {
                        gameState[newI][newJ].image = "/images/hero.png";
                    }

                    // Update the visual representation of the grid
                    updateGrid();
                    return; // Exit the loop after the hero is moved
                }
            }
        }
    }

    // Add event listeners for arrow keys
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
            moveHero("right");
        } else if (event.key === "ArrowUp") {
            moveHero("up");
        }
    });
});
