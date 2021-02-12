import time
from bleuio_lib.bleuio_funcs import BleuIo

my_dongle = BleuIo()
my_dongle.start_daemon()

print("\n\nConnected to Dongle.\n")
print("\nWelcome to the Eddystone example!\n\n")

success = ""
while True:
    if not success:
        new_input = input(
            "Enter the Eddystone formatted url:\n"
            "Example: 0d:16:aa:fe:10:00:03:67:6f:6f:67:6c:65:07 "
            "(https://google.com)\n>> "
        )
    success = my_dongle.at_advdata("03:03:aa:fe " + new_input)
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
