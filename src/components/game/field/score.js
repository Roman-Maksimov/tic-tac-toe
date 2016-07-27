import {React, CComponent, connect} from 'src/vendor';


@connect((state, props) => {return{
    score: state.game.score[props.player]
}})
export default class Score extends CComponent {
    render() {
        const {player, score} = this.props;
        const title = player == 'computer' ? 'Computer' : 'Player';

        return (<div className="score">
            <div className="title">{title}</div>
            <div className="num">{score}</div>
        </div>);
    }
}
