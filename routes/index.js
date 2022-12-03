const userRoutes = require('./user');

const constructorMethod = (app) => {
    
  app.use('/', userRoutes);
  
  app.use('*', (req, res) => {
    return res.redirect('/')
  });
};

module.exports = constructorMethod;
