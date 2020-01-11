import React from 'react';
import ReactDOM from 'react-dom';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import './index.css';

function Square(props) {
	let checkSnakeHeadBool =
		props.headXY[0] === props.value[0] && props.headXY[1] === props.value[1];
	let checkSnakeBool = props.checkSnake
		.map(x => {
			return x[0] === props.value[0] && x[1] === props.value[1];
		})
		.some(x => x === true);
	let checkFoodBool = props.value[0] === props.foodXY[0] && props.value[1] === props.foodXY[1];
	return (
		<button
			className={
				checkSnakeHeadBool ? (
					'snakeHead'
				) : checkSnakeBool ? (
					'snake'
				) : checkFoodBool ? (
					'food'
				) : (
					'square'
				)
			}
		>
			{/* ({props.value[0]}, {props.value[1]}) */}
		</button>
	);
}

class Background extends React.Component {
	renderBoardRow(boardSize, column) {
		let squares = [];
		for (let i = 1; i < boardSize + 1; i++) {
			squares.push(
				<Square
					key={i}
					value={[i, column]}
					checkSnake={this.props.isSnakeXY}
					headXY={this.props.headXY}
					foodXY={this.props.isFoodXY}
				/>
			);
		}
		return <div key={column} className="board-row">{squares}</div>;
	}

	renderBoard(boardSize) {
		let columns = [];
		for (let j = boardSize; j > 0; j--) {
			columns.push(this.renderBoardRow(boardSize, j));
		}
		return <div>{columns}</div>;
	}

	renderStatus(score, gameOver, highScore) {
		return (
			<div className="headSquare">
				<div>Score: {score}</div>
				<div>Highscore: {highScore}</div>
				{gameOver && <div>Game over!</div>}
			</div>
		);
	}

	renderReGame() {
		return (
			<div>
				<button className="reGame" onClick={() => this.props.onClick()}>
					Press 'R' to Play Again!
				</button>
			</div>
		);
	}

	render() {
		// console.log('########################');
		// console.log('timer: ', this.props.timerCheck);
		// console.log('headXY: ', this.props.headXY);
		// console.log('isSnakeXY: ', this.props.isSnakeXY);
		// console.log('isFoodXY: ', this.props.isFoodXY);
		// console.log('score: ', this.props.score);
		// console.log('direction: ', this.props.direction);
		// console.log('gameSpeed: ', this.props.gameSpeed);
		// console.log('gameOver: ', this.props.gameOver);

		return (
			<div>
				<div>{this.renderBoard(this.props.boardSize)}</div>
				<div className="head-row">
					{this.renderStatus(this.props.score, this.props.gameOver, this.props.highScore)}
				</div>
				{this.props.gameOver && <div>{this.renderReGame()}</div>}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timerCheck: 0,
			lastMove: null,
			headXY: [3, 2],
			isSnakeXY: [],
			isFoodXY: [6, 7],
			score: 0,
			gameOver: true,
			boardSize: 20,
			direction: 'right',
			gameSpeed: 30,
			difficulty: 0.7,
			highScore: 0
		};
	}

	handleClick() {
		this.setState({
			timerCheck: 0,
			lastMove: null,
			headXY: [3, 2],
			isSnakeXY: [],
			isFoodXY: [6, 7],
			score: 0,
			gameOver: false,
			direction: 'right'
		});
	}

	handleKeyPress(key) {
		// Change direction state if key pressed
		if (key === 'right') {
			this.setState({
				direction: 'right'
			});
		}
		if (key === 'left') {
			this.setState({
				direction: 'left'
			});
		}
		if (key === 'up') {
			this.setState({
				direction: 'up'
			});
		}
		if (key === 'down') {
			this.setState({
				direction: 'down'
			});
		}
		if (key === 'r') {
			this.setState({
				timerCheck: 0,
				lastMove: null,
				headXY: [3, 2],
				isSnakeXY: [],
				isFoodXY: [6, 7],
				score: 0,
				gameOver: false,
				direction: 'right'
			});
		}
	}

