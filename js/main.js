
// Arquivo principal de JavaScript para a implementação do jogo Othello para HTML5

// ---------------- Definição das variáveis globais ----------

// Define variáveis usadas para o controle de fluxo de telas
var SCREEN_START_MENU = 1; 		// indica tela do menu inicial
var SCREEN_GAME = 2;			// indica tela do jogo em si
var SCREEN_INSTRUCTIONS = 3;	// incida tela de instruções
var SCREEN_OPTIONS = 4;			// indica tela de opções/configurações

var game_screen = SCREEN_START_MENU;	// Define tela inicial como sendo o menu Inicializa
var game_screen = SCREEN_GAME;	// Define tela inicial como sendo o menu Inicializa


// Define tamanho de cada um dos 64 quadrados (8x8) do tabuleiro
var space_size = 60;
// Define raio das peças que serão poscionadas sobre o tabuleiro
var pieceRaidus = 20;

// Define largura e altura da tela, respectivamente
var screenWidth = 800;		// Define largura da tela
var screenHeight = 500;		// Define altura da tela

// Define número de casas que o tabuleiro terá na horizontal e na vertical (padrão: 8)
var boardSize = 8;

// Calcula largura e altura do tabuleiro baseado no número de peças que serão usadas e o tamanho de cada uma delas
var boardWidth = boardSize * space_size;			// Define largura do canvas do tabuleiro
var boardHeight = boardSize * space_size;			// Define altura do canvas do tabuleiro

// Variáveis de offset usadas para centralizaro tabuleiro
// var x_offset = ( screenWidth - 8*space_size ) / 2;
var y_offset = ( screenHeight - 8*space_size ) / 2;
var x_offset = y_offset;

// Define matrix representando cada casa do tabuleiro
var board;

//Define constantes para representar presenças de peças de cada jogar no tabuleiro
var P1_PIECE = 1;		// no tabuleiro, as casas que tiverem 1 (P1) terão peça do jogador 1
var P2_PIECE = 2;  	// no tabuleiro, as casas que tiverem 2 (P2) terão peça do jogador 2

// Define constantes com das peças usadas por cada jogador
var P1_COLOR = "rgb(255,222,173)";		// peças do player 1 recebem cor creme
var P2_COLOR = "rgb(0,0,0)";			// peças do player 2 recebem cor preta

// Define qual jogador está jogando
var P1_TURN = 1;	// define turno do player 1
var P2_TURN = 2;	// define turno do player 2
var player_turn = P1_TURN;	// varíavel guarda de quem é o turno

// Define a função do jogo (player vs player, player vs máquina)
var GAME_PVP = 1; 	// define jogo player vs player
var GAME_PVM = 2;	// define jogo player vs machine
// var game_mode = GAME_PVM;	// variável guarda o modo de jogo
var game_mode = GAME_PVP;	// variável guarda o modo de jogo

// Constantes usadas para controle de retorno da função addPiece( event )
var IN_BOARD_VALID = 1;
var IN_BOARD_INVALID = 2;
var OUT_BOARD = 3;

// Matriz com possíveis movimentos do jogador da vez. 1 indica que aquele movimento é possível
var possible_moves;

// Matriz com peças que serão capturadas
var pieces_to_switch;

// Dicionário com a posição que foi clicada. Ex: pos_clicked = {i: 3, j:2} => pos_clicked.i=3 e pos_clicked.j=2
var pos_clicked;

// variável conta quantas vezes seguidas o jogo ficou sem jogadas possíveis. Se chegar a dois, o jogo termina, pois nenhum dos jogadores terá jogadas possíveis
var count_no_moves = 0;


// Atributos usados nos estados para o mini-max + poda alpha-beta 
// board - indica o estado do tabuleiro no momento
// depth - indica a profundidade do estado na árvore
// utility - indica a utilidade do nó (já considerando todos os nós filhos visitados)
// successors - array com os nós sucessores
// 
// Exemplo:
// 		state.board
// 		state.depth
// 		state.utility
// 		state.successors

// Variáveis usadas somente para testes
var i_test = 0;
var j_test = 0;

// --------------Fim da definição das variáveis globais ----------

// Função executada assim que a tela é carregada
window.onload = function() {
	// gameAction();
	canvas.addEventListener("mousedown", getMouseClick );
	manageScreen();
};

function manageScreen() {
	if( game_screen == SCREEN_START_MENU ) {
		drawScreenStartMenu()
	}
	else if( game_screen == SCREEN_GAME ) {
		gameAction();
	}
	else if( game_screen == SCREEN_INSTRUCTIONS ) {

	}
	else if( game_screen == SCREEN_OPTIONS ) {

	}
}

function drawScreenStartMenu() {
	console.log('ok');
	drawScreen();

	// Desenha quadrado com início no ponto (x,y) e de tamanho size. O ponto (x,y) é referente ao canto superior esquerdo do quadrado
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	var buttom_width = 100;
	var button_height = 50;
	var num_buttons = 3;

	ctx.beginPath();
	ctx.rect(50,50,buttom_width,button_height);
	ctx.fillStyle = '#DD6666';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();

}

