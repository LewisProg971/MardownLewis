import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import getCaretCoordinates from 'textarea-caret';
import { SlashMenu, type Command } from '../SlashMenu/SlashMenu';
import './Editor.css';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(({ value, onChange }, ref) => {
    // We use an internal ref for our own logic if the parent doesn't need full control, 
    // but here we want to share the ref. 
    // If we simply forward the ref, we can't use it easily internally unless we use a callback ref or similar.
    // However, since we need it for caret coordinates, let's use a local ref and sync it, or use useImperativeHandle?
    // Actually, taking a ref from props is cleaner for sync scroll.

    // Better pattern: Create a local ref if one isn't provided, but strictly we expect a forwarded ref now.
    // But to avoid breaking internal logic, let's assume `ref` acts as the primary ref.
    // Since we need to access it inside `handleInput`, we need to ensure we can read it.
    // We can use a combination or just rely on `e.currentTarget`.

    const internalRef = useRef<HTMLTextAreaElement>(null);

    // Sync forwarded ref with internal ref
    useImperativeHandle(ref, () => internalRef.current!, []);

    const [menuState, setMenuState] = useState<{
        isOpen: boolean;
        position: { top: number; left: number };
        filter: string;
        triggerIndex: number;
    }>({
        isOpen: false,
        position: { top: 0, left: 0 },
        filter: '',
        triggerIndex: -1
    });

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        const newValue = textarea.value;
        const cursorPosition = textarea.selectionStart;

        // Check if we just typed /
        if (newValue[cursorPosition - 1] === '/') {
            const coords = getCaretCoordinates(textarea, cursorPosition);
            setMenuState({
                isOpen: true,
                position: {
                    top: coords.top + coords.height - textarea.scrollTop + 10,
                    left: coords.left - textarea.scrollLeft
                },
                filter: '',
                triggerIndex: cursorPosition - 1
            });
        } else if (menuState.isOpen) {
            const query = newValue.slice(menuState.triggerIndex + 1, cursorPosition);
            // If query contains space or newline, close menu
            if (query.includes(' ') || query.includes('\n')) {
                closeMenu();
            } else {
                setMenuState(prev => ({ ...prev, filter: query }));
            }
        }

        onChange(newValue);
    };

    const closeMenu = () => {
        setMenuState(prev => ({ ...prev, isOpen: false }));
    };

    const handleCommandSelect = (cmd: Command) => {
        if (!internalRef.current) return;
        const textarea = internalRef.current;

        const textWithoutTrigger = value.slice(0, menuState.triggerIndex) + value.slice(textarea.selectionStart);

        const { newValue, newCursorPosition } = cmd.action(textWithoutTrigger, menuState.triggerIndex);

        onChange(newValue);
        closeMenu();

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (menuState.isOpen) {
            if (['ArrowUp', 'ArrowDown', 'Enter', 'Tab'].includes(e.key)) {
                // Prevent default navigation in textarea when menu is open
                // The global listener in SlashMenu will handle the actual selection logic
                e.preventDefault();
            }
            if (e.key === 'Escape') {
                closeMenu();
            }
        }
    };

    return (
        <div className="editor-container" style={{ position: 'relative' }}>
            <textarea
                ref={internalRef}
                className="editor-textarea"
                value={value}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onClick={closeMenu}
                placeholder="Type '/' for commands..."
                spellCheck={false}
            />

            {menuState.isOpen && (
                <SlashMenu
                    position={menuState.position}
                    onSelect={handleCommandSelect}
                    onClose={closeMenu}
                    filter={menuState.filter}
                />
            )}
        </div>
    );
});

Editor.displayName = 'Editor';
