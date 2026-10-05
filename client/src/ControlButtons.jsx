import { useMoveElementMutation as rightMove } from "./api/baseApi.js";
import { useMoveElementMutation as leftMove } from "./api/sorterApi.js";

export function ControlButtons({ selectedLeftId, refetchLeft, onMovedRight, selectedRightId, refetchRight, onMovedLeft }) {
    const [moveRightElement, { isLoading: loadingLeft }] = rightMove();
    const [moveLeftElement, { isLoading: loadingRight }] = leftMove();


    async function moveRight() {
        if (selectedLeftId === null) return;

        try {
            await moveRightElement({ id: selectedLeftId }).unwrap();
            onMovedRight();
            await Promise.all([refetchLeft(), refetchRight()]);
        }
        catch { return; }
    }

    async function moveLeft() {
        if (selectedRightId === null) return;

        try {
            await moveLeftElement({ id: selectedRightId }).unwrap();
            onMovedLeft();
            await Promise.all([refetchLeft(), refetchRight()]);
        }
        catch { return; }
    }

    return (
        <>
            <button type="button"
                    onClick={moveRight}
                    disabled={selectedLeftId === null || loadingLeft}
            >
                {'=>'}
            </button>

            <button type="button"
                    onClick={moveLeft}
                    disabled={selectedRightId === null || loadingRight}
            >
                {'<='}
            </button>
        </>
    )
}