function gameAction() {
	pos_clicked = {i: 0, j:0};
	initializeBoard();
	initializePossibleMoves();
	initializePiecesToSwitch();
	getPossibleMoves( player_turn );
	// canvas.addEventListener("mousedown", getMouseClick );
	// printPiecesToSwitch();

	// console.log('---- Matriz board -----');
	// print_matrix( board, boardSize );
	// console.log('---- Matriz possible_moves -----');
	// print_matrix( possible_moves, boardSize );

	// console.log('---- Matriz pieces_to_switch -----');
	// print_matrix( pieces_to_switch, boardSize );
	// pieces_to_switch[0][0].push( { i: 1, j: 1} );

	// pos = pieces_to_switch[0][0][0];

	// console.log( 'Testando: ' + pos.i + ', ' + pos.j);
	// for(var i=0; i<boardSize; i++) {
	// 	for(var j=0; j<boardSize; j++) {
	// 		// if( typeof pieces_to_switch[i][j] != "undefined" ) {

	// 		// }
	// 		for(var k=0; k<pieces_to_switch[i][j].length; k++) {

	// 		}

	// 	}
	// }
	drawCanvas();
}

// retorna uma ação
// retornará o estado do tabuleiro obtido com a jogada escolhida
// state: the current state in game
function alphaBetaSearch( state ) {
	var v = maxValue( state, -999999, +999999 );

	// return the action in Successors(state) with value v

}

// retorna um valor de utilidade
// state: the current state in game
// alpha: the value of the best alternative for MAX along the path to state
// beta:  the value of the best alternative for MIN along the path to state
function maxValue( state, alpha, beta ) {
	var v, sucessors;
	if( isTerminalState( state ) ) {
		return getUtility( state );
	}
	v = -999999999;
	sucessors = getSucessors( state );
	for (var i = 0; i <= sucessors.length ; i++) {
		var s = sucessors[i];
		v = max( v, minValue( s, alpha, beta) );
		if( v >= beta ) {
			return v;
		}
		alpha = max( alpha, v );
	}
}

// retorna um valor de utilidade
// state: the current state in game
// alpha: the value of the best alternative for MAX along the path to state
// beta:  the value of the best alternative for MIN along the path to state
function minValue( state, alpha, beta ) {
	var v, sucessors;
	if( isTerminalState( state ) ) {
		return getUtility( state );
	}
	v = +999999999;
	sucessors = getSucessors( state );
	for (var i = 0; i <= sucessors.length ; i++) {
		var s = sucessors[i];
		v = min( v, maxValue( s, alpha, beta) );
		if( v <= alpha ) {
			return v;
		}
		beta = min( beta, v );
	}
}


//  PRECISA ALTERAR
// retorna true se estado for terminal e false caso contrário
function isTerminalState( state ) {
	if( isBoardFull( board ) ) {
		return true;
	}
	if( ! hasPossibleMoves( possible_moves ) ) {
		if( count_no_moves >= 2 ) {
			// alert("Fim de jogo. Nenhum dos jogadores têm opção de jogada");
			// alert( getEndOfGameMessage() );
			return true
		}
		else {
			count_no_moves = 0;
			
		}
	}
}

// retorna valor de utilidade do estado
function getUtility( state ) {

}

// retorna estados sucessores do estado passado como parâmetro
function getSucessors( state ) {

}

function switchPieces(i_clicked, j_clicked, player_turn) {
	var piece;
	for(var k=0; k<pieces_to_switch[i_clicked][j_clicked].length; k++) {
		piece = pieces_to_switch[i_clicked][j_clicked][k];
		board[piece.i][piece.j] = player_turn ;
	}
}



// Função chamada quando houer um clique dentro do canvas
//	 	Constantes usadas:
// 			var IN_BOARD_VALID = 1
// 			var IN_BOARD_INVALID = 2
// 			var OUT_BOARD = 3
function getMouseClick( event ) {
	var add_piece_ok_sound = document.getElementById('add_piece_ok');
	var add_piece_error_sound = document.getElementById('add_piece_error');

	// dá stop no som de add_piece_ok para que novo som possa ser reproduzido
	add_piece_ok_sound.pause();
	add_piece_ok_sound.currentTime = 0;
	// dá stop no som de add_piece_error para que novo som possa ser reproduzido
	add_piece_error_sound.pause();
	add_piece_error_sound.currentTime = 0;

	if( addPiece( event ) == IN_BOARD_VALID ) {
		add_piece_ok_sound.play();
		switchPieces(pos_clicked.i, pos_clicked.j, player_turn);
		// printPiecesToSwitch();
		// alert(pos_clicked.i + ', ' + pos_clicked.j);
		// document.getElementById('add_piece_ok').play();	
		newTurn();
	}
	else if( addPiece( event ) == IN_BOARD_INVALID ) {
		add_piece_error_sound.play();
		// document.getElementById('add_piece_error').play();	
	}
}

function newTurn() {
	var score = getScore();
	
	// Limpa matriz de peças a serem trocadas
	for(var i=0; i<boardSize; i++) {
		for(var j=0; j<boardSize; j++) {
			pieces_to_switch[i][j] = new Array();
		}
	}

	// Muda jogador e exibe nova configuração do tabuleiro, já com os movimentos possíveis
	changeTurn();
	getPossibleMoves( player_turn );	// Durante esta ação é também preenchida a matriz pieces_to_switch
	drawCanvas();

	if( isBoardFull( board ) ) {
		alert( getEndOfGameMessage() );
	}

	if( ! hasPossibleMoves( possible_moves ) ) {
		if( count_no_moves >= 2 ) {
			// alert("Fim de jogo. Nenhum dos jogadores têm opção de jogada");
			alert( getEndOfGameMessage() );
		}
		else {
			count_no_moves++;
			newTurn();
			
		}
	}
	else {
		count_no_moves = 0;
	}

	if( game_mode == GAME_PVM) {
		if( player_turn == P1_TURN ) {
			// Espera pelo clique na posição válida
		}
		else if( player_turn == P2_TURN ) {

			// var now = new Date().getTime();
			// var delay_ms = 1000;
			// while(1) {
			// 	if( new Date().getTime() - now > delay_ms ) {
			// 		break;
			// 	}
			// }
			alert( 'machine turn' );
			machineTurn();
			newTurn();
		}
	}
	if( game_mode == GAME_PVP ) {
		// Espera jogada do jogador
	}	
}

