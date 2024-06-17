import json
import os
import requests

os.chdir("./sets")

def send():
    url = "http://localhost:3333/pessoas"

    with open("dataset-extra1.json", 'r') as f:
        pessoas = json.load(f)
        for pessoa in pessoas:
            requests.post(url, json=pessoa)
    
    with open("dataset-extra2.json", 'r') as f:
        pessoas = json.load(f)
        for pessoa in pessoas:
            requests.post(url, json=pessoa)

    with open("dataset-extra3.json", 'r') as f:
        pessoas = json.load(f)
        for pessoa in pessoas:
            requests.post(url, json=pessoa)        


send()


