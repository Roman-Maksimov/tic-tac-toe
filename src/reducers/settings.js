const def = {
    symbols: ['X', '0'],
    symbol: 0,
    fieldSize: 3,   // 3x3
    fieldMinSize: 3,
    fieldMaxSize: 10,
    waitTime: 500   // in milliseconds
};

export const settings = function(state = def, action) {
    switch(action.type) {
        case 'SET_FIELD_SIZE':
            const {fieldMinSize, fieldMaxSize} = state;
            let fieldSize = +action.size;

            if(isNaN(fieldSize) || fieldSize < fieldMinSize || fieldSize > fieldMaxSize)
                return state;

            return Object.assign({}, state, {fieldSize});
        case 'SET_SYMBOL':
            const symbol = action.symbol >= 0 && state.symbols.length > action.symbol ? action.symbol : state.symbol;
            return Object.assign({}, state, {symbol});
    }

    return state;
};