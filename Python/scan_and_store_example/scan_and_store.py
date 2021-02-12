from datetime import datetime

from bleuio_lib.bleuio_funcs import BleuIo

# from serial import SerialException
from time import sleep

my_dongle = BleuIo()
my_dongle.start_daemon()

print(
    "Connected to dongle\n\n"
    "Welcome to the Bluetooth device Scan and Store example!\n\n"
)

# Set the dongle in central role
my_dongle.at_central()

user_input = input(
    "Enter something such as a Manufacturer Specific (MFS) ID to scan for "
    "and store in a file or just leave it blank to scan all:\n"
)

# Scans with a specific id or all devices if none is provided
my_dongle.at_findscandata(user_input)

log = ""

while user_input.casefold() != "stop":
    user_input = input('Enter "STOP" to stop scanning\n')
    # If the user stops the scan log reformat and log the response
    if user_input.casefold() == "stop":

        # Stop the scan
        my_dongle.stop_scan()

        # Fetch the result
        log = my_dongle.rx_scanning_results

# Saves the log to scan_log.txt
with open("scan_log.txt", "w") as scan_log:
    for line in log:
        scan_log.write(line)
