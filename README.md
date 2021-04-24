# Native Messaging API example

Only for Chrome at the moment. Just an experiment. 

## Install
1. Install the extension. Get its ID and copy it to the browser-specific native app manifest JSON (`/host/eu.lixko.nativemsg.json`).
2. Copy the native app manifest into `~/.config/google-chrome/NativeMessagingHosts` (see [the example install_host.sh](https://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/examples/api/nativeMessaging/host/install_host.sh?revision=250361) and [README](https://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/examples/api/nativeMessaging/README.txt)).
3. Run the webserver (`webpage/run.sh`).
4. Access http://localhost:3000/.

You can run Chrome with `--enable-logging` to get the error output (stderr, or `console.error(...)`) of your native app printed into the console.
