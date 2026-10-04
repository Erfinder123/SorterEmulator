import { Router } from 'express';
import { Element } from './element.js';
import { leftContainer, rightContainer } from "./index.js";

const leftRouter = Router();

export const checkId = id => id == null;

leftRouter.get('/', (req, res) => {
    const offset = Number(req.query.offset ?? 0);

    if (!Number.isSafeInteger(offset) || offset < 0) {
        return res.status(400).send('Invalid offset!');
    }
    return res.status(200).json(leftContainer.getElements(offset, 20));
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
    return res.status(404).send('Element this id not found!');
})

export default leftRouter;
