import pytest
import asyncpg
import mock
import asyncio

from src.connectors import Database_connector


@pytest.fixture
def get_database_connector():
    connector = Database_connector(
        "postgres://postgres:password@localhost:5432/benchmark", 2
    )
    return connector


@pytest.mark.asyncio
async def test_connect_successful(get_database_connector):

    database_connector = get_database_connector
    future = asyncio.Future()
    future.set_result(asyncpg.Connection)
    asyncpg.connect = mock.MagicMock(return_value=future)

    connection = await database_connector.connect()

    assert connection == asyncpg.Connection


@pytest.mark.asyncio
async def test_connect_unsuccessful(get_database_connector):

    database_connector = get_database_connector
    future = asyncio.Future()
    future.set_exception(asyncpg.PostgresError)
    asyncpg.connect = mock.MagicMock(return_value=future)

    with pytest.raises(asyncpg.PostgresError):
        connection = await database_connector.connect()

        assert connection != asyncpg.Connection
    assert asyncpg.connect.call_count == 2


@pytest.mark.asyncio
async def test_reconnect(get_database_connector):

    database_connector = get_database_connector
    future_exception, future_sucessful = asyncio.Future(), asyncio.Future()
    future_exception.set_exception(asyncpg.PostgresError)
    future_sucessful.set_result(asyncpg.Connection)
    asyncpg.connect = mock.MagicMock(side_effect=[future_exception, future_sucessful])

    connection = await database_connector.connect()

    assert connection == asyncpg.Connection
    assert asyncpg.connect.call_count == 2
