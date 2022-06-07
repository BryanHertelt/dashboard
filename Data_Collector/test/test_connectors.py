import unittest
import psycopg2

from src.connectors import Database_connector

def test_Database_connector():
    string = "dbname=crypto user=postgres password=password port=5432"
    db = Database_connector(string)
    print(db.connect())
    db.cursor.excetute("CREATE TABLE test (id INTEGER, name VARCHAR(255) NOT NULL")
    db.write("INSERT INTTO TABLE test (p1, p2) VALUES (%s, %s)", [1, "nick"])
    db.close_connection()
    
test_Database_connector()