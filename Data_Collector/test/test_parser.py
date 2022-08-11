import pytest
from src.parser import Parser

def test_parser():
    parser = Parser()
    with pytest.raises(NotImplementedError):
        parser.parse([(1, 1, 1)])