import mock
import pytest
import asyncpg
import redis

from src.collectors import Collector
from src.parser import Parser
from src.connectors import Message_broker_connector, Database_connector
from tests.development.utils.helper_funcs import future_exception, future_result

class Parser(Parser):
    
    "Default parser object for testing purposes."""
    
    @staticmethod
    def parse(data):
        return "Test"

@pytest.fixture
def get_collector():
    
    """Returns the default testing object of the Collector."""
    
    collector = Collector(Parser(), Message_broker_connector("test_url"), Database_connector("test_url", 1))
    return collector

@pytest.mark.asyncio
async def test_setup(get_collector):
    
    """Tests the setup method of the Collector."""
    
    collector = get_collector
    Message_broker_connector.connect = mock.MagicMock(return_value=future_result(None))
    Database_connector.connect = mock.MagicMock(return_value=future_result(None))
    await collector.setup()
    
    assert Message_broker_connector.connect.call_count == 1
    assert Database_connector.connect.call_count == 1

@pytest.mark.asyncio
async def test_write(get_collector):
    
    
    """Tests the write method of the Collector."""
    
    collector = get_collector
    Database_connector.write = mock.MagicMock(return_value=future_result(None))
    await collector._Collector__write(None, None, None)
    
    assert Database_connector.write.call_count == 1
    
    Database_connector.connect = mock.MagicMock(return_value=future_result(None))
    Database_connector.write = mock.MagicMock(return_value=future_exception(asyncpg.exceptions.ConnectionDoesNotExistError))
    await collector._Collector__write(None, None, None)
    
    assert Database_connector.connect.call_count == 1

@pytest.mark.asyncio
async def test_publish(get_collector):
    
    """Tests the publish method of the Collector."""
    
    collector = get_collector
    Message_broker_connector.write = mock.MagicMock(return_value=future_result(None))
    
    await collector._Collector__publish(None, None)
    
    assert Message_broker_connector.connect.call_count == 1
    
    Message_broker_connector.connect = mock.MagicMock(return_value=future_result(None))
    Message_broker_connector.write = mock.MagicMock(return_value=future_exception(redis.exceptions.ConnectionError))
    await collector._Collector__publish(None, None)

    assert Message_broker_connector.connect.call_count == 1

@pytest.mark.asyncio
async def test_collect(get_collector):
    
    """Tests the collector method of the Collector."""
    
    collector = get_collector
    
    with pytest.raises(NotImplementedError):
        await collector.collect()
        
@pytest.mark.asyncio
async def test_shutdown(get_collector):
    
    """Tests the shutdown method of the Collector."""
    
    collector = get_collector
    Database_connector.close_connection = mock.MagicMock(return_value=future_result(None))
    
    await collector.shutdown()
    
    assert Database_connector.close_connection.call_count == 1