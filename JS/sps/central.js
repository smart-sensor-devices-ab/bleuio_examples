import * as my_dongle from 'bleuio'
import 'regenerator-runtime/runtime'

const output = document.querySelector("#output");
const connectButton = document.querySelector('#connectButton');
const connectToPeripheralButton = document.querySelector('#connectToPeripheralButton');
const messageButton = document.querySelector('#messageButton');
const targetAddressField = document.querySelector('#targetAddressField');
const messageField = document.querySelector('#messageField');

let connected = false;
let connectedToPeripheral = false;

// Stannar vid line 101 (.ati()) när jag klickar på connect
// trycker jag igen går den vidare och fungerar

// Jag har inte hittat något bra sätt att hitta meddelandena som mottagits på
// utan använder .ati() och kollar om de har släpat med

// Generellt fungerar det ibland. Har inte fått grepp om 
// varför och när det inte riktigt fungerar


/**
 * Connects / disconnects the dongle
 */
const handleConnect = async () => {
    if (!connected) {
        connect();
    } else {
        disconnect();
    }
}

connectButton.addEventListener('click', handleConnect);

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
    connectToPeripheralButton.addEventListener('click', handleConnectToPeripheral);
}

/**
 * Disconnects from the peripheral
 * Disconnects the dongle
 * and disables the button to start the beacon
 */
const disconnect = async () => {
    // Disconnect from target device
    await my_dongle.at_gapdisconnect();

    // Disconnects the dongle
    await my_dongle.at_disconnect();

    connected = false;

    printResponse('Dongle disconnected');

    // Disable buttons to avoid errors
    connectToPeripheralButton.removeEventListener('click', handleConnectToPeripheral);
    messageButton.removeEventListener('click', handleSendMessage);

    connectButton.textContent = 'Connect to dongle';
}

/**
 * Connects to a peripheral device
 */
const handleConnectToPeripheral = () => {
    // Connect to a peripheral or disconnect from it
    if (!connectedToPeripheral) {
        connectToPeripheral();
    } else {
        disconnectFromPeripheral();
    }
}

/**
 * Checks the information about the dongle and sets it up to connect to a peripheral device
 */
const connectToPeripheral = async () => {
    await my_dongle.at_central();

    // Connect to the peripheral with the address provided in the DOM
    await my_dongle.at_gapconnect(targetAddressField.value);

    // Fetch the dongle status
    let dongleStatus = await my_dongle.ati();

    // Checks if the dongle is connected to a peripheral
    while (!dongleStatus.includes('Connected')) {
        printResponse('Trying to connect to the peripheral', true);
        dongleStatus = await my_dongle.ati();

        if (!dongleStatus.includes('Connected')) {
            await sleep(800)
        }
    }

    printResponse('Connected to peripheral');
    connectedToPeripheral = true;

    messageButton.addEventListener('click', handleSendMessage);

    messageListener();
}

/**
 * Sends a message to the peripheral device
 */
const handleSendMessage = async () => {
    const message = messageField.value;

    // Sends a message from the dongle
    await my_dongle.at_spssend(message);
    messageField.value = '';
    printResponse('[Sent]: ' + message);
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
        dongleStatus.forEach(async (response, index) => {
            if (response.indexOf('handle_evt_gattc_notification:') !== -1) {
                const msg = dongleStatus[index + 1];
                
                if(msg.slice(-4).includes('ATI')){
                    printResponse('[Received]: ' + msg.slice(0, msg.length - 4))
                }else{
                    printResponse('[Received]: ' + dongleStatus[index + 1])
                }

                // if (dongleStatus[index + 1].slice(-4) === 'ATI') {
                //     printResponse('[Received]: ' + dongleStatus[index + 1].slice(dongleStatus[index + 1].length - 3))
                // }else{
                //     printResponse('[Received]: ' + dongleStatus[index + 1])
                // }
            }
        });

        if (!connectedToPeripheral) {
            clearInterval(messageListener);
        }
    }, 500);
}

/**
 * Disconnects from the peripheral
 */
const disconnectFromPeripheral = async () => {
    await my_dongle.at_gapdisconnect();
    connectedToPeripheral = false;
    printResponse('Disconnected from peripheral');
}

/**
 * Prints a response to the DOM
 * @param {String} response the message to be printed to the DOM
 * @param {boolean} append if 'true' the message will be added otherwise the output will be cleared before printed. False by default
 */
const printResponse = (response) => {
    const printOutput = (text) => {
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
