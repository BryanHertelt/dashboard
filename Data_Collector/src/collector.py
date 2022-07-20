import asyncio
import time
import asyncpg
import redis
import websockets
import aiohttp

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

    async def _write(self, query_statement, data, table): #Exception Handling
        try:
            await self._db.write(query_statement, data, table)
        except (asyncpg.exceptions.ConnectionDoesNotExistError, asyncpg.exceptions._base.InterfaceError):
            await self._db.connect()
    
    async def _publish(self, data, source): #Exception Handling
        try:
            await self._mb.write(data, source)
        except (redis.exceptions.ConnectionError, OSError):
            await self._mb.connect()
    
    async def collect(self):
        raise NotImplementedError
    
    async def shutdown(self):
        await self._db.close_connection()

class Websocket_collector(Collector):
    
    def __init__(self, parser: Type[Parser], message_broker: Message_broker_connector, 
                 database: Database_connector , connector: Websocket_connector):
        super().__init__(parser, message_broker, database)
        self._connector: Websocket_connector = connector
    
    async def setup(self, subscription_message: str = None): #Exception Handling
        await super().setup()
        await self._connector.create_connection()
        if subscription_message != None:
            try:
                response = await self._connector.subscribe(subscription_message)
            except websockets.exceptions.ConnectionClosedError:
                await self._connector.create_connection()
                response = await self._connector.subscribe(subscription_message)
                return response
            else:
                return response
    
    async def collect(self, query_statement, table, source): #Exception Handling
        while True:
            try:
                async for message in self._connector.receive_message():
                    data = self._parser.parse(message)
                    await asyncio.gather(self._write(query_statement, data, table), self._publish(data, source))
            except websockets.exceptions.ConnectionClosedError:
                await self._connector.create_connection()
    
    async def shutdown(self):
        super().shutdown()
        await self._connector.close_connection()

class Api_collector(Collector):
    
    def __init__(self, parser: Type[Parser], message_broker: Message_broker_connector, 
                 database: Database_connector, connector: Api_connector):
        super().__init__(parser, message_broker, database)
        self._connector: Api_connector = connector
    
    async def setup(self):
        await super().setup()
        await self._connector.create_session()
    
    async def collect(self, query_statement, table, source, request_time_limit, url, parameter, max_reconnects: int, stream: bool = True): #Exception Handling
        difference, reconnects  = 0, 0
        while True:
            start_time = time.time()
            try:
                response = await self._connector.make_request(url, parameter)
            except (aiohttp.ClientResponseError, aiohttp.client_exceptions.ClientConnectorError)as error: #Logging?
                if reconnects <= max_reconnects:
                    reconnects += 1
                    await asyncio.sleep(reconnects)
                    continue
                raise error
            else:
                reconnects = 0
            data = self._parser.parse(response)
            if stream:
                await asyncio.gather(self._write(query_statement, data, table), self._publish(data, source))
            else:
                return data
            difference = 0 if ((time.time() - start_time) > request_time_limit) else (request_time_limit - (time.time() - start_time))
            await asyncio.sleep(difference)
            
    async def shutdown(self):
        super().shutdown()
        await self._connector.close_session()