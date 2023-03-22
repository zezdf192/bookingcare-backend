import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './config/viewEngine';
import initWebRoute from './route/web';
import connectDB from './config/connectDB';
import cors from 'cors';
require('dotenv').config();
const app = express();

app.use(cors({ origin: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

configViewEngine(app);
initWebRoute(app);

connectDB();

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
