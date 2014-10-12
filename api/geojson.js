function Point(x, y) {
	this.type = 'Point';
	this.coordinates = [x, y];
}

Point.prototype.valid = function() {
	return !!(
		this.type == 'Point'
		&& (this.coordinates[0]
			|| this.coordinates[1])
	);
}

exports.Point = Point;