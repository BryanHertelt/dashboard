import asyncio

from connectors import Message_broker_connector, Database_connector, Websocket_connector, Api_connector
from parser import Parser
from typing import Union

class Collector:
    
    def __init__(self, parser: Parser, message_broker: Message_broker_connector, 
                 database: Database_connector , connector: Union[Websocket_connector, Api_connector]):
        self._mb: Message_broker_connector = message_broker
        self._db: Database_connector = database
        self._parser: Parser = parser
        self._connector: Union[Websocket_connector(), Api_connector()]= connector
        
    async def _write(self, data):
        await self._db.connect()
        await self._db.write(data)
    
    async def _publish(self, data):
        await self._mb.connect()
        await self._mb.write(data)
    
    async def collect(self):
        if type(self._connector) == Websocket_connector:
            self._wss()
        elif type(self._connector) == Api_connector:
            self._http()
        else:
            raise ValueError("The connector has the wrong type.")
    
    async def _wss(self, message: str = ""):
        await self._connector.create_connection()
        if message != "":
            await self._connector.send_message(message)
        async for message in self._connector.receive_message():
             data = self._parser.parse(message)
             await asyncio.gather(self._write(data), self._publish(data))
    
    async def _http(self):
        await self._connector.create_session()
        response = await self._connector.make_request()
        data = self._parser.parse(response)
        await asyncio.gather(self._write(data), self._publish(data))