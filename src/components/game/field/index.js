import {React, CComponent, cx, connect} from 'src/vendor';
import store from 'src/store';
import Score from './score';
import Complete from './complete';


@connect(state => {return {
    symbols: state.settings.symbols,
    symbol: state.settings.symbol,
    cells: state.game.cells,
    fieldSize: state.settings.fieldSize,
    fieldMinSize: state.settings.fieldMinSize,
    fieldMaxSize: state.settings.fieldMaxSize,
    waitTime: state.settings.waitTime,
    isWaiting: !!state.game.isWaiting,
    isLoose: !!state.game.isLoose,
    isTie: !!state.game.isTie,
    waitHandler: state.game.waitHandler
}})
export default class Field extends CComponent {
    constructor(props, context) {
        super(props, context);

        this.playComputer(props);
    }

    componentWillUpdate(nextProps, nextState) {
        this.playComputer(nextProps);
    }

    playComputer = (props) => {
        const {fieldSize, isWaiting, waitHandler, waitTime} = props;

        isWaiting && !waitHandler && setTimeout(() => {
            store.dispatch({
                type: 'GAME_PLAY_COMPUTER',
                fieldSize
            });
        }, waitTime);
    };

    play = (x, y) => {
        const {fieldSize} = this.props;

        store.dispatch({
            type: 'GAME_PLAY_PLAYER',
            fieldSize,
            x, y
        });
    };

    render() {
        const {fieldSize, fieldMinSize, fieldMaxSize, symbols, symbol, cells, isLoose, isTie} = this.props;
        const playerSymbol = symbols[symbol];
        const computerSymbol = symbols[+!symbol];

        const k = (fieldMaxSize - fieldMinSize) / 3 >> 0;

        const complete = isLoose
            ? <Complete message="You loose!" />
            : (isTie ? <Complete message="The tie!" /> : null);

        return (<div className="game">
            <Score player="computer" />
            <table className={cx("field",{
                large: fieldSize <= (fieldMinSize + k),
                medium: fieldSize > (fieldMinSize + k) && fieldSize <= (fieldMinSize + k*2),
                small: fieldSize > (fieldMinSize + k*2)
            })}>
                <tbody>
                    {cells.map((row, x) =>
                        <tr key={x}>
                            {row.map((col, y) =>
                                <td key={y}
                                    onClick={this.play.bind(this, x, y)}
                                    >{
                                    col === 'player'
                                        ? <div>{playerSymbol}</div>
                                        : (col === 'computer' ? <div>{computerSymbol}</div> : '')
                                }</td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
            <Score player="player" />
            {complete}
        </div>);
    }
}
