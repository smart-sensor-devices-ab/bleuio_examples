from bleuio_lib.bleuio_funcs import BleuIo
import time

my_dongle = BleuIo()
my_dongle.start_daemon()

print("\n\nConnected to Dongle.\n")
print("\nWelcome to the iBeacon example!\n\n")

success = ""
while True:
    if not success:
        new_input = input(
            "Enter the iBeacon UUID (x) string with Major (j), "
            "Minor (n) and TX (t)\n"
            "Example: ebbaaf47-0e4f-4c65-8b08-dd07c98c41ca0000000000\n>> "
        )
    success = my_dongle.at_advdatai(new_input)
    time.sleep(0.1)
    if "OK" in str(success):
        advstart = my_dongle.at_advstart()
        print(advstart)
        if not input("Press any key to exit."):
            my_dongle.at_advstop()
            break
    else:
        print("Error, try again.")
        success = ""
