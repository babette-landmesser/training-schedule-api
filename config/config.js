require('dotenv').config();//instatiate environment variables

CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || '127.0.0.1';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'training-schedule';
CONFIG.db_user      = process.env.DB_USER       || 'root';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'root';

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'bestCoderOnEarth';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

CONFIG.hash = process.env.HASH || 'ad0ericasdea';