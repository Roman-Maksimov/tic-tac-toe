import {React, CComponent, cx, connect} from 'src/vendor';
import store from 'src/store';


@connect(state => {return {
    symbols: state.settings.symbols,
    symbol: state.settings.symbol
}})
export default class Menu extends CComponent {
    setSymbol = (symbol) => {
        store.dispatch({
            type: 'SET_SYMBOL',
            symbol
        });
    };

    render() {
        const {symbols = [], symbol} = this.props;

        return (<div className="symbols">
            Choose your symbol:
            <ul>{symbols.map((title, index)=>
                <li key={index}
                    className={cx("b-button", {"active": index === symbol})}
                    onClick={this.setSymbol.bind(this, index)}
                >{title}</li>
            )}</ul>


        </div>);
    }
}
