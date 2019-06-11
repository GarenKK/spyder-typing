import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../helpers';
import { alertActions } from '../actions';
import { PrivateRoute } from '../components/PrivateRoute';
import { HomePage } from '../pages/HomePage';
import { GamePage } from '../pages/GamePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MyHeader } from '../components/MyHeader';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }

    shouldHideHeader(pathname) {
      return pathname == '/login' || pathname == '/register'
    }

    render() {
        const { alert } = this.props;
        const hideHeader = this.shouldHideHeader(window.location.pathname)
        return (
            <div>
                { !hideHeader && <MyHeader /> }
                <div className="container pt-5 pb-5">
                    <div>
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/" component={HomePage} />
                                <PrivateRoute exact path="/game" component={GamePage} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 