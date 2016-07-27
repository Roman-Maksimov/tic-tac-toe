import {React} from 'src/vendor';
import Header from './header';
import Footer from './footer';
import style from 'src/styles/main';


export default class extends React.Component {
	render() {
		const {children} = this.props;

		return (
			<div>
				<Header />
				<div role="main">
					{children}
				</div>
				<Footer />
			</div>
		);
	}
};
