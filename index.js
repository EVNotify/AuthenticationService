const cors = require('cors');
const express = require('express');

const errors = require('./errors.json');
const port = process.env.PORT || 3002;

const authenticationRouter = require('./routes/authentication');
const db = require('@evnotify/utils').db;
const errorHandler = require('@evnotify/middlewares').errorHandler;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Cross-Origin-Resource-Sharing support
app.use(cors({
    credentials: true,
    /**
     * Handles the origin for CORS request
     * @param {String} origin the origin
     * @param {Function} callback callback function
     */
    origin: (origin, callback) => {
        if (!origin || origin === 'null') origin = '*';
        callback(null, origin);
    }
}));

// route parsing
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// route handling
app.use('/authentication', authenticationRouter);

// unknown route
app.use((_req, _res, next) => next(errors.UNKNOWN_ROUTE));

// error handling
app.use(errorHandler);

db.connect().then(() => {
    app.listen(port, () => console.log(`[HTTP] Server started on port ${port}`));
    app.emit('server_ready');
}).catch(() => {
    console.error('Database connection failed');
    process.exit(1);
});

module.exports = app;