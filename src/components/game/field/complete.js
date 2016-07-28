import {React, CComponent} from 'src/vendor';
import Start from '../menu/start';

export default class Complete extends CComponent {
    render() {
        const {message} = this.props;

        return (<div className="popup" draggable="true">
            <div className="message">{message}</div>
            <Start text="TRY AGAIN" />
        </div>);
    }
}
