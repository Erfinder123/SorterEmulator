import { useCallback, useEffect, useRef, useState } from 'react';
import { PageCache } from './pageCache.js';

export function usePageElements(useQuery) {
    const [fetchPage] = useQuery();
    const [page, setPage] = useState({ items: [] });
    const [isFetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [direction, setDirection] = useState(null);
    const [pageVersion, setPageVersion] = useState(0);
    const pageRef = useRef({ items: [] });
    const anchor = useRef(null);
    const pending = useRef(false);
    const refreshPending = useRef(false);
    const cache = useRef(new PageCache());
    const cacheVersion = useRef(0);

    const request = useCallback(async function request(params, direction = null) {
        if (pending.current) return;
        pending.current = true;
        setFetching(true);
        setError(null);
        const attempted = new Set();
        const version = cacheVersion.current;
        let nextParams = params;
        try {
            while (true) {
                try {
                    const result = cache.current.get(nextParams) ?? await fetchPage(nextParams).unwrap();
                    if (version !== cacheVersion.current) return;
                    if (result.items.length === 0 && nextParams.afterId != null) {
                        nextParams = { beforeId: nextParams.afterId };
                        continue;
                    }
                    if (result.items.length === 0 && nextParams.beforeId != null) {
                        nextParams = {};
                        continue;
                    }
                    cache.current.save(nextParams, result, pageRef.current, direction);
                    pageRef.current = result;
                    anchor.current = result.firstId;
                    setPage(result);
                    setDirection(direction);
                    setPageVersion(version => version + 1);
                    break;
                } catch (error) {
                    if (version !== cacheVersion.current) return;
                    if (error.status !== 409) throw error;
                    attempted.add(nextParams.startId ?? nextParams.afterId ?? nextParams.beforeId);
                    const candidate = pageRef.current.items.find(item => !attempted.has(item.id));
                    nextParams = candidate ? { startId: candidate.id } : {};
                }
            }
        } catch (error) {
            setError(error);
        } finally {
            pending.current = false;
            setFetching(false);
            if (refreshPending.current) {
                refreshPending.current = false;
                await request(anchor.current === null ? {} : { startId: anchor.current });
            }
        }
    }, [fetchPage]);

    useEffect(() => {
        request({});
    }, [request]);

    function load(direction) {
        const current = pageRef.current;
        if (direction === 'next' && current.hasNext) request({ afterId: current.lastId }, direction);
        if (direction === 'previous' && current.hasPrevious) request({ beforeId: current.firstId }, direction);
    }

    function prepareMove(id) {
        if (anchor.current !== id) return;
        anchor.current = pageRef.current.items.find(item => item.id !== id)?.id ?? null;
    }

    function refetch() {
        cache.current.clear();
        cacheVersion.current++;
        if (pending.current) {
            refreshPending.current = true;
            return;
        }
        return request(anchor.current === null ? {} : { startId: anchor.current });
    }

    return {
        page, direction, pageVersion, isFetching, error, refetch,
        loadNext: () => load('next'),
        loadPrevious: () => load('previous'),
        prepareMove,
    };
}
