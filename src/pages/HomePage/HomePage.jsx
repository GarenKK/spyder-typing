import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../../actions';
import { GameHistory } from '../../components/GameHistory';
import './HomePage.css'

class HomePage extends React.Component {
    componentDidMount() {
        this.props.dispatch(userActions.getData(this.props.user.id));
    }

    render() {
        const { user, userData } = this.props;
        const gameHistory = userData ? userData.history : [];
        return (
            <div>
                <div className="d-flex justify-content-around align-items-center">
                    <div className="scoreboard">
                      <h2>{ user.username }</h2>
                      <h5>Games Played: { userData ? userData.played : '-' }</h5>
                      <h5>
                          Score
                          <ul>
                            <li>Best: { userData ? Math.round(userData.best.score) : '-' }</li>
                            <li>Average: { userData ? Math.round(userData.avg.score) : '-' }</li>
                          </ul>
                      </h5>
                      <h5>
                          WPM
                          <ul>
                            <li>Best: { userData ? Math.round(userData.best.wpm) : '-' }</li>
                            <li>Average: { userData ? Math.round(userData.avg.wpm) : '-' }</li>
                          </ul>
                      </h5>
                    </div>
                    <div className="text-center">
                        <Link to="/game" className="btn btn-primary pt-2 pb-2 play-btn">PLAY NOW</Link>
                    </div>
                </div>
                <br/><br/>
                <GameHistory history={gameHistory}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication, userData } = state;
    return {
        user: authentication.user,
        userData: userData.stats
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };