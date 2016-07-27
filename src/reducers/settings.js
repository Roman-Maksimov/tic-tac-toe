const def = {
    symbols: ['X', '0'],
    symbol: 0,
    field: [3, 3],   // 3x3
    waitTime: 500   // in milliseconds
};

export const settings = function(state = def, action) {
    switch(action.type) {
        case 'SET_SYMBOL':
            const symbol = action.symbol >= 0 && state.symbols.length > action.symbol ? action.symbol : state.symbol;
            return Object.assign({}, state, {symbol});
    }

    return state;
};