import MapBuilder from './MapBuilder.mjs';
import CardBuilder from './CardBuilder.mjs';
import Player from './Player.mjs';
import UI from './UI.mjs';


let CARDTYPES = {};
CARDTYPES.DEFAULT = 0;
CARDTYPES.GOLD = 1;
CARDTYPES.KILL = 2;

const distribution = [[CARDTYPES.DEFAULT, 17], [CARDTYPES.GOLD, 6], [CARDTYPES.KILL, 2]];
 
/**
 * Главный класс игры
 * @module Game
 */
export default class Game {
	/**
	 * Создание экземпляра игры
	 * @param {number} mapSize размерность карты
	 * @param {number} playersCount количество игроков (2 или 4)
	 * @param {number} pirateCount количество фишек на игрока
	 */
	constructor(mapSize, playersCount, pirateCount) {
		this.map = MapBuilder.generateMap(distribution);	// получение карты в виде матрицы

		this.currentPlayer = 0;
		this.playersCount = playersCount;
		
		this.timeOut = this.startTimer();
		this.totalGoldCount = this.map.getTotalGoldCount();
		this.currentSelectedPirate = -1; // TODO убрать ???

		this.hovered = false;	//???

		this.players = Array(playersCount);
		for(let i = 0; i < playersCount; i++) {
			this.players[i] = new Player();
			this.players[i].addPirates(pirateCount, 'base-' + i);
		}

		this.UI = new UI(mapSize, this.timeOut);

		// навешиваем событие переворота карточки
		for(let i = 1; i <= mapSize * mapSize; ++i) {
			this.UI.setEventListener('click', 'gamecard-' + i, function() {
				window.game.flipCard(this.id);
			});
		}
	
		// навешиваем событие выбора пирата
		for (let i = 0; i < this.players.length; i++) {
			for (let j = 0; j < this.players[i].getPirates().length; j++) {
				const id = 'pirate-' + i + '-' + j;
				this.UI.setEventListener('click', id, function() {
					window.game.playerClick(this.id);
				});
			}
		}
	}

	/**
	 * Проверка выиграша какого-либо игрока
	 */
	checkForWin() {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].getScore() > this.totalGoldCount / 2) {
				return true;
			}
		}
		return false;
	}
  
	startTimer() {
		return window.setTimeout(function() {
			this.currentPlayer = (this.currentPlayer + 1) % this.playersCount;
			this.hovered = false;
			this.UI.resetOpacity();
			alert('Время вашего хода истекло');
		}, 30000);
	}

	/**
	 * Обработка нажатия на пирата
	 * @param {string} id id пирата на которого нажали
	 */
	playerClick(id) {
		if (this._getPlayerNumber(id) != this.currentPlayer) {
			return;
		}
	
		if (!this.hovered) {
			this.hovered = true;
			this.UI.setLowOpacity();
			let pirateID = this._getPirateNumber(id);
			let currentCard = this.players[this.currentPlayer].getPirate(pirateID).getCard();
			let moveableCards = this.map.getMoveableCards(currentCard);
			moveableCards.forEach(function(id) {
				document.getElementById('gamecard-' + id).style.opacity = 1;
			});
			this.currentSelectedPirate = pirateID; // TODO убрать
		} 
		else {
			this.hovered = false;
			this.UI.resetOpacity();
		}
	}

	/**
	 * Обработка нажатия на карточку
	 * @param {string} id id нажатой карточки
	 */
	flipCard(id) {
		if (!this.hovered) {
			return false;
		}
		const cardID = parseInt(this.getCardNumber(id));
		const currentCard = this.players[this.currentPlayer].getPirate(this.currentSelectedPirate).getCard();
		let moveableCards = this.map.getMoveableCards(currentCard);
		if (moveableCards.indexOf(cardID) == -1) {
			return false;
		}
	
		window.clearTimeout(this.timeOut);

		this.players[this.currentPlayer].getPirate(this.currentSelectedPirate).setCard(id);
	
		const cardType = this.map.getCardType(cardID);
		const cardObject = CardBuilder.build(cardType);
		cardObject.apply(this);
	
		const card = document.getElementById(id);
		switch (cardType) {
		case CARDTYPES.GOLD:
			card.getElementsByTagName('img')[0].src = 'img/gold.png';
			break;
		case CARDTYPES.KILL:
			card.getElementsByTagName('img')[0].src = 'img/kill.png';
			break;
		default:
			card.getElementsByTagName('img')[0].src = 'img/water.png';
			break;
		}
		card.classList.add('flip');

		const pirate = 'pirate-' + this.currentPlayer + '-' + this.currentSelectedPirate;
		document.getElementById(pirate).classList.add('flip');
		this.UI.moveToCard(pirate, id);
		this.UI.resetOpacity();

		if (this.checkForWin()) {
			if (this.done === undefined) {
				alert('Игрок ' + this.currentPlayer + ' выиграл! Вы можете продолжать игру (тестовый режим).');
				this.done = true;
			}
		}
		this.currentPlayer = (this.currentPlayer + 1) % this.players.length;	
		this.hovered = false;
		this.timeOut = this.startTimer();
		return true;
	}
	
	_getPlayerNumber(id) {
		return id.match(/\d+/g).map(Number)[0];
	}
	
	_getPirateNumber(id) {
		return id.match(/\d+/g).map(Number)[1];
	}

	getCardNumber(id) {
		return id.match(/\d+/)[0];
	}
}