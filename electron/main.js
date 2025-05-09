const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  const isPackaged = app.isPackaged;

  const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');

  console.log('🧩 Intentando cargar index.html desde:', indexPath);
  console.log('¿Existe?', fs.existsSync(indexPath)); // ✅ DEBUG

  win.loadFile(indexPath); // ✅ REEMPLAZADO loadURL por loadFile

  if (!isPackaged) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  const isPackaged = app.isPackaged;

  const backendPath = isPackaged
    ? path.join(process.resourcesPath, 'backend')
    : path.join(__dirname, 'backend');

  const nodeBinary = process.platform === 'win32' ? 'node.exe' : 'node';
  const nodeExec = isPackaged
    ? path.join(process.resourcesPath, 'node', nodeBinary)
    : nodeBinary;

  console.log('🟡 Intentando ejecutar backend...');
  console.log('🛠 Ejecutable:', nodeExec);
  console.log('📁 Carpeta de trabajo:', backendPath);

  if (!fs.existsSync(nodeExec)) {
    console.error('❌ nodeExec no encontrado:', nodeExec);
    return;
  }
  if (!fs.existsSync(path.join(backendPath, 'index.js'))) {
    console.error('❌ index.js no encontrado en:', backendPath);
    return;
  }

  backendProcess = spawn(nodeExec, ['index.js'], {
    cwd: backendPath,
    shell: true,
  });

  backendProcess.stdout.on('data', data => {
    console.log(`[BACKEND LOG] ${data.toString()}`);
  });

  backendProcess.stderr.on('data', data => {
    console.error(`[BACKEND ERROR] ${data.toString()}`);
    if (data.toString().includes('Servidor backend escuchando')) {
      console.log('✅ Backend arrancó correctamente');
    }
  });

  backendProcess.on('exit', code => {
    console.error(`⚠️ Backend salió con código ${code}`);
    if (code !== 0) {
      let retryCount = 0;
      const maxRetries = 3;
      const retryBackend = () => {
        if (retryCount < maxRetries) {
          backendProcess = spawn(nodeExec, ['index.js'], {
            cwd: backendPath,
            shell: true,
          });
          retryCount++;
          console.log(`🔄 Intento de reinicio número ${retryCount}`);
        } else {
          console.error('❌ El backend no pudo iniciarse después de varios intentos');
        }
      };
      retryBackend();
    }
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  app.quit();
});
