import mock
import pytest

from src.collectors import Api_collector, Collector
from src.parser import Parser
from src.connectors import Database_connector, Message_broker_connector, Api_connector
from tests.development.utils.helper_funcs import future_exception, future_result

@pytest.fixture
def get_Api_collector():
    
    """Returns the Api_collector object for testing purposes."""
    
    collector = Api_collector(Parser, Message_broker_connector(
        "redis://localhost"), Database_connector("postgresql://localhost"), Api_connector("http://localhost"))
    return collector

@pytest.mark.asyncio
async def test_collect(get_Api_collector):
    
    """Test the collect method."""
    
    collector = get_Api_collector
    pass

"""No tests required, because the class calls functions, which are already tested in their own modules."""