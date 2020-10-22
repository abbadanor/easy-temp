// Temperature constants
let MAX_TEMP: number;
let MIN_TEMP: number;
let TEMP_BIAS: number;

// Humidity letants
let MAX_HUMID: number;
let MIN_HUMID: number;
let HUMID_BIAS: number; 

// Jquery DOM elements
const thermometer = $('.thermometer');
const tempText = $('#temperature-text');
const thermoMarker = $('#thermo-marker');
const tempButton = $('#temp-button');
const humidButton = $('#humid-button');
const range = $('.range');
const minValueSlider = $('#min-val-slider');
const maxValueSlider = $('#max-val-slider');
const biasValueSlider = $('#bias-slider');
const minValText = $('#min-val-text');
const maxValText = $('#max-val-text');
const biasText = $('#bias-text');
const placeholderText = $('.placeholder');

// Global varibles
let cursorInsideThermometer = false;
let view: 'temperature' | 'humidity';

// Room temperature/humidity data placeholder
let roomsArray = [
    { temperature: 22, humidity: 35 },
    { temperature: 18, humidity: 42 },
    { temperature: 21, humidity: 32 },
    { temperature: 20, humidity: 30 },
    {},
];

/*  
    Maps number range to another number range
    0..100 -> 0..30 etc
 */
