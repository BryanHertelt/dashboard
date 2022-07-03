import logging
import redis
import websockets
import psycopg2
import json
import asyncio

from time import sleep

class Database_connector: ###ASYNC IMPLEMENTATION MISSING###
    
    '''Object for database connections and operations.'''
    
    def __init__(self, connection_string: str, max_reconnects: int) -> None: 
        
        '''Initialize the Database_connector object.''' 
        
        self._connection_string = connection_string
        self.cursor = None
        self.connection = None
        self._logger = logging.getLogger("connectors")
        self._max_reconnects = max_reconnects
    
    async def connect(self) -> None:
        
        '''This function connects to the database.'''
        for count in range(self._max_reconnects+1):
            try:
                self.connection = psycopg2.connect(self._connection_string)
            except psycopg2.OperationalError as error:
                exception = error
                sleep(count)
                continue
            else:
                return
        raise exception
    
    async def write(self, query_statement: str, data: list, table: str) -> None: 
        
        '''This function executes the query statement.'''
        
        if self.cursor != None:
            args_str = ",".join("('%s', '%s', '%s')" %(coin, price, volume) for (coin, price, volume) in data)
            self.cursor.execute(query_statement.format(table=table + args_str))
            self.cursor.commit()

    async def close_connection(self) -> None: 
        
        '''This function closes the connection to  the database.'''
        
        if self.connection != None:
            self.connection.close()

class Message_broker_connector:
    
    ''' Object for message broker connections and operations.'''
    
    def __init__(self, connection_string: dict, max_reconnects: int) -> None:
        self._connection_string = connection_string
        self.connection = None
        self._logger = logging.getLogger("connectors")
        self._logger.debug("Message_broker_connector initialized.")
        self._max_reconnects = max_reconnects
       
    def connect(self) -> None:
        
        '''This function connects to message broker.'''
        
        for count in range(self._max_reconnects+1):
            try:
                self.connection = redis.Redis(
                    host=self._connection_string["host"],
                    port=self._connection_string["port"],
                    password=self._connection_string["password"],
                )
            except redis.RedisError as error:
                exception = error
                sleep(count)
                continue
            else:
                return
        raise exception
    
    def write(self, data: list, source: str) -> None:
        
        '''This function executes the query statement.'''
        
        pipeline = self.connection.pipeline()
        for item in data:
            pipeline.publish(source + item[0], item[1])
        pipeline.execute()
            
class Websocket_connector:
    
    '''Object for websocket connections and operations.'''
    
    def __init__(self, websocket_url: str, max_reconnects: int) -> None:
        self._websocket_url = websocket_url
        self._websocket_connection = None
        self._max_reconnects = max_reconnects
    
    async def create_connection(self) -> None:
        
        '''This function creates a websocket connection.'''
        
        for count in range(self._max_reconnects+1):
            try:
                self._websocket_connection = await websockets.connect(self._websocket_url)
            except (websockets.exceptions.ConnectionClosed, OSError, websockets.exceptions.InvalidHandshake) as error:
                exception = error
                sleep(count)
                continue
            else:
                return
        raise exception 
            
    async def close_connection(self, reason: str = "", code: int = 1000) -> None:
        
        '''This function closes the websocket connection.'''
        
        if self._websocket_connection:
            await self._websocket_connection.close(reason=reason, code=code)
            self._logger.info("Websocket connection closed.")
                       
    async def _message_handler(self, parser_func) -> None:
        
        '''This function handles every message received from the websocket.'''
        
        if self._websocket_connection:
            while True:
                message = await self._websocket_connection.recv()
                parser_func(message)
    
    async def receive_message(self, parser_func) -> None:
        
        '''This function creates the connection and connect the message handler with the websocket.'''
        
        await self._message_handler(parser_func)
        
    async def send_message(self, message: str) -> None:
        
        '''This function sends messages to the websocket'''
        
        await self._websocket_connection.send(json.dumps(message))