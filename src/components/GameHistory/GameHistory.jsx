import React from 'react';
import moment from 'moment';
import { GameHistoryItem } from './GameHistoryItem'

export const GameHistory = (props) => (
		<div className="col-lg-8 mx-auto text-center">
		    <h3 className="mb-4">Your Game History</h3>
		    {
		      props.history.map((game, i) => {
		          let { id, date, score, wpm, accuracy } = game;
		          if (date) {
		              date = moment(date).format('MMMM Do YYYY HH:mm');
		          }
		          return (
		              <GameHistoryItem
		                  key={ id }
		                  game={{ id, date, score, wpm, accuracy }}
		              />
		          );
		      })
		    }
		</div>
)