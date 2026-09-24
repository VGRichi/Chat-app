(function() {
    const app = document.querySelector('.app');
    const socket = io();
    const typingIndicator = document.getElementById('typing');
    const messageInput = document.getElementById('message-input');
    const date = new Date();
    let typingTimeout;  

    let username;
    app.querySelector('.join-screen #join-user').addEventListener('click', function() {
        username = app.querySelector('.join-screen #username').value;
        if (username.length == 0) {
            return;
        }
        username = username;
        socket.emit("new-user", username);
        app.querySelector('.join-screen').classList.remove('active');
        app.querySelector('.chat-screen').classList.add('active');
    });

    app.querySelector('.chat-screen #send-message').addEventListener('click', function() {
        let message = app.querySelector('.chat-screen #message-input').value;
        if (message.length == 0) {
            return;
        }
        renderMessage("my", { 
            username: username,
            text: message,
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        });
        socket.emit("chat", {
            username: username,
            text: message,
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        });
        app.querySelector('.chat-screen #message-input').value = '';
    });

    app.querySelector('.chat-screen #exit-chat').addEventListener('click', function() {
        socket.emit("exit-chat", username);
        window.location.href = window.location.href;
    });

    socket.on("chat", function(message) {
        renderMessage("other", message);
    });
    socket.on("update", function(update) {
        renderMessage("update", update);
    });

    app.querySelector('#message-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            app.querySelector('#send-message').click();
        }
    });

    const picker = new EmojiMart.Picker({
        onEmojiSelect: function(emoji) {
        messageInput.value += emoji.native;
        document.getElementById('emoji-picker').style.display = 'none';
    }
    });

        document.getElementById('emoji-picker').appendChild(picker);
        document.getElementById('emoji-picker').style.display = 'none';

        document.getElementById('emoji-btn').addEventListener('click', function() {
        const pickerEl = document.getElementById('emoji-picker');
        pickerEl.style.display = pickerEl.style.display === 'none' ? 'block' : 'none';
    });


    function renderMessage(type, message) {
        let messageContainer = app.querySelector('.chat-screen .messages');
        if (type == "my") {
            let el = document.createElement('div');
            el.setAttribute('class', 'message my-message');
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                    <div class="time">${message.time}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "other") {
            let el = document.createElement('div');
            el.setAttribute('class', 'message other-message');
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                    <div class="time">${message.time}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        
        } else if (type == "update") {
            let el = document.createElement('div');
            el.setAttribute('class', 'update');
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        // Scroll to the bottom of the message container
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    messageInput.addEventListener('input', function() {
        socket.emit('typing', true);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(function() {
            socket.emit('typing', false);
        }, 1000);
    });

    socket.on('typing', function(isTyping) {
        if (isTyping) {
            typingIndicator.style.display = 'block';
        } else {
            typingIndicator.style.display = 'none';
        }
    });

})();