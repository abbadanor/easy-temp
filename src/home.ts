let tempButton = document.getElementById('temp-button')!;
let humidButton = document.getElementById('humid-button')!;

let roomsArray = [
    { room: "room0", temperature: 22, humidity: 35 },
    { room: "room1", temperature: 18, humidity: 42 },
    { room: "room2", temperature: 21, humidity: 25 },
    { room: "room3", temperature: 20, humidity: 30 },
    { room: "room4", temperature: 19, humidity: 40 },
]

let calculateTemperatureColor = (currentTemp: number, maxTemp: number, minTemp: number, b : number) => {
    let exponentionateRgb = (x: number, b: number) => {
        let f = (b ** x - 1) / (b - 1);
        let g = -((b ** x - 1) / (b - 1)) + 1;
        return { red: f, blue: g }
    }

    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    let redValue = exponentionateRgb(float, b).red * 255;
    let blueValue = exponentionateRgb(float, b).blue * 255;

    return `rgb(${redValue}, 0, ${blueValue})`;
}

let calculateHumidityColor = (currentHumid: number, maxHumid: number, minHumid: number, b: number) => {
    let exponentCurve = (x: number, b: number) => (b ** x - 1) / (b - 1);
    let float = (currentHumid - minHumid) / (maxHumid - minHumid);
    return `rgb(50, 50, ${exponentCurve(float, b) * 255})`;
}

function colorRoomTemps() {
    for (let i in roomsArray) {
        let room = document.getElementById(roomsArray[i].room)!;
        room.style.backgroundColor = calculateTemperatureColor(roomsArray[i].temperature, 30, 15, 0.008);
    }
}

function colorRoomHumid() {
    for(let i in roomsArray) {
        let room = document.getElementById(roomsArray[i].room)!;
        console.log(calculateHumidityColor(roomsArray[i].humidity, 100, 1, 10))
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