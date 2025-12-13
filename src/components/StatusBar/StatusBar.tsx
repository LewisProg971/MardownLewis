import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
    text: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ text }) => {
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;

    return (
        <footer className="status-bar">
            <div className="status-item">
                <span className="label">Words:</span> {wordCount}
            </div>
            <div className="status-item">
                <span className="label">Chars:</span> {charCount}
            </div>
            <div className="status-spacer" />
            <div className="status-item">
                Markdown
            </div>
        </footer>
    );
};