function getEndOfGameMessage() {
	var text_end = "Fim de jogo. ";
	var score = getScore();
	// alert("Fim de jogo");
	if( score.p1 > score.p2 ) {
		text_end += "Vitória do player 1";
	}
	else if( score.p1 < score.p2 ) {
		text_end += "Vitória do player 2";
	}
	else {
		text_end += "O jogo terminou empatado";
	}
	return text_end;
}

function hasPossibleMoves( possible_moves ) {
	for (var i = 0; i < boardSize; i++ ) {
		for (var j = 0; j < boardSize; j++ ) {
			if( possible_moves[i][j] == 1 ) {
				return true;
			}
		}
	}
	return false;
}

function isBoardFull( board ) {
	for (var i = 0; i < boardSize; i++ ) {
		for (var j = 0; j < boardSize; j++ ) {
			if( board[i][j] != 0 ) {
				return false;
			}
		}
	}
	return true;
}

function playerTurn() {

}

function delay( delay_ms ) {
	var ref = new Date().getTime();
	var now;
	while(1) {
		now = new Date().getTime();
		if( ( now - ref ) >= delay_ms ) {
			break;
		}
	}
}


// Função executa turno de jogada da máquina
function machineTurn() {
	var move;
	// alert('Turno da máquina');

	move = getMachineMove();
	board[move.i][move.j] = player_turn;
	switchPieces(move.i, move.j, player_turn);
}

function getMachineMove() {
	var move = getRandomMove();
	// alert('i: ' +move.i + ', j: ' +move.j);
	return move;

}

function getRandomMove() {
	for( var i=0; i<boardSize; i++ ) {
		for( var j=0; j<boardSize; j++ ) {
			if( possible_moves[i][j] == 1 ) {
				return {
					i: i,
					j: j
				}
			}
		}
	}
}

// Troca o turno, passando a vez para o outro jogador
function changeTurn() {
	if( player_turn == P1_TURN ) {
		player_turn = P2_TURN;
	}
	else if( player_turn == P2_TURN ) {
		player_turn = P1_TURN;
	}
	else {
		alert('Erro no changeTurn');
	}
}



// Define movimentos possíveis para o jogador da rodada
function getPossibleMoves( player ) {
	// Define todas as posições de possible_moves como zero
	var i, j;
	for( i = 0; i < boardSize; i++) {
		for( j = 0; j < boardSize; j++) {
			possible_moves[i][j] = 0;
		}
	}

	// Itera sobre cada casa e busca movimentos possíveis a partir dela
	for( i = 0; i < boardSize; i++) {
		for( j = 0; j < boardSize; j++) {
			if( board[i][j] == player ) {
				// possible_moves[i][j+1] = 1;
				searchPossibleMoves( player, i, j);
				// possible_moves[i][j] = 1;
			}
		}
	}
}





function searchPossibleMoves( player_turn, i_piece, j_piece ) {
	var player, opponent;
	if( player_turn == P1_TURN ) {
		player = P1_TURN;
		opponent = P2_TURN;
	}
	else {
		player = P2_TURN;
		opponent = P1_TURN;
	}

	console.log('--------------------------------');
	console.log('Peça - i: ' + i_piece + ', j: ' + j_piece );

	// Movimentos horizontais e verticais 

	searchPossibleMovesLookRight( player, opponent, i_piece, j_piece );
	searchPossibleMovesLookLeft( player, opponent, i_piece, j_piece );
	searchPossibleMovesLookUp( player, opponent, i_piece, j_piece );
	searchPossibleMovesLookDown( player, opponent, i_piece, j_piece );

	searchPossibleMovesLookRightUp( player, opponent, i_piece, j_piece );
	searchPossibleMovesLookRightDown( player, opponent, i_piece, j_piece );
	searchPossibleMovesLookLeftUp( player, opponent, i_piece, j_piece );
	searchPossibleMovesLookLeftDown( player, opponent, i_piece, j_piece );

	// aparentemente tudo certo com os movimentos verticais e horizontais
	// left-down parece estar ok
	// right-down parece estar ok
	// left-up parece estar ok
	// left-down parece estar ok

	console.log('--------------------------------');

	// possible_moves[i_piece][j_piece] = 1;
}

