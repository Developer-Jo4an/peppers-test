import { COLORS, WRAPPER_SETTINGS } from './constants.js'
import { createArmPointer, createErrorPointer } from './functions.js'

export class EducationGame {
	static getEducationObject() {
		// Данный метод создает массив из шести рандомных (уникальных) элементов в промежутке [1, 10]
		let numbers = Array.from({ length: 10 }, (_, i) => i + 1)

		for (let i = numbers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
		}

		const uniqueNumbers = numbers.slice(0, 6)
		const requiredNumberIndex = Math.floor(Math.random() * 6)
		const requiredNumber = uniqueNumbers[requiredNumberIndex]

		return {
			numbers: uniqueNumbers,
			required: requiredNumber
		}
	}

	static getEducationGameNode(educationObject, startGame) {
		// 1) Данный метод принимает аргументы: объект с уникальными числами и искомым числом, и функцию для запуска старта игры
		// 2) Формирует из аргументов dom node element, который обладает логикой в ответ на действия пользователя

		const { numbers, required } = educationObject

		const numbersNodeContainer = new DOMParser().parseFromString(`
			<div class="education-game__container">
				<div class="education-game__required-number">
					<p class="education-game__required-number-title">Найдите указанное число:</p>
					<span class="education-game__required-number-value">${ required }</span>
				</div>
			</div>
		`, 'text/html').querySelector('div')
		// Создаем окно обучения игры

		const { gap, columns, rows } = WRAPPER_SETTINGS['1']
		// Возвращаем настройку стилей wrapper, который содержит числа,
		// в качестве ключа указываем '1' - ключ совпадает с уровнем самой игры(на обучении 1 уровень)

		const randomNumbersWrapper = new DOMParser().parseFromString(`
			<div 
				class="education-numbers__wrapper" 
				style="--gap: ${gap}; --columns: ${columns}; --rows: ${rows}"
			></div>
		`, 'text/html').querySelector('div')
		// Создаем wrapper для всех чисел


		const educationMessage = new DOMParser().parseFromString(`
			<div class="education-game__message">'Нажмите на соответствующее число, чтобы продолжить'</div>
		`, 'text/html').querySelector('div')
		// Создаем описание к обучению

		numbers.forEach(number => {
			const numberNode = document.createElement('div')
			// Создаем dom node числа

			const randomColor = COLORS.randomColor()
			// Метод randomColor возвращает строку, например: 'violet', эту строку мы используем в качестве создания класса для dom node числа
			// Строка цвета рандомная

			numberNode.className = `education-number ${ randomColor }-style`
			// Устанавливаем в numberNode общий класс random-number и класс, отвечающий за цвет фона ${randomColor}-style

			numberNode.innerHTML = number.toString()
			// Добавляем само число внутрь numberNode

			if (number === required) {
				// Если наше число из массива равно искомому числу,
				// то добавляем к нему hand pointer для обучения

				const handPointer = createArmPointer(numberNode)
				// Создаем hand pointer

				numberNode.append(handPointer)
				// Добавляем hand pointer(он имеет абсолютное позиционирование) в numberNode
			}

			// Я решил сделать обучение пройденным, только в случае правильного ответа, так интереснее
			// Поэтому в этой функции мы присвоим слушатели события каждому числу

			numberNode.addEventListener('click', e => {
				if (number === required) {
					startGame()
					// Функция для начала основной игры после обучения
				}
				else {
					const clickCoordinatesX = e.layerX
					const clickCoordinatesY = e.layerY
					// Здесь мы получаем из объекта event координаты клика пользователя относительно number node

					const errorPointer = createErrorPointer(clickCoordinatesX, clickCoordinatesY)
					// Создаем error pointer

					numberNode.appendChild(errorPointer)
					// Добавляем error pointer в number Node

					setTimeout(() => errorPointer.remove(), 1000)
					// Удаляем error pointer, чтобы он не остался на страницу
				}
			})

			randomNumbersWrapper.appendChild(numberNode)
			// Добавляем number node во wrapper
		})

		numbersNodeContainer.appendChild(educationMessage)
		// Добавляем numbersNodeContainer внутрь numbersNodeContainer

		numbersNodeContainer.appendChild(randomNumbersWrapper)
		// Добавляем randomNumbersWrapper внутрь numbersNodeContainer

		return numbersNodeContainer
	}
}
