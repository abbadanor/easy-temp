"use strict";
const MAX_TEMP = 30;
const MIN_TEMP = 10;
const TEMP_BIAS = -2;
const MAX_HUMID = 45;
const MIN_HUMID = 25;
const HUMID_BIAS = -2;
let thermometer = $('.thermometer');
let cursorInsideThermometer = false;
let viewValue;
let roomsArray = [
    { temperature: 22, humidity: 35 },
    { temperature: 18, humidity: 42 },
    { temperature: 21, humidity: 32 },
    { temperature: 20, humidity: 30 },
    { temperature: 19, humidity: 40 },
];
let mapRange = (numToMap, in_min, in_max, out_min, out_max) => (numToMap - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
let writeRoomData = () => {
    for (let i in roomsArray) {
        $(`#room${i}>div>.temp>span`).html(roomsArray[i].temperature.toString());
        $(`#room${i}>div>.humid>span`).html(roomsArray[i].humidity.toString());
    }
};
function setGradient(type) {
    let gradientString = '';
    if (type === 'temperature') {
        $('#temperature-text').removeClass();
        $('#temperature-text').addClass('celsius');
        for (let i = 1; i <= 100; i++) {
            let percentageString = `${temperatureExponentiateFloat(i / 100, TEMP_BIAS)} ${(i / 100) * 100}%`;
            if (i === 100) {
                gradientString += percentageString;
            }
            else {
                gradientString += percentageString + ", ";
            }
        }
    }
    else if (type === 'humidity') {
        $('#temperature-text').removeClass();
        $('#temperature-text').addClass('humidity');
        for (let i = 1; i <= 100; i++) {
            let percentageString = `${humidityExponantiateFloat(i / 100, HUMID_BIAS)} ${(i / 100) * 100}%`;
            if (i === 100) {
                gradientString += percentageString;
            }
            else {
                gradientString += percentageString + ", ";
            }
        }
    }
    thermometer.css('background', `linear-gradient(to top, ${gradientString})`);
}
let temperatureExponentiate = (currentTemp, minTemp, maxTemp, bias) => {
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp)
        float = 0;
    if (currentTemp > maxTemp)
        float = 1;
    let exponentFunction = (x, b) => {
        let rX;
        let bX;
        if (bias === 0) {
            rX = -x + 1;
            bX = x;
        }
        else {
            rX = ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
            bX = -(((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1)) + 1;
        }
        return { b: bX, r: rX };
    };
    let exponentiatedFloat = exponentFunction(float, bias);
    return `rgb(${exponentiatedFloat.r * 255}, 0, ${exponentiatedFloat.b * 255})`;
};
let temperatureExponentiateFloat = (float, bias) => {
    let exponentFunction = (x, b) => {
        let rX;
        let bX;
        if (bias === 0) {
            rX = x;
            bX = -x + 1;
        }
        else {
            rX = ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
            bX = -(((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1)) + 1;
        }
        return { b: bX, r: rX };
    };
    let exponentiatedFloat = exponentFunction(float, bias);
    return `rgb(${(exponentiatedFloat.r * 255)}, 0, ${(exponentiatedFloat.b * 255)})`;
};
let humidityExponantiate = (currentTemp, minTemp, maxTemp, bias) => {
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp)
        float = 0;
    if (currentTemp > maxTemp)
        float = 1;
    if (bias === 0) {
        return `rgb(0, 0, ${float * 255})`;
    }
    else {
        let exponentFunction = (x, b) => ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
        return `rgb(0, 0, ${exponentFunction(float, bias) * 255})`;
    }
};
let humidityExponantiateFloat = (float, bias) => {
    if (bias === 0) {
        return `rgb(0, 0, ${float * 255})`;
    }
    else {
        let exponentFunction = (x, b) => ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
        return `rgb(0, 0, ${exponentFunction(float, bias) * 255})`;
    }
};
let colorRoomTemps = () => {
    for (let i = 0; i < roomsArray.length; i++) {
        $(`#room${i}`).css('background-color', temperatureExponentiate(roomsArray[i].temperature, MIN_TEMP, MAX_TEMP, TEMP_BIAS));
    }
};
let colorRoomHumid = () => {
    for (let i in roomsArray) {
        $(`#room${i}`).css('background-color', humidityExponantiate(roomsArray[i].humidity, MIN_HUMID, MAX_HUMID, HUMID_BIAS));
    }
};
let colorRooms = (type) => {
    if (type === 'temperature') {
        colorRoomTemps();
        setGradient(type);
    }
    else if (type === 'humidity') {
        colorRoomHumid();
        setGradient(type);
    }
};
thermometer.on('mouseenter', (e) => {
    cursorInsideThermometer = true;
});
thermometer.on('mouseleave', (e) => {
    cursorInsideThermometer = false;
});
thermometer.on('mousemove', (e) => {
    if (cursorInsideThermometer) {
        let top = thermometer.offset().top;
        let bottom = thermometer.offset().top + thermometer.height();
        let percentage = ((e.pageY - bottom) / (top - bottom)) * 100;
        if (percentage < 0)
            percentage = 0;
        if (percentage > 100)
            percentage = 100;
        let mappedPercentage;
        if (viewValue === 'temperature') {
            mappedPercentage = mapRange(percentage, 0, 100, MIN_TEMP, MAX_TEMP);
        }
        else {
            mappedPercentage = mapRange(percentage, 0, 100, MIN_HUMID, MAX_HUMID);
        }
        $('#thermo-marker').css('top', e.pageY - top - 4);
        $('#temperature-text').css('top', e.pageY - top - 6);
        $('#temperature-text').html(mappedPercentage.toFixed(1).toString());
    }
    else {
        return;
    }
});
$('#temp-button').on('click', () => {
    viewValue = "temperature";
    colorRooms(viewValue);
});
$('#humid-button').on('click', () => {
    viewValue = "humidity";
    colorRooms(viewValue);
});
window.onload = () => {
    viewValue = "temperature";
    colorRooms(viewValue);
    writeRoomData();
    setGradient(viewValue);
};
