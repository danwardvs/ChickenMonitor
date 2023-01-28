import os
import glob
import MySensor

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')
 
base_dir = '/sys/bus/w1/devices/'

device_folders = glob.glob(base_dir + '28-01151561b2ff')
device_file = MySensor.ERROR
if len(device_folders) > 0:
    device_folder = device_folders[0]
    device_file = device_folder + '/w1_slave'
 
def read_temp_raw():
    try:
        if not device_file == MySensor.ERROR:
            f = open(device_file, 'r')
            lines = f.readlines()
            f.close()
            return lines
        return MySensor.ERROR
    except:
        return MySensor.ERROR
 
def read():
    try:
        lines = read_temp_raw()
        if lines == MySensor.ERROR:
            return MySensor.ERROr
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = read_temp_raw()
        equals_pos = lines[1].find('t=')
        if equals_pos != -1:
            temp_string = lines[1][equals_pos+2:]
            temp_c = float(temp_string) / 1000.0
            temp_f = temp_c * 9.0 / 5.0 + 32.0
            return MySensor.checkInput(temp_c,-100,84)

        else:
            return MySensor.ERROR
    except:
        return MySensor.ERROR

        
    