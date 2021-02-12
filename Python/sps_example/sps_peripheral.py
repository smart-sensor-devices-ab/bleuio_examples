from bleuio_lib.bleuio_funcs import BleuIo
from serial import SerialException
from time import sleep

# This script will receive data from a central dongle
# and echo it back to the central

my_dongle = None
connected_to_dongle = False
connected_to_central = False
message = ""

while not connected_to_dongle:
    try:
        # Specify the COM PORT connected to the dongle
        my_dongle = BleuIo(port="COM6")
        # Start the deamon (background process handler) for RX and TX data.
        my_dongle.start_daemon()

        connected_to_dongle = True
    except SerialException:
        print("Dongle not found. Please connect your dongle")
        sleep(5)

print("Connected to dongle\n\n" "Welcome to the BleuIO SPS example!\n\n")

# Starts advertising so it can be detected
my_dongle.at_advstart()

try:
    time_out_counter = 0
    i = 0
    while not connected_to_central:
        # Get information from the dongle
        # to see if it's connected to the central
        status = my_dongle.at_gapstatus()

        # Checks for information about connection
        if "\\nConnected\\r" in str(status):
            print("\nConnected to central")
            while True:
                # Listen for a received message
                response = str(my_dongle.rx_buffer)
                if "Received" in response:
                    print(response)
                    my_dongle.rx_buffer = b""
        else:
            print("Trying to connect to central")
            sleep(2)

except KeyboardInterrupt:
    # Disconnects and stops the dongle
    my_dongle.at_gapdisconnect()
    my_dongle.stop_daemon()
    exit()
