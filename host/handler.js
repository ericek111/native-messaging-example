#!/usr/bin/node

const util = require('util');
const exec = util.promisify(require('child_process').exec);

class NativeMessenger {
	constructor() {
		this.handlers = [];
	}
	listen() {
		process.stdin.on('readable', this._receiveMessage.bind(this));
	}
	onMessage(handler) {
		this.handlers.push(handler);
	}
	_receiveMessage() {
		let input = [];

		let chunk;
		while (chunk = process.stdin.read()) {
			input.push(chunk);
		}

		input = Buffer.concat(input);
		if (input.length < 4) {
			return;
		}

		let msgLen = input.readUInt32LE(0);
		let dataLen = msgLen + 4;

		if (input.length >= dataLen) {
			const content = input.slice(4, dataLen);
			const rawMsg = JSON.parse(content.toString());

			for (const handler of this.handlers) {
				handler(this, (res) => {
					this._sendMessage({
						id: rawMsg.id,
						body: res
					});
				}, rawMsg.body);
			}
		}
	}
	_sendMessage(msg) {
		const buffer = Buffer.from(JSON.stringify(msg));

		const header = Buffer.alloc(4);
		header.writeUInt32LE(buffer.length, 0);

		const data = Buffer.concat([header, buffer]);
		process.stdout.write(data);
	}
}

(() => {

	const messenger = new NativeMessenger();
	messenger.onMessage(async (messengerObj, respFunc, msg) => {
		if (msg.cmd === 'get_free_memory') {
			const procOut = await exec('free -m');
			respFunc({
				msg: procOut.stdout,
			});
		}
		// TODO: Delete this function from the this.handlers array
		// to prevent memory leaks. Maybe Promise.race all handlers?
	});
	messenger.listen();

})();