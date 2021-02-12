from bleuio_lib.bleuio_funcs import BleuIo
from time import sleep

my_dongle = BleuIo()
my_dongle.start_daemon()

print(
    "\nConnected to dongle\n\n" "Welcome to the Bluetooth device Scanning example!\n\n"
)

# Set the dongle in central role
my_dongle.at_central()


user_input = input(
    "Enter:\n"
    '"1" Continuous scan\n'
    '"2" Scan for a limited time\n'
    '"3" Scan a target device\n'
)

if user_input == "1":
    # "Continuous scan" option

    # Start scanning for bluetooth devices
    my_dongle.at_gapscan()
    log = []
    try:
        while True:
            # Fetch response from the dongle
            response = my_dongle.rx_scanning_results
            # Iterate the response for every device found
            for device in response:

                # Add and print the device if its not already found
                if device not in log:
                    print(device)
                    log.append(device)
    except:
        my_dongle.stop_scan()
        exit()

elif user_input == "2":
    # "Scan for a limited time" option
    time_limit = input("Enter time limit(seconds):\n")

    while not time_limit.isdigit():
        time_limit = input("Wrong input please try again")

    print("Scanning..")

    # Starts scan with entered time limit
    my_dongle.at_gapscan(int(time_limit))
    response = my_dongle.rx_scanning_results
    # Prints the result
    for device in response:
        print(device)

elif user_input == "3":
    # "Scan a target device" option

    # Prompting user to enter a device address scanned for
    device_address = input(
        "Enter device type and address:\n" "Example: [0]40:48:FD:E5:2F:A5\n"
    )

    print("Scanning target device: {}".format(device_address))

    # Start scanning for the device
    my_dongle.at_scantarget(device_address)

    user_input = input("Press ENTER to get the result")

    # Stop the scan
    my_dongle.stop_scan()

    # Fetch the result
    devices = my_dongle.rx_scanning_results

    # Print the result
    for device in devices:
        print(device)

    # Stop daemon and exit
    my_dongle.stop_daemon()
    exit()