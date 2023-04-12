document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

function showLoadingIcon() {
    document.getElementById("loading-icon").style.display = "block";
}

function hideLoadingIcon() {
    document.getElementById("loading-icon").style.display = "none";
}

function sendMessage() {
    console.log("sendMessage called");
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) {
        return;
    }
    const chatHistory = sessionStorage.getItem("chat_history") || "";
    showLoadingIcon();

    fetch("/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:        JSON.stringify({
            user_input: userInput,
            chat_history: chatHistory,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.error) {
            const newChatHistory = chatHistory + "\nUser: " + userInput + "\nXander: " + data.response;
            sessionStorage.setItem("chat_history", newChatHistory);
            displayChatMessage("User", userInput);
            displayChatMessage("Xander", data.response);
        } else {
            alert("Error: " + data.error);
        }
        hideLoadingIcon();
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Error while making request: " + error);
        hideLoadingIcon();
    });

    document.getElementById("user-input").value = "";
}

function displayChatMessage(role, message) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<span class="${role.toLowerCase()}">${role}:</span> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function loadChatHistory() {
    const chatHistory = sessionStorage.getItem("chat_history") || "";
    const lines = chatHistory.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line) {
            const [role, message] = line.split(": ", 2);
            displayChatMessage(role, message);
        }
    }
}

loadChatHistory();

