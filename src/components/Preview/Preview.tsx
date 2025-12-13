import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Preview.css';

interface PreviewProps {
    content: string;
}

export const Preview: React.FC<PreviewProps> = ({ content }) => {
    return (
        <div className="preview-container">
            <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};
