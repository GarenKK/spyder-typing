import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { userActions } from '../actions';
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
                <div className="col-lg-8 mx-auto text-center">
                    <h3 className="mb-4">Your Game History</h3>
                    {
                      gameHistory.map((game, i) => {
                          let { id, date, score, wpm, accuracy } = game;
                          if (date) {
                              date = moment(date).format('MMMM Do YYYY HH:mm');
                          }
                          return (
                              <h5 key={ i }>
                                  <div className="d-flex mb-3 justify-content-between">
                                      <div className="d-flex flex-column justify-content-between">
                                          <div className="d-flex justify-content-between align-items-center">
                                            Game ID: <span className="value-text ml-4">{ id }</span>
                                          </div>
                                          <div className="d-flex justify-content-between align-items-center">
                                            Date: <span className="value-text ml-4">{ date }</span>
                                          </div>
                                      </div>
                                      <div>
                                          <div className="d-flex justify-content-between align-items-center">
                                            Score: <span className="value-text ml-4">{ Math.round(score) }</span>
                                          </div>
                                          <div className="d-flex justify-content-between align-items-center">
                                            WPM: <span className="value-text ml-4">{ Math.round(wpm) }</span>
                                          </div>
                                          <div className="d-flex justify-content-between align-it2ms-c2nter">
                                            Accuracy: <span className="value-text ml-4">{ Math.round(accuracy) }%</span>
                                          </div>
                                      </div>
                                  </div>
                                  <hr/>
                              </h5>
                          );
                      })
                    }
                </div>
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