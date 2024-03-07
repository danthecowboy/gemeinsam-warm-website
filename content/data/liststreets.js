const fs = require('fs');

fs.readFile('osm.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const obj = JSON.parse(data);
    const streets = [];
    obj.elements.forEach(element => {
        if (element.tags) {
            if (element.tags['addr:street']) {

                if (element.tags['addr:suburb'] === 'Burgjoß') {
                    return;
                }

                let index = 0;

                let result = streets.filter(street => street.name === element.tags['addr:street']);
                if (result.length === 0) {
                    index = streets.push( { name: element.tags['addr:street'] }) - 1;
                } else {
                    index = streets.indexOf(result[0]);
                }
                if (!streets[index].houseNumbers) {
                    streets[index].houseNumbers = [];
                }
                const houseNumber = parseInt(element.tags['addr:housenumber']);
                if (typeof houseNumber === 'number' || /^\d+$/.test(houseNumber)) {
                    if (streets[index].houseNumbers.indexOf(houseNumber) === -1) {
                        streets[index].houseNumbers.push(houseNumber);
                    }
                } else {
                    const regex = /^(\d+)[a-zA-Z]+/;
                    const match = houseNumber.match(regex);
                    if (match) {
                        const theNumber = parseInt(match[1]);
                        if (streets[index].houseNumbers.indexOf(theNumber) === -1) {
                            streets[index].houseNumbers.push(theNumber);
                        }
                    } else {
                        console.log('Unknown houseNumber: ', houseNumber);
                    }
                }
            }
        }
    });

    streets.forEach(street => {
        street.houseNumbers.sort((a, b) => a - b);
        const middle = street.houseNumbers[Math.floor(street.houseNumbers.length / 2)];
        console.log(street.name, middle);
        
    });
});