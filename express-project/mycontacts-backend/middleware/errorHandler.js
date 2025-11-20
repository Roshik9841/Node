const {constants} = require("../constants");

const errorHandler = (err,req,res,next)=>{

    const statusCode = res.statusCode?res.statusCode:500;
    switch(statusCode){
        case constants.VALIDATION_ERROR:
             res.json({title: "Validatoin Failed",message:err.message,
        stackTrace: err.stack
    });
    break;
  
    case constants.NOT_FOUND:
  res.json({title: "Not found",message:err.message,
        stackTrace: err.stack
    });
    break;

     case constants.UNAUTHORIZED:
  res.json({title: "Unauthoried",message:err.message,
        stackTrace: err.stack
    });
    break;
     case constants.FORBIDDEN:
  res.json({title: "Forbidden",message:err.message,
        stackTrace: err.stack
    });
    break;
    }
};

module.exports=(errorHandler);