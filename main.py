from dotenv import load_dotenv
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import os
import base64
from requests import post, get
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

@app.route('/')
def hello():
    return "Hello, this is the root!"

@app.route('/get_token', methods=['GET'])
def get_token():
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return jsonify({"access_token": token})

@app.route('/search_artist', methods=['GET'])
def search_for_artist():
    token = request.args.get('token')
    artist_name = request.args.get('artist_name')

    url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": "Bearer " + token}
    query = f"?q={artist_name}&type=artist&limit=1"

    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)["artists"]["items"]

    if len(json_result) == 0:
        return jsonify({"error": "No artists with this name exist"})
    
    return jsonify(json_result[0])

@app.route('/get_top_songs', methods=['GET'])
def get_top_songs():
    token = request.args.get('token')
    artist_id = request.args.get('artist_id')

    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    headers = {"Authorization": "Bearer " + token}
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]
    
    # return render_template('index.html', top_songs=json_result)
    return jsonify(json_result)

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=80, debug=True)
