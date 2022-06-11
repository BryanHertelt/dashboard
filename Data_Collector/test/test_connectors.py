import unittest
import psycopg2

from src.connectors import Database_connector, Message_broker_connector

def test_Database_connector():
    db = Database_connector("host=localhost dbname=test user=postgres port=5433 password=root")
    db.connect()
    db.close_connection()

def test_Message_broker_connector():
    mb = Message_broker_connector({"host": "localhost", "port": 6379})
    mb.connect()
    mb.connection.ping()