	componentDidMount() {
		this.interval = setInterval(
			() => {
				if (!this.state.gameOver) {
					const headXY = this.state.headXY;
					const isSnakeXY = this.state.isSnakeXY;
					const snakeAteFood =
						this.state.headXY[0] === this.state.isFoodXY[0] &&
						this.state.headXY[1] === this.state.isFoodXY[1];
					const score = this.state.score;
					const boardSize = this.state.boardSize;
					const gameSpeed = this.state.gameSpeed;
					const difficulty = this.state.difficulty;
					let highScore = this.state.highScore;

					if (GameOver(headXY, isSnakeXY, boardSize)) {
						if (this.state.score > highScore) {
							highScore = this.state.score;
						}
						this.setState({
							gameOver: true,
							highScore: highScore
						});
						clearInterval(this.inverval);
					}

					if (snakeAteFood) {
						if (this.state.direction === 'right') {
							this.setState({
								timerCheck: this.state.timerCheck + 1,
								headXY: [headXY[0] + 1, headXY[1]],
								isSnakeXY: isSnakeXY.concat([this.state.headXY]),
								isFoodXY: GetRandomXYArray(headXY, isSnakeXY, boardSize),
								score: score + 1,
								gameSpeed: ChangeGameSpeed(gameSpeed, difficulty)
							});
						}
						if (this.state.direction === 'left') {
							this.setState({
								timerCheck: this.state.timerCheck + 1,
								headXY: [headXY[0] - 1, headXY[1]],
								isSnakeXY: isSnakeXY.concat([this.state.headXY]),
								isFoodXY: GetRandomXYArray(headXY, isSnakeXY, boardSize),
								score: score + 1,
								gameSpeed: ChangeGameSpeed(gameSpeed, difficulty)
							});
						}
						if (this.state.direction === 'up') {
							this.setState({
								timerCheck: this.state.timerCheck + 1,
								headXY: [headXY[0], headXY[1] + 1],
								isSnakeXY: isSnakeXY.concat([this.state.headXY]),
								isFoodXY: GetRandomXYArray(headXY, isSnakeXY, boardSize),
								score: score + 1,
								gameSpeed: ChangeGameSpeed(gameSpeed, difficulty)
							});
						}
						if (this.state.direction === 'down') {
							this.setState({
								timerCheck: this.state.timerCheck + 1,
								headXY: [headXY[0], headXY[1] - 1],
								isSnakeXY: isSnakeXY.concat([this.state.headXY]),
								isFoodXY: GetRandomXYArray(headXY, isSnakeXY, boardSize),
								score: score + 1,
								gameSpeed: ChangeGameSpeed(gameSpeed, difficulty)
							});
						}
					} else {
						if (this.state.direction === 'right') {
							this.setState({
								timerCheck: this.state.timerCheck + 1,
								headXY: [headXY[0] + 1, headXY[1]],
								isSnakeXY: isSnakeXY.concat([this.state.headXY]).slice(1)
							});
						}
						if (this.state.direction === 'left') {
							this.setState({
								timerCheck: this.state.timerCheck + 1,
								headXY: [headXY[0] - 1, headXY[1]],
								isSnakeXY: isSnakeXY.concat([this.state.headXY]).slice(1)
							});
						}
						if (this.state.direction === 'up') {
							this.setState({
								timerCheck: this.state.timerCheck + 1,
								headXY: [headXY[0], headXY[1] + 1],
								isSnakeXY: isSnakeXY.concat([this.state.headXY]).slice(1)
							});
						}
						if (this.state.direction === 'down') {
							this.setState({
								timerCheck: this.state.timerCheck + 1,
								headXY: [headXY[0], headXY[1] - 1],
								isSnakeXY: isSnakeXY.concat([this.state.headXY]).slice(1)
							});
						}
					}
				}
			},
			// this part doesn't work well
			30
		);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div>
				<Background
					key={1}
					timerCheck={this.state.timerCheck}
					headXY={this.state.headXY}
					isSnakeXY={this.state.isSnakeXY}
					isFoodXY={this.state.isFoodXY}
					score={this.state.score}
					gameOver={this.state.gameOver}
					boardSize={this.state.boardSize}
					direction={this.state.direction}
					gameSpeed={this.state.gameSpeed}
					onClick={() => this.handleClick()}
					highScore={this.state.highScore}
				/>
				<KeyboardEventHandler
					handleKeys={['up', 'down', 'right', 'left', 'r']}
					onKeyEvent={(key, e) => this.handleKeyPress(key)}
				/>
			</div>
		);
	}
}

function GetRandomXYArray(snakeHead, snakeBody, size) {
	while (true) {
		let a = Math.floor(Math.random() * (size - 1) + 2);
		let b = Math.floor(Math.random() * (size - 1) + 2);
		if (
			a !== snakeHead[0] &&
			b !== snakeHead[1] &&
			snakeBody.map(x => {return x[0] !== a && x[1] !== b;}).every(x => x === true)) {
			return [a, b];
		}
	}
}

function ChangeGameSpeed(gameSpeed, difficulty) {
	return Math.floor(gameSpeed * difficulty);
}

function GameOver(headXY, isSnakeXY, boardSize) {
	// it head hits wall
	if (
		headXY[0] === 0 ||
		headXY[0] === boardSize + 1 ||
		headXY[1] === 0 ||
		headXY[1] === boardSize + 1
	) {
		return true;
	} else if (
		isSnakeXY
			.map(x => {
				return x[0] === headXY[0] && x[1] === headXY[1];
			})
			.some(x => x === true)
	) {
		return true;
	} else {
		return false;
	}
}

ReactDOM.render(<Game />, document.getElementById('root'));
