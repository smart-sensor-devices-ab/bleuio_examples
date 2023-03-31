from bleuio_lib.bleuio_funcs import BleuIO
import time

# This is an example script showing how to setup Eddystone Beacon  using BleuIO

# Creating a callback function for scan results. For this example we just prints out the result.
# Here you can add your code to parse the data.
def my_scan_callback(scan_input):
    print("\n\nmy_evt_callback: " + str(scan_input))

# Auto-Detect dongle
my_dongle = BleuIO()
# Registers the callback functions we created earlier.
my_dongle.register_scan_cb(my_scan_callback)

print("Eddystone example using BleuIO Python Library!\n")
new_input = input("Enter the Eddystone formatted url:\n"
            "Example: 0d:16:aa:fe:10:00:03:67:6f:6f:67:6c:65:07 "
            "(https://google.com)\n>> ")
s2="03:03:aa:fe "
my_dongle.at_advdata("03:03:aa:fe " + new_input)
my_dongle.at_advstart()
time.sleep(0.1)
#Check the status of the dongle
print("\nisAdvertising: " + str(my_dongle.status.isAdvertising))

print("\n--\n")
