Array.prototype.sum = function (v2) {

    if (this.length !== v2.length) {
        throw new Error("Different Length");
    }

    var r = new Array(this.length);

    for (var i = 0; i < this.length; i++) {
        r[i] = this[i] + v2[i];
    }

    return r;
}

Array.prototype.subtract = function (v2) {

    if (this.length !== v2.length) {
        throw new Error("Different Length");
    }

    var r = new Array(this.length);

    for (var i = 0; i < this.length; i++) {
        r[i] = this[i] - v2[i];
    }

    return r;
}

Array.prototype.norm = function () {

    var sum = 0.0;

    for (var i = 0; i < this.length; i++) {
        sum += Math.pow(this[i], 2);
    }

    return Math.sqrt(sum);
}

Array.prototype.unitVector = function () {

    var d = this.norm();

    var r = new Array(this.length);

    if (d != 0) {
        for (var i = 0; i < this.length; i++) {
            r[i] = this[i] / d;
        }
    }

    return r;
}

Array.prototype.scale = function (s) {

    var r = new Array(this.length);

    for (var i = 0; i < this.length; i++) {
        r[i] = this[i] * s;
    }

    return r;
}

Array.prototype.dot = function (v2) {

    if (this.length !== v2.length) {
        throw new Error("Different Length");
    }

    var sum = 0.0;

    for (var i = 0; i < this.length; i++) {
        sum += this[i] * v2[i];
    }

    return sum;
}

Array.prototype.copy = function () {

    var r = new Array(this.length);

    for (var i = 0; i < this.length; i++) {
        r[i] = this[i];
    }

    return r;
}

Array.prototype.range = function (startInclusive, endInclusive, step = 1) {

    var values = [];

    for (var i = startInclusive; i <= endInclusive; i += step) {
        values.push(i);
    }

    return values;
}

Array.prototype.removeByIndex = function (index) {

    if (index < 0 || index >= this.length) {
        throw new Error("Out of index");
    }

    var r = new Array();

    for (var i = 0; i < this.length; i++) {

        if (i !== index) {
            r.push(this[i])
        }
    }

    return r;
}
