import asyncio
import mock 
import websockets
import pytest

from src.connectors import Websocket_connector

class WebsocketException(websockets.exceptions.ConnectionClosed):
    
    """Recreate the exception class for websockets, because otherwise two parameters would be required."""
    
    def __init__(rcvd=None, sent=None):
        super().__init__(rcvd, sent)

@pytest.fixture
def get_websocket_connector():
    
    """Returns the default testing object of the Websocket_connector."""
    
    connector = Websocket_connector(
        "wss://stream.binance.com:9443/ws", 2, 2**60)
    return connector


@pytest.mark.asyncio
async def test_connect_successful(get_websocket_connector):

    """Tests if the Websocket_connector returns the correct object if the connection was successful."""
    
    websocket_connector = get_websocket_connector
    future = asyncio.Future()
    future.set_result(websockets.WebSocketClientProtocol)
    websockets.connect = mock.MagicMock(return_value=future)

    connection = await websocket_connector.create_connection()

    assert connection == websockets.WebSocketClientProtocol


@pytest.mark.asyncio
async def test_connect_unsuccessful(get_websocket_connector):

    """Tests if the exception handling is correct, when it is not possible to establish a connection."""
    
    websocket_connector = get_websocket_connector
    future = asyncio.Future()
    future.set_exception(WebsocketException)
    websockets.connect = mock.MagicMock(return_value=future)

    with pytest.raises(WebsocketException):
        connection = await websocket_connector.create_connection()

        assert connection != websockets.WebSocketClientProtocol
    assert websockets.connect.call_count == 2


@pytest.mark.asyncio
async def test_reconnect(get_websocket_connector):

    """Test if the object reconnects, when a connection error occurs."""
    
    websocket_connector = get_websocket_connector
    future_exception, future_sucessful = asyncio.Future(), asyncio.Future()
    future_exception.set_exception(WebsocketException)
    future_sucessful.set_result(websockets.WebSocketClientProtocol)
    websockets.connect = mock.MagicMock(
        side_effect=[future_exception, future_sucessful])

    connection = await websocket_connector.create_connection()

    assert connection == websockets.WebSocketClientProtocol
    assert websockets.connect.call_count == 2
