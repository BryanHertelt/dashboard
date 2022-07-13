import asyncio

from connectors import Message_broker_connector, Database_connector, Websocket_connector, Api_connector
from parser import Parser

class Websocket_collector:
    
    def __init__(self, parser: Parser, message_broker: Message_broker_connector, 
                 database: Database_connector , connector: Websocket_connector):
        self._mb: Message_broker_connector = message_broker
        self._db: Database_connector = database
        self._parser: Parser = parser
        self._connector: Websocket_connector = connector
    
    async def setup(self, message: str = None):
        await self._mb.connect()
        await self._db.connect()
        await self._connector.create_connection()
        if message != None:
            await self._connector.send_message(message)
       
    async def _write(self, data):
        await self._db.write(data)
    
    async def _publish(self, data):
        await self._mb.write(data)
    
    async def collect(self):
        async for message in self._connector.receive_message():
             data = self._parser.parse(message)
             await asyncio.gather(self._write(data), self._publish(data))

'''   
    async def _http(self):
        await self._connector.create_session()
        response = await self._connector.make_request()
        data = self._parser.parse(response)
        await asyncio.gather(self._write(data), self._publish(data))
'''