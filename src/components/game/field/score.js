import {React, CComponent, cx, connect} from 'src/vendor';


@connect((state, props) => {return{
    turn: state.game.isWaiting ? 'computer' : 'player',
    score: state.game.score[props.player]
}})
export default class Score extends CComponent {
    render() {
        const {player, turn, score} = this.props;
        const title = player == 'computer' ? 'Computer' : 'Player';

        return (<div className="score">
            <div className="title">{title}</div>
            <div className={cx("turn", {
                active: player === turn
            })}></div>
            <div className="num">{score}</div>
        </div>);
    }
}