let mapRange = (numToMap:number, inMin: number, inMax: number, outMin: number, outMax: number) => (numToMap - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

let writeRoomData = () => {
    for (let i in roomsArray) {
        $(`#room${i}>div>.temp>span`).html(roomsArray[i].temperature!.toString());
        $(`#room${i}>div>.humid>span`).html(roomsArray[i].humidity!.toString());
    }
}

// Sets gradient of thermometer
let setGradient = () => {
    let gradientString = '';
    if(view === 'temperature') {
        tempText.removeClass();
        tempText.addClass('celsius');
        for (let i = 1; i <= 100; i++) {
            let percentageString = `${temperatureExponentiateFloat(i/100, TEMP_BIAS)} ${(i / 100) * 100}%`
            if(i === 100) {
                gradientString += percentageString;
            } else {
                gradientString += percentageString + ", "
            }
        }
    } else {
        tempText.removeClass();
        tempText.addClass('humidity');
        for (let i = 1; i <= 100; i++) {
            let percentageString = `${humidityExponantiateFloat(i/100, HUMID_BIAS)} ${(i / 100) * 100}%`
            if(i === 100) {
                gradientString += percentageString;
            } else {
                gradientString += percentageString + ", "
            }
        }
    }

	thermometer.css('background', `linear-gradient(to top, ${gradientString})`);
}

// Returns rgb value
let temperatureExponentiate = (currentTemp: number, minTemp: number, maxTemp: number, bias: number) => {
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp) float = 0;
    if (currentTemp > maxTemp) float = 1;
    let exponentFunction = (x: number, b: number) => {
        let rX: number;
        let bX: number;
        if(bias === 0) {
            rX = x;
            bX = -x +1 ;
        } else {
            rX = ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
            bX = -(((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1)) + 1;
        }
        return { b: bX, r: rX }
    }

    let exponentiatedFloat = exponentFunction(float, bias);
    return `rgb(${exponentiatedFloat.r * 255}, 0, ${exponentiatedFloat.b * 255})`;
}

// Returns floating point from 0 ... 1
let temperatureExponentiateFloat = (float: number, bias: number) => {
    let exponentFunction = (x: number, b: number) => {
        let rX: number;
        let bX: number;
        if(bias === 0) {
            rX = x;
            bX = -x + 1;
        } else {
			rX = ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
        	bX = -(((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1)) + 1;
		}
        return { b: bX, r: rX }
    }

    let exponentiatedFloat = exponentFunction(float, bias);
    return `rgb(${(exponentiatedFloat.r * 255)}, 0, ${(exponentiatedFloat.b * 255)})`;
}

let humidityExponantiate = (currentTemp: number, minTemp: number, maxTemp: number, bias: number) => {
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp) float = 0;
    if (currentTemp > maxTemp) float = 1;

    if(bias === 0) {
        return `rgb(0, 0, ${float * 255})`;
    } else {
        let exponentFunction = (x: number, b: number) => ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
        return `rgb(0, 0, ${exponentFunction(float, bias) * 255})`;
    }
}

let humidityExponantiateFloat = (float: number, bias: number) => {
    if(bias === 0) {
        return `rgb(0, 0, ${float * 255})`;
    } else {
        let exponentFunction = (x: number, b: number) => ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
        return `rgb(0, 0, ${exponentFunction(float, bias) * 255})`;
    }
}

// Color in the rooms
let colorRooms = () => {
    if (view === 'temperature') {
        for (let i in roomsArray) {
            if (roomsArray[i].temperature) {
                $(`#room${i}`).css('background-color', temperatureExponentiate(roomsArray[i].temperature!, MIN_TEMP, MAX_TEMP, TEMP_BIAS));
            } else {
                $(`#room${i}`).css('background-color', "#333");
            }
        }
    } else {
        for (let i in roomsArray) {
            if (roomsArray[i].temperature) {
                $(`#room${i}`).css('background-color', humidityExponantiate(roomsArray[i].humidity!, MIN_HUMID, MAX_HUMID, HUMID_BIAS));
            } else {
                $(`#room${i}`).css('background-color', "#333");
            }
        }
    }
    setGradient();
};

// Get values from sliders
let getValues = (startup?: boolean) => {
    if(view === 'temperature') {
        if(startup) {
            minValText.html('' + MIN_TEMP);
            maxValText.html('' + MAX_TEMP);
            biasText.html('' + TEMP_BIAS);
            return;
        }

        MAX_TEMP = +maxValueSlider.val()! || 30;
        MIN_TEMP = +minValueSlider.val()! || 10;
        TEMP_BIAS = +biasValueSlider.val()! || -2;

        localStorage.setItem('max-temperature', '' + MAX_TEMP);
        localStorage.setItem('min-temperature', '' + MIN_TEMP);
        localStorage.setItem('temperature-bias', '' + TEMP_BIAS);

        minValText.html('' + MIN_TEMP);
        maxValText.html('' + MAX_TEMP);
        biasText.html('' + TEMP_BIAS);

        colorRooms();
        setGradient();
    } else {
        if(startup) {
            minValText.html('' + MIN_HUMID);
            maxValText.html('' + MAX_HUMID);
            biasText.html('' + HUMID_BIAS);
            return;
        }

        MAX_HUMID = +maxValueSlider.val()! || 50;
        MIN_HUMID = +minValueSlider.val()! || 1;
        HUMID_BIAS = +biasValueSlider.val()! || -8;

        localStorage.setItem('max-temperature', '' + MAX_HUMID);
        localStorage.setItem('min-temperature', '' + MIN_HUMID);
        localStorage.setItem('temperature-bias', '' + HUMID_BIAS);

        minValText.html('' + MIN_HUMID);
        maxValText.html('' + MAX_HUMID);
        biasText.html('' + HUMID_BIAS);

        colorRooms();
        setGradient();
    }
}

thermometer.on('mouseenter', (e) => {
	cursorInsideThermometer = true;
});

thermometer.on('mouseleave', (e) => {
	cursorInsideThermometer = false;
});

// When cursor moves on thermometer
thermometer.on('mousemove', (e)=>{
	if(cursorInsideThermometer) {
		let top = thermometer.offset()!.top; // y value of top of thermometer
        let bottom = thermometer.offset()!.top + thermometer.height()!; // y value of bottom of thermometer
        
		let percentage = ((e.pageY - bottom) / (top - bottom)) * 100; // mouse cursor percentage from bottom to top of thermometer
		if(percentage < 0) percentage = 0;
        if(percentage > 100) percentage = 100;

        let mappedPercentage: number; // mappedpercentage is the percentage mapped onto min_temp..max_temp range
        if(view === 'temperature') {
            mappedPercentage = mapRange(percentage, 0, 100, MIN_TEMP, MAX_TEMP);
        } else {
            mappedPercentage = mapRange(percentage, 0, 100, MIN_HUMID, MAX_HUMID)
        }

		thermoMarker.css('top', e.pageY - top - 4);
		tempText.css('top', e.pageY - top - 6);
		tempText.html(mappedPercentage.toFixed(1).toString());
	} else {
		return;
	}
})

// Change to temperature view
tempButton.on('click', ()=>{
    view = "temperature";
    placeholderText.html('Temperature');
    colorRooms();
    getValues(true);
})
 // Change to humidity view
humidButton.on('click', ()=>{
    view = "humidity";
    placeholderText.html('Humidity');
    colorRooms();
    getValues(true);
})

// On slider change, get values
range.on('input', ()=> {
    getValues();
})

// When window has finished loading
window.onload = () => {
    if(typeof(Storage) !== "undefined") {
        MIN_TEMP = +localStorage.getItem("min-temperature")! || 30;
        MAX_TEMP = +localStorage.getItem("max-temperature")! || 10;
        TEMP_BIAS = +localStorage.getItem("temperature-bias")! || -2;

        MIN_HUMID = +localStorage.getItem("min-humidity")! || 50;
        MAX_HUMID = +localStorage.getItem("max-humidity")! || 1;
        HUMID_BIAS = +localStorage.getItem("humidity-bias")! || -8;
    } else {
        MIN_TEMP = 30;
        MAX_TEMP = 10;
        TEMP_BIAS = -2;

        MIN_HUMID = 50;
        MAX_HUMID = 1;
        HUMID_BIAS = -8;
    }
    view = "temperature"; // Default view
    placeholderText.html('Temperature');
    colorRooms();
    setGradient();
    writeRoomData();
    getValues(true);
}