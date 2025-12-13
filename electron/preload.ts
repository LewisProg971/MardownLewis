import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    onFileOpened: (callback: (content: string) => void) => {
        ipcRenderer.on('file-opened', (_event, content) => callback(content));
    },
    onRequestSave: (callback: () => void) => {
        ipcRenderer.on('request-save', () => callback());
    },
    saveContent: (content: string) => {
        ipcRenderer.send('save-files-content', content);
    },
    exportHtml: (htmlContent: string) => {
        ipcRenderer.send('export-html', htmlContent);
    }
});
