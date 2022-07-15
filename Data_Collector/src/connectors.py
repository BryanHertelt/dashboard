import redis
import websockets
import json
import asyncpg
import asyncio
import aiohttp
import aiofiles

from redis import asyncio as aioredis
from typing import Dict, List, Tuple, Union

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
    
    """The connector for Redis.
    
    The connector connects to a given redis instance over the instance url and writes into it.
    
    Attributes:
        instance_url (str):
            A string, which specifies the url to the redis instance.
        max_reconnects (int):
            An integer, which is the maximum allowed number of reconnects.
    """
    
    def __init__(self, instance_url: str, max_reconnects: int) -> None:
        
        """Initialize the Message_broker_connector.
        
        Args:
            instance_url (str):
                A string, which specifies the url to the redis instance.
            max_reconnects (int):
                An integer, which is the maximum allowed number of reconnects.
        
        Returns:
            None
        
        Raises:
            None
        """
        
        self._instance_url: str = instance_url
        self._connection: aioredis.ConnectionPool
        self._max_reconnects: int = max_reconnects
       
    async def connect(self) -> aioredis.ConnectionPool:
        
        """Connects to the given redis instance.
        
        Connects to the given redis instance over the self._instance_url. When the connection fails, it starts retrying until it successfully establish a connection or the maximum amount of reconnects is reached.
        
        Args:
            None
        
        Returns:
            The self._connection object will be returned. It represents a connection to the given redis instance with an object of aioredis.ConnectionPool.
        
        Raises:
            redis.RedisError:
                This exception will be raised, if, ater reaching the maximum amount of reconnects, the connection attempt was still not successful.
        """
        
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
        
        """Writes given data into the redis instance.
        
        Writes given data into the redis instance. For executing the publish statements does the method use a pipe. Also the data gets published to a specific stream.
        
        Args:
            data (List[Tuple[str]]):
                A list, which represents to data thath should be inserted and published in the corresponding streams.
            source (str):
                A string, which specifies the exchange. This information is used to build the correct stream name.
        
        Returns:
            None
        
        Raises:
            None
        """
        
        async with self._connection.pipeline() as pipeline:
            for item in data:
                await pipeline.publish(source + item[0], item[1])
            await pipeline.execute()
            
class Websocket_connector:
    
    """The connector for a websocket.
    
    The connector connects to a given websocket adress and receives messages from it.
    
    Attributes:
        websocket_url (str):
            A string, which specifies the address to the websocket.
        max_reconnects (int):
            An integer, which is the maximum allowed number of reconnects.
        max_size (int):
            An integer, which limits the size of the message buffer from the websocket connector. 
    """
    
    def __init__(self, websocket_url: str, max_reconnects: int, max_size: int = None) -> None:
        
        """Initializes the websocket connector.
        
        Args:
            websocket_url (str):
                A string, which specifies the address to the websocket.
            max_reconnects (int):
                An integer, which is the maximum allowed number of reconnects.
            max_size (int):
                An integer, which limits the size of the message buffer from the websocket connector.
        
        Returns:
            None
        
        Raises:
            None
        """
        
        self._websocket_url: str = websocket_url
        self._websocket_connection: websockets.WebSocketClientProtocol
        self._max_reconnects: int = max_reconnects
        self._max_size: int = max_size
    
    async def create_connection(self) -> websockets.WebSocketClientProtocol:
        
        """Creates a connection to the websocket over the given address.
        
        Creates a connection to the websocket over the given adress. The method will try to connect to the websocket until the maximum amount of reconnects is reached or the connection attempt was successful.
        
        Args:
            None
        
        Returns:
            The new connection will be returned, which is a websocket.WebSocketClientProtocol object.
        
        Raises:
            websockets.exceptions.ConnectionClosed, OSError, websockets.exceptions.InvalidHandshake:
                This exception will be raised, if, ater reaching the maximum amount of reconnects, the connection attempt was still not successful.
        """
        
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
        
        """Closes the connection to the websocket.
        
        Closes the connection to the websocket, if the connection exists. Otherwise it does nothing.
        
        Args:
            reason (str) = "":
                A string, which specifies the reason for the connection to be closed. It gets passed with the close command.
            code (int) = 1000:
                An integer, which specifies the close code. It gets passed with the close command.
        
        Returns:
            None
            
        Raises:
            None
        """
        
        if self._websocket_connection:
            await self._websocket_connection.close(reason=reason, code=code)
                       
    async def receive_message(self) -> None:
        
        """Receives messages from the websocket.
        
        Receives messages from the websocket and passes them into a given parser function.
        
        Args:
            None
        
        Returns:
            It yields every message, so it can be consumed by a for loop.
        
        Raises:
            None
        """
        
        if self._websocket_connection:
            while True:
                message = await self._websocket_connection.recv()
                yield message
        
    async def subscribe(self, message: dict) -> Union[str, bytes]:
        
        """Sends messages through the websocket.
        
        Sends messages through the websocket. The messages gets passed to the method.
        
        Args:
            message (dict):
                A dictionary, which represents the subscription message that should be send through the websocket.
        
        Returns:
            None
        
        Raises:
            None
        """
        
        await self._websocket_connection.send(json.dumps(message))
        response = await self._websocket_connection.recv()
        return response
        
