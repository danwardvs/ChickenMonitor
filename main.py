import MyLCD
import MyWrite
import MyTemperature
import MyHumidity
import MyTime



MyLCD.setup()

while True:
    temp = MyTemperature.read()
    humidity = MyHumidity.read()
    time = MyTime.read()
    
    MyLCD.write("Temp: " + temp + "\n" + "Hmdy: " + humidity + "%  " + time)
    
    data = {"temp":temp,"humidity":humidity}

    MyWrite.write(data)
    MyTime.sleep(60)
