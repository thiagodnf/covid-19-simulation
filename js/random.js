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

            selectedIndexes.push(index);

            array = array.removeByIndex(index);
        }

        return selectedIndexes;
    }

    static getRandomValues(array, size) {

        var selectedIndexes = Random.getRandomIndexes(array, size);

        var selectedValues = [];

        for (var i = 0; i < selectedIndexes.length; i++) {
            selectedValues.push(array[selectedIndexes[i]]);
        }

        return selectedValues;
    }
}

