import {React, CComponent, connect} from 'src/vendor';
import Field from './field';
import Menu from './menu';


@connect(state => {return {
    isStarted: !!state.game.isStarted
}})
export default class extends CComponent {
    render() {
        const {isStarted} = this.props;

        return (isStarted ? <Field /> : <Menu />);
    }
}
