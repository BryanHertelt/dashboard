import mock
import aiohttp
import pytest

from src.connectors import Api_connector
from tests.development.utils.helper_funcs import future_exception, future_result

@pytest.fixture
def get_Api_connector():
    connector = Api_connector(5)
    return connector

"""No tests required, because this class only uses function, which are already tested in their own modules."""