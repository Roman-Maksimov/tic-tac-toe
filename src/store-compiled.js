'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vendor = require('src/vendor');

var tree = new _vendor.Baobab(getDefaultState(), {
    cloningFunction: _vendor.cloneDeep,
    clone: true
});

exports.default = tree;

function getDefaultState() {
    return {
        errors: {},
        game: {
            started: false,
            symbols: ['X', '0'],
            symbol: 0,
            positions: []
        }
    };
}

//# sourceMappingURL=store-compiled.js.map