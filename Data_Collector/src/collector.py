import asyncio

from .connectors import Message_broker_connector, Database_connector, Websocket_connector, Api_connector
from .parser import Parser
from typing import Type

class Collector:
    def __init__(self, parser: Type[Parser], message_broker: Message_broker_connector,
                 database: Database_connector):
        self._mb: Message_broker_connector = message_broker
        self._db: Database_connector = database
        self._parser: Type[Parser] = parser
        
    async def setup(self):
        await asyncio.gather(
            self._mb.connect(),
            self._db.connect(),
        )

    async def _write(self, data):
        await self._db.write("INSERT INTO {table} (name, price, volume) VALUES ", data, "test_table")
    
    async def _publish(self, data):
        await self._mb.write(data, "X")
    
    async def collect(self):
        raise NotImplementedError

class Websocket_collector(Collector):
    
    def __init__(self, parser: Type[Parser], message_broker: Message_broker_connector, 
                 database: Database_connector , connector: Websocket_connector):
        super().__init__(parser, message_broker, database)
        self._connector: Websocket_connector = connector
    
    async def setup(self, subscription_message: str = None):
        await super().setup()
        await self._connector.create_connection()
        if subscription_message != None:
            response = await self._connector.subscribe(subscription_message)
            return response
    
    async def collect(self):
        async for message in self._connector.receive_message():
             data = self._parser.parse(message)
             print(data)
             await asyncio.gather(self._write(data), self._publish(data))

class Api_collector(Collector):
    
    def __init__(self, parser: Type[Parser], message_broker: Message_broker_connector, 
                 database: Database_connector, connector: Api_connector):
        super().__init__(parser, message_broker, database)
        self._connector: Api_connector = connector
    
    async def setup(self):
        await super().setup()
        await self._connector.create_session()
    
    async def collect(self):
        for i in range(10):
            response = await self._connector.make_request()
            data = self._parser.parse(response)
            await asyncio.gather(self._write(data), self._publish(data))
            await asyncio.sleep(1)