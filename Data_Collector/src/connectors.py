#Imports 
import psycopg2
from psycopg2 import OperationalError, ProgrammingError


#Database Connector
class Database_connector:
    
    def __init__(self,connection_string): 
        self._connection_string = connection_string
        self.cursor = None
        self.connection = None
    
    def connect(self): #Establish connection and returns cursor
        try:
            self.connection = psycopg2.connect(self._connection_string)
        except OperationalError as error:
            #### Log e
            raise
        else:
            self.cursor = self.connection.cursor()
    
    def write(self, query_statement, data):
        if self.cursor != None:
            try:
                psycopg2.execute_value(self.cursor, query_statement, data)
            except ProgrammingError as error:
                #### Log e
                self.cursor.rollback()
                raise
            else:
                self.cursor.commit()
     
    def close_connection(self): #Closes connection.
        if self.connection != None:
            self.connection.close()

#Redis Connectors
class Message_broker_connector:
    
    def __init__(self, connection_string):
        pass
