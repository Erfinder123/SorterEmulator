import { Filter } from './Filter.jsx';
import { useScrollList } from './useScrollList.js';
import { useState } from 'react';
import { useAddElementMutation, useFillElementsMutation } from "./api/baseApi.js";

export function BaseContainer({ filter, onFilterChange, elements, selectedId, onSelect, onLoadMore, onLoadPrevious, direction, pageVersion, isFetching, onAdded }) {
    const [id, setId] = useState('');
    const [addElementMutation] = useAddElementMutation();
    const [fillElementsMutation, { isLoading }] = useFillElementsMutation();

    const { listRef, handleScroll, handleWheel } = useScrollList({
        onLoadMore, onLoadPrevious, direction, pageVersion, isFetching,
    });

    async function addElement(event) {
        event.preventDefault();

        const value = id.trim().replace(/^0+/, '');
        if (value === "") return;

        setId('');
        try {
            await addElementMutation({ id: value }).unwrap();
            await onAdded();
        }
        catch {
            setId('Не удалось добавить элемент');
        }
    }

    async function fillElements() {
        try {
            await fillElementsMutation().unwrap();
            await onAdded();
        } catch {
            setId('Не удалось добавить элемент');
        }
    }

    function handleKeyDown(e) {
        if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    }

    return (
        <>
            <h2>Основной список</h2>
            <Filter value={filter} onChange={onFilterChange} />
            <form onSubmit={addElement}>
                <input
                    value={id}
                    onChange={event => setId(event.target.value)}
                    placeholder="Введите ID"
                    aria-label="ID нового элемента"
                    onKeyDown={handleKeyDown}
                />
                <button type="submit">Добавить</button>
            </form>
            <button type="button" onClick={fillElements} disabled={isLoading}>
                Добавить 1 000 000 элементов
            </button>
            <div className="elements-list" ref={listRef} onScroll={handleScroll} onWheel={handleWheel}>
                {elements.map(element => (
                    <div
                        className={`element-row${selectedId === element.id ? ' selected' : ''}`}
                          key={element.id}
                          onClick={() => onSelect(
                              selectedId === element.id ? null : element.id
                          )}>
                        {element.id}
                    </div>
                ))}
            </div>
        </>
    )
}
