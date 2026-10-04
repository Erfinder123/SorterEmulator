import './App.css'
import { useState } from "react";
import { BaseContainer } from "./BaseContainer.jsx";
import { SortedContainer } from "./SortedContainer.jsx";
import { ControlButtons } from "./ControlButtons.jsx";
import { useGetAllQuery as leftGetAll } from "./api/baseApi.js";
import { useGetAllQuery as rightGetAll } from "./api/sorterApi.js";

function App() {
    const { data: leftElements = [],  refetch: refetchLeft } = leftGetAll();
    const [, setLeftElements] = useState([]);
    const { data: rightElements = [],  refetch: refetchRight } = rightGetAll();
    const [, setRightElements] = useState([]);

    const [selectedLeftId, setSelectedLeftId] = useState(null);
    const [selectedRightId, setSelectedRightId] = useState(null);

    function moveRight() {
        if (selectedLeftId === null) return;

        setLeftElements(elements =>
            elements.filter(element => element !== selectedLeftId)
        );

        setSelectedLeftId(null);
    }

    function moveLeft() {
        if (selectedRightId === null) return;

        setRightElements(elements =>
            elements.filter(element => element !== selectedRightId)
        );

        setSelectedRightId(null);
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
