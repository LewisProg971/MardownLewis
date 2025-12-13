import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let currentFilePath: string | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.resolve(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
        titleBarStyle: 'hiddenInset', // Mac-like style
        backgroundColor: '#0d1117',
        icon: path.join(__dirname, '../public/icon.png'), // Placeholder
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Open external links in browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    buildMenu();
}

function buildMenu() {
    const isMac = process.platform === 'darwin';

    const template: any[] = [
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    accelerator: 'CmdOrCtrl+O',
                    click: async () => {
                        if (!mainWindow) return;
                        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
                            properties: ['openFile'],
                            filters: [{ name: 'Markdown', extensions: ['md', 'markdown', 'txt'] }]
                        });
                        if (!canceled && filePaths[0]) {
                            openFile(filePaths[0]);
                        }
                    }
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        mainWindow?.webContents.send('request-save');
                    }
                },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' },
                            { role: 'stopSpeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function openFile(filePath: string) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Failed to read file', err);
            return;
        }
        currentFilePath = filePath;
        mainWindow?.setTitle(`${path.basename(filePath)} - Markdown Editor`);
        mainWindow?.webContents.send('file-opened', data);
    });
}

function saveFile(content: string) {
    if (currentFilePath) {
        fs.writeFile(currentFilePath, content, (err) => {
            if (err) console.error('Failed to save', err);
        });
    } else {
        dialog.showSaveDialog(mainWindow!, {
            filters: [{ name: 'Markdown', extensions: ['md'] }]
        }).then(({ canceled, filePath }) => {
            if (!canceled && filePath) {
                currentFilePath = filePath;
                mainWindow?.setTitle(`${path.basename(filePath)} - Markdown Editor`);
                fs.writeFile(filePath, content, (err) => {
                    if (err) console.error('Failed to save', err);
                });
            }
        });
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC Listeners
ipcMain.on('save-files-content', (_, content) => {
    saveFile(content);
});

ipcMain.on('export-html', (_, htmlContent) => {
    dialog.showSaveDialog(mainWindow!, {
        title: 'Export to HTML',
        defaultPath: 'export.html',
        filters: [{ name: 'HTML File', extensions: ['html'] }]
    }).then(({ canceled, filePath }) => {
        if (!canceled && filePath) {
            fs.writeFile(filePath, htmlContent, (err) => {
                if (err) console.error('Failed to save HTML', err);
            });
        }
    });
});
