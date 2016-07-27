import {React, CComponent, connect} from 'src/vendor';
import store from 'src/store';
import Score from './score';
import Complete from './complete';


@connect(state => {return {
    symbols: state.settings.symbols,
    symbol: state.settings.symbol,
    cells: state.game.cells,
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
        const {isWaiting, waitHandler, waitTime} = props;

        isWaiting && !waitHandler && setTimeout(() => {
            store.dispatch({
                type: 'GAME_PLAY_COMPUTER'
            });
        }, waitTime);
    };

    play = (x, y) => {
        store.dispatch({
            type: 'GAME_PLAY_PLAYER',
            x, y
        });
    };

    render() {
        const {symbols, symbol, cells, isLoose, isTie} = this.props;
        const playerSymbol = symbols[symbol];
        const computerSymbol = symbols[+!symbol];

        const complete = isLoose
            ? <Complete message="You loose!" />
            : (isTie ? <Complete message="The tie!" /> : null);

        return (<div className="game">
            <Score player="computer" />
            <table className="field">
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
