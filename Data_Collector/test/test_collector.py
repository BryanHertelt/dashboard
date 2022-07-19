import json
import asyncio
import time

from src.collector import Websocket_collector, Api_collector
from src.connectors import Websocket_connector, Api_connector, Message_broker_connector, Database_connector
from src.parser import Parser

class Wss_parser(Parser):
    
    @staticmethod
    def parse(data: str):
        parsed_data = json.loads(data)
        return [(parsed_data[0][0], str(parsed_data[0][1]), str(parsed_data[0][2]))]

async def test_Websocket_collector():
    collector = Websocket_collector(
        Wss_parser(), Message_broker_connector("redis://localhost:6379", 3), Database_connector("postgres://postgres:password@localhost:5432/benchmark", 3), Websocket_connector("ws://localhost:8001", 6, 2**60))
    await collector.setup()
    await collector.collect("INSERT INTO {table} (name, price, volume) VALUES ", "test_table", "TEST")

#asyncio.run(test_Websocket_collector())

class Api_parser(Parser):
    
    @staticmethod
    def parse(data: str):
        parsed_data = data
        return [("BTC", "187", "187")]
    
async def test_Api_collector():
    collector = Api_collector(Api_parser(), Message_broker_connector(
        "redis://localhost:6379", 3), Database_connector("postgres://postgres:password@localhost:5432/benchmark", 3), Api_connector(2))
    await collector.setup()
    await collector.collect("INSERT INTO {table} (name, price, volume) VALUES ", "test_table", "TEST", 1, "https://api1.binance.com/api/v3/time", {})

#asyncio.run(test_Api_collector())

async def test_time_controller():
    connector = Api_connector("https://api1.binance.com/api/v3/time", {}, 2)
    await connector.create_session()
    difference = 0
    while True:
        itera = time.time()
        start_time = time.time()
        await connector.make_request()
        difference = 0 if (time.time() - start_time) > 1 else (1 - (time.time() - start_time))
        print("Call: ", time.time() - start_time)
        print("Sleep: ", difference)
        time.sleep(difference)
        print("Loop: ", time.time() - itera)

#asyncio.run(test_time_controller())

class Test:
    
    def __init__(self):
        self.collector = Websocket_collector(
            Wss_parser(), Message_broker_connector("redis://localhost:6379", 3), Database_connector("postgres://postgres:password@localhost:5432/benchmark", 3), Websocket_connector("ws://localhost:8001", 6, 2**60))
        
    async def start(self):
        await self.collector.setup()
        
    async def sleep(self):
        time.sleep(10)
        
    async def shutdown(self):
        print("Shutdown")

async def test_shutdown():
    test = Test()
    try:
        await test.start()
        await test.sleep()
    except Exception as e:
        print("Error")
    finally:
        await test.shutdown()

#asyncio.run(test_shutdown())

async def test_exception_handling():
    collector = Websocket_collector(
        Wss_parser(), Message_broker_connector("redis://localhost:6379", 3), Database_connector("postgres://postgres:password@localhost:5432/benchmark", 5), Websocket_connector("ws://localhost:8001", 6, 2**60))
    await collector.setup()
    #await collector._write("INSERT INTO {table} (name, price, volume) VALUES ", [
                    #("XRP", "100", "100") for x in range(5)], "test_table")
    print("Sleep!")
    time.sleep(5)
    while True:
        data = [("BB", 3672), ("ETH", "190")]
        await collector._publish(data, "X")
        time.sleep(1)

#asyncio.run(test_exception_handling())