class Canvas extends EventEmitter {

    constructor(canvasId, speed, radius) {
        super();

        this.canvas = document.getElementById(canvasId);

        this.canvasWidth = $("body .container-fluid .row .col-6").width();
        this.canvasHeight = 600;

        this.canvas.width = this.canvasWidth;

        this.ctx = this.canvas.getContext("2d");

        this.points = [];
        this.isRunning = false;
        this.animation = null;
        this.iteration = 0;
        this.speed = speed;
        this.radius = radius;

        this.showGrid = false;
        this.useTheSameSpeed = true;

        // ctx.transform(1, 0, 0, -1, 0, canvas.height)
    }

    init(positions) {

        this.points = [];

        for (var i = 0; i < positions.length; i++) {

            var vx = Random.randElement([1, -1]);
            var vy = Random.randElement([1, -1]);

            this.addPoint(i, positions[i][0], positions[i][1], vx, vy);
        }

        this.emit("init", this.points);
    }

    addPoint(label, x, y, vx, vy) {

        var p = new Person(label, [x, y], [vx, vy], this.radius);

        this.emit("newPoint", p);

        this.points.push(p);
    }

    start() {

        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.animation = requestAnimationFrame(this.draw.bind(this));
    }

    stop() {

        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;
        cancelAnimationFrame(this.animation);
    }

    reset() {

        if (this.isRunning) {
            return;
        }

        for (var i = 0; i < this.points.length; i++) {
            this.points[i].reset();
        }

        this.emit("reset", this.points);

        this.iteration = 0;

        this.draw();
    }

    draw() {

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        for (var i = 0; i < this.points.length; i++) {

            var c1 = this.points[i];

            if (this.isRunning) {

                for (var j = i + 1; j < this.points.length; j++) {

                    var c2 = this.points[j];

                    this.verifyCollision(c1, c2);
                };

                if (this.useTheSameSpeed) {

                    var c = c1.velocity.norm();
                    var a = c1.velocity[0];
                    var b = c1.velocity[1];

                    var sin = b / c;
                    var cos = a / c;

                    c1.velocity[0] = this.speed * cos;
                    c1.velocity[1] = this.speed * sin;
                }

                this.findAllCollisionsWithWalls(i);

                if (c1.fixed) {
                    c1.velocity = [0, 0];
                }

                c1.position = c1.position.sum(c1.velocity);
            }

            this.drawCircle(c1);
        };

        if (this.isRunning) {

            this.iteration++;

            this.emit("iterate", this.iteration, this.points);

            this.animation = window.requestAnimationFrame(this.draw.bind(this));
        }
    }

    drawCircle(c) {
        c.draw(this.ctx);

        if (this.showGrid) {

            var vLines = this.canvasWidth / this.radius * 2;
            var hLines = this.canvasHeight / this.radius * 2;

            for (var i = 0; i < vLines; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(i * this.radius * 2, 0);
                this.ctx.lineTo(i * this.radius * 2, this.canvasHeight);
                this.ctx.stroke();
            }
            for (var i = 0; i < hLines; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, i * this.radius * 2);
                this.ctx.lineTo(this.canvasWidth, i * this.radius * 2);
                this.ctx.stroke();
            }
        }
    }

    getAvailablePositions(){

        var positions = [];

        var vLines = this.canvasWidth / this.radius * 2;
        var hLines = this.canvasHeight / this.radius * 2;

        for (var i = this.radius * 2; i < this.canvasWidth; i += this.radius * 2+5) {

            for (var j = this.radius * 2; j < this.canvasHeight; j += this.radius * 2+5) {
                positions.push([i, j]);

                //this.addPoint(i, i, j, 2, 2);
            }
        }

        return positions;
    }

    verifyCollision(c1, c2) {

        if (Collision.betweenTwoCircles(c1.position, c2.position, c1.radius, c2.radius)) {

            if (c1.status == STATUS.DEAD || c2.status == STATUS.DEAD) {
                return;
            }

            this.findCollisionsWithOtherPoints(c1, c2);

            this.emit("collide", this.iteration, c1, c2);
        }
    }

    findCollisionsWithOtherPoints(c1, c2) {

        // http://www.vobarian.com/collisions/2dcollisions2.pdf

        var p1 = c1.position;
        var p2 = c2.position;

        var radius = c1.radius + c2.radius;

        var n = p1.subtract(p2);

        // Move to start of collision

        var dr = (radius - n.norm()) / 2;

        var un = n.unitVector();

        p1 = p1.sum(un.scale(dr));
        p2 = p2.sum(un.scale(-dr));

        // console.log("p1", p1)
        // console.log("p2", p2)

        c1.position = p1;
        c2.position = p2;

        // Find normal and tangential components of v1/v2

        // Step 3: Next we need the unit tangent vector "ut"

        var ut = [-un[1], un[0]];


        var v1 = c1.velocity;
        var v2 = c2.velocity;

        // // Step 4: Create the initial (before the collision) velocity vectors, "v1" and "v2".


        // // Step 5: So we need to resolve the velocity vectors, "v1" and "v2", into normal and tangential components.

        var v1n = un.dot(v1);
        var v1t = ut.dot(v1);
        var v2n = un.dot(v2);
        var v2t = ut.dot(v2);

        // // Step 6: Find the new tangential velocities (after the collision). This is the simplest step of all. The tangential components of the velocity do not change after the collision because there is no

        var m1 = c1.weight;
        var m2 = c2.weight;

        var v1nNew = (v1n * (m1 - m2) + 2.0 * m2 * v2n) / (m1 + m2);
        var v2nNew = (v2n * (m2 - m1) + 2.0 * m1 * v1n) / (m1 + m2);

        // Calculate new v1/v2 in normal direction

        v1 = un.scale(v1nNew);
        v2 = ut.scale(v1t);

        c1.velocity = v1.sum(v2);

        v1 = un.scale(v2nNew);
        v2 = ut.scale(v2t);

        c2.velocity = v1.sum(v2);
    }

    findAllCollisionsWithWalls(i) {

        var c = this.points[i];

        var radius = c.radius;
        var p1 = c.position;
        var v1 = c.velocity;

        var left = 0;
        var top = 0;
        var right = this.canvasWidth;
        var bottom = this.canvasHeight;

        if (p1[0] < left + radius) {
            p1[0] = left + radius;
            v1[0] = -v1[0];
        }
        if (p1[1] < top + radius) {
            p1[1] = top + radius;
            v1[1] = -v1[1];
        }
        if (p1[0] > right - radius) {
            p1[0] = right - radius;
            v1[0] = -v1[0];
        }
        if (p1[1] > bottom - radius) {
            p1[1] = bottom - radius;
            v1[1] = -v1[1];
        }

        c.x = p1[0];
        c.y = p1[1];

        c.velocity = v1;
    }

    getStatus() {

        var status = {
            infected: 0,
            recovered: 0,
            deaths: 0
        };

        for (var i = 0; i < this.points.length; i++) {

            var p = this.points[i];

            if (p.status == STATUS.DEAD) {
                status.deaths++;
            }
            if (p.status == STATUS.INFECTED) {
                status.infected++;
            }
            if (p.status == STATUS.RECOVERED) {
                status.recovered++;
            }
        }

        return status;
    }
}


function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}
