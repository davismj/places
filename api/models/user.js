var Sequelize = require('sequelize'),
	postgres = new Sequelize(require('../config').postgres);

postgres.authenticate(); 

var FLAGS = {
	'login': 1,
	'add location': 2
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
