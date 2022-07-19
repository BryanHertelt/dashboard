import psycopg2
import redis
import time
import websockets
import asyncio
import json

from src.connectors import Database_connector, Message_broker_connector, Websocket_connector, Api_connector, File_connector

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
    mb = Message_broker_connector("redis://localhost", 3)
    await mb.connect()
    await mb._connection.ping()
    data = [("BTC", 1000), ("ETH", "190")]
    await mb.write(data, "X")

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
    dataset = [("BTC", str(x)) for x in range(10)]
    source = "X"
    #dataset = [("btc", 42)]
    r = redis.Redis(host="localhost", port="6379")
    r.publish("btc", 100)
    pipeline = r.pipeline()
    start = time.time()
    for item in dataset:
        pipeline.publish(source + item[0], item[1])
    pipeline.execute()
    end = time.time()
    print(end - start)

#test_redis_bench()

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
        "wss://stream.binance.com:9443/ws", 6, 2**60)
    await connector.create_connection()
    response = await connector.subscribe({
        "method": "SUBSCRIBE",
        "params":
        [
            "btcusdt@aggTrade"
        ],
        "id": 1
    })
    print(response)
    await connector.close_connection()
    #await connector.send_message("Test")
    #async for message in connector.receive_message():
        #print(message)
    #await connector.receive_message(prin)
    #sleep(2)
    #await connector.close_connection()
    #print("Connection closed.")

#asyncio.run(test_Websocket_connector())

async def test_Websocket_endpoint():
    websocket = await websockets.connect("wss://api.gemini.com/v1/marketdata/BTCUSD", max_size = 2 ** 60)
    while True:
        message = await websocket.recv()
        prin(message)

#asyncio.run(test_Websocket_endpoint())

async def test_Api_connector():
    connector = Api_connector({}, 2)
    await connector.create_session()
    for i in range(10):
        response = await connector.make_request("https://api1.binance.com/api/v3/time", {})
        print(type(response))
        await asyncio.sleep(0.5)
    await connector.close_session()
    
#asyncio.run(test_Api_connector())

async def test_File_connector():
    content = await File_connector.read_file("test_files/test.txt")
    print(content)

#asyncio.run(test_File_connector())

async def test_Websocket_subscribe():
    connection = await websockets.connect("wss://stream.binance.com:9443/ws", ssl=True)
    await connection.send(json.dumps({
        "method": "SUBSCRIBE",
        "params":
        [
            "btcusdt@aggTrade",
            "btcusdt@depth"
        ],
        "id": 1
    }))
    while True:
        response = await connection.recv()
        print(response)

#asyncio.run(test_Websocket_subscribe())

async def test_database_exceptions():
    connector = Database_connector("postgres://postgres:password@localhost:5432/benchmark", 3)
    await connector.connect()
    time.sleep(5)
    await connector.write("INSERT INTO {table} (coin, price, volume) VALUES ", [
                    ("100", "a", "a") for x in range(50000)], "test_table")
    
#asyncio.run(test_database_exceptions())

async def test_message_broker_exceptions():
    connector = Message_broker_connector("redis://localhost", 3)
    await connector.connect()
    time.sleep(5)
    data = [("BTC", 1000), ("ETH", "190")]
    await connector.write(data, "X")

#asyncio.run(test_message_broker_exceptions())

async def test_websocket_exceptions():
    connector = Websocket_connector("ws://locahlhost:8001", 3, 2**60)
    await connector.create_connection()
    time.sleep(5)
    await connector.subscribe("Test")
    
asyncio.run(test_websocket_exceptions())