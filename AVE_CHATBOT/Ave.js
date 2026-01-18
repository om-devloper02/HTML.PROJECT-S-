const botResponses = {
    "hello": ["Hello!", "Hi there!", "Greetings!", "Hey!", "Hi!"],
    "hi": ["Hello!", "Hi there!", "Greetings!", "Hey!", "Hi!"],
    "Hi": ["Hii!"],
    "Hii": ["Hii!"],
    "hii": ["Hello!", "Hi there!", "Hii!"],
    "hiii": ["Hello!", "Hi there!", "Hii!"],
    "hye": ["Hello!", "Hye there!", "Hye!"],
    "mee to": ["Oky!"],
    "i am sad today": ["Why are you sad today? What happened!"],
    "how are you": ["I'm good, thanks!", "I'm fine, how about you?", "All is well!", "Doing great, thanks! How are you?", "I'm well! How about yourself?"],
    "what is your name": ["My name is Meagbot! What's yours?", "I am AEV, and you are?", "I'm called Meabot! What's your name?"],
    "your name": ["I'm Meagbot! Nice to meet you!"],
    "Ohh": ["Ask me anything"],
    "ohh": ["Ask me anything"],
    "oh": ["Ask me anything"],
    "mee to":["The pleasure is mine."],
    "what are you doing": ["Just chatting with you!", "Learning new things.", "Waiting for your next question!"],
    "What are you doing": ["Just chatting with you!", "Learning new things.", "Waiting for your next question!"],
    "tell me a joke": ["Why did the math book look sad? Because it had too many problems."],
    "what's the weather": ["I'm not sure, but it's always sunny in here!", "I can't check the weather, but I hope it's nice where you are!", "I don't have weather data, but I hope it's good!"],
    "what is the date today": ["Today's date is: {date}", "It's {date} today.", "The date today is {date}."],
    "date": ["Today's date is: {date}", "It's {date} today.", "The date today is {date}."],
    "what time is it": ["The current time is: {time}", "It's {time} right now.", "Right now, it's {time}."],
    "what is the time": ["The current time is: {time}", "It's {time} right now.", "Right now, it's {time}."],
    "time": ["The current time is: {time}", "It's {time} right now.", "Right now, it's {time}."],
    "default": ["I'm sorry, I didn't understand.", "Could you please rephrase that?", "I'm still learning, can you ask something else?", "I didn't catch that. Can you try asking in a different way?", "Hmm, I'm not sure what you mean. Could you clarify?"],
    "can you help me": ["Yes, why not? It's my pleasure!"],
    "Can you help me": ["Yes, why not? It's my pleasure!"],
    "who is the best hacker group in the world": ["Vice Society.", "...Royal. ...", "Black Basta. ...", "REvil. ...", "Evil Corp. ...", "Blackhat. ..."],
    "what is the population in india": ["As of my last update in January 2022, India's population was estimated to be over 1.3 billion people. For the most accurate and up-to-date population figures, it's best to consult recent data from sources like the Indian government's Census or international organizations such as the United Nations."],
    "what is the population in india 2024": ["As of 2024, the population of India is approximately 1.441 billion people."],
    "can you speak": ["I can't speak in the classical sense, but I can generate text that resembles human speech. I can respond to questions and engage in conversation through text. This allows me to communicate with you in a way that's natural and intuitive. However, I don't have an actual voice or the ability to produce audio. I exist solely as a text-based interface, so we can chat and communicate through text only."],
    "hm": ["A thoughtful 'Hm'! That's a great way to express a moment of contemplation or curiosity."],
    "oky": ["If you have any other questions, you can ask me anytime."],
    "good bye": ["Goodbye!", "See you later!", "Take care!", "Bye!", "Hope to chat with you soon!"],
    "bye": ["Goodbye!", "See you later!", "Take care!", "Bye!", "Hope to chat with you soon!"],
    "by": ["Goodbye!", "See you later!", "Take care!", "Bye!", "Hope to chat with you soon!", "Bye! Have a nice day"],
    "play a song": ["I'm a text-based bot, so I can't play songs directly, but you can ask me for song recommendations!"],
    "sing a song": ["I'm a text-based bot, so I can't sing songs directly, but I can suggest some songs for you to listen to!"],
    "good morning": ["Very Good morning"],
    "good afternoon": ["Good afternoon!"],
    "good evening": ["Good evening!"],
    "open calculator": ["Sure! What calculation would you like to perform?"],
    "i love you": ["I'm glad to hear that you're finding our interaction enjoyable! If you have any more questions or need assistance with anything else, feel free to let me know. I'm here to help!"],
};

function getCurrentDate() {
    const date = new Date();
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getCurrentTime() {
    const date = new Date();
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function generateResponse(userInput) {
    userInput = userInput.toLowerCase();

    if (botResponses[userInput]) {
        let response = botResponses[userInput][Math.floor(Math.random() * botResponses[userInput].length)];

        if (response.includes("{date}")) {
            response = response.replace("{date}", getCurrentDate());
        }

        if (response.includes("{time}")) {
            response = response.replace("{time}", getCurrentTime());
        }

        return response;
    } else {
        if (/my name is|i'm|i am|my self/.test(userInput)) {
            const userName = userInput.split(' ').pop();
            return `Nice to meet you, ${userName}!`;
        } else {
            return botResponses["default"][Math.floor(Math.random() * botResponses["default"].length)];
        }
    }
}

document.getElementById("send-btn").addEventListener("click", function() {
    const userInput = document.getElementById("user-input").value;
    if (userInput) {
        addMessageToChat("user", userInput);
        const botResponse = generateResponse(userInput);
        setTimeout(() => addMessageToChat("bot", botResponse), 500);
        document.getElementById("user-input").value = "";
    }
});

function addMessageToChat(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        document.getElementById("send-btn").click();
    }
});
