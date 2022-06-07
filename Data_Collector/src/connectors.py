#Imports 
import psycopg2

#Database Connector
class Database_connector:
    
    def __init__(self,connections_string): 
        self._connections_string = connections_string
        self.cursor = None
        self.connection = None
    
    def connect(self): #Establish connection and returns cursor
        try:
            self.connection = psycopg2.connect(self._connections_string)
        except Exception as e:
            #### Log e
            raise
        else:
            self.cursor = self.connection.cursor()
    
    def write(self, query_statement, data):
        if self.cursor != None:
            try:
                psycopg2.execute_value(self.cursor, query_statement, data)
            except Exception as e:
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
