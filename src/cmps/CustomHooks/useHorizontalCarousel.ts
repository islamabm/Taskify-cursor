import { useCallback, useEffect, useRef, useState } from 'react';

export function useHorizontalCarousel(itemCount, options = {}) {
    const { gap = 16, smoothBehavior = true } = options;

    const containerRef = useRef(null);
    const itemsRef = useRef([]);
    const [state, setState] = useState({
        currentIndex: 0,
        canScrollLeft: false,
        canScrollRight: itemCount > 0,
        isScrolling: false,
    });

    const rafRef = useRef();
    const scrollTimeoutRef = useRef();
    const resizeObserverRef = useRef();
    const isDragging = useRef(false);
    const lastScrollTime = useRef(0);

    // Safe gap parsing for Safari
    const getComputedGap = useCallback(() => {
        if (!containerRef.current) return gap;
        const computed = window.getComputedStyle(containerRef.current).gap;
        if (computed === 'normal' || computed === '') return gap;
        const parsed = parseFloat(computed);
        return isNaN(parsed) ? gap : parsed;
    }, [gap]);

    // Get card positions with proper gap handling
    const getCardPositions = useCallback(() => {
        if (!containerRef.current) return [];

        const container = containerRef.current;
        const computedGap = getComputedGap();
        const cards = Array.from(container.querySelectorAll('[data-card]'));

        return cards.map((card, index) => {
            const rect = card.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            return rect.left - containerRect.left + container.scrollLeft;
        });
    }, [getComputedGap]);

    // Update carousel state
    const updateState = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const positions = getCardPositions();
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const scrollWidth = container.scrollWidth;

        // Find current index based on scroll position
        let newIndex = 0;
        let minDistance = Infinity;

        positions.forEach((position, index) => {
            const distance = Math.abs(position - scrollLeft);
            if (distance < minDistance) {
                minDistance = distance;
                newIndex = index;
            }
        });

        setState({
            currentIndex: newIndex,
            canScrollLeft: scrollLeft > 1,
            canScrollRight: scrollLeft < scrollWidth - containerWidth - 1,
            isScrolling: false,
        });
    }, [getCardPositions]);

    // Smooth scroll polyfill using RAF
    const smoothScrollTo = useCallback((targetPosition) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const startPosition = container.scrollLeft;
        const distance = targetPosition - startPosition;
        const duration = 300;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentPosition = startPosition + (distance * easeOutCubic);

            container.scrollLeft = currentPosition;

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animateScroll);
            } else {
                setState(prev => ({ ...prev, isScrolling: false }));
            }
        };

        setState(prev => ({ ...prev, isScrolling: true }));
        rafRef.current = requestAnimationFrame(animateScroll);
    }, []);

    // Scroll to specific index
    const scrollToIndex = useCallback((index) => {
        if (!containerRef.current || index < 0 || index >= itemCount) return;

        const positions = getCardPositions();
        const targetPosition = positions[index] || 0;

        // Cancel any ongoing animation
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        if (smoothBehavior && 'scrollBehavior' in document.documentElement.style) {
            containerRef.current.scrollTo({
                left: targetPosition,
                behavior: 'smooth'
            });
            setState(prev => ({ ...prev, isScrolling: true }));
        } else {
            smoothScrollTo(targetPosition);
        }
    }, [itemCount, getCardPositions, smoothBehavior, smoothScrollTo]);

    // Navigate functions
    const scrollLeft = useCallback(() => {
        const newIndex = Math.max(0, state.currentIndex - 1);
        scrollToIndex(newIndex);
    }, [state.currentIndex, scrollToIndex]);

    const scrollRight = useCallback(() => {
        const newIndex = Math.min(itemCount - 1, state.currentIndex + 1);
        scrollToIndex(newIndex);
    }, [state.currentIndex, itemCount, scrollToIndex]);

    // Snap to closest card after manual scroll
    const snapToClosest = useCallback(() => {
        if (!containerRef.current || isDragging.current) return;

        const positions = getCardPositions();
        const scrollLeft = containerRef.current.scrollLeft;

        let closestIndex = 0;
        let minDistance = Infinity;

        positions.forEach((position, index) => {
            const distance = Math.abs(position - scrollLeft);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        if (minDistance > 5) { // Only snap if we're not already close
            scrollToIndex(closestIndex);
        }
    }, [getCardPositions, scrollToIndex]);

    // Handle scroll events
    const handleScroll = useCallback(() => {
        lastScrollTime.current = Date.now();

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Update state immediately for button states
        updateState();

        // Snap after scroll ends
        scrollTimeoutRef.current = setTimeout(() => {
            const timeSinceLastScroll = Date.now() - lastScrollTime.current;
            if (timeSinceLastScroll >= 150 && !state.isScrolling) {
                snapToClosest();
            }
        }, 150);
    }, [updateState, snapToClosest, state.isScrolling]);

    // Pointer event handlers for drag functionality
    const handlePointerDown = useCallback((e) => {
        isDragging.current = true;
        if (containerRef.current) {
            containerRef.current.style.scrollBehavior = 'auto';
        }
    }, []);

    const handlePointerUp = useCallback((e) => {
        isDragging.current = false;
        if (containerRef.current) {
            containerRef.current.style.scrollBehavior = '';
        }

        // Snap to closest card after drag
        setTimeout(() => {
            if (!state.isScrolling) {
                snapToClosest();
            }
        }, 50);
    }, [snapToClosest, state.isScrolling]);

    // Setup resize observer
    useEffect(() => {
        if (!containerRef.current) return;

        resizeObserverRef.current = new ResizeObserver(() => {
            updateState();
        });

        resizeObserverRef.current.observe(containerRef.current);

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, [updateState]);

    // Setup scroll listener
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // Initial state update
    useEffect(() => {
        const timer = setTimeout(() => {
            updateState();
        }, 100);

        return () => clearTimeout(timer);
    }, [itemCount, updateState]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    return {
        containerRef,
        state,
        scrollLeft,
        scrollRight,
        scrollToIndex,
        handlePointerDown,
        handlePointerUp,
    };
}