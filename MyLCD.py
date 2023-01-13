from i2c_lcd import I2cLcd
import time

lcd = None
backlight_enabled = True


def toggle_backlight_enabled():
    global backlight_enabled
    backlight_enabled = not backlight_enabled
    if backlight_enabled:
        lcd.backlight_on()
    else:
        lcd.backlight_off()

def setup():
    global backlight_enabled
    global lcd
    # The PCF8574 has a jumper selectable address: 0x20 - 0x27
    DEFAULT_I2C_ADDR = 0x27
    lcd = I2cLcd(1, DEFAULT_I2C_ADDR, 2, 16)
    lcd.blink_cursor_off()
    lcd.hide_cursor()
    lcd.putstr("   Welcome to\n   ChickenPC")
    time.sleep(1)
    lcd.clear()
    print("backlight enabled",backlight_enabled)
    if not backlight_enabled:
        lcd.backlight_off()

def toggle_backlight(on):
    global backlight_enabled
    if backlight_enabled:
        if on:
            lcd.backlight_on()
        else:
            lcd.backlight_off()




def write(string):
    if lcd is None:
        print("Error: LCD not initalized")
    else:
        valid = True
        sp = string.split("\n")
        for i in sp:
            if len(i) > 16:
                valid = False
        if valid:
            try:
                lcd.clear()
                lcd.putstr(string)
            except:
                print("Error: Failed to print to LCD")
        else:
            print("Error: Too large of text")

def flash(off_time,on_time,n):
    if lcd is None:
        print("Error: LCD not initalized")
    else:
        for _ in range(n):
            toggle_backlight(False)
            time.sleep(off_time)
            toggle_backlight(True)
            time.sleep(on_time)

