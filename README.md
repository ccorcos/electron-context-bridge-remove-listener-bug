# Electron Bug with ipcRenderer.removeListener through contextBridge

[Issue Ticket](https://github.com/electron/electron/issues/33328)

I'm having a memory leak issue because I'm unable to remove event listeners from listening to an ipc channel.

Here's my preload script.

```js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (...args) => ipcRenderer.send(...args),
  on: (...args) => ipcRenderer.on(...args),
  off: (...args) => ipcRenderer.off(...args),
  listenerCount: (...args) => ipcRenderer.listenerCount(...args),
});
```

In main.js, I added a pong response to the ping channel.

```js
// Respond to ping with pong.
mainWindow.webContents.on("ipc-message", (event, channel) => {
	if (channel === "ping") mainWindow.webContents.send("pong");
});
```

And in the renderer, whenever I call ping, I first add a listener to pong to listen for the response, then I remove the listener.

```js
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
```

And here's a demonstration of the bug. Run `demo()` in the dev tools and you'll see that the number of listeners grows monotonically.

```js
window.demo = async () => {
  for (let i = 0; i < 10000; i++) {
    console.log("listenerCount", ipcRenderer.listenerCount("pong"));
    await ping();
  }
};
```

I believe the issue has to do with the context bridge changing the identity of the callback function...

