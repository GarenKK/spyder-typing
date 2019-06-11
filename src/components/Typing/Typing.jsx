import React from 'react';
import { Link } from 'react-router-dom';
import MS from 'pretty-ms';

import './Typing.css'

const TIME_LIMIT = 60000;

class Typing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			completedText: "",
			currentText: "",
			wordCounter: 0,
			wpm: 0,
			completion: 0,
			mistakes: 0,
			accuracy: 0,
			score: 0,
			time: 0,
			status: 'preGame', // preGame, playingGame, endedGame
			start: 0
		};
		this.startGame = this.startGame.bind(this);
		this.stopGame = this.stopGame.bind(this);
	}

	startGame() {
		this.setState({
			status: 'playingGame',
			time: 0,
			start: Date.now()
		})
		this.timer = setInterval(() => {
			let time = Math.round((Date.now() - this.state.start) / 1000) * 1000;
			let wpm = this.state.completedText.length * 12 / (time/1000);
			if (time > TIME_LIMIT) {
				this.stopGame();
			} else {
				this.setState({ time, wpm });
			}
		}, 1000);
	}
	stopGame() {
		let score = this.state.wpm * this.state.accuracy * this.state.completion / 10000;
		this.setState({
			time: TIME_LIMIT,
			status: 'endedGame',
			score
		}, () => {
			let {
				wpm,
				completion,
				mistakes,
				accuracy,
				score,
				start
			} = this.state;
			this.props.saveResult({
				wpm,
				completion,
				mistakes,
				accuracy,
				score,
				date: start
			});
		});
		clearInterval(this.timer);
	}

	componentDidUpdate(prevProps) {
		let { targetText } = this.props;
		if (targetText !== prevProps.targetText && targetText.length > 0) {
			this.setState({ selectedText: targetText.split(" ")[0] })
			this._input.focus();
		}
	}

	handleChange(e) {
		if(this.state.status === 'preGame') {
			this.startGame();
		}
		let currentText = e.target.value;
		let { targetText } = this.props;
		this.setState(prevState => {
			let { completedText, wordCounter, mistakes } = prevState;
			let currentWord = targetText.split(" ")[wordCounter];
			let completion = (completedText.length + currentText.length) / targetText.length * 100;
			let accuracy =
				(completedText.length + currentText.length) /
				(completedText.length + currentText.length + mistakes) *
				100;
			if (currentText[currentText.length - 1] === " ") {
				if (currentText.trim() === currentWord) {
					// move the content of the input to the completed text on "space"
					return {
						completedText: completedText + currentText,
						currentText: "",
						selectedText: targetText.split(" ")[wordCounter + 1],
						wordCounter: wordCounter + 1,
						accuracy,
						completion
					};
				}
				accuracy =
					(completedText.length + currentText.length) /
					(completedText.length + currentText.length + mistakes + 1) *
					100;
				return {
					accuracy,
					mistakes: mistakes + 1
				};
			} else if (currentWord.indexOf(currentText) === 0) {
				if (completion === 100) {
					this.stopGame();
				}
				return {
					currentText,
					selectedText: currentWord.replace(currentText, ""),
					accuracy,
					completion
				};
			} else if (currentText.length >= prevState.currentText.length) {
				accuracy =
					(completedText.length + currentText.length) /
					(completedText.length + currentText.length + mistakes + 1) *
					100;
				return {
					accuracy,
					mistakes: mistakes + 1
				};
			}
			return null
		});
	}

	refreshPage() {
		window.location.reload();
	}

	render() {
		const { targetText } = this.props;
		const handleChange = this.handleChange;
		let {
			completedText,
			currentText,
			selectedText,
			time,
			wpm,
			completion,
			mistakes,
			accuracy,
			score
		} = this.state;

    let timerWidthPercentage = (time / TIME_LIMIT * 100) + '%';
    let completionWidthPercentage = Math.round(completion) + '%';
    let wpmHeightPercentage = 100 - Math.round(wpm) + '%';
		return (
			<div>
        <h5>Time: { MS(TIME_LIMIT - time) }</h5>
        <div className="progress">
          <div className="progress-bar bg-info"
            style={{ width: timerWidthPercentage }} role="progressbar"/>
        </div>
        <h5>Completion: { completionWidthPercentage }</h5>
        <div className="progress">
          <div className="progress-bar bg-success"
            style={{ width: completionWidthPercentage }} role="progressbar"/>
        </div>
        <div className="wpm d-flex flex-column align-items-center">
          <div className="wpm-bar progress">
            <div className="wpm-value"/>
            <div className="wpm-mask"
              style={{ height: wpmHeightPercentage }}/>
          </div>
          <h5 className="mt-3">WPM: { Math.round(wpm) }</h5>
        </div>
				<h4 className="target-text">
					{targetText}
					<div className="completed-text">
						{completedText}
						<span className="current-text">{currentText}</span>
						<span className="selected-text">{selectedText}</span>
					</div>
				</h4>
				<h4>
					<input
            className="word-input"
						type="text"
						name="title"
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						autoFocus={true}
						ref={c => (this._input = c)}
						disabled={ this.state.status === 'endedGame' }
						value={currentText}
						onChange={handleChange.bind(this)}/>
					{
						this.state.status === 'preGame' &&
						<span className="info-text text-primary ml-4">Start typing to begin game!</span>
					}
				</h4>
				<br/>
				<h5 className="mt-3">
					<p>Mistakes: { mistakes }</p>
					<p>Accuracy: { Math.round(accuracy) }%</p>
				</h5>
				{
					this.state.status === 'endedGame' &&
					<div className="text-center">
						<h3>Game Finished!</h3>
						<h5>Your score in this round was: { Math.round(score) }</h5>
						<button onClick={ this.refreshPage }
							className="btn btn-primary">Play Again</button>
						<button className="btn btn-primary ml-4">
							<Link to="/" className="text-white return-button">Return Home</Link>
						</button>
					</div>
				}
			</div>
		);
	}
}

export { Typing };