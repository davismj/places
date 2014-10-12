var Sequelize = require('sequelize'),
	postgres = new Sequelize(require('../config').postgres);

postgres.authenticate(); 

var FLAGS = {
	'login': 1,
	'add location': 2
};

var AWARDS = {
	
	'busy': {
		id: 0,
		description: 'At least 20 visits.',
		condition: Events.subscribe('insert visit', 
			function(visit, mongo) {
				mongo.use('visits', function(visits) {
					visits
						.find({ user: visit.user })
						.toArray(function(err, visits) {
							if (visits.length >= 20)
								this.award(m );
						});
				});
			}
		)
	},

	'tester': {
	 	id: 0,
		description: 'Contributed at least 5 visits to the first 200.',
		condition: Events.subscribe('insert visit', 
			function(visit, mongo) {
				mongo.use('visits', function(visits) {
					visits
						.find({ user: visit.user })
						.toArray(function(err, visits) {
							if (visits.length >= 20)
								this.award(m );
						});
				});
			}
		)
	}
};

module.exports = 
	postgres.define('users', {
		id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
		email: { type: Sequelize.STRING, allowNull: false, unique: true },
		password: { type: Sequelize.STRING, allowNull: false },
		hash: Sequelize.UUID,
		flags: { type: Sequelize.BIGINT, allowNull: false, defaultValue: 0 }
	},{ 
		timestamps: false,
		instanceMethods: {
			toJson: function() {
				return {
					id: this.id,
					email: this.email,
					flags: this.flags
				}
			},
			can: function(permission) {
				return this.flags & FLAGS[permission];
			},
			allow: function(permission) { 
				this.flags |= FLAGS[permission];
			}
		}
	});

