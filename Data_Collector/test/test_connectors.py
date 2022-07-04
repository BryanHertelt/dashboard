import psycopg2
import redis
import time
import websockets
import asyncio

from time import sleep
from src.connectors import Database_connector, Message_broker_connector, Websocket_connector

async def test_Database_connector():
    db = Database_connector(
        "postgres://postgres:password@localhost:5432/benchmark", 3)
    await db.connect()
    start = time.time()
    await db.write("INSERT INTO {table} (coin, price, volume) VALUES ", [("100", "a", "a") for x in range(50000)], "test_table")
    print(time.time()-start)
    await db.close_connection()

#asyncio.run(test_Database_connector())

async def test_Message_broker_connector():
    mb = Message_broker_connector("redis: // localhost", 3)
    await mb.connect()
    data = [("BTC", "1000"), ("ETH", "190")]
    await mb.write(data, "BINANCE")

#asyncio.run(test_Message_broker_connector())

def test_db_bench():
    TABLE_NAME = "prices"
    CONNECTION = "postgres://postgres:password@localhost:5432/benchmark"
    dataset = [("coin", x) for x in range(50000, 100001)]

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

#test_db_bench()
    
def test_redis_bench():
    dataset = [("coin", x) for x in range(50000, 1000010)]
    r = redis.Redis(host="localhost", port="6379")
    pipeline = r.pipeline()
    start = time.time()
    for item in dataset:
        pipeline.publish(str(item), str(item))
    pipeline.execute()
    end = time.time()
    print(end - start)
    

async def handler(websocket):
    async for message in websocket:
        print(message)

async def main():
    async with websockets.connect("wss://api.gemini.com/v1/marketdata/BTCUSD") as websocket:
        await handler(websocket)
#asyncio.run(main())

def prin(message):
    print(message)
    
async def test_Websocket_connector():
    connector =  Websocket_connector(
        "ws://localhost:8001", 4)
    await connector.create_connection()
    #await connector.receive_message(prin)
    sleep(2)
    await connector.close_connection()
    print("Connection closed.")

async def test_Websocket_endpoint():
    websocket = await websockets.connect("ws://localhost:8001")
    while True:
        message = await websocket.recv()
        prin(message)

#asyncio.run(test_Websocket_connector())