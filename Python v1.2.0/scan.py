from bleuio_lib.bleuio_funcs import BleuIO
import time

# This is an example script showing how to scan for nearby bluetooth devices using BleuIO's Python library

# Creating a callback function for scan results. For this example we just prints out the result.
# Here you can add your code to parse the data.
def my_scan_callback(scan_input):
    print("\n\nmy_evt_callback: " + str(scan_input))

# Auto-Detect dongle
my_dongle = BleuIO()
# Registers the callback functions we created earlier.
my_dongle.register_scan_cb(my_scan_callback)

print("Scan for nearby Bluetooth devices using BleuIO Python Library!\n")
# Now we start scanning
# First we need to put the dongle in Central or Dual Gap Role
my_dongle.at_dual()

# We send in a timeout as a parameter for the at_gapscan() command. In that case it will scan for 3 seconds.
# Here we just set a three second sleep.
# Notice that all the scan data will be printed by our my_scan_callback() function.
resp = my_dongle.at_gapscan(3)
time.sleep(3)

print("\n--\n")
