const def = {
    isStarted: false,
    isWaiting: false,
    isLoose: false,
    isTie: false,
    waitHandler: null,
    step: 0,
    cells: [],
    score: {
        computer: 0,
        player: 0
    }
};

/**
 * prepare Matrix like
 *    --                  --
 *    |  null  null  null  |
 *    |                    |
 *    |  null  null  null  |
 *    |                    |
 *    |  null  null  null  |
 *    --                  --
 *
 * @param field - field dimension
 * @returns {Array}
 */
const clearCells = (field) => {
    const fieldSize = field.length === 2 && field[0] && field[1] ? field.splice(0) : [3, 3];
    const rows = [];

    for(let y = 0; y < fieldSize[1]; y++) {
        const cols = [];
        for (let x = 0; x < fieldSize[0]; x++) {
            cols.push(null);
        }

        rows.push(cols);
    }

    return rows;
};

export const game = function(state = def, action) {
    switch(action.type) {
        case 'GAME_START':
            const {field} = action;
            const cells = clearCells(field);
            const score = Object.assign({}, state.score);

            return Object.assign({}, def, {isStarted: true, isWaiting: true, cells, score});
        case 'GAME_PLAY_COMPUTER': {
            let {step} = state;
            const cells = state.cells.splice(0);

            const line = (player)=>{
                let protectPoint = null;

                let rColSet = [0, 0, 0];
                let rColFree = [null, null, null];
                let rDiagSet = [0, 0];
                let rDiagFree = [null, null];
                cells.map((row, x) => {
                    let rRowSet = 0;
                    let rRowFree = null;

                    row.map((col, y) => {
                        if(protectPoint)
                            return;

                        if(col === null || col === player){
                            if(col === null){
                                rRowFree = [x, y];
                                rColFree[y] = [x, y];

                                // first diagonal
                                if(
                                       x === 0 && y === 0
                                    || x === 1 && y === 1
                                    || x === 2 && y === 2
                                )
                                    rDiagFree[0] = [x, y];

                                // second diagonal
                                if(
                                       x === 2 && y === 0
                                    || x === 1 && y === 1
                                    || x === 0 && y === 2
                                )
                                    rDiagFree[1] = [x, y];
                            } else {
                                rRowSet++;
                                rColSet[y]++;

                                // first diagonal
                                if(
                                       x === 0 && y === 0
                                    || x === 1 && y === 1
                                    || x === 2 && y === 2
                                )
                                    rDiagSet[0]++;

                                // second diagonal
                                if(
                                       x === 2 && y === 0
                                    || x === 1 && y === 1
                                    || x === 0 && y === 2
                                )
                                    rDiagSet[1]++;
                            }

                            if(2 === rRowSet && rRowFree)
                                protectPoint = rRowFree;
                            else if(2 === rColSet[y] && rColFree[y])
                                protectPoint = rColFree[y];
                            else if(2 === rDiagSet[0] && rDiagFree[0])
                                protectPoint = rDiagFree[0];
                            else if(2 === rDiagSet[1] && rDiagFree[1])
                                protectPoint = rDiagFree[1];
                        }
                    });
                });

                return protectPoint;
            };

            const score = Object.assign({}, state.score);
            let isLoose = false;
            let isTie = false;

            switch(step) {
                case 0: // first computer play
                    cells[0][0] = 'computer';
                    break;
                case 2: // second computer play
                    if(cells[2][2] === 'player')
                        // player went to opposite corner
                        // play to contiguous corner
                        cells[2][0] = 'computer';
                    else if(cells[1][1] === 'player' || cells[0][2] === 'player' || cells[2][0] === 'player')
                        // player went to center cell or to one of contiguous corners
                        // play to opposite corner
                        cells[2][2] = 'computer';
                    else
                        // player went to side cell
                        // play to center
                        cells[1][1] = 'computer';

                    break;

                case 4: { // third computer play
                    // try to complete
                    let point = line('computer');
                    if (point) {
                        cells[point[0]][point[1]] = 'computer';
                        score.computer++;
                        isLoose = true;
                        break;
                    }

                    // protect first, then attack
                    point = line('player');
                    if (point) {
                        cells[point[0]][point[1]] = 'computer';
                        break;
                    }

                    if (cells[0][1] === 'player')
                        cells[2][0] = 'computer';
                    else if (cells[0][2] === 'player')
                        cells[2][0] = 'computer';
                    else
                        cells[0][2] = 'computer';


                    break;

                }
                default: {
                    // try to complete
                    let point = line('computer');
                    if (point) {
                        cells[point[0]][point[1]] = 'computer';
                        score.computer++;
                        isLoose = true;
                        break;
                    }

                    // protect first, then attack
                    point = line('player');
                    if (point) {
                        cells[point[0]][point[1]] = 'computer';
                        isTie = step >= 8;
                        break;
                    }

                    break;
                }
            }

            return Object.assign({}, state, {isWaiting: false, waitHandler: null, isLoose, isTie, step: ++step, cells, score});
        }
        case 'GAME_PLAY_PLAYER': {
            // Player doesn't allowed to play while computer is thinking and if the game is already finished
            if(state.isWaiting || state.isLoose || state.isTie)
                return state;

            let {step} = state;
            const cells = state.cells.splice(0);
            const {x, y} = action;

            if(cells[x][y] === null)
                cells[x][y] = 'player';

            return Object.assign({}, state, {isWaiting: true, step: ++step, cells});
        }
    }

    return state;
};