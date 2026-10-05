import { useCallback, useEffect, useRef, useState } from 'react';
import { PageCache } from './pageCache.js';

export function usePageElements(useQuery) {
    const [fetchPage] = useQuery();
    const [filter, setFilter] = useState('');
    const filterRef = useRef('');
    const [page, setPage] = useState({ items: [] });
    const [isFetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [direction, setDirection] = useState(null);
    const [pageVersion, setPageVersion] = useState(0);
    const pageRef = useRef({ items: [] });
    const anchor = useRef(null);
    const pending = useRef(false);
    const requestVersion = useRef(0);
    const cache = useRef(new PageCache());
    const cacheVersion = useRef(0);

    const request = useCallback(async function request(params, direction = null, replace = false) {
        if (pending.current && !replace) return;
        const currentRequest = ++requestVersion.current;
        pending.current = true;
        setFetching(true);
        setError(null);
        const attempted = new Set();
        const version = cacheVersion.current;
        let nextParams = { ...params, filter: filterRef.current };
        try {
            while (true) {
                try {
                    const result = cache.current.get(nextParams) ?? await fetchPage(nextParams).unwrap();
                    if (version !== cacheVersion.current || currentRequest !== requestVersion.current) return;
                    if (result.items.length === 0 && nextParams.afterId != null) {
                        nextParams = { beforeId: nextParams.afterId, filter: filterRef.current };
                        continue;
                    }
                    if (result.items.length === 0 && nextParams.beforeId != null) {
                        nextParams = { filter: filterRef.current };
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
                    if (version !== cacheVersion.current || currentRequest !== requestVersion.current) return;
                    if (error.data?.code === 'REQUEST_REPLACED') return;
                    if (error.status !== 409) throw error;
                    attempted.add(nextParams.startId ?? nextParams.afterId ?? nextParams.beforeId);
                    const candidate = pageRef.current.items.find(item => !attempted.has(item.id));
                    nextParams = candidate ? { startId: candidate.id, filter: filterRef.current } : { filter: filterRef.current };
                }
            }
        } catch (error) {
            if (currentRequest === requestVersion.current) setError(error);
        } finally {
            if (currentRequest === requestVersion.current) {
                pending.current = false;
                setFetching(false);
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

    function refetchAfterSort(id, beforeId) {
        const current = pageRef.current;
        if (!current.hasPrevious) {
            anchor.current = null;
        } else {
            const first = current.items.find(item => item.id !== id);
            anchor.current = first?.id === beforeId ? id : first?.id ?? null;
        }
        return refetch();
    }

    function changeFilter(value) {
        filterRef.current = value;
        setFilter(value);
        anchor.current = null;
        pageRef.current = { items: [] };
        setPage({ items: [] });
        setDirection(null);
        setPageVersion(version => version + 1);
        return refetch();
    }

    function refetch() {
        cache.current.clear();
        cacheVersion.current++;
        return request(anchor.current === null ? {} : { startId: anchor.current }, null, true);
    }

    return {
        page, direction, pageVersion, isFetching, error, refetch, filter, changeFilter,
        loadNext: () => load('next'),
        loadPrevious: () => load('previous'),
        prepareMove, refetchAfterSort,
    };
}
