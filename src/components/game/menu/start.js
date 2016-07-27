import {React, CComponent, connect} from 'src/vendor';
import store from 'src/store';


@connect(state => {return {
    field: state.settings.field
}})
export default class Menu extends CComponent {
    start = () => {
        const {field} = this.props;

        store.dispatch({
            type: 'GAME_START',
            field
        });
    };

    render() {
        const {text} = this.props;
        
        return (<button className="b-button" onClick={this.start}>{text}</button>);
    }
}
