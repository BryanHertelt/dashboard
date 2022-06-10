#Imports 
###LOGGER_NAME muss noch festgelegt werden###

import psycopg2
import logging
from psycopg2 import OperationalError, ProgrammingError


class Database_connector:
    
    '''Connects to database'''
    
    def __init__(self,connection_string: str): 
        self._connection_string = connection_string
        self.cursor = None
        self.connection = None
        self.logger = logging.getLogger("LOGGER_NAME")
        self.logger.debug("Database_connector initialized.")
    
    def connect(self): #Establish connection and returns cursor
        try:
            self.connection = psycopg2.connect(self._connection_string)
        except OperationalError as error:
            self.logger.exception("Connection to database failed.")
            raise
        else:
            self.cursor = self.connection.cursor()
            self.logging.debug("Connection to database established.")
    
    def write(self, query_statement: str, data: list): #Write query statement
        if self.cursor != None:
            try:
                psycopg2.execute_value(self.cursor, query_statement, data)
            except ProgrammingError as error:
                self.logger.exception("Cannot execute query statement")
                self.cursor.rollback()
                raise
            else:
                self.cursor.commit()
                self.logger.debug("Executed query statement.")
     
    def close_connection(self): #Closes connection.
        if self.connection != None:
            self.connection.close()
            self.logger.info("Connection closed.")

#Redis Connectors
class Message_broker_connector:
    
    def __init__(self, connection_string):
        pass
