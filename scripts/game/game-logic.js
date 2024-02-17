import {
	changeContainerBackground,
	clearContainer,
	createHeadband,
	createTotal,
	delPrevGame,
	timer
} from './functions.js'
import { EducationGame } from './EducationGame.js'
import { Game } from './Game.js'

export const gameLogic = () => {
	const gameContainer = document.querySelector('.game__container')
	// Находим верхний контейнер

	const [headBand, startGameBtn] = createHeadband()
	gameContainer.appendChild(headBand)
	// Получаем приветственное с кнопкой старта игры и добавляем приветственное окно на страницу

	const gameProcess = () => {
		const gameOptions = {
			lvl: 1,
			answers: [],
			points: 0,
			bonus: 1,
			timer: 2
		}

		const timer = () => {
			if (gameOptions.timer > 0) {
				setTimeout(() => { timerLogic(--gameOptions.timer); timer() }, 1000)
			} else {
				gameOver(gameOptions)
			}
		}; timer()
		// Тут заводим таймер, который рекурсивно считается

		const { panel, timerLogic, lvlLogic, pointsLogic, bonusLogic } = Game.getGamePanel()
		// Создаем game panel и деструктурируем саму панель и функции, которые меняют ее состояние, как же не хватает React :()
		timerLogic(gameOptions.timer)
		lvlLogic(gameOptions.lvl)
		pointsLogic(gameOptions.points)
		bonusLogic(gameOptions.bonus)
		// Заводим изначальное состояние панели с помощью функций

		const choice = isRight => {
			if (isRight && gameOptions.lvl < 9) lvlLogic(++gameOptions.lvl)
			if (isRight && gameOptions.bonus < 5) bonusLogic(++gameOptions.bonus)
			if (!isRight && gameOptions.bonus > 1) bonusLogic(--gameOptions.bonus)
			gameOptions.answers.push(isRight)
			isRight ? pointsLogic(++gameOptions.points) : null

			if (gameOptions.timer > 0) hideNumbers()
			else {  }
		} // callback, который выполняется при правильном клике на число

		const gameObject = Game.getGameObject(gameOptions.lvl)
		// Создаем объект с числами и искомым числом в зависимости от уровня
		const gameNumbers = Game.getGameNumbers(gameObject, gameOptions.lvl, choice)
		// Создаем на основе gameObject node элемент панели, со всеми слушателями событий
		const [gameNode, requiredNumber, requiredNumberWrapper] = Game.getGameNode(gameObject, panel, gameNumbers)
		// Создаем саму game node, прокидывая туда gameNumbers и panel

		const hideNumbers = () => {
			delPrevGame()

			const nextGameObject = Game.getGameObject(gameOptions.lvl)
			const nextGameNumbers = Game.getGameNumbers(nextGameObject, gameOptions.lvl, choice)

			const nextRequiredValue = new DOMParser().parseFromString(
			`<span 
						class="game__required-number-value ${gameOptions.lvl > 5 ? 'game__required-number-value-little' : ''}"
						>${ nextGameObject[1] }
					</span>`,
			'text/html').querySelector('span')

			requiredNumberWrapper.appendChild(nextRequiredValue)
			gameNode.appendChild(nextGameNumbers)

			setTimeout(() => nextGameNumbers.classList.add('show-numbers__wrapper'))
			setTimeout(() => nextRequiredValue.classList.add('show-game__required-number-value'))
		}
		gameContainer.appendChild(gameNode)
		// Здесь добавляем gameNode в gameContainer
	}

	const startGame = () => {
		const [timerNode, timerCountDown] = timer(gameProcess)

		clearContainer(gameContainer)

		gameContainer.appendChild(timerNode)

		changeContainerBackground(gameContainer)

		timerCountDown()
	}

	const startEducation = () => {
		const educationGameObject = EducationGame.getEducationObject()
		// Создаем объект с настройками education main-game
		const educationGameNode = EducationGame.getEducationGameNode(educationGameObject, startGame)
		// Создаем node element игры и передаем туда настройки

		clearContainer(gameContainer)
		// Очищаем главный контейнер
		changeContainerBackground(gameContainer)
		// Изменили background контейнера

		gameContainer.appendChild(educationGameNode)
		// Добавили education main-game внутрь main-game container
	}

	const gameOver = gameTotal => {
		gameContainer.className = 'game__container'
		clearContainer(gameContainer)

		const totalNode = createTotal(gameTotal)

		gameContainer.appendChild(totalNode)
	}

	startGameBtn.addEventListener('click', startEducation)
}