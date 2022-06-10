import unittest
import psycopg2

from src.connectors import Database_connector, Message_broker_connector

def test_Database_connector():
    db = Database_connector("test")
    db.connect()

def test_Message_broker_connector():
    mb = Message_broker_connector({"host": "localhost"})
    mb.connect()
    pass