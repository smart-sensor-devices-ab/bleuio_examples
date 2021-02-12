import * as my_dongle from 'bleuio'
import 'regenerator-runtime/runtime'

const output = document.querySelector("#output");
const connectButton = document.querySelector('#connectButton');
const messageButton = document.querySelector('#messageButton');
const advertisingButton = document.querySelector('#advertisingButton');
const messageField = document.querySelector('#messageField');

let connected = false;
let advertising = false;
let connectedToCentral = false;

const handleConnectButton = async () => {
    if (!connected) {
        connect();
    } else {
        disconnect();
    }
}

connectButton.addEventListener('click', handleConnectButton);

/**
 * Connects the the dongle via the computers COM port
 * Prompts the user to choose port from dialog in chrome
 * Enables buttons
 */
const connect = async () => {

    // Connect to dongle 
    await my_dongle.at_connect();

    connectButton.textContent = 'Disconnect';

    connected = true;

    printResponse('Connected to dongle');

    // Enable the connect button which is disabled by default to avoid errors
    messageButton.addEventListener('click', handleSendMessage);
    advertisingButton.addEventListener('click', handleAdvertising);

    connectButton.textContent = 'Disconnect';
}

/**
 * Disconnects from the central
 * Disconnects the dongle
 * and disables the button to start advertising
 */
const disconnect = async () => {

    // Disconnect from target device
    await my_dongle.at_gapdisconnect();

    // Disconnects the dongle
    await my_dongle.at_disconnect();

    connected = false;

    printResponse('Dongle disconnected');

    // Disable buttons to avoid errors
    messageButton.removeEventListener('click', handleSendMessage);
    connectButton.textContent = 'Connect to dongle';
}


/**
 * Starts advertising and creates 
 * a listener for connection status and
 * a listener for messages
 */
const handleAdvertising = () => {
    if (!advertising) {
        startAdvertising();
        connectionListener();
        messageListener();
    } else {
        stopAdvertising();
    }
}

/**
 * Starts advertising 
 */
const startAdvertising = async () => {
    // Start advertising
    await my_dongle.at_advstart();

    printResponse('Advertising..');

    advertising = true;

    advertisingButton.textContent = 'Stop advertising';
}

/**
 * Listens for information about the connection to the central
 */
const connectionListener = async () => {

    // Loops information from the dongle to evaluate
    // if it is connected or not
    const connectionListener = setInterval(async () => {

        // Fetch the dongles status
        const dongleStatus = await my_dongle.at_gapstatus();

        // Sets connectedToCentral to true when information about 
        // it finds indicates a connection been made
        // Or if the information indicates the dongle is disconnected 
        // it sets connectedToCentral to false 
        // which stops other processes in the script
        if (dongleStatus.includes('Connected') && !connectedToCentral) {
            printResponse('Connected to central');
            connectedToCentral = true;
        } else if (dongleStatus.includes('Not Connected') && connectedToCentral) {
            printResponse('Disconnected from central');
            connectedToCentral = false;
        }

        // Stop the loop
        if (!advertising) {
            clearInterval(connectionListener);
        }
    }, 500);
}

/**
 * Listens for messages from the central
 */
const messageListener = async () => {
    const messageListener = setInterval(async () => {

        // FIXME: släpande data
        const dongleStatus = await my_dongle.ati();

        // Check if any data in the status contains "[Received]:"
        // If it finds it it will print that response(element) 
        // which also contains the message
        dongleStatus.forEach(async (response) => {
            if (response.indexOf('[Received]:') !== -1) {
                printResponse(response);
            }
        });

        if (!advertising) {
            clearInterval(messageListener);
        }
    }, 500);
}

/**
 * Sends a message to the central device
 */
const handleSendMessage = async () => {
    const message = messageField.value;
    await my_dongle.at_spssend(message);
    messageField.value = '';
    printResponse('[Sent]: ' + message);
}

/**
 * Stops advertising
 */
const stopAdvertising = async () => {
    await my_dongle.at_advstop();
    printResponse('Stopped advertising');
    advertising = false;
    advertisingButton.textContent = 'Start advertising';
}

/**
 * Prints a response to the DOM
 * @param {String} response the message to be printed to the DOM
 * @param {boolean} append if 'true' the message will be added otherwise the output will be cleared before printed. False by default
 */
const printResponse = (response) => {

    const printOutput = (text) =>{
        const outputLine = document.createElement("p");
        outputLine.setAttribute("style", "margin: 2px");
        outputLine.textContent = text;

        output.appendChild(outputLine);
    }
    
    // Some of the dongles functions returns the data in an Array
    if (Array.isArray(response)) {
        response.forEach(data => {
            // Adds the data in the response as a row of information in the DOM
            printOutput(data);
        })

    } else {
        // Adds the data in the response as a row of information in the DOM
        printOutput(response);
    }
}

/**
 * Stop the event loop for x amount milliseconds
 */
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
