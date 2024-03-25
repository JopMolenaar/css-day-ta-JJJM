let allData = [];

const yearsData = fetch("https://cssday.nl/data.json").then((response) => response.json());
const speakersData = fetch("https://cssday.nl/data/speakers.json").then((response) => response.json());
const talksData = fetch("https://cssday.nl/data/talks.json").then((response) => response.json());

Promise.all([yearsData, speakersData, talksData])
    .then(([data1, data2, data3]) => {
        allData.push(data1, data2, data3);
        dataCalc(data1);
    })
    .catch((error) => {
        console.error(error);
    });