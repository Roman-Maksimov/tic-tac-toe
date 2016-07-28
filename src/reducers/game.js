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
 * @param fieldSize - field dimension
 * @returns {Array}
 */
const clearCells = (fieldSize) => {
    const rows = [];

    for(let y = 0; y < fieldSize; y++) {
        const cols = [];
        for (let x = 0; x < fieldSize; x++) {
            cols.push(null);
        }

        rows.push(cols);
    }

    return rows;
};

export const game = function(state = def, action) {
    switch(action.type) {
        case 'GAME_START': {
            const {fieldSize, symbol} = action;
            const cells = clearCells(fieldSize);
            const score = Object.assign({}, state.score);
            const isWaiting = symbol > 0;

            return Object.assign({}, def, {isStarted: true, isWaiting, cells, score});
        } case 'GAME_PLAY_COMPUTER': {
            let {step} = state;
            const {fieldSize} = action;
            const cells = state.cells.splice(0);

            const line = (player)=>{
                let protectPoint = null;

                let rColSet = [];
                let rColFree = [];

                for(let i = 0; i < fieldSize; i++){
                    rColSet.push(0);
                    rColFree.push(null);
                }

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
                                if(x == y)
                                    rDiagFree[0] = [x, y];

                                // second diagonal
                                if(x == fieldSize - y - 1)
                                    rDiagFree[1] = [x, y];
                            } else {
                                rRowSet++;
                                rColSet[y]++;

                                // first diagonal
                                if(x == y)
                                    rDiagSet[0]++;

                                // second diagonal
                                if(x == fieldSize - y - 1)
                                    rDiagSet[1]++;
                            }

                            if(fieldSize - 1 === rRowSet && rRowFree)
                                protectPoint = rRowFree;
                            else if(fieldSize - 1 === rColSet[y] && rColFree[y])
                                protectPoint = rColFree[y];
                            else if(fieldSize - 1 === rDiagSet[0] && rDiagFree[0])
                                protectPoint = rDiagFree[0];
                            else if(fieldSize - 1 === rDiagSet[1] && rDiagFree[1])
                                protectPoint = rDiagFree[1];
                        }
                    });
                });

                return protectPoint;
            };

            const attack = ()=>{
                // find unprotected lines
                const rows = [];
                const cols = [];
                const free = [];

                for(let i = 0; i < fieldSize; i++){
                    rows.push(i);
                    cols.push(i);
                }

                cells.map((row, x) => {
                    row.map((col, y) => {
                        if(col === 'computer') {
                            rows[x] = null;
                            cols[y] = null;
                        } else if(col === null) {
                            free.push([x, y]);
                        }
                    });
                });

                const pRows = rows.filter(p => p !== null);
                const pCols = cols.filter(p => p !== null);

                // try to protect row and col simultaneously
                let point = null;
                pRows.map(x => {
                    pCols.map(y => {
                        // diagonals preferred
                        if(!point || x == y || x == fieldSize - y - 1)
                            point = [x, y];
                    });
                });

                // if it impossible, just protect any row or col
                if(pRows.length > 0) {
                    const c = free.filter(p => pRows.indexOf(p[0]) !== -1);
                    point = c.length > 0 ? c[0] : null;
                } else if (pCols.length > 0) {
                    const c = free.filter(p => pCols.indexOf(p[1]) !== -1);
                    point = c.length > 0 ? c[0] : null;
                } else {
                    point = free.length > 0 ? free[0] : null;
                }

                return point;
            };

            const score = Object.assign({}, state.score);
            let isLoose = false;
            let isTie = false;

            switch(step) {
                case 0: // first computer play
                case 1:
                    if(cells[0][0] === 'player')
                        cells[1][1] = 'computer';
                    else
                        cells[0][0] = 'computer';

                    break;
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
                        break;
                    }

                    // for simplest field use special strategy for protection
                    if(fieldSize === 3){
                        if(step === 2){
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
                        }

                        if(step === 3 && cells[0][0] === 'player'){
                            cells[1][0] = 'computer';
                            break;
                        }
                    }

                    // attack
                    point = attack();
                    if (point) {
                        cells[point[0]][point[1]] = 'computer';
                        break;
                    }

                    break;
                }
            }

            isTie = !isLoose && step >= fieldSize * fieldSize - 1;

            return Object.assign({}, state, {isWaiting: false, waitHandler: null, isLoose, isTie, step: ++step, cells, score});
        }
        case 'GAME_PLAY_PLAYER': {
            // Player doesn't allowed to play while computer is thinking and if the game is already finished
            if(state.isWaiting || state.isLoose || state.isTie)
                return state;

            let {step} = state;
            const {fieldSize} = action;
            const cells = state.cells.splice(0);
            const {x, y} = action;

            if(cells[x][y] === null)
                cells[x][y] = 'player';

            const isTie = step >= fieldSize * fieldSize - 1;

            return Object.assign({}, state, {isWaiting: !isTie, step: ++step, isTie, cells});
        }
    }

    return state;
};