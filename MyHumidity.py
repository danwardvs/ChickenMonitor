import time
import board
import adafruit_dht
import MySensor

# Initial the dht device, with data pin connected to:
dhtDevice = adafruit_dht.DHT11(board.D10)

# you can pass DHT22 use_pulseio=False if you wouldn't like to use pulseio.
# This may be necessary on a Linux single board computer like the Raspberry Pi,
# but it will not work in CircuitPython.
# dhtDevice = adafruit_dht.DHT22(board.D18, use_pulseio=False)

def read():
    try:
        # Print the values to the serial port
        temperature_c = dhtDevice.temperature
        temperature_f = temperature_c * (9 / 5) + 32
        humidity = dhtDevice.humidity

        return MySensor.checkInput(humidity,-1,101)
        

    except Exception as error:
        #Fails a lot!
        #print(error.args[0])


        return MySensor.ERROR
    