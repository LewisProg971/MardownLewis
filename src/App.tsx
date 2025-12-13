import { useState, useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Editor } from './components/Editor/Editor';
import { Preview } from './components/Preview/Preview';
import { StatusBar } from './components/StatusBar/StatusBar';
import { useDebounce } from './hooks/useDebounce';
import { FileText, Eye, Grid, Download } from 'lucide-react';
import './App.css';

function App() {
  const [markdown, setMarkdown] = useState<string>('# Welcome to your Markdown Editor\n\nStart typing to see the **magic** happen!');
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');

  // Debounce the preview update (e.g. 250ms) to avoid lagging on heavy typing
  const debouncedMarkdown = useDebounce(markdown, 250);

  // Use a ref to keep track of the latest markdown content without triggering re-renders or effect re-runs
  const markdownRef = useRef(markdown);

  // Update ref whenever markdown changes
  useEffect(() => {
    markdownRef.current = markdown;
  }, [markdown]);

  useEffect(() => {
    if (window.electronAPI) {
      // Listener for file opening
      window.electronAPI.onFileOpened((content) => {
        setMarkdown(content);
      });

      // Listener for save requests (Ctrl+S or Menu)
      window.electronAPI.onRequestSave(() => {
        // We read the current value from the ref
        window.electronAPI.saveContent(markdownRef.current);
      });
    } else {
      console.warn('Electron API not found. Running in browser mode?');
    }
  }, []);

  const toggleViewMode = () => {
    if (viewMode === 'split') setViewMode('preview');
    else if (viewMode === 'preview') setViewMode('editor');
    else setViewMode('split');
  };

  const handleExportHtml = () => {
    if (window.electronAPI) {
      const htmlBody = renderToStaticMarkup(<Preview content={markdown} />);
      const exportTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Export</title>
    <style>
        :root {
            --bg-primary: #0d1117;
            --text-primary: #c9d1d9;
            --text-secondary: #8b949e;
            --text-accent: #58a6ff;
            --border-color: #30363d;
            --bg-secondary: #161b22;
            --bg-tertiary: #21262d;
            --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        }
        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            font-family: var(--font-sans);
            line-height: 1.6;
            margin: 0;
            padding: 40px;
        }
        .markdown-body {
            max-width: 800px;
            margin: 0 auto;
        }
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
            color: var(--text-primary);
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.3em;
            margin-top: 24px;
        }
        .markdown-body pre {
            background-color: var(--bg-secondary);
            padding: 16px;
            border-radius: 6px;
            overflow: auto;
        }
        .markdown-body code {
            font-family: var(--font-mono);
            background-color: var(--bg-tertiary);
            padding: 0.2em 0.4em;
            border-radius: 6px;
            font-size: 85%;
        }
        .markdown-body pre code {
            background-color: transparent;
            padding: 0;
        }
        .markdown-body blockquote {
            border-left: 0.25em solid var(--border-color);
            color: var(--text-secondary);
            padding: 0 1em;
            margin: 0;
        }
        .markdown-body a { color: var(--text-accent); text-decoration: none; }
        .markdown-body a:hover { text-decoration: underline; }
        .markdown-body table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
        .markdown-body table th, .markdown-body table td { border: 1px solid var(--border-color); padding: 6px 13px; }
        .markdown-body table tr:nth-child(2n) { background-color: var(--bg-secondary); }
    </style>
</head>
<body>
    <div class="markdown-body">
        ${htmlBody}
    </div>
</body>
</html>`;
      window.electronAPI.exportHtml(exportTemplate);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <FileText className="icon" size={24} />
          <h1>Markdown Editor</h1>
        </div>
        <div className="toolbar">
          <button
            className="icon-btn"
            title="Export to HTML"
            onClick={handleExportHtml}
          >
            <Download size={20} />
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>
          <button
            className="icon-btn"
            title="Toggle Preview"
            onClick={() => setViewMode(prev => prev === 'editor' ? 'split' : 'editor')}
            style={{ color: viewMode === 'editor' ? 'var(--text-secondary)' : 'var(--text-accent)' }}
          >
            <Eye size={20} />
          </button>
          <button
            className="icon-btn"
            title="Change Layout"
            onClick={toggleViewMode}
          >
            <Grid size={20} />
          </button>
        </div>
      </header>

      <main className="main-content">
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className="pane editor-pane" style={{ flex: 1 }}>
            <Editor value={markdown} onChange={setMarkdown} />
          </div>
        )}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="pane preview-pane" style={{ flex: 1 }}>
            <Preview content={debouncedMarkdown} />
          </div>
        )}
      </main>

      <StatusBar text={markdown} />
    </div>
  );
}

export default App;
