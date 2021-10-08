const express = require('express');
const cors = require('cors');

const DatabaseConnection = require('./app/config/connection');
const ErrorHandle = require('./app/middleware/error');
const Routes = require('./routes');

const router = express.Router();
const app = express();
const port = 3000

DatabaseConnection.init();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());
app.use('/api', router);
app.use(ErrorHandle.error);
Routes(router);

app.use('/', (req, res) => {
    res.status(404);
    res.json({
        status: 404,
        message: 'not found'
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})