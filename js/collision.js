class Collision {

    /**
     * @param {array} p1 - Position for particle 1
     * @param {array} p2 - Position for particle 2
     * @param {number} r1 - Radio for particle 1
     * @param {number} r2 - Radio for particle 2
     * @return {boolean} True is collides, False otherwise
     */
    static betweenTwoCircles(p1, p2, r1, r2) {

        var radius = r1 + r2;

        var n = p1.subtract(p2);

        if (n.norm() < radius) {
            return true;
        }

        return false;
    }
}
