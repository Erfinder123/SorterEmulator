import express from 'express';
import leftContainerController from './leftContainerController.js';
import rightContainerController from './rightContainerController.js';
import { Container } from './container.js';
import { SorterContainer } from "./sorterContainer.js";

const app = express();
export const leftContainer = new Container();
export const rightContainer = new SorterContainer();

app.use(express.json());
app.use('/left', leftContainerController);
app.use('/right', rightContainerController);
app.listen(3000, () => {
    console.log('Сервер запущен: http://localhost:3000');
});
