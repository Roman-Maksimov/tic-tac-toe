import {React, CComponent, connect} from 'src/vendor';
import store from 'src/store';


@connect(state => {return {
    fieldSize: state.settings.fieldSize,
    symbol: state.settings.symbol
}})
export default class Menu extends CComponent {
    start = () => {
        const {fieldSize, symbol} = this.props;

        store.dispatch({
            type: 'GAME_START',
            fieldSize,
            symbol
        });
    };

    render() {
        const {text} = this.props;
        
        return (<button className="b-button" onClick={this.start}>{text}</button>);
    }
}
