// Modules to control application life and create native browser window
const {app, BrowserWindow, session} = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater');


// Auto-Updater Docs: https://www.electron.build/auto-update
autoUpdater.setFeedURL('http://david-luhmer.de/404');
console.log('autoUpdater.channel', autoUpdater.channel);
console.log('autoUpdater.currentVersion', autoUpdater.currentVersion.version);


// this calls kills the app once its in production mode
setTimeout(() => {
  console.log('let it crash!');
  autoUpdater.checkForUpdatesAndNotify();
}, 5000);


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  const resourcesPath = require('process').resourcesPath;
  const appPath = app.getAppPath();
  const isPackaged = appPath.indexOf('app.asar') !== -1;
  const pathToExtention = isPackaged ? resourcesPath : appPath;
  const extensionPathDest = path.join(pathToExtention, "extensions/test-extension/");
  console.log('Loading extension from path: ' + extensionPathDest);

  session.defaultSession
      .loadExtension(extensionPathDest)
      .then((extension) => {
        console.log('Extension loaded!', extension.id + ' - ' + extension.name + '@' + extension.version);
      }).catch((e) => {
        console.error(e);
      });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
