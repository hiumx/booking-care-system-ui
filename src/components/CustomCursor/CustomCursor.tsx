import { useEffect } from 'react';

const CustomCursor: React.FC = () => {
    useEffect(() => {
        const cursorInner = document.querySelector('.cursor-inner') as HTMLElement;
        const cursorOuter = document.querySelector('.cursor-outer') as HTMLElement;

        if (!cursorInner || !cursorOuter) return;

        let isMoving = false;

        // Handle mouse move
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;

            // Update cursor inner position immediately
            cursorInner.style.transform = `translate(${clientX}px, ${clientY}px)`;

            // Update cursor outer position with slight delay for smooth effect
            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(() => {
                    cursorOuter.style.transform = `translate(${clientX}px, ${clientY}px)`;
                    isMoving = false;
                });
            } else {
                cursorOuter.style.transform = `translate(${clientX}px, ${clientY}px)`;
            }
        };

        // Handle hover on links and cursor-pointer elements
        const handleMouseEnter = (e: Event) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a, [role="button"], .cursor-pointer, button');
            if (link) {
                cursorInner.classList.add('cursor-hover');
                cursorOuter.classList.add('cursor-hover');
            }
        };

        const handleMouseLeave = (e: Event) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a, [role="button"], .cursor-pointer, button');
            if (link) {
                // Check if we're still inside a hoverable element
                const relatedTarget = (e as MouseEvent).relatedTarget as HTMLElement;
                const isStillHoverable = relatedTarget?.closest(
                    'a, [role="button"], .cursor-pointer, button'
                );
                if (!isStillHoverable) {
                    cursorInner.classList.remove('cursor-hover');
                    cursorOuter.classList.remove('cursor-hover');
                }
            }
        };

        // Show cursors
        cursorInner.style.visibility = 'visible';
        cursorOuter.style.visibility = 'visible';

        // Add event listeners
        globalThis.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseenter', handleMouseEnter, true);
        document.body.addEventListener('mouseleave', handleMouseLeave, true);

        // Cleanup
        return () => {
            globalThis.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseenter', handleMouseEnter, true);
            document.body.removeEventListener('mouseleave', handleMouseLeave, true);
        };
    }, []);

    return (
        <>
            <div className="mouse-cursor cursor-outer"></div>
            <div className="mouse-cursor cursor-inner"></div>
        </>
    );
};

export default CustomCursor;
