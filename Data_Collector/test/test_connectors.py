import psycopg2
import time

from src.connectors import Database_connector, Message_broker_connector

def test_Database_connector():
    db = Database_connector("host=localhost dbname=test user=postgres port=5433 password=root")
    db.connect()
    db.close_connection()

def test_Message_broker_connector():
    mb = Message_broker_connector({"host": "localhost", "port": 6379})
    mb.connect()
    mb.connection.ping()
    
def test_db_bench():
    TABLE_NAME = "prices"
    CONNECTION = "postgres://postgres:password@localhost:5432/benchmark"
    dataset = [("coin", x) for x in range(50000,100001) ]

    with psycopg2.connect(CONNECTION) as conn:
        cursor = conn.cursor()
        reset_query = "DROP TABLE prices;"
        cursor.execute(reset_query)
        conn.commit()
        create_table = "CREATE TABLE prices (name VARCHAR(50),price INT);"
        cursor.execute(create_table)
        conn.commit()
        start = time.time()
        args_str = ",".join("('%s', '%s')" % (x, y) for (x, y) in dataset)
        cursor.execute("INSERT INTO {table} VALUES".format(
        table=TABLE_NAME) + args_str)
        conn.commit()
        
        end = time.time()
        
    print(end - start)