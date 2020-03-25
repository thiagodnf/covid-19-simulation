class Component {

    constructor(label, position, velocity = [0, 0]) {

        this.initialLabel = label;
        this.initialPosition = position;
        this.initialVelocity = velocity;
        this.weight = 1;

        this.reset();
    }

    reset() {
        this.label = this.initialLabel;
        this.position = this.initialPosition.copy();
        this.velocity = this.initialVelocity.copy();
        this.fixed = false;
    }
}
