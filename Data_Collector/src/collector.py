import asyncio
import time

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

    async def _write(self, query_statement, data, table):
        await self._db.write(query_statement, data, table)
    
    async def _publish(self, data, source):
        await self._mb.write(data, source)
    
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
    
    async def collect(self, query_statement, table, source):
        async for message in self._connector.receive_message():
             data = self._parser.parse(message)
             await asyncio.gather(self._write(query_statement, data, table), self._publish(data, source))

class Api_collector(Collector):
    
    def __init__(self, parser: Type[Parser], message_broker: Message_broker_connector, 
                 database: Database_connector, connector: Api_connector):
        super().__init__(parser, message_broker, database)
        self._connector: Api_connector = connector
    
    async def setup(self):
        await super().setup()
        await self._connector.create_session()
    
    async def collect(self, query_statement, table, source, request_time_limit, url, parameter):
        difference = 0
        while True:
            start_time = time.time()
            response = await self._connector.make_request(url, parameter)
            data = self._parser.parse(response)
            await asyncio.gather(self._write(query_statement, data, table), self._publish(data, source))
            difference = 0 if ((time.time() - start_time) > request_time_limit) else (request_time_limit - (time.time() - start_time))
            await asyncio.sleep(difference)