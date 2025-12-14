import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Preview.css';

interface PreviewProps {
    content: string;
}

export const Preview = React.forwardRef<HTMLDivElement, PreviewProps>(({ content }, ref) => {
    return (
        <div className="preview-container" ref={ref}>
            <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
});

Preview.displayName = 'Preview';
