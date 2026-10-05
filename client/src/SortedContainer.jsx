import { Filter } from './Filter.jsx';
import { useScrollList } from './useScrollList.js';
import { useRef } from 'react';
import { useSortElementsMutation } from './api/sorterApi.js';

export function SortedContainer({ filter, onFilterChange, elements, selectedId, onSelect, onLoadMore, onLoadPrevious, direction, pageVersion, isFetching, onSorted }) {
    const draggId = useRef(null);
    const [sortElement, { isLoading }] = useSortElementsMutation();

    const { listRef, handleScroll, handleWheel } = useScrollList({
        onLoadMore, onLoadPrevious, direction, pageVersion, isFetching,
    });

    async function dropElement(event, lastOneId) {
        event.preventDefault();

        const id = draggId.current;
        draggId.current = null;

        if (id === null || id === lastOneId || isLoading) return;

        try {
            await sortElement({id, lastOneId}).unwrap();
            await onSorted(id, lastOneId);
        }
        catch { return; }
    }

    return (
        <>
            <h2>Отсортированный список</h2>
            <Filter value={filter} onChange={onFilterChange} />
            <div className="elements-list1" ref={listRef} onScroll={handleScroll} onWheel={handleWheel}>
                {elements.map(element => (
                    <div
                        className={`element-row${selectedId === element.id ? ' selected' : ''}`}
                            key={element.id}
                            onClick={() => onSelect(
                              selectedId === element.id ? null : element.id
                            )}
                            draggable={!isLoading}
                            onDragStart={event => {
                                draggId.current = element.id;
                                event.dataTransfer.effectAllowed = 'move';
                                event.dataTransfer.setData('text/plain', String(element.id));
                            }}
                            onDragOver={event => event.preventDefault()}
                            onDrop={event => {dropElement(event, element.id)}}
                            onDragEnd={() => draggId.current = null}
                    >
                        {element.id}
                    </div>
                ))}
            </div>
        </>
    )
}
