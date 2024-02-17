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
			timer: 60
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
			if (isRight) {
				const points = gameOptions.points + 22 * gameOptions.bonus
				gameOptions.points = points
				pointsLogic(points)
			}
			gameOptions.answers.push(isRight)

			hideNumbers()
		} // callback, который выполняется при клике на число

		const gameObject = Game.getGameObject(gameOptions.lvl)
		// Создаем объект с числами и искомым числом в зависимости от уровня
		const gameNumbers = Game.getGameNumbers(gameObject, gameOptions.lvl, choice)
		// Создаем на основе gameObject node элемент панели, со всеми слушателями событий
		const [gameNode, requiredNumberWrapper] = Game.getGameNode(gameObject, panel, gameNumbers)
		// Создаем саму game node, прокидывая туда gameNumbers и panel

		const hideNumbers = () => {
			delPrevGame()
			// Удаляем прк=едыдущую игру

			const nextGameObject = Game.getGameObject(gameOptions.lvl)
			const nextGameNumbers = Game.getGameNumbers(nextGameObject, gameOptions.lvl, choice)
			const nextRequiredValue = new DOMParser().parseFromString(
			`<span 
						class="game__required-number-value ${gameOptions.lvl > 5 ? 'game__required-number-value-little' : ''}"
						>${ nextGameObject[1] }
					</span>`,
			'text/html').querySelector('span')
			// Создаем новую игру

			requiredNumberWrapper.appendChild(nextRequiredValue)
			gameNode.appendChild(nextGameNumbers)

			setTimeout(() => nextGameNumbers.classList.add('show-numbers__wrapper'))
			setTimeout(() => nextRequiredValue.classList.add('show-game__required-number-value'))

			// Добавляем все на страницу и анимируем переход
		}
		gameContainer.appendChild(gameNode)
		// Здесь добавляем gameNode в gameContainer
	} // Функция создана, чтобы скрыть предыдущую игру и показать новую

	const startGame = () => {
		const [timerNode, timerCountDown] = timer(gameProcess)
		// Ставим тут таймер (3 секундный)

		clearContainer(gameContainer)
		// Очищаем контейнер

		gameContainer.appendChild(timerNode)
		// Добавляем туда таймер

		changeContainerBackground(gameContainer)
		// Меняем цвет фона

		timerCountDown()
		// Запускаем таймер
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
		// Сбрасываем класс для главного контейнера
		clearContainer(gameContainer)
		// Очищаем содержимое

		const { node, buttons } = createTotal(gameTotal)
		// Эта функция возращает страницу отчета и кнопки внутри страницы, которые перезапускают игру

		const [reload, onMainPage] = buttons

		reload.addEventListener('click', startEducation)
		onMainPage.addEventListener('click', () => { clearContainer(gameContainer); gameLogic() })
		// Тут диструктуризировали кнопки и навешали callback функции с перезапусками игры
		gameContainer.appendChild(node)
		// и добавили соответственно в главный контейнер
	}

	startGameBtn.addEventListener('click', startEducation)
}