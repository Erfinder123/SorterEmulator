import './App.css'
import { useState } from "react";
import { BaseContainer } from "./BaseContainer.jsx";
import { SortedContainer } from "./SortedContainer.jsx";
import { ControlButtons } from "./ControlButtons.jsx";
import { useGetAllInfiniteQuery as leftGetAll } from "./api/baseApi.js";
import { useGetAllInfiniteQuery as rightGetAll } from "./api/sorterApi.js";

function App() {
    const { data: leftData,
            refetch: refetchLeft,
            fetchNextPage: fetchNextLeft,
            hasNextPage: hasNextLeft,
            isFetching: fetchingLeft,} = leftGetAll();
    const { data: rightData,
            refetch: refetchRight,
            fetchNextPage: fetchNextRight,
            hasNextPage: hasNextRight,
            isFetching: fetchingRight, } = rightGetAll();

    const leftElements = leftData?.pages.flat() ?? [];
    const rightElements = rightData?.pages.flat() ?? [];

    const [selectedLeftId, setSelectedLeftId] = useState(null);
    const [selectedRightId, setSelectedRightId] = useState(null);

    function loadMoreLeft() {
        if (hasNextLeft && !fetchingLeft) {
            fetchNextLeft();
        }
    }

    function loadMoreRight() {
        if (hasNextRight && !fetchingRight) {
            fetchNextRight();
        }
    }

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
                elements={leftElements}
                selectedId={selectedLeftId}
                onSelect={setSelectedLeftId}
                onLoadMore={loadMoreLeft}
            />
        </div>
        <div1 id="docs1">
            <ControlButtons
                selectedLeftId={selectedLeftId}
                refetchLeft={refetchLeft}
                onMovedRight={() => setSelectedLeftId(null)}
                selectedRightId={selectedRightId}
                refetchRight={refetchRight}
                onMovedLeft={() => setSelectedRightId(null)}
            />
        </div1>
        <div>
            <SortedContainer
                elements={rightElements}
                selectedId={selectedRightId}
                onSelect={setSelectedRightId}
                onLoadMore={loadMoreRight}
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
