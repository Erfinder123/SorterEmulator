import { Router } from 'express';
import { Element } from './element.js';
import { leftContainer, rightContainer, addQueue, dataQueue } from './index.js';

const PAGE_SIZE = 20;
const TOTAL_ELEMENTS = 1000000;
const leftRouter = Router();

export const checkId = id => id == null;

leftRouter.get('/', async (req, res, next) => {
    const { startId, afterId, beforeId, filter = '' } = req.query;
    const limit = Number(req.query.limit ?? PAGE_SIZE);
    if ([startId, afterId, beforeId, filter].some(id => id != null && typeof id !== 'string')) {
        return res.status(400).send('Invalid cursor!');
    }
    const clientId = req.get('X-Client-Id');
    const key = clientId ? JSON.stringify(['get', 'left', clientId]) : null;
    try {
        const result = await dataQueue.pushLatest(key, () =>
            leftContainer.getElements({ startId, afterId, beforeId, filter, limit })
        );
        return res.status(200).json(result);
    } catch (error) {
        if (error.code === 'REQUEST_REPLACED') {
            return res.status(409).json({ code: error.code });
        }
        next(error);
    }
});

leftRouter.post('/add', async (req, res, next) => {
    const value = req.body?.id;
    if (checkId(value)) return res.status(400).send('Element id must contain only digits!');
    if (typeof value !== 'string' && typeof value !== 'number') {
        return res.status(400).send('Element id must contain only digits!');
    }
    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
        return res.status(400).send('Element id must contain only digits!');
    }
    const id = String(value).trim().replace(/^0+/, '');
    if (!/^[0-9]+$/.test(id)) return res.status(400).send('Element id must contain only digits!');
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

leftRouter.post('/fill', async (req, res, next) => {
    try {
        await addQueue.push('fill', () => {
            for (let id = 1; id <= TOTAL_ELEMENTS; id++) {
                leftContainer.addElement(new Element(String(id)));
            }
        });
        return res.status(200).send('success');
    } catch (error) { next(error); }
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
