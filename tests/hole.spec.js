import ReactTestUtils from 'react-addons-test-utils';
import {React} from 'src/vendor';
import routes from 'src/routes';

describe('Hole application', () => {
    const tree = ReactTestUtils.renderIntoDocument(
        routes
    );

    it('Should be rendered', () => {
        assert(ReactTestUtils.isDOMComponent(
            ReactTestUtils.findRenderedDOMComponentWithClass(tree, "game")
        ), 'DOM exists');

        assert(ReactTestUtils.isDOMComponent(
            ReactTestUtils.findRenderedDOMComponentWithTag(tree, "button")
        ), 'Start button exists');
    });

    it('Start game', () => {
        ReactTestUtils.Simulate.click(
            ReactTestUtils.findRenderedDOMComponentWithTag(tree, "button")
        );

        assert(ReactTestUtils.isDOMComponent(
            ReactTestUtils.findRenderedDOMComponentWithClass(tree, "field")
        ), 'Field exists');
    });
});