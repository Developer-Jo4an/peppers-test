import { ANIMATIONS, COLORS, WRAPPER_SETTINGS } from './constants.js'
import { createErrorPointer } from './functions.js'

export class Game {
    static getGameObject(lvl) {
        let numCount
        let numRange

        switch(lvl) {
            case 1: { numCount = 6; numRange = [1, 10]; break }
            case 2: case 3: { numCount = 6; numRange = [10, 100]; break }
            case 4: case 5: { numCount = 12; numRange = [100, 1000]; break }
            case 6: case 7: { numCount = 16; numRange = [1000, 10000]; break }
            case 8: case 9: { numCount = 25; numRange = [1000, 10000]; break }
        }

        let numbers = new Set()
        while(numbers.size < numCount) {
            numbers.add(Math.floor(Math.random() * (numRange[1] - numRange[0] + 1)) + numRange[0])
        }

        let numbersArray = Array.from(numbers)
        let required = numbersArray[Math.floor(Math.random() * numbersArray.length)]

        return [numbersArray, required]
    }

    static getGameNode(gameObject, gamePanel, gameNumbers) {

        const [_, required] = gameObject

        const gameNode = new DOMParser().parseFromString(`
            <div class="main-game__container">
				<div class="game__required-number">
					<p class="game__required-number-title">Найдите указанное число:</p>
					<span class="game__required-number-value">${ required }</span>
				</div>
			</div>
        `, 'text/html').querySelector('div')
        // Создаем окно игры

        const requiredNumber = gameNode.querySelector('.game__required-number-value')
        setTimeout(() => requiredNumber.classList.add('show-game__required-number-value'))

        const requiredNumberWrapper = gameNode.querySelector('.game__required-number')

        gameNode.appendChild(gamePanel)
        gameNode.appendChild(gameNumbers)

        return [gameNode, requiredNumber, requiredNumberWrapper]

    }
    static getGamePanel() {
        const gamePanelNode = new DOMParser().parseFromString(`
            <div class="game-panel__container">
                <div class="game-panel__timer">
                    <div class="game-panel__title">Таймер</div>
                    <div class="game-panel__timer-value"></div>
                </div>
                <div class="game-panel__lvl">
                    <div class="game-panel__title">Уровень</div>
                    <div class="game-panel__lvl-value"></div>        
                </div>
                <div class="game-panel__points">
                    <div class="game-panel__title">Очки</div>  
                    <div class="game-panel__point-value"></div>      
                </div>
                <div class="game-panel__bonus">
                    <div class="game-panel__title">Бонус</div>        
                    <div class="game-panel__bonus-circles-wrapper">
                        <div class="game-panel__bonus-circle"></div>
                        <div class="game-panel__bonus-circle"></div>
                        <div class="game-panel__bonus-circle"></div>
                        <div class="game-panel__bonus-circle"></div>
                        <div class="game-panel__bonus-circle"></div>
                        <div class="game-panel__bonus-value"></div>
                    </div>    
                </div>
            </div> 
        `, 'text/html').querySelector('div')

        // Создали game panel node

        const gamePanelTimer = gamePanelNode.querySelector('.game-panel__timer-value')
        const gamePanelLvl = gamePanelNode.querySelector('.game-panel__lvl-value')
        const gamePanelPoints = gamePanelNode.querySelector('.game-panel__point-value')
        const gamePanelBonus = gamePanelNode.querySelector('.game-panel__bonus-circles-wrapper')
        // Завели переменные к каждой характеристике панели

        const timerLogic = seconds => {
            gamePanelTimer.innerHTML = seconds.toString()
        } // Функция, меняющая состояние панели

        const lvlLogic = lvl => {
            gamePanelLvl.innerHTML = `${lvl}/9`
        } // Функция, меняющая состояние панели

        const pointsLogic = points => {
            gamePanelPoints.innerHTML = `${points}`
        } // Функция, меняющая состояние панели

        const bonusLogic = bonus => {
            const bonusCircles = [...gamePanelBonus.querySelectorAll('.game-panel__bonus-circle')]
            const bonusValue = gamePanelBonus.querySelector('.game-panel__bonus-value')

            bonusCircles.forEach(circle => circle.classList.remove('active-bonus-circle'))
            for (let i = 1; i <= bonus; i++) bonusCircles[i - 1].classList.add('active-bonus-circle')

            bonusValue.innerHTML = `x${bonus}`
        } // Функция, меняющая состояние панели

        return {
            panel: gamePanelNode,
            timerLogic,
            lvlLogic,
            pointsLogic,
            bonusLogic
        }
    }

    static getGameNumbers(gameObject, lvl, choice) {
        const [numbers, required] = gameObject

        const { gap, columns, rows, fontSize } = WRAPPER_SETTINGS[lvl.toString()]
        // Возвращаем настройку стилей wrapper, который содержит числа, в качестве ключа указываем lvl

        const randomNumbersWrapper = new DOMParser().parseFromString(`
			<div 
				class="game-numbers__wrapper" 
				style="--gap: ${gap}; --columns: ${columns}; --rows: ${rows}; --font-size: ${fontSize}"
			></div>
		`, 'text/html').querySelector('div')
        setTimeout(() => randomNumbersWrapper.classList.add('show-numbers__wrapper'))

        // Создаем wrapper для всех чисел

        numbers.forEach(number => {
            const numberNode = document.createElement('div')
            // Создаем dom node числа

            numberNode.className = `game-number ${ COLORS.randomColor() }-style ${lvl > 2 ? ANIMATIONS.randomAnimation() : ''}`
            // Устанавливаем в numberNode общий класс random-number и классы, отвечающий за цвет фона и анимацию, если уровень > 2

            numberNode.innerHTML =`<div class="game-number-value">${number.toString()}</div>`
            // Добавляем само число внутрь numberNode

            numberNode.addEventListener('click', e => {
                if (number !== required) {
	                const clickCoordinatesX = e.layerX
	                const clickCoordinatesY = e.layerY
	                // Здесь мы получаем из объекта event координаты клика пользователя относительно number node

	                const errorPointer = createErrorPointer(clickCoordinatesX, clickCoordinatesY)
	                // Создаем error pointer

	                numberNode.appendChild(errorPointer)
	                // Добавляем error pointer в number Node

	                setTimeout(() => errorPointer.remove(), 1000)
	                // Удаляем error pointer, чтобы он не остался на страницу

	                choice(false)
                }
	            choice(true)
            })
            randomNumbersWrapper.appendChild(numberNode)
            // Добавляем number node во wrapper
        })

        return randomNumbersWrapper
    }
}