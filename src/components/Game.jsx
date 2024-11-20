import React, { useState, useEffect } from "react";
import Board from "./Board";
import ScoreBoard from "./ScoreBoard";
import Modal from "./Modal";
import { makeRandomMove } from "../ai-players/RandomAI";
import { makeMinimaxMove } from "../ai-players/MinimaxAI";
import { makeMCTSMove } from "../ai-players/MCTS";

const initialBoard = () => {
	const board = Array(8)
		.fill(null)
		.map(() => Array(8).fill(null));
	board[3][3] = "W";
	board[3][4] = "B";
	board[4][3] = "B";
	board[4][4] = "W";
	return board;
};

const Game = () => {
	const [board, setBoard] = useState(initialBoard());
	const [score, setScore] = useState({ B: 2, W: 2 });
	const [currentPlayer, setCurrentPlayer] = useState("B");
	const [validMoves, setValidMoves] = useState([]); // geçerli hamleleri tutmak için state
	const [playType, setPlayType] = useState("");
	const [showModal, setShowModal] = useState(true);
	const [latestDisc, setLatestDisc] = useState(null);
	const [aiType, setAiType] = useState(true);

	useEffect(() => {
		highlightValidMoves();
	}, [board, currentPlayer]);

	useEffect(() => {
		if (playType === "human-vs-ai" && currentPlayer === "W") {
			if (validMoves.length === 0) return;

			let move;
			if (aiType === "random") {
				move = makeRandomMove(validMoves);
			} else if (aiType === "minimax") {
				move = makeMinimaxMove(board, currentPlayer);
			} else if (aiType === "mcts") {
				console.log("mcts triggered");
				move = makeMCTSMove(board, currentPlayer);
			}

			if (move) {
				const [row, col] = move;
				setTimeout(() => {
					handleCellClick(row, col);
				}, 1000);
			}
		}
	}, [currentPlayer]);

	// const handleCellClick = (row, col) => {
	//   setLatestDisc({ row, col });
	//   if (isValidMove(row, col)) {
	//     const newBoard = [...board];
	//     newBoard[row][col] = currentPlayer;

	//     flipPieces(newBoard, row, col);
	//     updateScore(newBoard);
	//     setBoard(newBoard);
	//     setCurrentPlayer(currentPlayer === 'B' ? 'W' : 'B');
	//     checkGameOver();
	//   }
	// };

	const handleModalSelect = ({ playType, aiType }) => {
		setPlayType(playType);
		if (playType === "human-vs-ai") {
			setAiType(aiType);
		}
		setShowModal(false);
	};


	const updateScore = (newBoard) => {
		const newScore = { B: 0, W: 0 };
		newBoard.forEach((row) => {
			row.forEach((cell) => {
				if (cell === "B") newScore.B++;
				if (cell === "W") newScore.W++;
			});
		});
		setScore(newScore);
	};

	const isValidMove = (board, row, col, currentPlayer) => {
		if (row < 0 || row >= 8 || col < 0 || col >= 8) return false;
		if (!board[row] || board[row][col] !== null) return false; // board[row] control

		const directions = [
			{ x: 1, y: 0 },
			{ x: -1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: -1 },
			{ x: 1, y: 1 },
			{ x: -1, y: -1 },
			{ x: 1, y: -1 },
			{ x: -1, y: 1 },
		];

		let isValid = false;

		for (const { x, y } of directions) {
			let r = row + y;
			let c = col + x;
			let hasOpponentPiece = false;

			while (r >= 0 && r < 8 && c >= 0 && c < 8) {
				if (!board[r] || board[r][c] === undefined) break; // board[r] kontrolü eklendi
				if (board[r][c] === null) break;
				if (board[r][c] === currentPlayer) {
					if (hasOpponentPiece) {
						isValid = true;
					}
					break;
				}
				hasOpponentPiece = true;
				r += y;
				c += x;
			}
		}

		return isValid;
	};

	const handleCellClick = (row, col) => {
		if (isValidMove(board, row, col, currentPlayer)) {
			const newBoard = [...board];
			newBoard[row][col] = currentPlayer;

			setLatestDisc({ row, col });

			flipPieces(newBoard, row, col, currentPlayer);
			updateScore(newBoard);
			setBoard(newBoard);
			setCurrentPlayer(currentPlayer === "B" ? "W" : "B");
			checkGameOver();
		}
	};

	const highlightValidMoves = () => {
		const moves = [];
		console.log("highlightValidMoves", board, currentPlayer);
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 8; col++) {
				if (isValidMove(board, row, col, currentPlayer)) {
					moves.push([row, col]);
				}
			}
		}
		setValidMoves(moves);
	};

	const checkGameOver = () => {
		const hasMoves = (player) => {
			for (let row = 0; row < 8; row++) {
				for (let col = 0; col < 8; col++) {
					if (isValidMove(board, row, col, player)) {
						return true;
					}
				}
			}
			return false;
		};

		if (!hasMoves("B") && !hasMoves("W")) {
			alert("Oyun Bitti! Skor: B: " + score.B + " W: " + score.W);
		}
	};

	const flipPieces = (newBoard, row, col) => {
		const directions = [
			{ x: 1, y: 0 },
			{ x: -1, y: 0 },
			{ x: 0, y: 1 },
			{ x: 0, y: -1 },
			{ x: 1, y: 1 },
			{ x: -1, y: -1 },
			{ x: 1, y: -1 },
			{ x: -1, y: 1 },
		];

		for (const { x, y } of directions) {
			let r = row + y;
			let c = col + x;
			const piecesToFlip = [];

			while (r >= 0 && r < 8 && c >= 0 && c < 8) {
				if (newBoard[r][c] === null) break;
				if (newBoard[r][c] === currentPlayer) {
					piecesToFlip.forEach(([flipRow, flipCol]) => {
						newBoard[flipRow][flipCol] = currentPlayer;
					});
					break;
				}
				piecesToFlip.push([r, c]);
				r += y;
				c += x;
			}
		}
	};

	return (
		<div className="game-container">
			{showModal && (
				<Modal
					onClose={() => setShowModal(false)}
					onSelect={handleModalSelect}
				/>
			)}
			<ScoreBoard score={score} playType={playType} aiType={aiType} />
			<h3>{currentPlayer === "B" ? "Move: Black" : "Move: White"}</h3>
			<Board
				board={board}
				onCellClick={handleCellClick}
				validMoves={validMoves}
				latestDisc={latestDisc}
			/>
		</div>
	);
};

export default Game;
