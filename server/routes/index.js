const userRoutes = require('./user');
const transactionRoutes = require('./transaction')
const groupRoutes = require('./group')

const constructorMethod = (app) => {
    
  	app.use('/users', userRoutes); 
	app.use('/transactions', transactionRoutes);
	app.use('/groups', groupRoutes);
	app.use('*', (req, res) => {
		res.status(404).json({ error: 'Not Found' });
	});
};

module.exports = constructorMethod;
