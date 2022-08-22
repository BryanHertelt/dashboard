import re
import mock
import pytest
import websockets

from src.collectors import Websocket_collector, Collector
from src.parser import Parser
from src.connectors import Database_connector, Message_broker_connector, Websocket_connector
from tests.development.utils.helper_funcs import future_exception, future_result

class Parser(Parser):

    """Default parser class for testing purposes."""
    
    @staticmethod
    def parse(data):
        return "Test"


class WebsocketException(websockets.exceptions.ConnectionClosedError):

    """Recreate the exception class for websockets, because otherwise two parameters would be required."""

    def __init__(rcvd=None, sent=None):
        super().__init__(rcvd, sent)

@pytest.fixture
def get_Websocket_collector():
    
    """Returns the default testing object of the Websocket_collector."""
    
    collector = Websocket_collector(Parser, Message_broker_connector("redis://localhost"), Database_connector("postgresql://localhost"), Websocket_connector("ws://localhost"))
    return collector

#Test for the exception handling in the setup method is still missing
"""
if message == "message":
        Collector.setup = mock.MagicMock(future_result(None))
        Websocket_connector.create_connection = mock.MagicMock(return_value=future_result(None))
        Websocket_connector.subscribe = mock.MagicMock(return_value=
            future_exception(websockets.exceptions.ConnectionClosedError("rcvd", "sent")))

        await collector.setup(message)

        assert Websocket_connector.create_connection.call_count == 2
        assert Websocket_connector.subscribe.call_count == 2
"""
@pytest.mark.asyncio
@pytest.mark.parametrize("message", ["message", None])
async def test_setup(get_Websocket_collector, message):
    
    """Tests the setup method of the Websocket_collector."""
    
    collector = get_Websocket_collector
    Collector.setup = mock.MagicMock(future_result(None))
    Websocket_connector.create_connection = mock.MagicMock(return_value=future_result(None))
    Websocket_connector.subscribe = mock.MagicMock(return_value=future_result(None))
    
    await collector.setup(message)
    
    assert Collector.setup.call_count == 1
    assert Websocket_connector.create_connection.call_count == 1
    if message == None:
        assert Websocket_connector.subscribe.call_count == 0
    elif message == "message":
        assert Websocket_connector.subscribe.call_count == 1
    
    
"""No further tests required, because the class just calls function, which are already tested in their own modules.
""" 