function searchPossibleMovesLookRight( player, opponent, i_piece, j_piece ) {
	var j;
	// pieces_to_switch[0][0].push( { i: 1, j: 1} );
	var changeable_pieces = new Array();
	console.log('Pre look-rigt');
	if( j_piece <= boardSize ) {
		console.log('Entrou look-rigt');
		// console.log('got: ' + board[i_piece][j_piece+1]);
		// console.log('got: ' + board[i_piece][j_piece+1]);
		// console.log('player_turn: ' + player);
		// console.log('opponent: ' + opponent);
		if (typeof board[i_piece] != 'undefined') {
			if (typeof board[i_piece][j_piece+1] != 'undefined') {
				if( board[i_piece][j_piece+1] == opponent ) {
					changeable_pieces.push( { i: i_piece, j: j_piece+1} );
					console.log('Entrou DEEP look-rigt');
					// console.log('encontrou oponente à esquerda');
					for( j=j_piece+2; j<boardSize; j++ ) {
						// console.log('no for');
						if (typeof board[i_piece][j] == 'undefined') {
							break;
						}
						if( board[i_piece][j] == opponent ) {
							// console.log('opponent');
							changeable_pieces.push( {i: i_piece, j: j} );
							continue;
						}
						else if( board[i_piece][j] == player ) {
							// console.log('player');
							break;
						}
						else if (board[i_piece][j] == 0 ) {
							possible_moves[i_piece][j] = 1;
							// if( pieces_to_switch[i_piece][j] )
							// pieces_to_switch[i_piece][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(pieces_to_switch[i_piece][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							// console.log('adicionou');
							break;
						}
						else {
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
} 

function searchPossibleMovesLookLeft( player, opponent, i_piece, j_piece ) {
	var j;
	var changeable_pieces = new Array();
	if( j_piece >= 1 ) {
		// console.log('Entrou look-left');
		if (typeof board[i_piece] != 'undefined') {
			if (typeof board[i_piece][j_piece-1] != 'undefined') {
				if( board[i_piece][j_piece-1] == opponent ) {
					changeable_pieces.push( { i: i_piece, j: j_piece-1} );
					// console.log('Entrou DEEP look-left');
					for( j=j_piece-2; j>=0; j--) {
						if (typeof board[i_piece][j] == 'undefined') {
							break;
						}
						if( board[i_piece][j] == opponent ) {
							changeable_pieces.push( {i: i_piece, j: j} );
							continue;
						}
						else if( board[i_piece][j] == player ) {
							break;
						}
						else if (board[i_piece][j] == 0 ) {
							possible_moves[i_piece][j] = 1;
							// pieces_to_switch[i_piece][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(pieces_to_switch[i_piece][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
}

function searchPossibleMovesLookUp( player, opponent, i_piece, j_piece ) {
	var i;
	// console.log('Pre look-up');
	var changeable_pieces = new Array();
	if( i_piece >= 1 ) {
		// console.log('Entrou look-up');
		if (typeof board[i_piece-1] != 'undefined') {
			if (typeof board[i_piece-1][j_piece] != 'undefined') {
				if( board[i_piece-1][j_piece] == opponent ) {
					changeable_pieces.push( { i: i_piece-1, j: j_piece} );
					// console.log('Entrou DEEP look-up');
					for( i=i_piece-2; i>=0; i--) {
						if (typeof board[i][j_piece] == 'undefined') {
							break;
						}
						if( board[i][j_piece] == opponent ) {
							changeable_pieces.push( {i: i, j: j_piece} );
							continue;
						}
						else if( board[i][j_piece] == player ) {
							break;
						}
						else if ( board[i][j_piece] == 0 ) {
							possible_moves[i][j_piece] = 1;
							// pieces_to_switch[i][j_piece] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(pieces_to_switch[i][j_piece], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
}

function searchPossibleMovesLookDown( player, opponent, i_piece, j_piece ) {
	var i;
	var changeable_pieces = new Array();
	// print_matrix(board, boardSize);
	if( i_piece <= boardSize-1 ) {
		if (typeof board[i_piece+1] != 'undefined' ) {
			if( typeof board[i_piece+1][j_piece] != 'undefined') {	// verifica se array na posição board[i_piece + 1] está definido. Se não estiver, não prossegue
				if( board[i_piece+1][j_piece] == opponent ) {
					changeable_pieces.push( { i: i_piece+1, j: j_piece} );
					for( i=i_piece+2; i<boardSize; i++ ) {
						if (typeof board[i][j_piece] == 'undefined') {
							break;
						}
						// console.log('no for');
						if( board[i][j_piece] == opponent ) {
							// console.log('opponent');
							changeable_pieces.push( {i: i, j: j_piece} );
							continue;
						}
						else if( board[i][j_piece] == player ) {
							// console.log('player');
							break;
						}
						else if (board[i][j_piece] == 0 ) {
							possible_moves[i][j_piece] = 1;
							// pieces_to_switch[i][j_piece] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(pieces_to_switch[i][j_piece], changeable_pieces);
							}
							// printPiecesToSwitch();
							// console.log('adicionou');
							break;
						}
						else {
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
} 

// Movimentos Diagonais
function searchPossibleMovesLookRightDown( player, opponent, i_piece, j_piece ) {
	// look right-down
	var i, j;
	var changeable_pieces = new Array();
	// console.log('Pre look-rigt-down');
	if( j_piece <= boardSize-1 && i_piece <= boardSize-1 ) {
		if (typeof board[i_piece+1] != 'undefined') {
			if (typeof board[i_piece+1][j_piece+1] != 'undefined') {
				// console.log('Entrou look-rigt-down');
				if( board[i_piece+1][j_piece+1] == opponent ) {
					changeable_pieces.push( { i: i_piece+1, j: j_piece+1} );
					// console.log('Entrou DEEP look-rigt-down');
					for( i=i_piece+2, j=j_piece+2; i<boardSize && j<boardSize; i++, j++ ) {
						if (typeof board[i][j] == 'undefined') {
							break;
						}
						// if( i>= boardSize || j>=boardSize ) {
						// 	break;
						// }

						if( board[i][j] == opponent ) {
							changeable_pieces.push( {i: i, j: j} );
							continue;
						}
						else if( board[i][j] == player ) {
							break;
						}
						else if (board[i][j] == 0 ) {
							possible_moves[i][j] = 1;
							// pieces_to_switch[i][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(pieces_to_switch[i][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							console.log('Erro inesperado - look right-down');
							alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
}

function searchPossibleMovesLookLeftUp( player, opponent, i_piece, j_piece ) {
	// look left-up
	var i, j;
	var changeable_pieces = new Array();
	// console.log('Pre look-left-up');
	if( j_piece >= 1 && i_piece >= 1 ) {
		// console.log('Entrou look-left-up');
		if (typeof board[i_piece-1] != 'undefined') {
			if (typeof board[i_piece-1][j_piece-1] != 'undefined') {
				if( board[i_piece-1][j_piece-1] == opponent ) {
					changeable_pieces.push( { i: i_piece-1, j: j_piece-1} );
					// console.log('Entrou DEEP look-left-up');
					for( i=i_piece-2, j=j_piece-2; i>=0 && j>=0 ; i--, j--) {
						if (typeof board[i][j] == 'undefined') {
							break;
						}
						if( board[i][j] == opponent ) {
							changeable_pieces.push( {i: i, j: j} );
							continue;
						}
						else if( board[i][j] == player ) {
							break;
						}
						else if (board[i][j] == 0 ) {
							possible_moves[i][j] = 1;
							// pieces_to_switch[i][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(pieces_to_switch[i][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							console.log('Erro inesperado - look left-up');
							alert('Erro inesperado no searchPossibleMoves');
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
}

function searchPossibleMovesLookRightUp( player, opponent, i_piece, j_piece ) {
	// look right-up
	var i, j;
	var changeable_pieces = new Array();
	// console.log('Pre look-rigtup');
	if( j_piece <= boardSize-2 && i_piece >= 1 ) {
		// console.log('Entrou look-rigt-up');
		if (typeof board[i_piece-1] != 'undefined') {
			if (typeof board[i_piece-1][j_piece+1] != 'undefined') {
				if( board[i_piece-1][j_piece+1] == opponent ) {
					changeable_pieces.push( { i: i_piece-1, j: j_piece+1} );
					// console.log('Entrou DEEP look-rigt-up');
					for( i=i_piece-2, j=j_piece+2; i>=0 && j<boardSize; i--, j++ ) {
						if (typeof board[i][j] == 'undefined') {
							break;
						}
						if( board[i][j] == opponent ) {
							changeable_pieces.push( {i: i, j: j} );
							continue;
						}
						else if( board[i][j] == player ) {
							break;
						}
						else if (board[i][j] == 0 ) {
							possible_moves[i][j] = 1;
							// pieces_to_switch[i][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(pieces_to_switch[i][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							console.log('Erro inesperado - look right-up');
							alert('Erro inesperado no searchPossibleMoves');
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
}

function searchPossibleMovesLookLeftDown( player, opponent, i_piece, j_piece ) {
	var i, j;
	var changeable_pieces = new Array();
	// // look left-down
	// console.log('Pre left-down');
	if( j_piece >= 1 && i_piece <= boardSize ) {
		if (typeof board[i_piece+1] != 'undefined') {
			if (typeof board[i_piece+1][j_piece-1] != 'undefined') {
				if( board[i_piece+1][j_piece-1] == opponent ) {
					changeable_pieces.push( { i: i_piece+1, j: j_piece-1} );
					// console.log('Entrou DEEP left-down');
					for( i=i_piece+2, j=j_piece-2; i<boardSize && j>=0; i++, j--) {
						if (typeof board[i][j] == 'undefined') {
							break;
						}
						if( board[i][j] == opponent ) {
							changeable_pieces.push( {i: i, j: j} );
							continue;
						}
						else if( board[i][j] == player ) {
							break;
						}
						else if ( board[i][j] == 0 ) {
							possible_moves[i][j] = 1;
							// pieces_to_switch[i][j] = changeable_pieces;
							if( changeable_pieces.length > 0 ) {
								Array.prototype.push.apply(pieces_to_switch[i][j], changeable_pieces);
							}
							// printPiecesToSwitch();
							break;
						}
						else {
							console.log('Erro inesperado - look left-down');
							alert('Erro inesperado no searchPossibleMoves');
							// alert('Erro inesperado no searchPossibleMoves');
						}
					}
				}
			}
		}
	}
}

// Adiciona nova peça ao tabuleiro. Se local clicado já estiver ocupado, retorna false. Caso contrário, adiciona peça e retorna true
// return
//		1: clique dentro do tabuleiro em casa válida
//		2: clique dentro do tabuleiro em casa inválida
//		3: clique fora o tabuleiro
//	 	Constantes definidas:
// 			var IN_BOARD_VALID = 1
// 			var IN_BOARD_INVALID = 2
// 			var OUT_BOARD = 3
function addPiece( event ) {
	var ret = OUT_BOARD;
	var mousePos = getMousePos(canvas, event);
	var x = mousePos.x;
	var y = mousePos.y;
	//var h_space = parseInt( ( x - x_offset ) / space_size );
	//var v_space = parseInt( ( y - y_offset ) / space_size ); 
	var i, j;

	if( x >= x_offset && x <= ( boardWidth + x_offset) && y >= y_offset && y <= ( boardHeight + y_offset) ) {
		console.log( 'Posição válida para a peça' );
		i = parseInt( ( y - y_offset ) / space_size ); // posição horizontal da matriz
		j = parseInt( ( x - x_offset ) / space_size ); // posiçao vertical da matriz

		// Verifica se casa está ocupada
		if( board[i][j] != 0 ) {
			ret = IN_BOARD_INVALID;
		}
		else {	
			if( possible_moves[i][j] ) {	// Se casa está vazia e movimento é válido
				board[i][j] = player_turn;
				pos_clicked = {i: i, j:j};
				ret = IN_BOARD_VALID;
			}
			else {							// Se casa está vazia mas movimento é inválido
				// alert('Você deve posicionar uma peça numa posição válida - marcada por uma cor diferente');
				ret = IN_BOARD_INVALID;
			}
		}
	}
	return ret;
}

// Retorna posição do clique com relação ao canvas. Retorno pode ser acessado como ret.x e ret.y
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function initializePiecesToSwitch() {
	pieces_to_switch = new Array(boardSize);
	for (var i = 0; i < boardSize; i++) {
		pieces_to_switch[i] = new Array(boardSize);
	}
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			pieces_to_switch[i][j] = new Array();
		}
	}
}

function initializePossibleMoves() {
	possible_moves = new Array(boardSize);
	for (var i = 0; i < boardSize; i++) {
		possible_moves[i] = new Array(boardSize);
	}
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			possible_moves[i][j] = 0;
		}
	}
}

// Inicializa tabuleiro com todas as casas vazias - board[a][b] diz respeito à linha a e coluna b
function initializeBoard() {
	board = new Array(boardSize);			
	for (var i = 0; i < boardSize; i++) {
		board[i] = new Array(boardSize);
	}
	for (var i = 0; i < boardSize; i++) {
		for (var j = 0; j < boardSize; j++) {
			board[i][j] = 0;
		}
	}

	h_half_board_pieces = parseInt( boardSize / 2 );
	v_half_board_pieces = parseInt( boardSize / 2 );

	// Posiciona as duas peças iniciais do Player 1
	board[v_half_board_pieces][h_half_board_pieces-1] = P1_PIECE;
	board[v_half_board_pieces-1][h_half_board_pieces] = P1_PIECE;

	// Posiciona as duas peças iniciais do Player 2
	board[v_half_board_pieces-1][h_half_board_pieces-1] = P2_PIECE;
	board[v_half_board_pieces][h_half_board_pieces] = P2_PIECE;
}

function getScore() {
	var p1_score = 0;
	var p2_score = 0;
	var i, j;
	for( i=0; i<boardSize; i++ ) {
		for( j=0; j<boardSize; j++ ) {
			if( board[i][j] == P1_PIECE ) {
				p1_score++;
			}
			else if( board[i][j] == P2_PIECE ) {
				p2_score++;
			}
		}
	}
	return {
		p1: p1_score,
		p2: p2_score
	};
}

function drawCanvas() {
	drawScreen();
	drawBoard();
	drawTurnControl();
}

// Imprime parte da tela que informará quantas peças cada jogador tem e de quem é o turno
function drawTurnControl() {
	//var width = screenWidth - boardWidth - 3*x_offset;
	//var height = screenHeight - 2*y_offset;

	var x_start = 2*x_offset + boardWidth;
	var y_start = y_offset + 30;

	var x_p1_score = x_start + 30;
	var y_p1_score = y_start + 40;

	var x_p2_score = x_start + 30;
	var y_p2_score = y_start + 160;

	var turn_message = "Turno: ";
	var score = getScore();

	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();

	var p1_score_text = "Player 1";
	var p2_score_text = "Player 2";
	ctx.font = "30px Arial";
	ctx.fillStyle = "black";

	ctx.fillText(p1_score_text, x_p1_score, y_p1_score);
	ctx.fillText(p2_score_text, x_p2_score, y_p2_score);

	ctx.fillText("x " + score.p1, x_start+120, y_start+80);
	ctx.fillText("x " + score.p2, x_start+120, y_start+200);

	if( player_turn == P1_TURN ) {
		turn_message += "Player 1";
	}
	else {
		turn_message += "Player 2";
	}
	ctx.fillText(turn_message, x_start+30, y_start+340);
	ctx.closePath();

	drawPiece( x_start+90, y_start+70, pieceRaidus/2, P1_COLOR );
	drawPiece( x_start+90, y_start+190, pieceRaidus/2, P2_COLOR );


}

function drawPossibleMoves_unused() {
	// Desenha casas para os quais os movimentos são válidos
	var i,j;
	for( i=0; i<boardSize; i++ ) {
		for( j=0; j<boardSize; j++ ) {
			if( possible_moves[i][j] == 1 ) {
				drawFilledSquare( i*space_size + x_offset, j*space_size + y_offset, space_size );
			}
			else {
				// drawFilledSquareTest( i*space_size + x_offset, j*space_size + y_offset, space_size );
			}
		}
	}
}

function drawPieces() {
	// Desenha peças que já estão no tabuleiro
	var i,j;
	for( i = 0; i < boardSize; i++) {
		for( j = 0; j < boardSize; j++) {
			if( board[i][j] == P1_PIECE )  {
				drawPiece( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P1_COLOR);
			}
			else if( board[i][j] == P2_PIECE ) {
				drawPiece( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P2_COLOR);
			}
		}
	}
}

// Desenha tabuleiro (já preenchido com as peças que o compõem)
// Por algum motivo, para a impressão ficar correta, está sendo necessário verificar a posição [j][i]
function drawBoard() {	// Desenha tabuleiro (todas as casas)
	// Desenha tabuleiro vazio
	for(var i=0; i<boardSize; i++ ) {
		for(var j=0; j<boardSize; j++ ) {
			// drawEmptySquare( i*space_size + x_offset, j*space_size + y_offset, space_size );
			if( possible_moves[j][i] == 0 ) {
				drawEmptySquare( i*space_size + x_offset, j*space_size + y_offset, space_size );
			}
			else {
				drawFilledSquare( i*space_size + x_offset, j*space_size + y_offset, space_size );
				// i*space_size + x_offset
				// j*space_size + y_offset
				// drawFilledSquare( j*space_size + y_offset, i*space_size + x_offset, space_size );
			}


		}
	}

	// drawPossibleMoves();
	drawPieces();
	// Desenha peças que já estão no tabuleiro
	// for (var i = 0; i < boardSize; i++) {
	// 	for (var j = 0; j < boardSize; j++) {
	// 		if( board[i][j] == P1_PIECE )  {
	// 			drawPiece( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P1_COLOR);
	// 		}
	// 		else if( board[i][j] == P2_PIECE ) {
	// 			drawPiece( x_offset - space_size/2 + (j+1)*space_size, y_offset - space_size/2 + (i+1)*space_size, pieceRaidus, P2_COLOR);
	// 		}
	// 	}
	// }
}

// Desenha canvas
function drawScreen() {
	var canvas = document.getElementById("canvas");
	if( canvas.getContext ) {
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.canvas.width  = screenWidth;	// Seta largura do canvas do tabuleiro
	  	ctx.canvas.height = screenHeight;	// Seta altura do canvas do tabuleiro
	  	ctx.closePath();
	}
}

// Desenha quadrado com início no ponto (x,y) e de tamanho size. O ponto (x,y) é referente ao canto superior esquerdo do quadrado
function drawEmptySquare( x, y, size ) {	// Desenha novo quadrado com início no onto (x,y)
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.rect(x,y,size,size);
	ctx.fillStyle = '#DD6666';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
}

function drawFilledSquare( x, y, size ) {	// Desenha novo quadrado com início no onto (x,y)
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	// ctx.rect(x+1,y+1,size-2,size-2);	// diferenças são para não sobrepor as bordas
	ctx.rect(x,y,size,size);	// diferenças são para não sobrepor as bordas
	// ctx.fillStyle = '#CCCCCC';
	ctx.fillStyle = '#993333';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
}

// Desenha círculo (peça) com início no ponto (x,y), de raio radius e de cor color
function drawPiece( x, y, radius, color ) {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.arc( x, y, radius, 0, 2*Math.PI);
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000000';
	ctx.fillStyle = color;
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

// Função usada para depuração - Imprime a matriz no console JS do browser
function print_matrix( matrix, n ) {
	var line = '';
	var i, j;
	for( i=0; i<n; i++ ) {
		for( j=0; j<n; j++ ) {
			line += matrix[i][j] + ' ';
		}
		console.log(line);
		line = '';
	}
}

function printPiecesToSwitch() {
	var piece;
	console.log('--- Imprimindo pieces_to_switch ---');
	for( var i = 0; i<boardSize; i++ ) {
		for( var j = 0; j<boardSize; j++ ) {
			if( pieces_to_switch[i][j].length > 0 ) {
				console.log('posição: ' + i + ', ' + j );
				for( var k = 0; k<pieces_to_switch[i][j].length; k++) {
					piece = pieces_to_switch[i][j][k];
					// console.log('  i: ' + i + ', j: ' + j);
					console.log('  i: ' + piece.i + ', j: ' + piece.j);
				}
			}
		}
	}
}



function startGame() {

}


// Código que estava no searchPossibleMoves antes de modularizar
// look right
	// console.log('Pre look-rigt');
	// if( j_piece <= boardSize ) {
	// 	console.log('Entrou look-rigt');
	// 	// console.log('got: ' + board[i_piece][j_piece+1]);
	// 	// console.log('got: ' + board[i_piece][j_piece+1]);
	// 	// console.log('player_turn: ' + player);
	// 	// console.log('opponent: ' + opponent);
	// 	if( board[i_piece][j_piece+1] == opponent ) {
	// 		console.log('Entrou DEEP look-rigt');
	// 		// console.log('encontrou oponente à esquerda');
	// 		for( j=j_piece+2; j<boardSize; j++ ) {
	// 			// console.log('no for');
	// 			if( board[i_piece][j] == opponent ) {
	// 				// console.log('opponent');
	// 				continue;
	// 			}
	// 			else if( board[i_piece][j] == player ) {
	// 				// console.log('player');
	// 				break;
	// 			}
	// 			else if (board[i_piece][j] == 0 ) {
	// 				possible_moves[i_piece][j] = 1;
	// 				// console.log('adicionou');
	// 				break;
	// 			}
	// 			else {
	// 				// alert('Erro inesperado no searchPossibleMoves');
	// 			}
	// 		}
	// 	}
	// }

	// console.log('Pre look-left');
	// // look left
	// if( j_piece >= 1 ) {
	// 	console.log('Entrou look-left');
	// 	if( board[i_piece][j_piece-1] == opponent ) {
	// 		console.log('Entrou DEEP look-left');
	// 		for( j=j_piece-2; j>=0; j--) {
	// 			if( board[i_piece][j] == opponent ) {
	// 				continue;
	// 			}
	// 			else if( board[i_piece][j] == player ) {
	// 				break;
	// 			}
	// 			else if (board[i_piece][j] == 0 ) {
	// 				possible_moves[i_piece][j] = 1;
	// 				break;
	// 			}
	// 			else {
	// 				// alert('Erro inesperado no searchPossibleMoves');
	// 			}
	// 		}
	// 	}
	// }

	// // look up
	// console.log('Pre look-up');
	// if( i_piece >= 1 ) {
	// 	console.log('Entrou look-up');
	// 	if( board[i_piece-1][j_piece] == opponent ) {
	// 		console.log('Entrou DEEP look-up');
	// 		for( i=i_piece-2; i>=0; i--) {
	// 			if( board[i][j_piece] == opponent ) {
	// 				continue;
	// 			}
	// 			else if( board[i][j_piece] == player ) {
	// 				break;
	// 			}
	// 			else if ( board[i][j_piece] == 0 ) {
	// 				possible_moves[i][j_piece] = 1;
	// 				break;
	// 			}
	// 			else {
	// 				// alert('Erro inesperado no searchPossibleMoves');
	// 			}
	// 		}
	// 	}
	// }
	
	// // // look down
	// console.log('Pre look-down');
	// if( i_piece <= boardSize ) {
	// 	console.log('Entrou look-down');
	// 	if( board[i_piece+1][j_piece] == opponent ) {
	// 		console.log('Entrou DEEP look-down');
	// 		for( i=i_piece+2; i<boardSize; i++) {
	// 			if( board[i][j_piece] == opponent ) {
	// 				continue;
	// 			}
	// 			else if( board[i][j_piece] == player ) {
	// 				break;
	// 			}
	// 			else if ( board[i][j_piece] == 0 ) {
	// 				possible_moves[i][j_piece] = 1;
	// 				break;
	// 			}
	// 			else {
	// 				// alert('Erro inesperado no searchPossibleMoves');
	// 			}
	// 		}
	// 	}
	// }

	// // Movimentos Diagonais

	// // look right-down
	// console.log('Pre look-rigt-down');
	// if( j_piece <= boardSize-2 && i_piece <= boardSize-2 ) {
	// 	console.log('Entrou look-rigt-down');
	// 	if( board[i_piece+1][j_piece+1] == opponent ) {
	// 		console.log('Entrou DEEP look-rigt-down');
	// 		for( i=i_piece+2, j=j_piece+2; i<boardSize && j<boardSize; i++, j++ ) {
	// 			// if( i>= boardSize || j>=boardSize ) {
	// 			// 	break;
	// 			// }

	// 			if( board[i][j] == opponent ) {
	// 				continue;
	// 			}
	// 			else if( board[i][j] == player ) {
	// 				break;
	// 			}
	// 			else if (board[i_piece][j] == 0 ) {
	// 				possible_moves[i][j] = 1;
	// 				break;
	// 			}
	// 			else {
	// 				// alert('Erro inesperado no searchPossibleMoves');
	// 			}
	// 		}
	// 	}
	// }

	// // look left-up
	// console.log('Pre look-left-up');
	// if( j_piece >= 1 && i_piece >= 1 ) {
	// 	console.log('Entrou look-left-up');
	// 	if( board[i_piece-1][j_piece-1] == opponent ) {
	// 		console.log('Entrou DEEP look-left-up');
	// 		for( i=i_piece-2, j=j_piece-2; i>=0 && j>=0 ; i--, j--) {
	// 			if( board[i][j] == opponent ) {
	// 				continue;
	// 			}
	// 			else if( board[i][j] == player ) {
	// 				break;
	// 			}
	// 			else if (board[i_piece][j] == 0 ) {
	// 				possible_moves[i][j] = 1;
	// 				break;
	// 			}
	// 			else {
	// 				// alert('Erro inesperado no searchPossibleMoves');
	// 			}
	// 		}
	// 	}
	// }

	// // look right-up
	// console.log('Pre look-rigtup');
	// if( j_piece <= boardSize-2 && i_piece >= 1 ) {
	// 	console.log('Entrou look-rigt-up');
	// 	if( board[i_piece-1][j_piece+1] == opponent ) {
	// 		console.log('Entrou DEEP look-rigt-up');
	// 		for( i=i_piece-2, j=j_piece+2; i>=0 && j<boardSize; i--, j++ ) {
	// 			if( board[i][j] == opponent ) {
	// 				continue;
	// 			}
	// 			else if( board[i][j] == player ) {
	// 				break;
	// 			}
	// 			else if (board[i_piece][j] == 0 ) {
	// 				possible_moves[i][j] = 1;
	// 				break;
	// 			}
	// 			else {
	// 				// alert('Erro inesperado no searchPossibleMoves');
	// 			}
	// 		}
	// 	}
	// }

	// // // look left-down
	// console.log('Pre left-down');
	// if( j_piece >= 1 && i_piece <= boardSize ) {
	// 	if( board[i_piece+1][j_piece-1] == opponent ) {
	// 		console.log('Entrou DEEP left-down');
	// 		for( i=i_piece+2, j=j_piece-2; i<boardSize && j>=0; i++, j--) {
	// 			if( board[i][j] == opponent ) {
	// 				continue;
	// 			}
	// 			else if( board[i][j] == player ) {
	// 				break;
	// 			}
	// 			else if ( board[i][j] == 0 ) {
	// 				possible_moves[i][j] = 1;
	// 				break;
	// 			}
	// 			else {
	// 				// alert('Erro inesperado no searchPossibleMoves');
	// 			}
	// 		}
	// 	}

	// }