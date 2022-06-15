import logging
import websockets
import asyncio
import psycopg2
from psycopg2 import OperationalError, ProgrammingError

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
        except OperationalError as error:
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
            except ProgrammingError as error:
                self._logger.exception("Cannot execute query statement")
                self.cursor.rollback()
                raise
            else:
                self.cursor.commit()
                self._logger.debug("Executed query statement.")
     
    def close_connection(self):
        
        '''This function closes the connection to  the database.'''
        
        if self.connection != None:
            self.connection.close()
            self._logger.info("Connection closed.")

import redis

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
        except redis.RedisError as error:
            self._logger.exception("Messagebroker connect failed.")
            raise
        else:
            self._logger.debug("Messagebroker connect succeeded.")
    
    def write(self, data: list, source: str):
        
        '''This function executes the query statement.'''
        
        try:
            pipeline = self.connection.pipeline()
        except redis.RedisError as error:
            self._logger.exception("Messagebroker write failed.")
            raise
        else:
            self._logger.debug("Messagebroker write succeeded.")
        for item in data:
            pipeline.publish(source + item[0], item[1])
        try:
            pipeline.execute()
        except redis.RedisError as error:
            self._logger.exception("Pipeline execute failed.")
            raise
        else:
            self._logger.debug("Write succeeded.")
            
class Websocket_connector:
    
    '''Object for websocket connections and operations.'''
    
    def __init__(self, websocket_url: str):
        self._websocket_url = websocket_url
    
    async def create_connection(self):
        
        '''This function creates a websocket connection.'''
        
        async for websocket in websockets.connect(self._websocket_url):
            try:
                self.receive(websocket)
            except websockets.ConnectionClose as error:
                #Log error
                continue
            except websockets.InvalidHandshake as error:
                #Log error
                raise
            except websockets.InvalidState as error:
                #Log error
                raise
    
    async def receive(self, websocket):
        
        '''This function handles every message received from the websocket.'''
        
        async for message in websocket:
           print(message) ###SEND DATA TO PARSER###
    
    def connect(self):
        
        '''This function creates the connection and connect the handler with the websocket.'''
        
        asyncio.run(self.create_connection())