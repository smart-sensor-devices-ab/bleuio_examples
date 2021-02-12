import * as my_dongle from 'bleuio'
import 'regenerator-runtime/runtime'

// Fungerar första gången jag kör
// Om jag stoppar den och försöker starta igen så händer ingenting

// När jag har testat lägga in en sleep() efter at_advdatai() (line 102)
// fungerar det att köra den om och om igen

// Donglarna jag har fungerar olika när jag kör den här.
// På den märkta dongeln så kan jag starta en beacon en gång (om jag inte använder sleep())
// den går alltså inte starta igen om jag har stoppat den.
// Den omärkta dongeln blir resettad så fort jag försöker skapa en iBeacon


const output = document.querySelector("#output");
const connectButton = document.querySelector('#connectButton');
const iBeaconButton = document.querySelector('#iBeaconButton');
const uuidInputField = document.querySelector('#uuidInputField');

let isConnected = false;
let isAdvertising = false;

/**
 * Connects / disconnects the dongle
 */
const handleConnectButton = async () => {
    if (!isConnected) {
        connect();
    } else {
        disconnect();
    }
}

connectButton.addEventListener('click', handleConnectButton);

/**
 * Connects the the dongle via the computers COM port
 * Prompts the user to choose port from dialog in chrome
 * Enables the button to start the beacon
 */
const connect = async () => {

    // Connect to dongle
    await my_dongle.at_connect();

    isConnected = true;

    connectButton.textContent = 'Disconnect';
    output.textContent = 'Connected to dongle';

    // Enable the iBeacon button which is disabled by default to avoid errors
    iBeaconButton.addEventListener('click', handleIBeaconButton);
    iBeaconButton.classList.remove('disabled');
}

/**
 * Stops advertising and disconnects the dongle
 * and disables the button to start the beacon
 */
const disconnect = async () => {

    // Stop advertising
    await my_dongle.at_advstop();

    // Disconnects the dongle
    await my_dongle.at_disconnect();

    // Reset dongle status
    isConnected = false;
    isAdvertising = false;

    output.textContent = 'Dongle disconnected';
    connectButton.textContent = 'Connect';

    // Disable the iBeacon button
    iBeaconButton.classList.add('disabled');
    iBeaconButton.removeEventListener('click', handleIBeaconButton);
}

/**
 * Calls the dongles advertise function (at_advdatai())
 * and provides an UUID as the data
 * Please notice the "i" in the function .at_advdatai()
 * which is used when creating an iBeacon
 */
const handleIBeaconButton = async () => {
    // If the dongle is not advertising, start advertising the iBeacon
    if (!isAdvertising) {
        startAdvertising();
    } else {
        stopAdvertising();
    }
}

/**
 * Starts advertising
 */
const startAdvertising = async () => {

    // Sets the advertise data
    await my_dongle.at_advdatai(uuidInputField.value);

    // Start advertising
    await my_dongle.at_advstart();

    isAdvertising = true;

    output.textContent = 'iBeacon created';
    iBeaconButton.textContent = 'Stop the iBeacon';
}

/**
 * Stops advertising
 */
const stopAdvertising = async () => {
    // Stop the dongle from advertising
   await my_dongle.at_advstop();

    isAdvertising = false;

    output.textContent = 'iBeacon stopped';
    iBeaconButton.textContent = 'Create an iBeacon';
}