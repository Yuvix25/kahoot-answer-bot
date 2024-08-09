# Kahoot Answer Bot (Proof of Concept)
This Chrome Extension is a proof of concept for a Kahoot Answer Bot. It is not intended to be used in a real Kahoot game, but rather to show how easy it is to cheat in Kahoot.

## How it works
The extension injects a script into the Kahoot game page. This script first asks the user to find the **public** Kahoot quiz via a sidebar menu. The script reads the quiz data from the Kahoot API, which includes the answer. Then, once a question is asked, the script automatically answers the question with a random delay to not get a perfect score, which would be suspicious.

## How to install
1. Clone this repository, or download the zip and unzip it.
2. Go to `chrome://extensions` in your browser.
3. Enable developer mode and click on "Load unpacked".
4. Select the folder where you cloned or unzipped the repository.

The extension should now be installed, and will be enabled whenever you visit a `kahoot.it` page.

## Mobile App
I have also created a [mobile app](https://github.com/Yuvix25/kahoot-answer-bot-mobile/releases/latest) proof-of-concept Kahoot Answer Bot for Android.