import { useEffect } from "react";
import { useMoveElementMutation as rightMove } from "./api/baseApi.js";
import { useMoveElementMutation as leftMove } from "./api/sorterApi.js";

export function ControlButtons({ selectedLeftId, refetchLeft, onMovedRight, selectedRightId, refetchRight, onMovedLeft }) {
    const [moveRightElement, { isLoading: loadingLeft, isSuccess: successLeft, reset: resetLeft }] = rightMove();
    const [moveLeftElement, { isLoading: loadingRight, isSuccess: successRight, reset: resetRight }] = leftMove();

    useEffect(() => {
        if (successLeft ) {
            refetchRight();
            resetLeft();
        }
        if (successRight) {
            refetchLeft();
            resetRight();
        }
    }, [successLeft, refetchLeft, resetLeft, refetchRight, successRight, resetRight]);

    async function moveRight() {
        if (selectedLeftId === null) return;

        try {
            await moveRightElement({ id: selectedLeftId }).unwrap();
            onMovedRight();
        }
        catch {}
    }

    async function moveLeft() {
        if (selectedRightId === null) return;

        try {
            await moveLeftElement({ id: selectedRightId }).unwrap();
            onMovedLeft();
        }
        catch {}
    }

    return (
        <>
            <button type="submit"
                    onClick={moveRight}
                    disabled={selectedLeftId === null || loadingLeft}
            >
                {'=>'}
            </button>

            <button type="submit"
                    onClick={moveLeft}
                    disabled={selectedRightId === null || loadingRight}
            >
                {'<='}
            </button>
        </>
    )
}