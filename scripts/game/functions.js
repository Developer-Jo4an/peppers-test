import { COLORS } from './constants.js'

export const clearContainer = container => {
    // Функция, которая очищает главный контейнер
    container.innerHTML = ''
}

export const changeContainerBackground = (container, isSmooth = false) => {
    // Функция, которая меняет цвет контейнера
    container.className = `game__container ${COLORS.randomColor()}-style ${isSmooth ? 'smooth-animation' : ''}`
}

export const createArmPointer = () => {
    // Эта функция создает руку(указатель при обучении на искомое число)
    const armNode = document.createElement('div')
    // Создаем node element руки
    armNode.classList.add('arm-pointer')
    // Добавляем класс

    const armImg = document.createElement('img')
    armImg.src = '../../assets/game-arm/game-arm.svg'
    armImg.alt = 'main-game-arm'
    armImg.classList.add('arm-pointer-sign')
    // Создаем img node со всеми атрибутами

    armNode.appendChild(armImg)
    // Добавляем img внутрь armNode

    return armNode
}

export const createErrorPointer = (x, y) => {
    // Эта функция создает error sign(указатель при ошибке)
    const errorNode = document.createElement('div')
    errorNode.classList.add('error-sign-wrapper')
    // Создаем dom node у error sign и присваиваем класс

    errorNode.style.setProperty('--x', `${ x }px`)
    errorNode.style.setProperty('--y', `${ y }px`)
    // Добавляем координаты в css property, чтобы правильно позиционировать sign

    const errorSign = document.createElement('img')
    errorSign.classList.add('error-sign')
    errorSign.src = '../../assets/error/error-sign.png'
    errorSign.alt = 'error-sign'
    // Создаем img node

    errorNode.appendChild(errorSign)
    // Добавляем img node внутрь errorNode

    return errorNode
}

export const timer = gameProcess => {
    let timeLeft = 3
    // Создаем счетчик

    const timerNode = new DOMParser().parseFromString(`
        <div class="timer__wrapper">
            <div class="timer__value">${timeLeft}</div>
        </div>
    `, 'text/html').querySelector('div')
    // Создаем timer node

    const timerValueNode = timerNode.firstElementChild
    // Находим timer Value node

    const timerCountdown = () => {
        if (timeLeft > 0) {
            setTimeout(() => { timerValueNode.innerHTML = (--timeLeft).toString(); timerCountdown() }, 1000)
            // Вычитаем каждую секунду от таймера 1 секунду
        }
        else {
            timerNode.remove()
            // Удаляем таймер
            gameProcess()
            // Вызываем функцию старта игрового процесса
        }
    }
    // Создаем рекурсивную функцию обратного отсчета

    return [timerNode, timerCountdown]
}

export const createHeadband = () => {
    const headBand = new DOMParser().parseFromString(`
       <div class="headband__wrapper">
           <div class="headband__header">
                <div class="headband__header-wrapper">
                    <h1 class="headband__title">НАЙДИ ЧИСЛО</h1>
                    <p class="headband__description">Тренажер на внимание</p>
                </div>
            </div>
            <div class="headband__content">
                <h2 class="headband__content-title">Тренирует:</h2>
                <ul class="headband__content-list">
                    <li class="headband__content__list-item">
                        <div class="headband__content__list-item-sign">
                            <img src="../../assets/start-slide/arbitrary-sign.svg" alt="arbitrary-sign">
                        </div>
                        <div class="headband__content__list-item-title">Произвольное внимание</div>
                        <div>Научитесь концентрировать внимание только на важном</div>
                    </li>
                    <li class="headband__content__list-item">
                        <div class="headband__content__list-item-sign">
                            <img src="../../assets/start-slide/concentration-sign.svg" alt="arbitrary-sign">
                        </div>
                        <div class="headband__content__list-item-title">Концентрацию и переключение внимания</div>
                        <div>Позволит не упускать из виду важные детали</div>
                    </li>
                    <li class="headband__content__list-item">
                        <div class="headband__content__list-item-sign">
                            <img src="../../assets/start-slide/visual-sign.svg" alt="arbitrary-sign">
                        </div>
                        <div class="headband__content__list-item-title">Зрительное восприятие</div>
                        <div>Сможете быстро находить основные мысли в текстах</div>
                    </li>
                </ul>
                <button class="headband__start-education-btn">Далее</button>
            </div>
        </div>
    </div>
    `, 'text/html').querySelector('div')

    const startGameBtn = headBand.querySelector('button')

    return [headBand, startGameBtn]
}