let language = document.getElementById("languages").value
let suggestions = []
var settings = {
    default: "Continue the casual conversation, as a human, and not as an ai bot.",
    doctor: "Getting a checkup at the hospital. You are the doctor.",
    cafe: "Ordering a coffee at a cafe. You are the barista.",
    supermarket: "Buying things at the supermarket. You are the cashier.",
    restaurant: "Ordering food at a restaurant. You are the waiter."
}

let languages = {
    English: 'en-US',
    French: 'fr-FR',
    Spanish: 'es-ES',
    Hindi: 'hi-IN',
    German: 'de-DE',
    Chinese: 'zh-CN',
    Japanese: 'ja-JP',
    Italian: 'it-IT',
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Set recognition options
// Specify the language you want to use
// recognition.lang = 'en-US'; 
recognition.lang = languages[language]; 
console.log(language,languages[language]);

function change_lang(val){
    recognition.lang = languages[val]; 
    console.log("yaya")
}

// Reference to the user input field
const userMessageInput = document.getElementById('userMessage');

// Reference to the send button
const sendMessageButton = document.getElementById('sendMessage');

// Function to handle speech recognition results
recognition.onresult = function (event) {
  const result = event.results[0][0].transcript;
  userMessageInput.value = result;
  console.log("recording")
  // Automatically submit the message when speech is recognized
  sendMessageButton.click();
};

// Start speech recognition when the user clicks on the microphone button
document.getElementById('microphone').addEventListener('click', () => {
  recognition.start();
});


const sendMessage = async () => {
    language = document.getElementById("languages").value
    console.log(language)
    const userMessage = document.getElementById("userMessage").value;
    console.log(userMessage)
    if (userMessage.trim() === "") return;

    const chatContainer = document.getElementById("chatContainer");

    // Create and append user message on the right side
    const userDiv = document.createElement("div");
    userDiv.className = "message user-message";
    userDiv.innerHTML = `<p>${userMessage}</p><img src="assets/img/human_image.png" alt="Human Animation" class="human-animation">`;
    chatContainer.appendChild(userDiv);

    document.getElementById("userMessage").value = "";


    scenario = document.getElementById("roleplay").value;
    console.log(scenario)
    // botmsg = await getText(userMessage,language);
    reply = await getText(userMessage, settings[scenario]);
    botmsg = reply[0].reply;
    console.log("msg returned: " + botmsg)
    suggestions = reply[0].suggestion.split("\n")
    console.log("suggestions: " + suggestions)
    console.log(suggestions[0])

    // document.getElementById("hintBar").innerHTML = suggestions[0] + '<br><br>' + suggestions[1]
    document.getElementById("hintBar").innerHTML = suggestions.join('<br><br>')

    setTimeout(() => {

        if (reply[1].toLowerCase() != 'null') {
            const userCorrectionDiv = document.createElement("div");
            userCorrectionDiv.className = "message user-correction";
            userCorrectionDiv.innerHTML = `<p>${reply[1]}</p>`;
            chatContainer.appendChild(userCorrectionDiv);
        }

        const butDiv = document.createElement("div")
        butDiv.className = "user-trans"
        const button = document.createElement("button");
        button.className = "user-translation"
        const image = document.createElement("img");
        image.src = "assets/img/translation.png";
        image.alt = "Button Image";
        button.appendChild(image);
        butDiv.appendChild(button);
        chatContainer.appendChild(butDiv)
    }, 1)


    // Simulate bot response (you can replace this with actual chatbot logic)
    setTimeout(function () {
        const botDiv = document.createElement("div");
        botDiv.className = "message bot-message";
        botDiv.innerHTML = `${botmsg}<img src="assets/img/bot_image.jpg" alt="Bot" class="bot-image">`;
        chatContainer.appendChild(botDiv);

        const butbDiv = document.createElement("div")
        butbDiv.className = "bot-trans"
        const button = document.createElement("button");
        button.className = "user-translation"
        const image = document.createElement("img");
        image.src = "assets/img/translation.png";
        image.alt = "Button Image";
        button.appendChild(image);
        butbDiv.appendChild(button);
        chatContainer.appendChild(butbDiv)


        // Scroll to the bottom to show the latest message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);

    // Clear the input field
}


const getText = async (msg, scenario) => {
    console.log(msg)
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: "POST",
            body: JSON.stringify({
                text: msg,
                setting: scenario,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()
        console.log(data)
        return data;
    }
    catch (error) {
        console.log(error)
    }
}



// Add event listener to the send button
document.getElementById("sendMessage").addEventListener("click", sendMessage);

// Allow pressing Enter key to send messages
document.getElementById("userMessage").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

document.getElementById("hint").addEventListener("click", function () {
    // Toggle the visibility of the hint bar
    var hintBar = document.getElementById("hintBar");
    hintBar.style.display = hintBar.style.display === "block" ? "none" : "block";
});