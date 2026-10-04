import { useState } from 'react';
import { useAddElementMutation } from "./api/baseApi.js";

export function BaseContainer({ elements, selectedId, onSelect, onLoadMore }) {
    const [id, setId] = useState('');
    const [addElementMutation] = useAddElementMutation();

    function handleScroll(event) {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

        if (scrollTop + clientHeight >= scrollHeight - 40) {
            onLoadMore();
        }
    }

    async function addElement(event) {
        event.preventDefault();

        const value = id.trim().replace(/^0+/, '');
        if (value === "") return;

        try {
            await addElementMutation({ id: value }).unwrap();
            setId('');
        }
        catch {
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
            <div className="elements-list" onScroll={handleScroll}>
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
