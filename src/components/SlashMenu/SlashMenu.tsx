import React, { useEffect, useState, useRef } from 'react';
import { Heading1, Heading2, Heading3, Bold, Italic, List, ListOrdered, Code, CheckSquare, Image, Link, Quote } from 'lucide-react';
import './SlashMenu.css';

export interface Command {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: (value: string, selectionStart: number) => { newValue: string; newCursorPosition: number };
}

interface SlashMenuProps {
    position: { top: number; left: number };
    onSelect: (command: Command) => void;
    onClose: () => void;
    filter: string;
}

export const COMMANDS: Command[] = [
    {
        id: 'h1',
        label: 'Heading 1',
        icon: <Heading1 size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '# ' + val.slice(pos), newCursorPosition: pos + 2 })
    },
    {
        id: 'h2',
        label: 'Heading 2',
        icon: <Heading2 size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '## ' + val.slice(pos), newCursorPosition: pos + 3 })
    },
    {
        id: 'h3',
        label: 'Heading 3',
        icon: <Heading3 size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '### ' + val.slice(pos), newCursorPosition: pos + 4 })
    },
    {
        id: 'bold',
        label: 'Bold',
        icon: <Bold size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '**bold**' + val.slice(pos), newCursorPosition: pos + 2 })
    },
    {
        id: 'italic',
        label: 'Italic',
        icon: <Italic size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '*italic*' + val.slice(pos), newCursorPosition: pos + 1 })
    },
    {
        id: 'bullet-list',
        label: 'Bullet List',
        icon: <List size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '- ' + val.slice(pos), newCursorPosition: pos + 2 })
    },
    {
        id: 'ordered-list',
        label: 'Ordered List',
        icon: <ListOrdered size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '1. ' + val.slice(pos), newCursorPosition: pos + 3 })
    },
    {
        id: 'task-list',
        label: 'Task List',
        icon: <CheckSquare size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '- [ ] ' + val.slice(pos), newCursorPosition: pos + 6 })
    },
    {
        id: 'quote',
        label: 'Quote',
        icon: <Quote size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '> ' + val.slice(pos), newCursorPosition: pos + 2 })
    },
    {
        id: 'code-block',
        label: 'Code Block',
        icon: <Code size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '```\n\n```' + val.slice(pos), newCursorPosition: pos + 4 })
    },
    {
        id: 'link',
        label: 'Link',
        icon: <Link size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '[text](url)' + val.slice(pos), newCursorPosition: pos + 1 })
    },
    {
        id: 'image',
        label: 'Image',
        icon: <Image size={18} />,
        action: (val, pos) => ({ newValue: val.slice(0, pos) + '![alt](url)' + val.slice(pos), newCursorPosition: pos + 2 })
    }
];

export const SlashMenu: React.FC<SlashMenuProps> = ({ position, onSelect, onClose, filter }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    const filteredCommands = COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(filter.toLowerCase()) ||
        cmd.id.toLowerCase().includes(filter.toLowerCase())
    );

    useEffect(() => {
        setSelectedIndex(0);
    }, [filter]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (filteredCommands.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                onSelect(filteredCommands[selectedIndex]);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [filteredCommands, selectedIndex, onSelect, onClose]);

    if (filteredCommands.length === 0) return null;

    return (
        <div
            className="slash-menu"
            style={{ top: position.top, left: position.left }}
            ref={menuRef}
        >
            <div className="slash-menu-header">Basic blocks</div>
            {filteredCommands.map((cmd, index) => (
                <div
                    key={cmd.id}
                    className={`slash-menu-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => onSelect(cmd)}
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    <div className="slash-icon">{cmd.icon}</div>
                    <div className="slash-label">
                        <span className="label-text">{cmd.label}</span>
                        {/* <span className="sub-text">Shortcut info?</span> */}
                    </div>
                </div>
            ))}
        </div>
    );
};
