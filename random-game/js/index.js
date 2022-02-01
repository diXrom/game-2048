console.log(`
1.Вёрстка, дизайн, UI +20
    - внешний вид приложения +5
    - вёрстка адаптивная. Приложения корректно отображается и отсутствует полоса прокрутки при ширине страницы от 1920рх до 768рх +5
    - интерактивность элементов, с которыми пользователи могут взаимодействовать, изменение внешнего вида самого элемента и состояния курсора при наведении, использование разных стилей для активного и неактивного состояния элемента, плавные анимации +5
    - в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5
2.Логика игры. Ходы, перемещения фигур, другие действия игрока подчиняются определённым свойственным игре правилам +10
3.По окончанию игры выводится её результат, например, количество ходов, время игры, набранные баллы, выигрыш или поражение и т.д +10
4.Результаты игр сохраняются в local storage. Есть таблица рекордов, в которой сохраняются результаты предыдущих 10 игр +10
5.Анимации или звуки, или настройки игры. Баллы начисляются за любой из перечисленных пунктов +10
6.Высокое качество реализации игры +5
`);

function startGame() {
    const btnNewGame = document.querySelector('.btn_new-game'),
        btnOverGame = document.querySelector('.btn_end-game'),
        gameContainer = document.querySelector('.game'),
        gameOver = document.querySelector('.end-game'),
        score = document.querySelector('.header__score span'),
        record = document.querySelector('.header__best span'),
        tableScore = document.querySelector('.record'),
        btnRecord = document.querySelector('.btn_record');

    let dataArr, tableArr = [], flag = false, counter = 0;

    const scoreUpdate = (num) => {
        score.innerHTML = +score.innerHTML + num;
        if (+score.innerHTML > +record.innerHTML) {
            record.innerHTML = score.innerHTML;
            localStorage.setItem('record', record.innerHTML);
        }
        score.parentElement.classList.add('update');
        setTimeout(() => {
            score.parentElement.classList.remove('update');
        }, 200)
    }
    const showTable = () => tableScore.classList.toggle('show');
    const createTableList = () => {
        tableArr.forEach((score, i) => {
            const list = document.createElement('div');
            list.classList.add('record__text');
            list.innerHTML = `<span>${i + 1}.</span>${score} score`;
            tableScore.append(list);
        });
    }

    const randomNumInRange = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
    const getCells = (col, row) => document.querySelectorAll(`.col_${col}.row_${row}`);
    const cleanCells = () => {
        const arrCell = Array.from(document.querySelectorAll('.cell'));
        arrCell.forEach(cell => cell.classList.remove('rise'));
        arrCell.forEach(cell => cell.classList.remove('join'));
        dataArr.forEach((item, col) => item.forEach((item, row) => {
            getCells(col, row).forEach(item => {
                if (item.dataset.value != dataArr[col][row]) {
                    item.remove();
                }
            })
        }));
    }
    const createCell = (col, row, inner = 2, selec = 'rise') => {
        const cell = document.createElement('div'),
            content = document.createElement('div');
        content.classList.add('content');
        content.innerHTML = inner;
        cell.classList.add('cell');
        cell.append(content);
        gameContainer.append(cell);
        cell.classList.add(`col_${col}`, `row_${row}`, `${selec}`);
        cell.setAttribute('data-value', `${inner}`)
        dataArr[col][row] = inner;
    }
    const createRandomCell = (col, row) => {
        if (dataArr[col][row] >= 2) {
            createRandomCell(randomNumInRange(0, 3), randomNumInRange(0, 3));
            return;
        }
        createCell(col, row);
    }
    const moveCell = (col, row, preCol, preRow) => {
        if (dataArr[col][row] == 0) return;
        if (dataArr[preCol][preRow] == 0) {
            let cells = getCells(col, row, dataArr[col][row]);
            dataArr[preCol][preRow] = dataArr[col][row];
            dataArr[col][row] = 0;
            cells.forEach(cell => cell.classList.remove(`col_${col}`, `row_${row}`));
            cells.forEach(cell => cell.classList.add(`col_${preCol}`, `row_${preRow}`));
            flag = true;
        }
    }
    const joinCell = (col, row, preCol, preRow) => {
        if (dataArr[col][row] == 0) return;
        if (dataArr[col][row] == dataArr[preCol][preRow]) {
            let cells = getCells(col, row, dataArr[col][row]);
            dataArr[preCol][preRow] = dataArr[col][row] + dataArr[preCol][preRow];
            dataArr[col][row] = 0;
            cells.forEach(cell => cell.classList.remove(`col_${col}`, `row_${row}`));
            cells.forEach(cell => cell.classList.add(`col_${preCol}`, `row_${preRow}`));
            createCell(preCol, preRow, dataArr[preCol][preRow], 'join')
            scoreUpdate(dataArr[preCol][preRow]);
            flag = true;
        }
    }
    const loadGame = () => {
        dataArr = JSON.parse(localStorage.getItem('dataArr'));
        score.innerHTML = localStorage.getItem('score');
        dataArr.forEach((item, col) => item.forEach((i, row) => {
            if (i == 0) return;
            createCell(col, row, dataArr[col][row]);
        }));
        document.addEventListener('keydown', moveUp);
        document.addEventListener('keydown', moveDown);
        document.addEventListener('keydown', moveLeft);
        document.addEventListener('keydown', moveRight);
    }
    const startNewGame = () => {
        dataArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        document.querySelectorAll('.cell').forEach(cell => cell.remove());
        gameOver.classList.remove('over');
        document.addEventListener('keydown', moveUp);
        document.addEventListener('keydown', moveDown);
        document.addEventListener('keydown', moveLeft);
        document.addEventListener('keydown', moveRight);
        localStorage.removeItem('dataArr')
        localStorage.removeItem('score')
        score.innerHTML = 0;
        createRandomCell(randomNumInRange(0, 3), randomNumInRange(0, 3));
        createRandomCell(randomNumInRange(0, 3), randomNumInRange(0, 3));
    }
    const endGame = () => {
        if (!flag && dataArr.flatMap(item => item).filter(item => item > 0).length == 16) {
            counter++;
            if (counter < 2) return;
            counter = 0;
            gameOver.classList.add('over');
            document.removeEventListener('keydown', moveUp);
            document.removeEventListener('keydown', moveDown);
            document.removeEventListener('keydown', moveLeft);
            document.removeEventListener('keydown', moveRight);
        }
        if (!flag) return;
        createRandomCell(randomNumInRange(0, 3), randomNumInRange(0, 3));
        flag = false;
    }
    const moveUp = (e) => {
        if (e.code !== 'ArrowUp') return
        cleanCells();
        for (let col = 1; col <= 3; col++) {
            dataArr.forEach((i, row) => moveCell(col, row, (col - 1), row))
        }
        for (let col = 1; col <= 3; col++) {
            dataArr.forEach((i, row) => moveCell(col, row, (col - 1), row))
        }
        for (let col = 1; col <= 3; col++) {
            dataArr.forEach((i, row) => joinCell(col, row, (col - 1), row))
        }
        for (let col = 3; col >= 1; col--) {
            dataArr.forEach((i, row) => moveCell(col, row, (col - 1), row))
        }
        endGame();
    }
    const moveDown = (e) => {
        if (e.code !== 'ArrowDown') return
        cleanCells();
        for (let col = 2; col >= 0; col--) {
            dataArr.forEach((i, row) => moveCell(col, row, (col + 1), row))
        }
        for (let col = 2; col >= 0; col--) {
            dataArr.forEach((i, row) => moveCell(col, row, (col + 1), row))
        }
        for (let col = 2; col >= 0; col--) {
            dataArr.forEach((i, row) => joinCell(col, row, (col + 1), row))
        }
        for (let col = 0; col <= 2; col++) {
            dataArr.forEach((i, row) => moveCell(col, row, (col + 1), row))
        }
        endGame();
    }
    const moveLeft = (e) => {
        if (e.code !== 'ArrowLeft') return
        cleanCells();
        dataArr.forEach((i, col) => {
            for (let row = 1; row <= 3; row++) moveCell(col, row, col, (row - 1))
        })
        dataArr.forEach((i, col) => {
            for (let row = 1; row <= 3; row++) moveCell(col, row, col, (row - 1))
        })
        dataArr.forEach((i, col) => {
            for (let row = 1; row <= 3; row++) joinCell(col, row, col, (row - 1))
        })
        dataArr.forEach((i, col) => {
            for (let row = 3; row >= 1; row--) moveCell(col, row, col, (row - 1))
        })
        endGame();
    }
    const moveRight = (e) => {
        if (e.code !== 'ArrowRight') return
        cleanCells();
        dataArr.forEach((i, col) => {
            for (let row = 2; row >= 0; row--) moveCell(col, row, col, (row + 1))
        })
        dataArr.forEach((i, col) => {
            for (let row = 2; row >= 0; row--) moveCell(col, row, col, (row + 1))
        })
        dataArr.forEach((i, col) => {
            for (let row = 2; row >= 0; row--) joinCell(col, row, col, (row + 1))
        })
        dataArr.forEach((i, col) => {
            for (let row = 0; row <= 2; row++) moveCell(col, row, col, (row + 1))
        })
        endGame();
    }

    btnNewGame.addEventListener('click', startNewGame);
    btnOverGame.addEventListener('click', startNewGame);
    btnRecord.addEventListener('click', showTable);
    window.addEventListener('unload', () => {
        localStorage.setItem('dataArr', JSON.stringify(dataArr));
        localStorage.setItem('score', score.innerHTML);
        if(score.innerHTML==0) return;
        if (tableArr.length > 9) tableArr.pull()
        tableArr.push(+score.innerHTML);
        tableArr.sort((a, b) => b - a);
        localStorage.setItem('table', JSON.stringify(tableArr));
    })
    if (localStorage.getItem('record')) {
        record.innerHTML = localStorage.getItem('record');
    }
    if (localStorage.getItem('table')) {
         tableArr = JSON.parse(localStorage.getItem('table'));
    }
    if (localStorage.getItem('dataArr')) loadGame()
    else startNewGame();
    createTableList();
}
startGame();