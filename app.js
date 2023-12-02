let tlanguage = document.getElementById("tlanguages").value
let slanguage = document.getElementById("slanguages").value
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

let voices = {
    English: 0,
    French: 11,
    Spanish: 9,
    Hindi: 12,
    German: 5,
    Chinese: 21,
    Japanese: 15,
    Italian: 14,
}

let translate = {
    English: 'en',
    French: 'fr',
    Spanish: 'es',
    Hindi: 'hm',
    German: 'de',
    Chinese: 'zh-CN',
    Japanese: 'ja',
    Italian: 'it',
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
 
recognition.lang = languages[tlanguage]; 
console.log(tlanguage,languages[tlanguage]);

function change_lang_t(val){
    recognition.lang = languages[val];
    tlanguage = val;
    console.log("yaya");
}

function change_lang_s(val){
    slanguage = val;
    console.log("yaya");
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




async function translateMessage(message) {
    // const message = document.getElementById('message').value;
    const targetLanguage = translate[tlanguage];
    const sourceLanguage = translate[slanguage];

    const encodedParams = new URLSearchParams();
    encodedParams.set('q', message);
    encodedParams.set('target', targetLanguage);
    encodedParams.set('source', sourceLanguage);  // Assuming the source language is English

    const options = {
    method: 'POST',
    url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
    headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'application/gzip',
    'X-RapidAPI-Key': '78cc5c3b58msh5f0640128897723p16535fjsnd248754ddfa0',
    // 'X-RapidAPI-Key': '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',
    'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    },
    data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      const translatedMessage = response.data.data.translations[0].translatedText;
      console.log(translatedMessage)
      return translatedMessage
    }
    catch (error) {
      console.error(error);
    }
}


async function translate_to_source(message) {
    // const message = document.getElementById('message').value;
    const targetLanguage = translate[slanguage];
    const sourceLanguage = translate[tlanguage];

    const encodedParams = new URLSearchParams();
    encodedParams.set('q', message);
    encodedParams.set('target', targetLanguage);
    encodedParams.set('source', sourceLanguage);  // Assuming the source language is English

    const options = {
    method: 'POST',
    url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
    headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'application/gzip',
    'X-RapidAPI-Key': '78cc5c3b58msh5f0640128897723p16535fjsnd248754ddfa0',
    // 'X-RapidAPI-Key': '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',
    'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    },
    data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      const translatedMessage = response.data.data.translations[0].translatedText;
      console.log(translatedMessage)
      return translatedMessage
    //   document.getElementById('translatedMessage').innerText = `Translated Message: ${translatedMessage}`;
    }
    catch (error) {
      console.error(error);
    }
}



const sendMessage_util = async () => {
    let userMessage = document.getElementById("userMessage").value;
    if (userMessage.trim() === "") return;

    document.getElementById("userMessage").value = "";
    sendMessage(userMessage)
}

const sendMessage = async (userMessage) => {
    // language = document.getElementById("languages").value
    console.log("target lang", tlanguage)
    console.log("source lang", slanguage)

    

    userMessage = await translateMessage(userMessage)

    
    console.log(userMessage)
    
    const chatContainer = document.getElementById("chatContainer");
    
    const userDiv = document.createElement("div");
    userDiv.className = "message user-message";
    const content = document.createElement("div")
    content.className = "content content-user";
    const text = document.createElement("div");
    text.className = "text user"
    text.innerHTML = `<p class="msg">${userMessage}</p><p class="translated user"></p>`;
    content.appendChild(text)
    
    const img = document.createElement("img");
    img.src = "assets/img/human_image.png";
    img.alt = "Human Animation";
    img.className = "human-animation";
    content.appendChild(img);
    userDiv.appendChild(content)
    chatContainer.appendChild(userDiv);
    
    

    const correct = await correct_grammar(userMessage)

    if (correct.toLowerCase() != 'null') {
        const userCorrectionDiv = document.createElement("div");
        userCorrectionDiv.className = "message user-correction";
        userCorrectionDiv.innerHTML = `<p>${correct}</p>`;
        chatContainer.appendChild(userCorrectionDiv);
    }

    scenario = document.getElementById("roleplay").value;
    console.log(scenario)

    reply = await getText(userMessage, settings[scenario]);
    botmsg = reply.reply;
    console.log("msg returned: " + botmsg)
    suggestions = reply.suggestion.split("\n")
    console.log("suggestions: " + suggestions)
    console.log(suggestions[0])
    // botmsg = "yo"

    document.getElementById("hintBar").innerHTML = ""
    for(let i=0;i<suggestions.length; i++){
        const suggestionContainer = document.createElement("div");
        suggestionContainer.className = "suggestion-container";
        suggestionContainer.onclick = get_sug_text

        const butDiv = document.createElement("div")
        butDiv.className = "sug-trans"
        const button = document.createElement("button");
        button.className = "user-translation sug-trans"
        button.onclick = translate_sug_text
        const image = document.createElement("img");
        image.src = "assets/img/translation.png";
        image.alt = "Button Image";
        button.appendChild(image);
        butDiv.appendChild(button);

        // const content = document.createElement("div")
        // content.className = "content content-sug";
        const text = document.createElement("div");
        text.className = "content content-sug"
        text.innerHTML = `<p class="msg">${suggestions[i]}</p><p class="translated sug"></p>`
        // content.appendChild(text)

        const vol = document.createElement("div")
        vol.className = "sug-vol"
        const vbutton = document.createElement("button");
        vbutton.className = "speak sug-speak"
        vbutton.onclick = speak_sug_text
        const vimage = document.createElement("img");
        vimage.src = "assets/img/volume.png";
        vimage.alt = "Button Image";
        vbutton.appendChild(vimage);
        vol.appendChild(vbutton);

        suggestionContainer.appendChild(butDiv)
        suggestionContainer.appendChild(text)
        suggestionContainer.appendChild(vol)

        document.getElementById("hintBar").appendChild(suggestionContainer)
    }

    // document.getElementById("hintBar").innerHTML = suggestions.join('<br><br>')

    setTimeout(() => {

        const all_but = document.createElement("div")
        all_but.className = "buttons user-buts"

        const butDiv = document.createElement("div")
        butDiv.className = "trans user-trans"
        const button = document.createElement("button");
        button.className = "user-translation"
        button.onclick = translate_text
        const image = document.createElement("img");
        image.src = "assets/img/translation.png";
        image.alt = "Button Image";
        button.appendChild(image);
        butDiv.appendChild(button);
        all_but.appendChild(butDiv)

        const vol = document.createElement("div")
        vol.className = "user-vol"
        const vbutton = document.createElement("button");
        vbutton.className = "speak"
        vbutton.onclick = speak_text
        const vimage = document.createElement("img");
        vimage.src = "assets/img/volume.png";
        vimage.alt = "Button Image";
        vbutton.appendChild(vimage);
        vol.appendChild(vbutton);
        all_but.appendChild(vol)
        userDiv.appendChild(all_but)
    }, 1)


    setTimeout(function () {
        const botDiv = document.createElement("div");
        botDiv.className = "message bot-message";
        const content = document.createElement("div")
        content.className = "content content-bot";

        const img = document.createElement("img");
        img.src = "assets/img/bot_image.png";
        img.alt = "Bot";
        img.className = "bot-image";
        content.appendChild(img);

        const text = document.createElement("div")
        text.className = "text bot"
        text.innerHTML = `<p class="msg">${botmsg}</p><p class="translated bot"></p>`
        content.appendChild(text)

        botDiv.appendChild(content)
        chatContainer.appendChild(botDiv);

        const all_but = document.createElement("div")
        all_but.className = "buttons bot-buts"

        const butbDiv = document.createElement("div")
        butbDiv.className = "trans bot-trans"
        const button = document.createElement("button");
        button.className = "user-translation"
        button.onclick = translate_text
        const image = document.createElement("img");
        image.src = "assets/img/translation.png";
        image.alt = "Button Image";
        button.appendChild(image);
        butbDiv.appendChild(button);
        all_but.appendChild(butbDiv)

        const vol = document.createElement("div")
        vol.className = "bot-vol"
        const vbutton = document.createElement("button");
        vbutton.className = "speak"
        vbutton.onclick = speak_text
        const vimage = document.createElement("img");
        vimage.src = "assets/img/volume.png";
        vimage.alt = "Button Image";
        vbutton.appendChild(vimage);
        vol.appendChild(vbutton);
        all_but.appendChild(vol)
        botDiv.appendChild(all_but)


        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);

}


const correct_grammar = async(text) => {
    try{
        const response = await fetch('http://localhost:5000/grammar',{
            method: "POST",
            body: JSON.stringify({
                text: text,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.text()
        console.log(data)
        return data;
    }
    catch (error) {
        console.log(error)
    }
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



document.getElementById("sendMessage").addEventListener("click", sendMessage_util);

document.getElementById("userMessage").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        sendMessage_util();
    }
});

document.getElementById("hint").addEventListener("click", function () {
    var hintBar = document.getElementById("hintBar");
    hintBar.style.display = hintBar.style.display === "block" ? "none" : "block";
});



async function translate_text(){
    console.log("kuch to ho ja")
    const paragraphElement = this.closest('.message').querySelector('.content p.msg');
    console.log(paragraphElement.textContent);
    const transla = await translate_to_source(paragraphElement.textContent)
    // const transla = "this is the translation"
    this.closest('.message').querySelector('.content p.translated').innerHTML = transla

}


async function translate_sug_text(){
    console.log("kuch to ho ja")
    const paragraphElement = this.closest('.suggestion-container').querySelector('.content-sug p.msg');
    console.log(paragraphElement.textContent);
    const transla = await translate_to_source(paragraphElement.textContent)
    // const transla = "this is the translation"
    this.closest('.suggestion-container').querySelector('.content-sug p.translated').innerHTML = transla

}

async function speak_util(text){
    let utterance = new SpeechSynthesisUtterance();

    utterance.text = text.textContent;
    let voice_index = voices[tlanguage]
    utterance.voice = window.speechSynthesis.getVoices()[voice_index];
    utterance.lang = languages[tlanguage]
    console.log("chal gyyaaaa")
    console.log("speak ka text", text)

    window.speechSynthesis.speak(utterance);
}

async function speak_text(){
    const text = this.closest('.message').querySelector('.content p.msg');
    speak_util(text)

}

async function speak_sug_text(){
    const text = this.closest('.suggestion-container').querySelector('.content-sug p.msg');
    speak_util(text)

}


function GoToHomePage(){
    window.location = '/';   
}



function get_sug_text(){
    console.log("are we getting in")
  // Add click event listener to the outer div
    // Get the inner div
    const innerDiv = this.querySelector('.content-sug');
    // console.log(innerDiv)
    // Get paragraphs inside the inner div
    const paragraph = innerDiv.querySelector('p.msg');
    // console.log(paragraph)

    // Access and log the content of each paragraph
    console.log(paragraph.textContent);
    sendMessage(paragraph.textContent)
      
}