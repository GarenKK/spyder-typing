import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../../helpers';

import './MyHeader.css'
import userIcon from '../../assets/icons/ic_account_box.png';

class MyHeader extends React.Component {
    constructor(props) {
        super(props);

        history.listen((location, action) => {
            this.setState({
                currentPath: location
            });
        });
    }

    render() {
        const { user } = this.props;
        const currentPath = window.location.pathname;
        return (
            <div id="MyHeader">
                <div className="container">
                    <Link to="/">
                        <button
                            type="button"
                            className={`btn btn-secondary ${currentPath === '/' ? 'btn-active' : ''}`}>
                            Home
                        </button>
                    </Link>
                    <Link to="/game">
                        <button
                            type="button"
                            className={`btn btn-secondary ml-4 ${currentPath === '/game' ? 'btn-active' : ''}`}>
                            Game
                        </button>
                    </Link>
                    <div className="float-right d-flex align-items-center">
                        <div className="text-center">
                            <img className="user-icon" src={userIcon}/>
                            <div>{ user.firstName + ' ' + user.lastName }</div>
                        </div>
                        <Link to="/login">
                            <button onClick={this.logoutClicked}
                                type="button" className="btn btn-link ml-4">
                                Logout
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        user: authentication.user || {}
    };
}

const MyHeaderClass = connect(mapStateToProps)(MyHeader);
export { MyHeaderClass as MyHeader };
