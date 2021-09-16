if(process.env.NODE_ENV=='production'){
    module.wxports = require('./prod');
}else{
    module.wxports = require('./dev');
}