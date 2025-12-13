export interface ElectronAPI {
    onFileOpened: (callback: (content: string) => void) => void;
    onRequestSave: (callback: () => void) => void;
    saveContent: (content: string) => void;
    exportHtml: (htmlContent: string) => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
