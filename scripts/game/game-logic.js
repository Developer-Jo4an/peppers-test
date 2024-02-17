import { changeContainerBackground, clearContainer, createHeadband, timer } from './functions.js'
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
			timer: 60
		}

		const { panel, timerLogic, lvlLogic, pointsLogic, bonusLogic } = Game.getGamePanel()
		// Создаем game panel и деструктурируем саму панель и функции, которые меняют ее состояние, как же не хватает React :()
		timerLogic(gameOptions.timer)
		lvlLogic(gameOptions.lvl)
		pointsLogic(gameOptions.points)
		bonusLogic(gameOptions.bonus)
		// Заводим изначальное состояние панели с помощью функций

		const rightChoice = () => {
			if (gameOptions.lvl < 9) lvlLogic(++gameOptions.lvl)
			if (gameOptions.bonus < 5) bonusLogic(++gameOptions.bonus)
			gameOptions.answers.push(true)
			pointsLogic(++gameOptions.points)

			hideNumbers()
		} // callback, который выполняется при правильном клике на число

		const gameObject = Game.getGameObject(gameOptions.lvl)
		// Создаем объект с числами и искомым числом в зависимости от уровня
		const gameNumbers = Game.getGameNumbers(gameObject, gameOptions.lvl, rightChoice)
		// Создаем на основе gameObject node элемент панели, со всеми слушателями событий
		const [gameNode, requiredNumber, requiredNumberWrapper] = Game.getGameNode(gameObject, panel, gameNumbers)
		// Создаем саму game node, прокидывая туда gameNumbers и panel

		const hideNumbers = () => {
			const requiredNumber = document.querySelector('.game__required-number-value')
			const numbersWrapper = document.querySelector('.game-numbers__wrapper')

			requiredNumber.classList.add('hide-game__required-number-value')
			numbersWrapper.classList.add('hide-numbers__wrapper')

			setTimeout(() => {
				requiredNumber.remove()
				numbersWrapper.remove()
			}, 300)

			const nextGameObject = Game.getGameObject(gameOptions.lvl)
			const nextGameNumbers = Game.getGameNumbers(nextGameObject, gameOptions.lvl, rightChoice)

			const nextRequiredValue = new DOMParser().parseFromString(
				`<span class="game__required-number-value">${ nextGameObject[1] }</span>`,
			'text/html').querySelector('span')

			requiredNumberWrapper.appendChild(nextRequiredValue)
			gameNode.appendChild(nextGameNumbers)

			setTimeout(() => nextGameNumbers.classList.add('show-numbers__wrapper'))
			setTimeout(() => nextRequiredValue.classList.add('show-game__required-number-value'))
		}
		// Функция, которая скрывает

		const timer = () => {
			if (gameOptions.timer > 1) {
				setTimeout(() => { timerLogic(--gameOptions.timer); timer() }, 1000)
			} else {
				alert('Время вышло')
			}
		}; timer()
		// Тут заводим таймер, который рекурсивно считается

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

	startGameBtn.addEventListener('click', startEducation)
}