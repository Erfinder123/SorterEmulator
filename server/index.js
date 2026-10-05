import express from 'express';
import { fileURLToPath } from 'node:url';
import leftContainerController from './leftContainerController.js';
import rightContainerController from './rightContainerController.js';
import { Container } from './container.js';
import { SorterContainer } from "./sorterContainer.js";
import { RequestQueue } from "./requestQueue.js";

const ADD_BATCH_INTERVAL = 10000;
const DATA_BATCH_INTERVAL = 1000;

const app = express();
export const leftContainer = new Container();
export const rightContainer = new SorterContainer();
export const addQueue = new RequestQueue(ADD_BATCH_INTERVAL);
export const dataQueue = new RequestQueue(DATA_BATCH_INTERVAL);

app.use(express.json());
app.use('/left', leftContainerController);
app.use('/right', rightContainerController);
const clientDist = fileURLToPath(new URL('../client/dist/', import.meta.url));
app.use(express.static(clientDist));
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    res.status(error.status ?? 500).send(error.status ? error.message : 'Internal server error!');
});
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${port}`);
});
