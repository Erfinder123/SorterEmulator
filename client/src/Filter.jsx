export function Filter({ value, onChange }) {
    return (
        <div className="filter">
            <input
                type="search"
                value={value}
                onChange={event => onChange(event.target.value)}
                placeholder="Фильтр по ID"
                aria-label="Фильтр по ID"
            />
        </div>
    );
}