class Api_connector:
    
    """The connector for an api.
    
    The connector makes a request to the given url and passes the result into a parser function.
    
    Attributes:
        url (str):
            A string, which represents the url, to which the request should be made.
        parameter (Dict[str, str]):
            A dictionary, which holds optional parameters in it, which are passed with the url.
        timeout (int):
            An integer, which specifies the timeout for each request attempt.
    """
    
    def __init__(self, url: str, parameter: Dict[str, str], timeout: int) -> None:
        
        """Initializes the Api_connector.
        
        Args:
            url (str):
                A string, which represents the url, to which the request should be made.
            parameter (Dict[str, str]):
                A dictionary, which holds optional parameters in it, which are passed with the url.
            timeout (int):
                An integer, which specifies the timeout for each request attempt.
        
        Returns:
            None
        
        Raises:
            None
        """
        
        self._url: str = url
        self._session: aiohttp.ClientSession
        self._response: str
        self._status: Union[str, int]
        self._params: Dict[str, str] = parameter
        self._timeout: aiohttp.ClientTimeout = aiohttp.ClientTimeout(total=timeout)
    
    async def create_session(self) -> None:
        
        """Creates a new session.
        
        Creates a new session for making new http-requests. The session is represented by a aiohttp.ClientSession() object.
        
        Args:
            None
        
        Returns:
            None
        
        Raises:
            None
        """
        
        self._session = aiohttp.ClientSession(timeout=self._timeout)
    
    async def make_request(self) -> str:
        
        """Makes a request, with the given url and parameters.
        
        Makes a request, with the given url and parameters. The response is divided into the statuscode and response text, where the text gets returned.
        
        Args:
            None
        
        Returns:
            It returns the response text.
        
        Raises:
            None
        """
        
        async with self._session.get(self._url, params=self._params) as response:
            self._status = response.status
            self._response = await response.text()
            return self._response
            
    async def close_session(self) -> None:
        
        """Closes the session.
        
        Closes the session, when nor more rquests are made.
        
        Args:
            None
        
        Returns:
            None
        
        Raises:
            None
        """
        
        await self._session.close()
        
class File_connector:
    
    """Reads from a file.
    
    Reads data from a file and returns it. It has only a classmethod for reading a file.
    
    Attributes:
        None
    """
    
    @staticmethod
    async def read_file(file_path: str) -> None:
        
        """Reads from file.
        
        Reads from file at the given path and returns the data.
        
        Args:
            file_path (str):
                A string representing the path to the file.
        
        Returns:
            The data from the file is returned as a result.
            
        Raises:
            None
        """
        
        async with aiofiles.open(file_path, "r") as file:
            content= await file.read()
            return content