import logging

import redis
import websockets
import asyncio
import psycopg2
import json

class Database_connector:
    
    '''Object for database connections and operations.'''
    
    def __init__(self,connection_string: str):
        
        '''Initialize the Database_connector object.''' 
        
        self._connection_string = connection_string
        self.cursor = None
        self.connection = None
        self._logger = logging.getLogger("connectors")
        self._logger.debug("Database_connector initialized.")
    
    def connect(self):
        
        '''This function connects to the database.'''
        
        try:
            self.connection = psycopg2.connect(self._connection_string)
        except psycopg2.OperationalError:
            self._logger.exception("Connection to database failed.")
            raise
        else:
            self.cursor = self.connection.cursor()
            self._logger.info("Connection to database succeeded.")
    
    def write(self, query_statement: str, data: list, table: str):
        
        '''This function executes the query statement.'''

        if self.cursor != None:
            args_str = ",".join("('%s', '%s', '%s')" % (coin, price, volume) for (coin, price, volume) in data)
            try:
                self.cursor.execute(query_statement.format(table=table + args_str) )
            except psycopg2.ProgrammingError:
                self._logger.exception("Cannot execute query statement")
                self.cursor.rollback()
                self._loggger.warn("Rollback of query statement executed.")
                raise
            else:
                self.cursor.commit()
                self._logger.debug("Executed query statement.")
     
    def close_connection(self):
        
        '''This function closes the connection to  the database.'''
        
        if self.connection != None:
            self.connection.close()
            self._logger.info("Connection closed.")

class Message_broker_connector:
    
    ''' Object for message broker connections and operations.'''
    
    def __init__(self, connection_string: dict):
        self._connection_string = connection_string
        self.connection = None
        self._logger = logging.getLogger("connectors")
        self._logger.debug("Message_broker_connector initialized.")
       
    def connect(self):
        
        '''This function connects to message broker.'''
        
        try:
            self.connection = redis.Redis(
                host=self._connection_string["host"],
                port=self._connection_string["port"],
                password=self._connection_string["password"],
            )
        except redis.RedisError:
            self._logger.exception("Messagebroker connect failed.")
            raise
        else:
            self._logger.debug("Messagebroker connect succeeded.")
    
    def write(self, data: list, source: str):
        
        '''This function executes the query statement.'''
        
        try:
            pipeline = self.connection.pipeline()
        except redis.RedisError:
            self._logger.exception("Messagebroker write failed.")
            raise
        else:
            self._logger.debug("Messagebroker write succeeded.")
        for item in data:
            pipeline.publish(source + item[0], item[1])
        try:
            pipeline.execute()
        except redis.RedisError:
            self._logger.exception("Pipeline execute failed.")
            raise
        else:
            self._logger.debug("Write succeeded.")
            
class Websocket_connector:
    
    '''Object for websocket connections and operations.'''
    
    def __init__(self, websocket_url: str, max_reconnects: int):
        self._websocket_url = websocket_url
        self._websocket_connection = None
        self._max_reconnects = max_reconnects
        self._logger = logging.getLogger("connectors")
        self._logger.debug("Websocket_connector initialized.")
    
    async def create_connection(self):
        
        '''This function creates a websocket connection.'''
        
        try:
            self._websocket_connection = await websockets.connect(self._websocket_url)
        except websockets.exceptions.ConnectionClose:
            self._logger.exception("Websocket connection closed.")
            self.reconnect()#Reconnect
            raise
        except websockets.exceptions.InvalidHandshake:
            self._logger.exception("Handshake with websocket failed.")
            self.reconnect()#Reconnect
            raise
        except websockets.exceptions.InvalidURI:
            self._logger.exception("Invalid websocket uri.")
            raise 
    
    def reconnect(self):
        for _ in range(self._max_reconnects):
            try:
                self.create_connection()
            except websockets.exceptions.ConnectionClosed:
                self._logger.exception("Reconnecting failed.")
                continue
            except Exception:
                self._logger.exception(
                    "Error when trying to reconnect to the websocket.")
                raise
            else:
                return
               
    
    
    async def close_connection(self, reason: str ="", code: int = 1000):
        
        '''This function closes the websocket connection.'''
        if self._websocket_connection:
            await self._websocket_connection.close(reason=reason, code=code)
            self._logger.info("Websocket connection closed.")
            
            
    async def _message_handler(self, parser_func):
        
        '''This function handles every message received from the websocket.'''
        
        if self._websocket_connection:
            while True:
                try:
                    message = await self._websocket_connection.recv()
                except websockets.exceptions.ConnectionClose:
                    self.reconnect()#Reconnect
                    self._logger.exception("Websocket connection closed.")
                    pass
                except websockets.exceptions.RuntimeError:
                    self._logger.exception("Recv() method was called, from the event loop, in the same moment")
                    raise
                parser_func(message)
    
    def receive_message(self):
        
        '''This function creates the connection and connect the message handler with the websocket.'''
        
        asyncio.run(self._message_handler())
        
    async def send_message(self, message: str):
        
        '''This function sends messages to the websocket'''
        
        try:
            await self._websocket_connection.send(json.dumps(message))
        except websockets.exceptions.ConncetionClosed:
            self._logger.exception("Websocket connection closed.")
            self.reconnect()#Reconnect
        except websockets.exceptions.TypeError:
            self._logger.exception("Message type is not accepted.")
            raise
        except TypeError:
            self._logger.exception("Failed to convert message to json.")
            raise