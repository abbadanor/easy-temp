let tempButton = document.getElementById('temp-button')!;
let humidButton = document.getElementById('humid-button')!;

let roomsArray = [
    { temperature: 22, humidity: 35 },
    { temperature: 18, humidity: 42 },
    { temperature: 21, humidity: 25 },
    { temperature: 20, humidity: 30 },
    { temperature: 19, humidity: 40 },
];

let writeRoomData = () => {
    for (let i in roomsArray) {
        document.querySelector(`#room${i}>div>.temp>span`)!.innerHTML = `${roomsArray[i].temperature}°C`;
        document.querySelector(`#room${i}>div>.humid>span`)!.innerHTML = roomsArray[i].humidity.toString();
    }
}

let temperatureExponentiate = (currentTemp: number, minTemp: number, maxTemp: number, bias: number) => {
    if (bias === 0) bias = 0.001;
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp) float = 0;
    if (currentTemp > maxTemp) float = 1;

    let exponentFunction = (x: number, b: number) => {
        let rX = ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
        let bX = -(((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1)) + 1;
        return { b: bX, r: rX }
    }

    let exponentiatedFloat = exponentFunction(float, bias);
    return `rgb(${exponentiatedFloat.r * 255}, 0, ${exponentiatedFloat.b * 255})`;
}

let humidityExponantiate = (currentTemp: number, minTemp: number, maxTemp: number, bias: number) => {
    if (bias === 0) bias = 0.001;
    let float = (currentTemp - minTemp) / (maxTemp - minTemp);
    if (currentTemp < minTemp) float = 0;
    if (currentTemp > maxTemp) float = 1;

    let exponentFunction = (x: number, b: number) => ((Math.exp(b) ** x) - 1) / (Math.exp(b) - 1);
    return `rgb(0, 0, ${exponentFunction(float, bias) * 255})`;
}

let colorRoomTemps = () => {
    for (let i = 0; i < roomsArray.length; i++) {
        let room = document.getElementById('room' + i)!;
        room.style.backgroundColor = temperatureExponentiate(roomsArray[i].temperature, 15, 30, -4);
    }
}

let colorRoomHumid = () => {
    for(let i in roomsArray) {
        let room = document.getElementById('room' + i)!;
        room.style.backgroundColor = humidityExponantiate(roomsArray[i].humidity, 20, 50, -8);
    }
}

tempButton.onclick = () => {
    colorRoomTemps();
}

humidButton.onclick = () => {
    colorRoomHumid();
}

window.onload = () => {
   colorRoomTemps();
   writeRoomData();
}