import { useLayoutEffect, useRef } from 'react';

const SCROLL_EDGE_OFFSET = 1;

export function useScrollList({ onLoadMore, onLoadPrevious, direction, pageVersion, isFetching }) {
    const listRef = useRef(null);
    const ignoreScroll = useRef(false);
    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list) return;
        if (!direction) {
            list.scrollTop = 0;
            return;
        }
        ignoreScroll.current = true;
        list.scrollTop = direction === 'next'
            ? SCROLL_EDGE_OFFSET
            : Math.max(0, list.scrollHeight - list.clientHeight - SCROLL_EDGE_OFFSET);
        const frame = requestAnimationFrame(() => { ignoreScroll.current = false; });
        return () => cancelAnimationFrame(frame);
    }, [pageVersion, direction]);

    function handleScroll(event) {
        if (ignoreScroll.current || isFetching) return;
        const list = event.currentTarget;
        if (list.scrollTop <= 0) onLoadPrevious();
        else if (list.scrollTop + list.clientHeight >= list.scrollHeight - SCROLL_EDGE_OFFSET) onLoadMore();
    }

    function handleWheel(event) {
        const list = event.currentTarget;
        if (isFetching || event.deltaY === 0) return;
        if (event.deltaY < 0 && list.scrollTop <= 0) onLoadPrevious();
        if (event.deltaY > 0 && list.scrollTop + list.clientHeight >= list.scrollHeight - SCROLL_EDGE_OFFSET) onLoadMore();
    }
    return { listRef, handleScroll, handleWheel };
}
