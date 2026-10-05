import { Router } from 'express';
import { Element } from './element.js';
import { leftContainer, rightContainer, addQueue, dataQueue } from './index.js';

const PAGE_SIZE = 20;
const leftRouter = Router();

export const checkId = id => id == null;

leftRouter.get('/', async (req, res, next) => {
    const { startId, afterId, beforeId } = req.query;
    const limit = Number(req.query.limit ?? PAGE_SIZE);
    if ([startId, afterId, beforeId].some(id => id != null && typeof id !== 'string')) {
        return res.status(400).send('Invalid cursor!');
    }
    try {
        const result = await dataQueue.push(null, () =>
            leftContainer.getElements({ startId, afterId, beforeId, limit })
        );
        return res.status(200).json(result);
    } catch (error) { next(error); }
});

leftRouter.post('/add', async (req, res, next) => {
    const id = req.body?.id;
    if (checkId(id)) return res.status(400).send('Element id must contain only digits!');
    if (!/^[0-9]+$/.test(String(id))) return res.status(400).send('Element id must contain only digits!');
    try {
        const result = await addQueue.push(JSON.stringify(['add', 'left', id]), () => {
            return leftContainer.addElement(new Element(id));
        });
        if (result) return res.status(200).send('success');
        return res.status(400).send('Element this id already exists!');
    }
    catch (error) {
        next(error); }
});

leftRouter.post('/move', async (req, res, next) => {
    const id = req.body?.id;
    if (checkId(id)) return res.status(400).send('Element id is required!');
    try {
        const result = await dataQueue.push(null, () => {
            const element = leftContainer.detachElement(id);
            if (!element) return false;
            rightContainer.pushElement(element);
            return true;
        });
        if (result) return res.status(200).send('success');
        return res.status(404).send('Element this id not found!');
    } catch (error) { next(error); }
});

export default leftRouter;
