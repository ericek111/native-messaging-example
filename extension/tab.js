let outBox = document.getElementById('outbox');
document.addEventListener('click', event => {
	if (event.target.matches('button.cmd-button')) {		
		chrome.runtime.sendMessage(chrome.runtime.id, {
			cmd: event.target.dataset.cmd
		}, (data, error) => {
			// data is returned from our native app
			let newText = document.createTextNode(data.msg + "\n");
			outBox.appendChild(newText);
		});
	}
});


