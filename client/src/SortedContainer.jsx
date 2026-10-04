import { useRef } from 'react';
import { useSortElementsMutation } from './api/sorterApi.js';

export function SortedContainer({ elements, selectedId, onSelect, onLoadMore }) {
    const draggId = useRef(null);
    const [sortElement, { isLoading }] = useSortElementsMutation();

    function handleScroll(event) {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

        if (scrollTop + clientHeight >= scrollHeight - 40) {
            onLoadMore();
        }
    }

    async function dropElement(event, lastOneId) {
        event.preventDefault();

        const id = draggId.current;
        draggId.current = null;

        if (id === null || id === lastOneId || isLoading) return;

        try {
            await sortElement({id, lastOneId}).unwrap();
        } catch {}
    }

    return (
        <>
            <h2>Отсортированный список</h2>
            <div className="elements-list1" onScroll={handleScroll}>
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
