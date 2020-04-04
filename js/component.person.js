const STATUS = {
    HEALTHY: {
        id: 0,
        color: "#434348",
        icon: "\uF5a4",
        bold: false
    },
    INFECTED: {
        id: 1,
        color: "#f45b5b",
        icon: "\uF119",
        bold: true
    },
    RECOVERED: {
        id: 2,
        color: "#2b908f",
        icon: "\uF59a",
        bold: true
    },
    DEAD: {
        id: 3,
        color: "#434348",
        icon: "\uF567",
        bold: true
    }
};

class Person extends Component {

    constructor(label, position, velocity, radius) {
        super(label, position, velocity);

        this.initialRadius = radius;

        this.reset();
    }

    reset() {
        super.reset();

        this.radius = this.initialRadius;
        this.status = STATUS.HEALTHY;
        this.infectedTime = null;
    }

    setInfected(){
        this.status = STATUS.INFECTED;
        this.infectedTime = new Date();
    }

    draw(ctx) {

        var icon = this.status.icon;
        var bold = this.status.bold;
        var color = this.status.color;

        var fontSize = this.radius * 2.0;
        var colorBold = bold ? '800' : '1';

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        ctx.font = `${colorBold} ${fontSize}px "Font Awesome 5 Free"`;
        ctx.fillText(icon, this.position[0], this.position[1]);


        // ctx.beginPath();
        // ctx.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI);
        // ctx.stroke();

        // ctx.beginPath();
        // ctx.rect(this.position[0] - this.radius, this.position[1] - this.radius, 2* this.radius, 2*this.radius);
        // ctx.stroke();
    }
}
