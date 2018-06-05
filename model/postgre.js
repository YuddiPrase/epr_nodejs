var Model = {};

//Koneksi Postgre
	const Sequelize = require('sequelize');
	const Op = Sequelize.Op;
	const operatorsAliases = {
	  $eq: Op.eq,
	  $ne: Op.ne,
	  $gte: Op.gte,
	  $gt: Op.gt,
	  $lte: Op.lte,
	  $lt: Op.lt,
	  $not: Op.not,
	  $in: Op.in,
	  $notIn: Op.notIn,
	  $is: Op.is,
	  $like: Op.like,
	  $notLike: Op.notLike,
	  $iLike: Op.iLike,
	  $notILike: Op.notILike,
	  $regexp: Op.regexp,
	  $notRegexp: Op.notRegexp,
	  $iRegexp: Op.iRegexp,
	  $notIRegexp: Op.notIRegexp,
	  $between: Op.between,
	  $notBetween: Op.notBetween,
	  $overlap: Op.overlap,
	  $contains: Op.contains,
	  $contained: Op.contained,
	  $adjacent: Op.adjacent,
	  $strictLeft: Op.strictLeft,
	  $strictRight: Op.strictRight,
	  $noExtendRight: Op.noExtendRight,
	  $noExtendLeft: Op.noExtendLeft,
	  $and: Op.and,
	  $or: Op.or,
	  $any: Op.any,
	  $all: Op.all,
	  $values: Op.values,
	  $col: Op.col
	};

	const sequelize = new Sequelize('db_eproc', 'admin', 'admin123', {
	  operatorsAliases: operatorsAliases,
	  host: '10.10.8.6',
	  dialect: 'postgres',
	  port: 5432,
	  pool: {
	    max: 5,
	    min: 0,
	    acquire: 30000,
	    idle: 10000
	  },

	  define: {
	  	timestamps: false
	  }
	});

	sequelize
	  .authenticate()
	  .then(() => {
	    console.log('Connection has been established successfully.');
	  })
	  .catch(err => {
	    console.error('Unable to connect to the database:', err);
	  });	

//Table User
	Model.User = sequelize.define('users', {
		id: {
			type: Sequelize.STRING, primaryKey: true
		},
		name: {
			type: Sequelize.STRING
		}, 
		email: {
			type: Sequelize.STRING
		}, 
		password: {
			type: Sequelize.STRING
		}, 
		is_verified: {
			type: Sequelize.BOOLEAN
		}, 
		remember_token: {
			type: Sequelize.STRING
		}, 
		deleted_at: {
	 		type: Sequelize.DATE
		}, 
		created_at:{
			type: Sequelize.DATE
		}, 
		updated_at:{
			type: Sequelize.DATE
		}, 
		updated_by:{
			type: Sequelize.INTEGER
		}, 
		created_by:{
			type: Sequelize.INTEGER
		}, 
		ip_address:{
			type: Sequelize.STRING
		}, 
		id_organisasi_perusahaan:{
			type: Sequelize.INTEGER
		},
		id_jabatan:{
			type: Sequelize.INTEGER
		}
	});

	/*
	Model.User.associate = (models) => {
	    Model.User.hasMany(models.ModelUserVerification, {
	      foreignKey: 'todoId',
	      as: 'todoItems',
	    });
	  };
	*/

module.exports = Model;