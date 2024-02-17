export const COLORS = {
    colorsArray: ['green', 'blue', 'violet', 'pink', 'orange'],
    randomColor() { return this.colorsArray[Math.floor(Math.random() * 5)] }
}

export const ANIMATIONS = {
	animationsArray: ['animation-rotation', 'animation-opacity', 'animation-size', ''],
	randomAnimation() { return this.animationsArray[Math.floor(Math.random() * 4)] }
}

export const WRAPPER_SETTINGS = {
    '1': {
        gap: '20px',
        columns: '1fr 1fr 1fr',
        rows: '1fr 1fr',
	    fontSize: '32px'
    },
    '2' : {
        gap: '20px',
        columns: '1fr 1fr 1fr',
        rows: '1fr 1fr',
	    fontSize: '32px'
    },
    '3' : {
        gap: '20px',
        columns: '1fr 1fr 1fr',
        rows: '1fr 1fr',
	    fontSize: '32px'
    },
    '4' : {
        gap: '14px',
        columns: '1fr 1fr 1fr 1fr',
        rows: '1fr 1fr 1fr',
	    fontSize: '24px'
    },
    '5' : {
        gap: '14px',
        columns: '1fr 1fr 1fr 1fr',
        rows: '1fr 1fr 1fr',
	    fontSize: '24px'
    },
    '6' : {
        gap: '10px',
        columns: '1fr 1fr 1fr 1fr',
        rows: '1fr 1fr 1fr 1fr',
	    fontSize: '20px'
    },
    '7' : {
        gap: '10px',
        columns: '1fr 1fr 1fr 1fr',
        rows: '1fr 1fr 1fr 1fr',
	    fontSize: '20px'
    },
    '8' : {
        gap: '8px',
        columns: '1fr 1fr 1fr 1fr 1fr',
        rows: '1fr 1fr 1fr 1fr 1fr',
	    fontSize: '18px'
    },
    '9' : {
        gap: '8px',
        columns: '1fr 1fr 1fr 1fr 1fr',
        rows: '1fr 1fr 1fr 1fr 1fr',
	    fontSize: '18px'
    }
}