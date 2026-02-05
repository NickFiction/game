const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    fullscreen: false,
    fullscreenable: true,
    title: 'Terra Love - Happy Birthday Edition 💕',
    icon: path.join(__dirname, '../dist/icon-192.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    backgroundColor: '#1a0a2e'
  });

  // Load the built game
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);

  // Toggle fullscreen with F11
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
    if (input.key === 'Escape' && mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
