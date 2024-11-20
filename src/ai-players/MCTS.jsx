// Monte Carlo Tree Search fonksiyonu
class Node {
	constructor(state, parent = null, currentPlayer = "B") {
		this.state = state;
		this.parent = parent;
		this.children = [];
		this.currentPlayer = currentPlayer;
		this.visits = 0;
		this.wins = 0;
	}

	isFullyExpanded() {
		const validMoves = getValidMoves(this.state, this.currentPlayer);
		return this.children.length === validMoves.length;
	}

	bestChild() {
		// console.log("bestChild");
		if (this.children.length === 0) return null;
		const epsilon = 1e-6; // Bölme hatalarını önlemek için
		return this.children.reduce((best, child) => {
			const bestUCB =
				best.wins / (best.visits + epsilon) +
				Math.sqrt(
					(2 * Math.log(this.visits + epsilon)) / (best.visits + epsilon),
				);
			const childUCB =
				child.wins / (child.visits + epsilon) +
				Math.sqrt(
					(2 * Math.log(this.visits + epsilon)) / (child.visits + epsilon),
				);
			return childUCB > bestUCB ? child : best;
		}, this.children[0]);
	}
}

function selection(node, currentPlayer) {
	console.log("selection");
	while (node.isFullyExpanded()) {
		const bestChild = node.bestChild();
		if (!bestChild) return node;
		node = bestChild;
	}
	console.log("end selection");
	return expansion(node, currentPlayer);
}

function expansion(node, currentPlayer) {
	console.log("expansion");
	const validMoves = getValidMoves(node.state, currentPlayer);
	validMoves.forEach(([row, col]) => {
		const newState = copyBoard(node.state);
		makeMove(newState, row, col, currentPlayer);
		const childNode = new Node(newState, node);
		node.children.push(childNode);
	});
	return node.children[0]; 
}

function simulation(state, player) {
	console.log("simulation");
	const simulatedState = copyBoard(state);
	let currentSimPlayer = player;

	while (!isGameOver(simulatedState)) {
		const validMoves = getValidMoves(simulatedState, currentSimPlayer);
		if (validMoves.length === 0) break;
		const randomMove =
			validMoves[Math.floor(Math.random() * validMoves.length)];
		makeMove(simulatedState, randomMove[0], randomMove[1], currentSimPlayer);
		currentSimPlayer = currentSimPlayer === "B" ? "W" : "B";
	}

	return evaluateBoard(simulatedState, player);
}

function backPropagation(node, result) {
	// console.log("backprogation");
	while (node !== null) {
		node.visits++;
		node.wins += result > 0 ? 1 : 0;
		node = node.parent;
	}
}

export const makeMCTSMove = (board, currentPlayer, iterations = 1000) => {
	const root = new Node(board, null, currentPlayer);

	for (let i = 0; i < iterations; i++) {
		const node = selection(root, currentPlayer);
		if (!node) break;
		const result = simulation(node.state, currentPlayer);
		backPropagation(node, result);
	}

	const bestMoveNode = root.bestChild();

	return bestMoveNode
		? getMoveFromStateDifference(board, bestMoveNode.state)
		: null;
};

// Yardımcı fonksiyonlar
const copyBoard = (board) => {
	return board.map((row) => row.slice());
};

const isGameOver = (board) => {
	return (
		getValidMoves(board, "B").length === 0 &&
		getValidMoves(board, "W").length === 0
	);
};

const evaluateBoard = (board, player) => {
	let score = 0;
	board.forEach((row) => {
		row.forEach((cell) => {
			if (cell === player) score++;
			else if (cell !== null) score--;
		});
	});
	return score;
};

const getValidMoves = (board, player) => {
	const validMoves = [];

	for (let row = 0; row < 8; row++) {
		for (let col = 0; col < 8; col++) {
			if (isValidMove(board, row, col, player)) {
				validMoves.push([row, col]);
			}
		}
	}
	return validMoves;
};

const makeMove = (board, row, col, player) => {
	board[row][col] = player;
	flipPieces(board, row, col, player);
};

const isValidMove = (board, row, col, currentPlayer) => {
	if (row < 0 || row >= 8 || col < 0 || col >= 8) return false;
	if (board[row][col] !== null) return false;

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

const flipPieces = (board, row, col, player) => {
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
	const opponent = player === "B" ? "W" : "B";

	for (const { x, y } of directions) {
		let r = row + y;
		let c = col + x;
		const piecesToFlip = [];

		while (r >= 0 && r < 8 && c >= 0 && c < 8) {
			if (board[r][c] === null) break;
			if (board[r][c] === player) {
				// biome-ignore lint/complexity/noForEach: <explanation>
				piecesToFlip.forEach(([flipRow, flipCol]) => {
					board[flipRow][flipCol] = player;
				});
				break;
			}
			if (board[r][c] === opponent) piecesToFlip.push([r, c]);
			r += y;
			c += x;
		}
	}
};

const getMoveFromStateDifference = (oldState, newState) => {
	for (let row = 0; row < oldState.length; row++) {
		for (let col = 0; col < oldState[row].length; col++) {
			if (oldState[row][col] !== newState[row][col]) {
				if (isValidMove(oldState, row, col, "W")) {
					return [row, col];
				}
			}
		}
	}

	return null;
};
