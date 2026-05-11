import { useState, useRef, useCallback } from 'react';

export function useDragScroll() {
    const ref = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = useCallback((e) => {
        if (!ref.current) return;
        setIsDragging(true);
        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
    }, []);

    const onMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const onMouseMove = useCallback((e) => {
        if (!isDragging || !ref.current) return;
        e.preventDefault();
        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX) * 1.2; // 드래그 속도 자연스럽게 조정
        ref.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);

    return {
        ref,
        onMouseDown,
        onMouseLeave,
        onMouseUp,
        onMouseMove,
        isDragging,
        style: { 
            cursor: isDragging ? 'grabbing' : 'grab',
            // 드래그 중에는 snap을 풀고 즉각 반응하게 하며, 마우스를 떼면 부드럽게 스냅되도록 처리
            scrollSnapType: isDragging ? 'none' : '',
            scrollBehavior: isDragging ? 'auto' : 'smooth'
        }
    };
}
