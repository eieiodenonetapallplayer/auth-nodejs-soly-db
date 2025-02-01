const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const net = require('net');
const cookieParser = require('cookie-parser');

const app = express();
const DEFAULT_PORT = 3000;

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());

const router = require('./routes/main');

app.use('/', router);

const findAvailablePort = (port, callback) => {
    const server = net.createServer();

    server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            callback(null, port + 1);
        } else {
            callback(err, null);
        }
    });

    server.once('listening', () => {
        server.close(() => callback(null, port));
    });

    server.listen(port);
};

findAvailablePort(DEFAULT_PORT, (err, availablePort) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    const PORT = availablePort || DEFAULT_PORT;

    app.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`);
    });
});