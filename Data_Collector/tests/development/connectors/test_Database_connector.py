import pytest
import asyncpg
import mock

from src.connectors import Database_connector
from tests.development.utils.helper_funcs import future_exception, future_result

@pytest.fixture
def get_database_connector():
    
    """Returns the default testing object of the Database_connector."""
    
    connector = Database_connector(
        "postgres://postgres:password@localhost:5432/benchmark", 2
    )
    return connector


@pytest.mark.asyncio
async def test_connect_successful(get_database_connector):
    
    """Tests if the Database_connector returns the correct object if the connection was successful."""
    
    database_connector = get_database_connector
    asyncpg.connect = mock.MagicMock(return_value=future_result(asyncpg.Connection))

    connection = await database_connector.connect()

    assert connection == asyncpg.Connection


@pytest.mark.asyncio
async def test_connect_unsuccessful(get_database_connector):

    """Tests if the exception handling is correct, when the connection can not be established."""

    database_connector = get_database_connector
    asyncpg.connect = mock.MagicMock(return_value=future_exception(asyncpg.PostgresError))

    with pytest.raises(asyncpg.PostgresError):
        connection = await database_connector.connect()

        assert connection != asyncpg.Connection
    assert asyncpg.connect.call_count == 2


@pytest.mark.asyncio
async def test_reconnect(get_database_connector):

    """Tests if reconnecting after a connection fail is successful."""

    database_connector = get_database_connector
    asyncpg.connect = mock.MagicMock(side_effect=[future_exception(asyncpg.PostgresError), future_result(asyncpg.Connection)])

    connection = await database_connector.connect()

    assert connection == asyncpg.Connection
    assert asyncpg.connect.call_count == 2
