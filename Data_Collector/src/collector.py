import asyncio

from connectors import Message_broker_connector, Database_connector, Websocket_connector, Api_connector
from parser import Parser
from typing import Callable, Type

class Websocket_collector:
    
    def __init__(self, parser: Type[Parser], message_broker: Message_broker_connector, 
                 database: Database_connector , connector: Websocket_connector):
        self._mb: Message_broker_connector = message_broker
        self._db: Database_connector = database
        self._parser: Type[Parser] = parser
        self._connector: Websocket_connector = connector
    
    async def setup(self, subscription_message: str = None):
        await asyncio.gather(
            self._mb.connect(),
            self._db.connect(),
            self._connector.create_connection()
        )
        if subscription_message != None:
            response = await self._connector.subscribe(subscription_message)
            return response
       
    async def _write(self, data):
        await self._db.write(data)
    
    async def _publish(self, data):
        await self._mb.write(data)
    
    async def collect(self):
        async for message in self._connector.receive_message():
             data = self._parser.parse(message)
             await asyncio.gather(self._write(data), self._publish(data))


class Api_collector:
    
    async def _http(self):
        await self._connector.create_session()
        response = await self._connector.make_request()
        data = self._parser.parse(response)
        await asyncio.gather(self._write(data), self._publish(data))