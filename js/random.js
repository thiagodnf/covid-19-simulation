class Random {

    static randInt(startInclusive, endInclusive) {
        return Math.floor(Math.random() * (endInclusive - startInclusive + 1)) + startInclusive;
    }

    static randElement(array) {

        var index = Random.randInt(0, array.length - 1);

        return array[index];
    }

    static randDouble() {
        return Math.random();
    }

    static getRandomIndexes(array, size) {

        var selectedIndexes = [];

        while (selectedIndexes.length < size) {

            var index = Random.randInt(0, array.length - 1);

            selectedIndexes.push(array[index]);

            array = array.removeByIndex(index);
        }

        return selectedIndexes;
    }
}

