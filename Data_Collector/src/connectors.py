# Imports
import psycopg2
from psycopg2 import OperationalError

# Database Connector
class Database_connector:
    
    def __init__(self,connections_string): 
        self._connections_string = connections_string
        self.cursor = None
        self.connection = None
    
    def get_cursor(self): # Establish connection and returns cursor
        try:
            self.connection = psycopg2.connect(self._connections_string)
        except Exception as error:
            #Logging
            pass
            self._connection = None
        try:   
            self.cursor = self.connection.cursor()
        except Exception as error:
            #Logging
            pass
        return self.cursor
     
    def close_connection(self): # Closes connection.
        if self.connection != None:
            try:
                self.connection.close()
            except Exception as error:
                #Logging
                pass
        else:
            #Logging
            pass

db = Database_connector("host=localhost user=postgres password=password dbname=example port=5432")
cursor = db.get_cursor()
cursor.execute("CREATE TABLE xejsflghjgsjef (id SERIAL PRIMARY KEY, type VARCHAR(50), location VARCHAR(50));")
db.connection.commit()
db.close_connection()