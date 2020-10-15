let tempButton = document.getElementById('temp-button')!;
let humidButton = document.getElementById('humid-button')!;

let roomsArray = [
    { temperature: 22, humidity: 35 }, //
    { temperature: 18, humidity: 42 }, //
    { temperature: 21, humidity: 25 }, //
    { temperature: 20, humidity: 30 }, //
    { temperature: 19, humidity: 40 }, //
];

let writeRoomData = () => {
    for (let i in roomsArray) {
        document.querySelector(`#room${roomsArray[i]}>div>.temp>span`)!.innerHTML = `${roomsArray[i].temperature}°C`;
        document.querySelector(`#room${roomsArray[i]}>div>.humid>span`)!.innerHTML = roomsArray[i].humidity.toString();
    }
}

let calculateTemperatureColor = (currentTemp: number, maxTemp: number, minTemp: number, b : number) => {
    let exponentionateRgb = (x: number, b: number) => {
        let f = (b ** x - 1) / (b - 1);
        let g = -((b ** x - 1) / (b - 1)) + 1;
        return { red: f, blue: g }
    }

    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp) float = 0;
    if (currentTemp > maxTemp) float = 1;

    let redValue = exponentionateRgb(float, b).red * 255;
    let blueValue = exponentionateRgb(float, b).blue * 255;

    return `rgb(${redValue}, 0, ${blueValue})`;
}

let calculateHumidityColor = (currentHumid: number, maxHumid: number, minHumid: number, b: number) => {
    let exponentCurve = (x: number, b: number) => (b ** x - 1) / (b - 1);

    let float = (currentHumid - minHumid) / (maxHumid - minHumid);
    if (currentHumid < minHumid) float = 0;
    if (currentHumid > maxHumid) float = 1;

    return `rgb(50, 50, ${exponentCurve(float, b) * 255})`;
}

function colorRoomTemps() {
    for (let i in roomsArray) {
        let room = document.getElementById('room' + roomsArray[i])!;
        room.style.backgroundColor = calculateTemperatureColor(roomsArray[i].temperature, 30, 15, 0.008);
    }
}

function colorRoomHumid() {
    for(let i in roomsArray) {
        let room = document.getElementById('room' + roomsArray[i])!;
        room.style.backgroundColor = calculateHumidityColor(roomsArray[i].humidity, 100, 1, 0.01);
    }
}

tempButton.onclick = () => {
    colorRoomTemps();
}

humidButton.onclick = () => {
    colorRoomHumid();
}

window.onload = () => {
    colorRoomHumid();
}