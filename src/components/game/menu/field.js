import {React, CComponent, connect} from 'src/vendor';
import store from 'src/store';


@connect(state => {return {
    fieldSize: state.settings.fieldSize,
    fieldMinSize: state.settings.fieldMinSize,
    fieldMaxSize: state.settings.fieldMaxSize
}})
export default class Field extends CComponent {
    setSize = function(event) {
        store.dispatch({
            type: 'SET_FIELD_SIZE',
            size: event.target.value
        });
    };

    render() {
        const {fieldSize, fieldMinSize, fieldMaxSize} = this.props;

        return (<div className="field-size">
            Set field size:<br />
            <input type="number" min={fieldMinSize} max={fieldMaxSize} value={fieldSize} onChange={this.setSize} />
        </div>);
    }
}
