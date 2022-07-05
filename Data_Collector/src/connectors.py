import redis
import websockets
import json
import asyncpg
import asyncio
import aiohttp

from redis import asyncio as aioredis
from typing import Callable, Dict, List, Tuple, Union

class Database_connector:
    
    """The connector for a PostgreSQL database.
    
    The Database_connector opens a connection to the database and writes into it.
    
    Attributes:
        connection_string (str): 
            A string which specifies the address to the database.
        connection (asyncpg.Connection): 
            A asyncpg.Connection object, which represents the connection to  the database.
        max_reconnects (int): 
            An integer, which is the maximum allowed number of reconnects.
    
    """
    
    def __init__(self, connection_string: str, max_reconnects: int) -> None: 
        
        """Initialize the Database_connector.
        
        Args:
            connection_string (str): 
                A string which specifies the address to the database.
            max_reconnects (int):
                An integer, which is the maximum allowed number of reconnects.
        
        Returns:
            None
        
        Raises:
            None
        """ 
        
        self._connection_string: str = connection_string
        self._connection: asyncpg.Connection
        self._max_reconnects: int = max_reconnects
    
    async def connect(self) -> asyncpg.Connection: 
        
        """Connects to the database.
        
        Connects to the database with the given address. The maximum amount of reconnects will be set. If the first connect fails, the method will retry until the amount of maximum reconnects is reached.
        
        Args:
            None
            
        Returns:
            The connection object will be returned in the attribute self._connection. When the connection fails, it returns nothing and instead raises an exception.
        
        Raises:
            asyncpg.PostgresError, OSError:
                This exception will be raised, if, afer the limit of reconnects is reached, there is still no working connection.
        """
        
        for count in range(self._max_reconnects+1):
            try:
                self._connection = await asyncpg.connect(self._connection_string)
            except (asyncpg.PostgresError, OSError) as error:
                exception = error
                await asyncio.sleep(count)
                continue
            else:
                return self._connection
        raise exception
    
    async def write(self, query_statement: str, data: List[Tuple[str]], table: str) -> None: 
        
        """Writes to the database.
        
        Writes the given data into the database. For that it uses the given query statement. Befor the insertion the data will be formatted probperly by a join()-statement. The data is inserted as its whole. To accomplish that the query is generated before and then executed.
        
        Args:
            query_statement (str):
                This string specifies the query, which will be used to insert the data into the given table.
            data (List[Tuple[str]]):
                The list conists of tuple containing strings. This data will be formatted and inserted entry by entry.
            table (str):
                This string names the table, where the data should be inserted.
        
        Returns:
            None
        
        Raises:
            None
        """
        
        if self._connection != None:
            args_str = ",".join("('%s', '%s', '%s')" %(coin, price, volume) for (coin, price, volume) in data)
            await self._connection.execute(query_statement.format(table=table) + args_str)

    async def close_connection(self) -> None: 
        
        """Closes the connection to the database.
        
        Closes the connection to the database if the connection exists.
        
        Args:
            None
            
        Returns:
            None
        
        Raises:
            None
        """
        
        if self._connection != None:
            await self._connection.close()

class Message_broker_connector:
    
    ''' Object for message broker connections and operations.'''
    
    def __init__(self, instance_url: str, max_reconnects: int) -> None:
        self._instance_url: str = instance_url
        self._connection: aioredis.ConnectionPool
        self._max_reconnects: int = max_reconnects
       
    async def connect(self) -> aioredis.ConnectionPool:
        
        '''This function connects to message broker.'''
        
        for count in range(self._max_reconnects+1):
            try:
                self._connection = await aioredis.from_url(self._instance_url)
                await self._connection.ping()
            except redis.RedisError as error:
                exception = error
                await asyncio.sleep(count)
                continue
            else:
                return self._connection
        raise exception
    
    async def write(self, data: List[Tuple[str]], source: str) -> None:
        
        '''This function executes the query statement.'''
        
        async with self._connection.pipeline() as pipeline:
            for item in data:
                await pipeline.publish(source + item[0], item[1])
            
class Websocket_connector:
    
    '''Object for websocket connections and operations.'''
    
    def __init__(self, websocket_url: str, max_reconnects: int, max_size: int = None) -> None:
        self._websocket_url: str = websocket_url
        self._websocket_connection: websockets.WebSocketClientProtocol
        self._max_reconnects: int = max_reconnects
        self._max_size: int = max_size
    
    async def create_connection(self) -> websockets.WebSocketClientProtocol:
        
        '''This function creates a websocket connection.'''
        
        for count in range(self._max_reconnects+1):
            try:
                self._websocket_connection = await websockets.connect(self._websocket_url, max_size=self._max_size)
            except (websockets.exceptions.ConnectionClosed, OSError, websockets.exceptions.InvalidHandshake) as error:
                exception = error
                await asyncio.sleep(count)
                continue
            else:
                return self._websocket_connection
        raise exception 
            
    async def close_connection(self, reason: str = "", code: int = 1000) -> None:
        
        '''This function closes the websocket connection.'''
        
        if self._websocket_connection:
            await self._websocket_connection.close(reason=reason, code=code)
            self._logger.info("Websocket connection closed.")
                       
    async def receive_message(self, parser_func: Callable[[str], str]) -> None:
        
        '''This function handles every message received from the websocket.'''
        
        if self._websocket_connection:
            while True:
                message = await self._websocket_connection.recv()
                parser_func(message)
        
    async def send_message(self, message: str) -> None:
        
        '''This function sends messages to the websocket'''
        
        await self._websocket_connection.send(json.dumps(message))
        
class Api_Connector:
    
    def __init__(self, url: str, parameter: Dict[str, str], timeout: int) -> None:
        
        ''' This function initializes the Api_Connector.'''
        
        self._session: aiohttp.ClientSession
        self._response: str
        self._url = url
        self._status: Union[str, int]
        self._params: Dict[str, str] = parameter
        self._timeout: aiohttp.ClientTimeout = aiohttp.ClientTimeout(total=timeout)
    
    async def create_session(self) -> None:
        
        '''This function creates a new session.'''
        
        self._session = aiohttp.ClientSession(timeout=self._timeout)
    
    async def make_request(self) -> str:
        
        '''This function creates a new request.'''
        
        async with self._session.get(self._url, params=self._params) as response:
            self._status = response.status
            self._response = await response.text()
    
    async def close_session(self) -> None:
        
        '''This function closes the session.'''
        
        await self._session.close()