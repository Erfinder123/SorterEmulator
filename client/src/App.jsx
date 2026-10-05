import { usePageElements } from './usePageElements.js';
import './App.css'
import { useState } from "react";
import { BaseContainer } from "./BaseContainer.jsx";
import { SortedContainer } from "./SortedContainer.jsx";
import { ControlButtons } from "./ControlButtons.jsx";
import { useLazyGetPageQuery as leftGetPage } from "./api/baseApi.js";
import { useLazyGetPageQuery as rightGetPage } from "./api/sorterApi.js";

function App() {
    const left = usePageElements(leftGetPage);
    const right = usePageElements(rightGetPage);

    const [selectedLeftId, setSelectedLeftId] = useState(null);
    const [selectedRightId, setSelectedRightId] = useState(null);

  return (
    <>
      <section id="header">
        <div>
          <h1>Эмулятор сортировки</h1>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="center">
        <div id="docs">
            <BaseContainer
                filter={left.filter}
                onFilterChange={value => { setSelectedLeftId(null); left.changeFilter(value); }}
                elements={left.page.items}
                onAdded={left.refetch}
                selectedId={selectedLeftId}
                onSelect={setSelectedLeftId}
                onLoadMore={left.loadNext}
                onLoadPrevious={left.loadPrevious}
                direction={left.direction}
                pageVersion={left.pageVersion}
                isFetching={left.isFetching}
            />
        </div>
        <div id="docs1">
            <ControlButtons
                selectedLeftId={selectedLeftId}
                refetchLeft={left.refetch}
                onMovedRight={() => { left.prepareMove(selectedLeftId); setSelectedLeftId(null); }}
                selectedRightId={selectedRightId}
                refetchRight={right.refetch}
                onMovedLeft={() => { right.prepareMove(selectedRightId); setSelectedRightId(null); }}
            />
        </div>
        <div>
            <SortedContainer
                filter={right.filter}
                onFilterChange={value => { setSelectedRightId(null); right.changeFilter(value); }}
                elements={right.page.items}
                onSorted={right.refetchAfterSort}
                selectedId={selectedRightId}
                onSelect={setSelectedRightId}
                onLoadMore={right.loadNext}
                onLoadPrevious={right.loadPrevious}
                direction={right.direction}
                pageVersion={right.pageVersion}
                isFetching={right.isFetching}
            />
        </div>
      </section>

      <div className="ticks"></div>

      <section id="footer">
        <div id="social">
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                    className="button-icon"
                    role="presentation"
                    aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}

export default App
