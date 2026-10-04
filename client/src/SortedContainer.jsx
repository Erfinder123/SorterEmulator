
export function SortedContainer({ elements, selectedId, onSelect }) {

    return (
        <>
            <h2>Отсортированный список</h2>
            <div className="elements-list1">
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