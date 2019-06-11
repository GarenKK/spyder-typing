import React from 'react';
import { connect } from 'react-redux';

import { userActions, getText } from '../../actions';
import { Typing } from '../../components/Typing';

class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            completedText: "",
            currentText: ""
        };
        this.saveResult = this.saveResult.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(getText());
        this.props.dispatch(userActions.getData(this.props.user.id));
    }

    saveResult(result) {
        const { user, userData } = this.props;
        let newData = {...userData};
        if (result.score > newData.best.score) {
            newData.best.score = result.score;
        }
        if (result.wpm > newData.best.wpm) {
            newData.best.wpm = result.wpm;
        }
        newData.avg.score =
            (newData.avg.score * newData.played / (newData.played + 1)) +
            (result.score / (newData.played + 1));
        newData.avg.wpm =
            (newData.avg.wpm * newData.played / (newData.played + 1)) +
            (result.wpm / (newData.played + 1));
        result.id = newData.played;
        newData.played = newData.played + 1;
        newData.history = [result, ...userData.history];
        this.props.dispatch(userActions.saveData(user.id, newData));
    }

    render() {
        const { user, userData, text } = this.props;
        const targetText = text ? text.join(" ") : "";
        const { saveResult } = this;
        return (
            <div className="col-md-9">
                <Typing targetText={targetText} saveResult={saveResult}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication, userData, text } = state;
    return {
        user: authentication.user,
        userData: userData.stats,
        text: text.random,
    };
}

const connectedGamePage = connect(mapStateToProps)(GamePage);
export { connectedGamePage as GamePage };