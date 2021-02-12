import * as my_dongle from 'bleuio'
import 'regenerator-runtime/runtime'

// Fungerar första gången jag kör
// Om jag stoppar den och försöker starta igen så händer ingenting

// När jag har testat lägga in en sleep() efter at_advdata() (line 108)
// fungerar det att köra den om och om igen

// Donglarna jag har fungerar olika när jag kör den här.
// Om jag kör två instanser av programmet och kör samma sekvenser
// är resultaten ändå olika. 
// På den märkta dongeln så kan jag starta en beacon en gång (om jag inte använder sleep()) 
// den går alltså inte starta igen om jag har stoppat den.
// På den omärkta dongeln så kan jag starta en beacon men inte stänga av den


const output = document.querySelector("#output");
const connectButton = document.querySelector('#connectButton');
const eddystoneButton = document.querySelector('#eddystoneButton');
const urlInputField = document.querySelector('#urlInputField');

let connected = false;
let advertising = false;

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
 * Enables the button to start the beacon
 */
const connect = async () => {
    // Connect to dongle
    await my_dongle.at_connect();

    connectButton.textContent = 'Disconnect';
    output.textContent = 'Connected to dongle';

    connected = true;

    // Enable the eddystone button which is disabled by default to avoid errors
    eddystoneButton.addEventListener('click', handleEddystone);
    eddystoneButton.classList.remove('disabled');
}

/**
 * Stops advertising the URL and disconnects the dongle
 * and disables the button to start the beacon
 */
const disconnect = async () => {
    // Stops advertising
    await my_dongle.at_advstop();

    // Disconnects the dongle
    await my_dongle.at_disconnect();

    // Reset dongle status
    connected = false;
    advertising = false;

    output.textContent = 'Dongle disconnected';

    // Disable the eddystone button to avoid errors
    eddystoneButton.removeEventListener('click', handleEddystone);
    eddystoneButton.classList.add('disabled')
    eddystoneButton.textContent = 'Create an Eddystone beacon';

    connectButton.textContent = 'Connect';
}


/**
 * Starts / stops advertising the URL
 */
const handleEddystone = async () => {
    // If the dongle is not advertising, start advertising
    if (!advertising) {
        startAdvertising();
    } else {
        stopAdvertising();
    }
}

/**
 * Starts advertising the eddystone url
 */
const startAdvertising = async () => {
    // Disable the eddyStoneButton until the advertising has completed
    eddystoneButton.classList.add('disabled');

    // A prefix is needed for the dongle to advertise the data as an Eddystone Beacon
    // Note that a whitespace at the end is required
    const beaconPrefix = '03:03:aa:fe '

    // Sets the data to advertise the provided url in the html will advertise "https://google.com"
    await my_dongle.at_advdata(beaconPrefix + urlInputField.value);

    // Start advertising
    await my_dongle.at_advstart();
    
    advertising = true;

    output.textContent = 'Eddystone beacon created';

    eddystoneButton.textContent = 'Stop';
    eddystoneButton.classList.remove('disabled');
}

/**
 * Stops the dongle from advertising
 */
const stopAdvertising = async () => {
    // Stops advertising
    await my_dongle.at_advstop();

    advertising = false;

    output.textContent = 'Eddystone beacon stopped';

    eddystoneButton.textContent = 'Create an Eddystone beacon'
}