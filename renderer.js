// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

async function ping() {
  const response = new Promise((resolve) => {
    const handler = () => {
      ipcRenderer.off("pong", handler);
      resolve();
    };
    ipcRenderer.on("pong", handler);
  });

  ipcRenderer.send("ping");
  await response;
}

window.demo = async () => {
  for (let i = 0; i < 10000; i++) {
    console.log("listenerCount", ipcRenderer.listenerCount("pong"));
    await ping();
  }
};
