###LOGGER_NAME muss noch festgelegt werden###

import psycopg2
import redis
import logging
from psycopg2 import OperationalError, ProgrammingError

class Database_connector:
    
    '''Object for database connections and operations.'''
    
    def __init__(self,connection_string: str):
        
        '''Initialize the Database_connector object.''' 
        
        self._connection_string = connection_string
        self.cursor = None
        self.connection = None
        self._logger = logging.getLogger("LOGGER_NAME")
        self._logger.debug("Database_connector initialized.")
    
    def connect(self):
        
        '''Connects to the database.'''
        
        try:
            self.connection = psycopg2.connect(self._connection_string)
        except OperationalError as error:
            self._logger.exception("Connection to database failed.")
            raise
        else:
            self.cursor = self.connection.cursor()
            self._logger.info("Connection to database succeeded.")
    
    def write(self, query_statement: str, data: list):
        
        '''Executes query statement.'''
        
        if self.cursor != None:
            try:
                psycopg2.execute_value(self.cursor, query_statement, data)
            except ProgrammingError as error:
                self._logger.exception("Cannot execute query statement")
                self.cursor.rollback()
                raise
            else:
                self.cursor.commit()
                self._logger.debug("Executed query statement.")
     
    def close_connection(self):
        
        '''Closes connection to database.'''
        
        if self.connection != None:
            self.connection.close()
            self._logger.info("Connection closed.")

class Message_broker_connector:
    
    ''' Object for message broker connections and operations.'''
    
    def __init__(self, connection_string: dict):
        self._connection_string = connection_string
        self.connection = None
        self.logger = logging.getLogger("LOGGER_NAME")
        self._logger = logging.getLogger("LOGGER_NAME")
        self._logger.debug("Message_broker_connector initialized.")
       
    def connect(self):
        
        '''Connects to message broker.'''
        
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
    
    def write(self, data: list):
        
        '''Executes query statement.'''
        
        try:
            pipeline = self.connection.pipeline()
        except redis.RedisError as error:
            self._logger.exception("Messagebroker write failed.")
            raise
        else:
            self._logger.debug("Messagebroker write succeeded.")
        for item in data:
            pipeline.hsmet(item)                   ###Change to right command###
        pipeline.execute()
        self._logger.debug("Write succeeded.")