def test_parser():
    pass

def parser(message):
    return message[0]["price"]

def test_formatting(parser):
    test_string = [{"data": 1, "price": 1010}, [1]]
    result = parser(test_string)
    print(result)

#test_formatting(parser)