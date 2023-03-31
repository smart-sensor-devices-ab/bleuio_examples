from bleuio_lib.bleuio_funcs import BleuIO
import time

# This is an example script showing how to setup your and IBeacon using BleuIO

# Creating a callback function for scan results. For this example we just prints out the result.
# Here you can add your code to parse the data.
def my_scan_callback(scan_input):
    print("\n\nmy_evt_callback: " + str(scan_input))

# Auto-Detect dongle
my_dongle = BleuIO()
# Registers the callback functions we created earlier.
my_dongle.register_scan_cb(my_scan_callback)

print("IBeacon example using BleuIO Python Library!\n")
new_input = input("Enter the iBeacon UUID (x) string with Major (j), "
            "Minor (n) and TX (t)\n"
            "Example: ebbaaf47-0e4f-4c65-8b08-dd07c98c41ca0000000000\n>> ")
my_dongle.at_advdatai(new_input)
my_dongle.at_advstart(0,200,3000,0)
#Check the status of the dongle
print("\nisAdvertising: " + str(my_dongle.status.isAdvertising))

print("\n--\n")
