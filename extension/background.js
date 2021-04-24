class NativeMessagingEmitter {
	constructor(nativeId) {
		this.nativeId = nativeId;
		this.port = null;
		this.messageCounter = 0;
		this.promises = {};
	}
	listen() {
		this.port = chrome.runtime.connectNative(this.nativeId);
		this.port.onMessage.addListener(this._receiveMessage.bind(this));
	}
	/* Send and forget, no promises. */
	shout(msg) {

	}
	talk(msg) {
		let promise = new Promise((resolveFunc) => {
			const msgId = this._sendMessage(msg);
			this.promises[msgId] = resolveFunc;
		});
		
		return promise;
	}
	_sendMessage(msg) {
		this.messageCounter++;
		this.port.postMessage({
			id: this.messageCounter,
			body: msg
		});
		return this.messageCounter;
	}
	_receiveMessage(response) {
		if (!response || !response.id) {
			// Weird data came back, throw away.
			return;
		}

		let respFunc = this.promises[response.id];
		if (!respFunc) {
			// Something came back twice? O.o
			return;
		}

		respFunc(response.body);
		delete this.promises[response.id];
	}
}

let emitter = new NativeMessagingEmitter('eu.lixko.nativemsg');
emitter.listen();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	if (request.cmd === 'get_free_memory') {
		emitter.talk({
			cmd: 'get_free_memory'
		}).then(resp => {
			sendResponse(resp);
		});
	}

	// without returning true, Chrome craps out too early
	return true;
});
