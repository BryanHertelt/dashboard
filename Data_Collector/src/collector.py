from connectors import Message_broker_connector, Database_connector, Websocket_connector, Api_connector
from parser import Parser
from typing import Union

class Collector:
    
    def __init__(self, parser: Parser, message_broker: Message_broker_connector(), database: Database_connector(), connector: Union[Websocket_connector(), Api_connector()]):
        self._mb: Message_broker_connector = message_broker
        self._db: Database_connector = database
        self._parser: Parser = parser
        self._connector: Union[Websocket_connector(), Api_connector()]= connector
        
    
    def _write(self):
        pass
    
    def _publish(self):
        pass
    
    def collect(self):
        pass