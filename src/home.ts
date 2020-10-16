// Temperature constants
const MAX_TEMP = 30;
const MIN_TEMP = 10;
const TEMP_BIAS = -2;

// Humidity constants
const MAX_HUMID = 45;
const MIN_HUMID = 25;
const HUMID_BIAS = -2;

// Jquery DOM elements
const thermometer = $('.thermometer');
const tempText = $('#temperature-text');
const thermoMarker = $('#thermo-marker');
const tempButton = $('#temp-button');
const humidButton = $('#humid-button');

// Global varibles
let cursorInsideThermometer = false;
let view: 'temperature' | 'humidity';

// Room temperature/humidity data placeholder
let roomsArray = [
    { temperature: 22, humidity: 35 },
    { temperature: 18, humidity: 42 },
    { temperature: 21, humidity: 32 },
    { temperature: 20, humidity: 30 },
    { temperature: 19, humidity: 40 },
];

/*  
    Maps number range to another number range
    0..100 -> 0..30 etc
 */
let mapRange = (numToMap:number, inMin: number, inMax: number, outMin: number, outMax: number) => (numToMap - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

let writeRoomData = () => {
    for (let i in roomsArray) {
        $(`#room${i}>div>.temp>span`).html(roomsArray[i].temperature.toString());
        $(`#room${i}>div>.humid>span`).html(roomsArray[i].humidity.toString());
    }
}

// Sets gradient of thermometer
let setGradient = (type: 'temperature' | 'humidity') => {
    let gradientString = '';
    if(type === 'temperature') {
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
    } else if(type === 'humidity') {
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

let temperatureExponentiate = (currentTemp: number, minTemp: number, maxTemp: number, bias: number) => {
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp) float = 0;
    if (currentTemp > maxTemp) float = 1;
    let exponentFunction = (x: number, b: number) => {
        let rX: number;
        let bX: number;
        if(bias === 0) {
            rX = -x + 1;
            bX = x;
        } else {
            rX = ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
            bX = -(((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1)) + 1;
        }
        return { b: bX, r: rX }
    }

    let exponentiatedFloat = exponentFunction(float, bias);
    return `rgb(${exponentiatedFloat.r * 255}, 0, ${exponentiatedFloat.b * 255})`;
}

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

let colorRooms = (type: 'temperature' | 'humidity') => {
    if(type === 'temperature') {
        for (let i in roomsArray) {
            $(`#room${i}`).css('background-color', temperatureExponentiate(roomsArray[i].temperature, MIN_TEMP, MAX_TEMP, TEMP_BIAS));
        }
        setGradient(type);
    } else if(type === 'humidity') {
        for(let i in roomsArray) {
            $(`#room${i}`).css('background-color', humidityExponantiate(roomsArray[i].humidity, MIN_HUMID, MAX_HUMID, HUMID_BIAS));
        }
        setGradient(type);
    }
}

thermometer.on('mouseenter', (e) => {
	cursorInsideThermometer = true;
});

thermometer.on('mouseleave', (e) => {
	cursorInsideThermometer = false;
});

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

tempButton.on('click', ()=>{
    view = "temperature";
    colorRooms(view);
})

humidButton.on('click', ()=>{
    view = "humidity";
    colorRooms(view);
})

window.onload = () => {
   view = "temperature"; // Default view 
   colorRooms(view);
   writeRoomData();
   setGradient(view);
}