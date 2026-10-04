import { Router } from 'express';
import { Element } from './element.js';
import { leftContainer, rightContainer } from "./index.js";
import { checkId } from "./leftContainerController.js";

const rightRouter = Router();

rightRouter.get('/', (req, res) => {
    return res.status(200).json(rightContainer.getElements());
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
    return res.status(400).send('Element this id not found!');
})

export default rightRouter;
