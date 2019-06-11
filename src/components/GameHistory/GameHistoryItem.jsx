import React from 'react';

export const GameHistoryItem = (props) => (
	  <h5>
	      <div className="d-flex mb-3 justify-content-between">
	          <div className="d-flex flex-column justify-content-between">
	              <div className="d-flex justify-content-between align-items-center">
	                	Game ID: <span className="value-text ml-4">{ props.game.id }</span>
	              </div>
	              <div className="d-flex justify-content-between align-items-center">
	                	Date: <span className="value-text ml-4">{ props.game.date }</span>
	              </div>
	          </div>
	          <div>
	              <div className="d-flex justify-content-between align-items-center">
	                	Score: <span className="value-text ml-4">{ Math.round(props.game.score) }</span>
	              </div>
	              <div className="d-flex justify-content-between align-items-center">
	                	WPM: <span className="value-text ml-4">{ Math.round(props.game.wpm) }</span>
	              </div>
	              <div className="d-flex justify-content-between align-it2ms-c2nter">
	                	Accuracy: <span className="value-text ml-4">{ Math.round(props.game.accuracy) }%</span>
	              </div>
	          </div>
	      </div>
	      <hr/>
	  </h5>
)