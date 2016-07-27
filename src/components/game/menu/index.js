import {React, CComponent} from 'src/vendor';
import Symbols from './symbols';
import Start from './start';


export default class Menu extends CComponent {
    render() {
        return (<div className="game">
            <Symbols/>
            <Start text="START"/>
        </div>);
    }
}
