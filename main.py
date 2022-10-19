from http import cookies
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

import requests, json
from flask import Flask, render_template, request, redirect, Response

class KahootAnswerBot:
    def __init__(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--mute-audio")
        chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome()

    def loadAnswers(self, quizId):
        self.driver.get("https://create.kahoot.it/details/" + quizId)
        sleep(1);
        show_answers_button = self.driver.find_element(By.XPATH, "//button[contains(., 'Show answers')]")
        show_answers_button.click()
        sleep(1);
        answers = self.driver.find_elements(By.XPATH, "//div[contains(@aria-label, ' correct')]")
        self.answers = list(map(lambda x: int(x.get_attribute("aria-label").split(" ")[1])-1, answers)) # answer indices
        self.driver.close()
        return self.answers


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/getAnswers/<quizId>")
def getAnswers(quizId):
    bot = KahootAnswerBot()
    return json.dumps(bot.loadAnswers(quizId))


@app.route("/getKahoot")
def getKahoot():
    resp = requests.get("https://kahoot.it/")
    return resp.text


def proxy(url):
    resp = requests.request(
        method=request.method,
        url=url,
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        data=request.get_data(),
        cookies=request.cookies,
        allow_redirects=False)

    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]

    response = Response(resp.content, resp.status_code, headers)
    return response

@app.route("/searchKahoot/<query>")
def searchKahoot(query):
    resp = requests.get(f"https://create.kahoot.it/rest/kahoots/?query={query}&limit=24&cursor=0&searchCluster=1&includeExtendedCounters=false&inventoryItemId=NONE")
    
    return resp.text

# forward rest to create.kahoot.it
@app.route("/<path:path>")
@app.route("/<path:path>/")
def kahootForward(path):
    # return proxy("https://kahoot.it/reserve/session/" + pin + "/?" + request.query_string.decode("utf-8"))
    print("https://create.kahoot.it/" + path + "/?" + request.query_string.decode("utf-8"))
    return proxy("https://create.kahoot.it/" + path + "/?" + request.query_string.decode("utf-8"))


if __name__ == "__main__":
    # bot = KahootAnswerBot()
    # bot.loadAnswers("06f54b71-fc81-4229-aa70-bb8ee102e469")
    app.run()
