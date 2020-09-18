# Telldus Live app for Athom Homey

With this app you can add sensors and switches from "Telldus Live".

For "Telldus ZNET lite v2" - gateways, a direct, local connection is also supported.


## Install:

#### For Telldus Live:

You will need a "Telldus Live" account, and "OAuth tokens". 

To create OAuth tokens:

- Go to http://api.telldus.com/keys/index
- Click on "Generate a private token for my user only", and follow the instructions.

Then install the "Telldus Live" device from the app.  
Enter the public key, private key, token and token secret that you created.

Now you can install sensors and switches.


#### For Telldus Local:

If you have a "Telldus ZNET lite v2", it can be controlled locally, without an Internet connection. 
To use the "Telldus Local", you need to create an access token.

Find the IP address of your TellStick device.  
Then install `npm i -g telldus-local-auth`, from [telldus-local-auth](https://github.com/mifi/telldus-local-auth).

Run the tool in a terminal: 

`telldus-local-auth <IP OF YOUR DEVICE> HomeyLocal`

A webpage should open in a browser.  Select "One year" and "Auto renew access", and click on "Authorize".
Go back to the terminal, and you will see the access token.

Then install the "Telldus Local" device from the app. Enter the access token that you created.

Now you can install sensors and switches.


## Disclaimer:

Use at your own risk. I accept no responsibility for any damages caused by using this app.


## Release Notes:

#### 0.9.0

- Release

#### 0.0.2

- Norwegian language

#### 0.0.1

- First version
