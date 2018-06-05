var config = {
	node:{
		host: 'localhost',
		// host: '10.10.8.6',
		port: 3031,
		secure: false,
		auth: {
			user: null,
			pass: null
		}
	},
	email: {
		host: '10.10.8.6',
		port: 1025,
		secure: false,
		auth: {
			user: null,
			pass: null
		}
	},
	dbPostgre: {
		user: 'postgres',
		host: 'localhost',
		database: 'db_eproc',
		password: 'admin123',
		port: 5432
	},
	mongoDb:{
		user: 'mongodb',
		// host: '10.10.8.6',
		host: 'localhost',
		database: 'eproc-realtime',
		password: 'admin123',
		port: 5432
	}
};

module.exports = config;