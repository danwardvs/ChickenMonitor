
import time

import MyLCD
import MyWrite
import MyTemperature




MyLCD.setup()

while True:
    temp = MyTemperature.read()
    print(temp)
    MyLCD.write("Temp: " + temp)
    MyWrite.write(temp)
    time.sleep(1)
