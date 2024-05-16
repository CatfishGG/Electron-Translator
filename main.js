const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
};

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

ipcMain.handle('translate-text', async (event, { text, sourceLang, targetLang }) => {
  const options = {
    method: 'POST',
    url: 'https://libretranslate.de/translate',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text"
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
});

ipcMain.handle('detect-language', async (event, { text }) => {
  const options = {
    method: 'POST',
    url: 'https://libretranslate.de/detect',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      q: text
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
});
