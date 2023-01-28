
import time

import MyLCD
import MyWrite
import MyTemperature
import MyHumidity




MyLCD.setup()

while True:
    temp = MyTemperature.read()
    humidity = MyHumidity.read()

    MyLCD.write("Temp: " + temp + "\n" + "Hmdy: " + humidity + "%")
    data = {"temp":temp,"humidity":humidity}

    MyWrite.write(data)
    time.sleep(60*2)
