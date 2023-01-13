ERROR = "N/A"

def checkInput(input,min=-999,max=999):
    print((type(input)))
    if not isinstance(input, float) and not isinstance(input,int):
        print("Incorrect type")
        return ERROR
    if(input>max):
        print("Input too large")
        return ERROR
    if(input<min):
        print("Input too low")
        return ERROR
    return str(input)