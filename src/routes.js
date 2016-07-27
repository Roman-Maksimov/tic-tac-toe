import {React, ReactRouter, ReactRouterRedux, Provider} from 'src/vendor';
import store from 'src/store';
import App from 'src/components/app';

const {Router, Route, Redirect, browserHistory} = ReactRouter;
const {syncHistoryWithStore} = ReactRouterRedux;

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

export default (
    <Provider store={store}>
        <Router history={history}>
            <Route component={App}>
                <Route path="/" component={require('app/components/game').default}/>
            </Route>
        </Router>
    </Provider>
);
