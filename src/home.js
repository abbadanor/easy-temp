"use strict";
let roomsArray = [
    { temperature: 22, humidity: 35 },
    { temperature: 18, humidity: 42 },
    { temperature: 21, humidity: 25 },
    { temperature: 20, humidity: 30 },
    { temperature: 19, humidity: 40 },
];
let writeRoomData = () => {
    for (let i in roomsArray) {
        $(`#room${i}>div>.temp>span`).html(roomsArray[i].temperature.toString());
        $(`#room${i}>div>.humid>span`).html(roomsArray[i].humidity.toString());
    }
};
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
        rX = ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
        bX = -(((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1)) + 1;
        return { b: bX, r: rX };
    };
    let exponentiatedFloat = exponentFunction(float, bias);
    return `rgb(${exponentiatedFloat.r * 255}, 0, ${exponentiatedFloat.b * 255})`;
};
let humidityExponantiate = (currentTemp, minTemp, maxTemp, bias) => {
    if (bias === 0)
        bias = 0.001;
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp)
        float = 0;
    if (currentTemp > maxTemp)
        float = 1;
    let exponentFunction = (x, b) => ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
    return `rgb(0, 0, ${exponentFunction(float, bias) * 255})`;
};
let colorRoomTemps = () => {
    for (let i = 0; i < roomsArray.length; i++) {
        $(`#room${i}`).css('background-color', temperatureExponentiate(roomsArray[i].temperature, 15, 30, -4));
    }
};
let colorRoomHumid = () => {
    for (let i in roomsArray) {
        $(`#room${i}`).css('background-color', humidityExponantiate(roomsArray[i].humidity, 20, 50, -8));
    }
};
$('#temp-button').on('click', () => {
    colorRoomTemps();
});
$('#humid-button').on('click', () => {
    colorRoomHumid();
});
window.onload = () => {
    colorRoomTemps();
    writeRoomData();
};
