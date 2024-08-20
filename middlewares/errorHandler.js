import 'dotenv/config';

const prod = process.env.NODE_ENV;

const errorHandler = (err, req, res, next) => {

    if (prod === 'notproduction') {
        console.log('Status code - ', err.statusCode || 500, ' | MSG - ', err.message || 'неизвестная ошибка на сервере.');
    }
    console.log('Status code - ', err.statusCode || 500, ' | MSG - ', err.message || 'неизвестная ошибка на сервере.');
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || 'неизвестная ошибка на сервере.'
    });
  };
  
  export default errorHandler;