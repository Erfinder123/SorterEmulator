import { Router } from 'express';
import { Element } from './element.js';
import { leftContainer, rightContainer } from "./index.js";

const leftRouter = Router();

export const checkId = id => id == null;

leftRouter.get('/', (req, res) => {
    return res.status(200).json(leftContainer.getElements());
})

leftRouter.post('/add', (req, res) => {
    if (checkId(req.body?.id)) return res.status(400).send('Element id is required!');
    if (!/^[0-9]+$/.test(String(req.body.id))) return res.status(400).send('Element id must contain only digits!');
    if (leftContainer.addElement(new Element(req.body.id))) return res.status(200).send('success');
    return res.status(400).send('Element this id already exists!');
})

leftRouter.post('/move', (req, res) => {
    if (checkId(req.body?.id)) return res.status(400).send('Element id is required!');
    const result = leftContainer.moveElement(req.body.id);
    if (result) {
        rightContainer.addElement(result)
        return res.status(200).send('success');
    }
    return res.status(400).send('Element this id not found!');
})

export default leftRouter;
