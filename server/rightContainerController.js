import { Router } from 'express';
import { Element } from './element.js';
import { leftContainer, rightContainer } from "./index.js";
import { checkId } from "./leftContainerController.js";

const rightRouter = Router();

rightRouter.get('/', (req, res) => {
    const offset = Number(req.query.offset ?? 0);

    if (!Number.isSafeInteger(offset) || offset < 0) {
        return res.status(400).send('Invalid offset!');
    }
    return res.status(200).json(rightContainer.getElements(offset, 20));
})

rightRouter.post('/add', (req, res) => {
    if (checkId(req.body?.id)) return res.status(400).send('Element id is required!');
    if (rightContainer.addElement(new Element(req.body.id))) return res.status(200).send('success');
    return res.status(400).send('Element this id already exists!');
})

rightRouter.post('/move', (req, res) => {
    if (checkId(req.body?.id)) return res.status(400).send('Element id is required!');
    const result = rightContainer.moveElement(req.body.id);
    if (result) {
        leftContainer.addElement(result)
        return res.status(200).send('success');
    }
    return res.status(404).send('Element this id not found!');
})

rightRouter.patch('/sort', (req, res) => {
    if (checkId(req.query?.id) ||  checkId(req.body?.id)) return res.status(400).send('Element id is required!');
    if (rightContainer.sortElements(req.query.id, req.body.id)) return res.status(200).send('success');
    return res.status(404).send('Element this id not found!');
})

export default rightRouter;
