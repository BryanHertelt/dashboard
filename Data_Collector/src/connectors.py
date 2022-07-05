import logging
from pytest import param
import redis
import websockets
import json
import asyncpg
import asyncio
import aiohttp

from redis import asyncio as aioredis

class Database_connector:
    
    '''Object for database connections and operations.'''
    
    def __init__(self, connection_string: str, max_reconnects: int) -> None: 
        
        '''Initialize the Database_connector object.''' 
        
        self._connection_string = connection_string
        self._cursor = None
        self._connection = None
        self._logger = logging.getLogger("connectors")
        self._max_reconnects = max_reconnects
    
    async def connect(self) -> None: 
        
        '''This function connects to the database.'''
        for count in range(self._max_reconnects+1):
            try:
                self._connection = await asyncpg.connect(self._connection_string)
            except (asyncpg.PostgresError, OSError) as error:
                exception = error
                await asyncio.sleep(count)
                continue
            else:
                return
        raise exception
    
    async def write(self, query_statement: str, data: list, table: str) -> None: 
        
        '''This function executes the query statement.'''
        
        if self._connection != None:
            args_str = ",".join("('%s', '%s', '%s')" %(coin, price, volume) for (coin, price, volume) in data)
            await self._connection.execute(query_statement.format(table=table) + args_str)

    async def close_connection(self) -> None: 
        
        '''This function closes the connection to  the database.'''
        
        if self._connection != None:
            await self._connection.close()

class Message_broker_connector:
    
    ''' Object for message broker connections and operations.'''
    
    def __init__(self, instance_url: str, max_reconnects: int) -> None:
        self._instance_url = instance_url
        self._connection = None
        self._max_reconnects = max_reconnects
       
    async def connect(self) -> None:
        
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
                return
        raise exception
    
    async def write(self, data: list, source: str) -> None:
        
        '''This function executes the query statement.'''
        
        async with self._connection.pipeline() as pipeline:
            for item in data:
                await pipeline.publish(source + item[0], item[1])
            
class Websocket_connector:
    
    '''Object for websocket connections and operations.'''
    
    def __init__(self, websocket_url: str, max_reconnects: int, max_size: int = None) -> None:
        self._websocket_url = websocket_url
        self._websocket_connection = None
        self._max_reconnects = max_reconnects
        self._max_size = None
    
    async def create_connection(self) -> None:
        
        '''This function creates a websocket connection.'''
        
        for count in range(self._max_reconnects+1):
            try:
                self._websocket_connection = await websockets.connect(self._websocket_url)
            except (websockets.exceptions.ConnectionClosed, OSError, websockets.exceptions.InvalidHandshake) as error:
                exception = error
                await asyncio.sleep(count)
                continue
            else:
                return
        raise exception 
            
    async def close_connection(self, reason: str = "", code: int = 1000) -> None:
        
        '''This function closes the websocket connection.'''
        
        if self._websocket_connection:
            await self._websocket_connection.close(reason=reason, code=code)
            self._logger.info("Websocket connection closed.")
                       
    async def receive_message(self, parser_func) -> None:
        
        '''This function handles every message received from the websocket.'''
        
        if self._websocket_connection:
            while True:
                message = await self._websocket_connection.recv()
                parser_func(message)
        
    async def send_message(self, message: str) -> None:
        
        '''This function sends messages to the websocket'''
        
        await self._websocket_connection.send(json.dumps(message))
        
class Api_Connector:
    
    def __init__(self, url: str, parameter: dict):
        
        ''' This function initializes the Api_Connector.'''
        
        self._session = None
        self._response = None
        self._url = url
        self._status = None
        self._params = parameter
    
    async def create_session(self):
        
        '''This function creates a new session.'''
        
        self._session = aiohttp.ClientSession()
    
    async def make_request(self):
        
        '''This function creates a new request.'''
        
        async with self._session.get(self._url, params=self._params) as response:
            self._status = response.status
            self._response = await response.text()
    
    async def close_session(self):
        
        '''This function closes the session.'''
        
        await self._session.close()