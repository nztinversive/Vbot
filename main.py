import os
from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

API_URL = "https://xanderapi.nztinversive.repl.co"
my_secret = os.environ['API_SECRET']



@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    print(f"Request data: {data}")
    user_input = data.get("user_input")
    chat_history = data.get("chat_history")

    payload = {
        "secret": my_secret,
        "question": user_input,
        "history": chat_history.split("\n") if chat_history else [],
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        chatbot_response_json = response.json()
        print(chatbot_response_json)

        if chatbot_response_json.get("success"):
            chatbot_response = chatbot_response_json["answer"]
            return jsonify({"response": chatbot_response})
        else:
            error_message = chatbot_response_json.get("message", "Unknown error")
            return jsonify({"error": f"Failed to get response from Xander API: {error_message}"})

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Failed to get response from Xander API: {e}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)


