import pytest
import mock
import redis
import asyncio

from redis import asyncio as aioredis
from src.connectors import Message_broker_connector

@pytest.fixture
def get_message_broker_connector():
    connector = Message_broker_connector("redis://test", 2)
    return connector


@pytest.mark.asyncio
async def test_connect_successful(get_message_broker_connector):
    
    message_broker_connector = get_message_broker_connector
    future_sucessful = asyncio.Future()
    future_sucessful.set_result(aioredis.ConnectionPool)
    aioredis.from_url = mock.MagicMock(return_value=future_sucessful)
    aioredis.ConnectionPool.ping = mock.MagicMock(return_value=future_sucessful)
    
    connection = await message_broker_connector.connect()
    
    assert connection == aioredis.ConnectionPool


@pytest.mark.asyncio
async def test_connect_unsuccessful(get_message_broker_connector):
    message_broker_connector = get_message_broker_connector
    future = asyncio.Future()
    future.set_exception(redis.RedisError)
    aioredis.from_url = mock.MagicMock(return_value=future)

    with pytest.raises(redis.RedisError):
        connection = await message_broker_connector.connect()

        assert connection != aioredis.ConnectionPool
    assert aioredis.from_url.call_count == 2


@pytest.mark.asyncio
async def test_reconnect(get_message_broker_connector):
    
    message_broker_connector = get_message_broker_connector
    future_exception, future_sucessful = asyncio.Future(), asyncio.Future()
    future_exception.set_exception(redis.RedisError)
    future_sucessful.set_result(aioredis.ConnectionPool)
    aioredis.from_url = mock.MagicMock(
        side_effect=[future_exception, future_sucessful])
    aioredis.from_url.ping = mock.MagicMock(side_effect=[future_exception, future_sucessful])

    connection = await message_broker_connector.connect()

    assert connection == aioredis.ConnectionPool
    assert aioredis.from_url.call_count == 2
