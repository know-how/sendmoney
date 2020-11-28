
const auth = require('../apis/appControllers/authentication');
const restControllers = require('../apis/appControllers/restControllers');
const webControllers = require('../apis/webControllers/webControllers');
const errors = require('../apis/errors/errors');

module.exports={
    auth,
    restControllers,
    webControllers,
    errors
    
}