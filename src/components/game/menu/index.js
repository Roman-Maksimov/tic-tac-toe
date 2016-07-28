import {React, CComponent} from 'src/vendor';
import Field from './field';
import Symbols from './symbols';
import Start from './start';


export default class Menu extends CComponent {
    render() {
        return (<div className="game">
            <Field />
            <Symbols/>
            <Start text="START"/>
        </div>);
    }
}
