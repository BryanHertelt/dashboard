import asyncio
import time
import asyncpg
import redis
import websockets
import aiohttp

from .connectors import Message_broker_connector, Database_connector, Websocket_connector, Api_connector
from .parser import Parser
from typing import Tuple, Type, List

class Collector:
    
    """The parent class for all collectors.
    
    The collector is the parent class for the specific collector types.
    
    Attributes:
        parser (Parser):
            An object of the class parser, which formats the raw data.
        message_broker (Message_broker):
            An object of the class Message_broker, which writes the formatted data into the given instance.
        database (Database_connector):
            An object of the class Database_connector, which writes the formatted data into the given instance
    """
    
    def __init__(self, parser: Parser, message_broker: Message_broker_connector,
                 database: Database_connector):
        
        """Initialize the Collector.
        
        Args:
            parser (Parser):
            An object of the class parser, which formats the raw data.
            message_broker (Message_broker):
                An object of the class Message_broker, which writes the formatted data into the given instance.
            database (Database_connector):
                An object of the class Database_connector, which writes the formatted data into the given instance
        
        Returns: 
            None
        
        Raises:
            None
        """
        
        self._mb: Message_broker_connector = message_broker
        self._db: Database_connector = database
        self._parser: Type[Parser] = parser
        
    async def setup(self):
        
        """Setup the collector.
        
        Connects to the message broker and database through the given instances. The connection process runs asynchronously and independent from each other.
        
        Args:
            None
            
        Returns:
            None
            
        Raises:
            None
        """
        
        await asyncio.gather(
            self._mb.connect(),
            self._db.connect(),
        )

    async def _write(self, query_statement: str, data: List[Tuple[str]], table: str): 
        
        """Writes data into the database.
        
        Writes formatted data into the database over the Database_connector instance. If the write process fails, the method tries to reconnect to the database.
        
        Args:
            query_statement (str):
                This string specifies the query statement, which is used to insert the data.
            data (List[Tuple[str]]):
                This list contains the data to be written to the database.
            table (str):
                This strings specifies the target table in the database.
        
        Returns:
            None
        
        Raises:
            None
        """
        
        try:
            await self._db.write(query_statement, data, table)
        except (asyncpg.exceptions.ConnectionDoesNotExistError, asyncpg.exceptions._base.InterfaceError):
            await self._db.connect()
    
    async def _publish(self, data: List[Tuple[str]], source: str):
        
        """Publishes the data to the message broker.
        
        Publishes the data to the message broker, which is accessible over the Message_broker_connector instance. If the publish process fails the method tries to reconnect to the message broker.
        
        Args:
            data (List[Tuple[]]):
                This list contains the data to be published to the message broker.
            
            source (str):
                A string, which represents to specific source of the data. It is used to generate the specific key in the message broker.
        
        Returns:
            None
            
        Raises:
            None
        """
        
        try:
            await self._mb.write(data, source)
        except (redis.exceptions.ConnectionError, OSError):
            await self._mb.connect()
    
    async def collect(self):
        
        """ Collects data from different sources.
        
        This method gets implemented by her child class.
        
        Args:
            None
        
        Returns:
            None
            
        Raises:
            NotImplementedError:
                This exception is raised, because of the missing implementation.
        """
        
        raise NotImplementedError
    
    async def shutdown(self):
        
        """Shuts down the collector.
        
        Befor the program is stopped this method runs to close open connections.
        
        Args:
            None
            
        Returns:
            None
            
        Raises:
            None
        """
        
        await self._db.close_connection()

class Websocket_collector(Collector):
    
    """The collector for a websocket as data source.
    
    The Websocket_collector connects to a websocket and writes the collected data into a message broker and a database.
    
    Attributes:
        parser (Parser):
            An object of the class parser, which formats the raw data.
        message_broker (Message_broker):
            An object of the class Message_broker, which writes the formatted data into the given instance.
        database (Database_connector):
            An object of the class Database_connector, which writes the formatted data into the given instance
        connector (Websocket_connector):
            An object, which connects to the websocket server.
    """
    
    def __init__(self, parser: Parser, message_broker: Message_broker_connector, database: Database_connector , connector: Websocket_connector):
        
        """Initiliaze the Websocket_collector.
        
        Args:
            parser (Parser):
                An object of the class parser, which formats the raw data.
            message_broker (Message_broker):
                An object of the class Message_broker, which writes the formatted data into the given instance.
            database (Database_connector):
                An object of the class Database_connector, which writes the formatted data into the given instance
            connector (Websocket_connector):
                An object, which connects to the websocket server.
                
        Returns:
            None
            
        Raises:
            None
        """
        
        super().__init__(parser, message_broker, database)
        self._connector: Websocket_connector = connector
    
    async def setup(self, subscription_message: str = None):
        
        """Setup the collector.
        
        Setup the collector. Runs the method from the parent class, connects to the websocket and subscribes the specific stream.
        
        Args:
            subscription_message (str):
                A string representation of the subscription message.
        
        Returns:
            The response from the subscription will be returned.
        
        Raises:
            None
        """
        
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
    
    async def collect(self, query_statement: str, table: str, source: str):
        
        """Collects data from the websocket and saves them.
        
        Collects data from the websocket and streams them to the message broker and database.
        
        Args:
            query_statement (str):
                A string representing the query statement.
            table (str):
                A string representing the table in the database.
            source (str):
                A string representing the source, which will  be used to build the key for the message broker.
        
        Returns:
            None
            
        Raises:
            None
        """
        
        while True:
            try:
                async for message in self._connector.receive_message():
                    data = self._parser.parse(message)
                    await asyncio.gather(self._write(query_statement, data, table), self._publish(data, source))
            except websockets.exceptions.ConnectionClosedError:
                await self._connector.create_connection()
    
    async def shutdown(self):
        
        """Shuts down the collector.
        
        Shuts down the collector. Runs the parent method and closes the websocket connection.
        
        Args:
            None
            
        Returns:
            None
            
        Raises:
            None
        """
        
        super().shutdown()
        await self._connector.close_connection()

class Api_collector(Collector):
    
    """ The collector for an api as data source.
    
    The collector connects to an api and streams the data to a message broker and a database.
    
    Attributes:
        parser (Parser):
            An object of the class parser, which formats the raw data.
        message_broker (Message_broker):
            An object of the class Message_broker, which writes the formatted data into the given instance.
        database (Database_connector):
            An object of the class Database_connector, which writes the formatted data into the given instance
        connector (Api_connector):
            An object, which connects to the api server.
    """
    
    def __init__(self, parser: Parser, message_broker: Message_broker_connector, database: Database_connector, connector: Api_connector):
        
        """Initiliazes the Api_collector.
        
        Args:
            parser (Parser):
                An object of the class parser, which formats the raw data.
            message_broker (Message_broker):
                An object of the class Message_broker, which writes the formatted data into the given instance.
            database (Database_connector):
                An object of the class Database_connector, which writes the formatted data into the given instance
            connector (Api_connector):
                An object, which connects to the api server.
                
        Returns:
            None
            
        Raises:
            None
        """
        
        super().__init__(parser, message_broker, database)
        self._connector: Api_connector = connector
    
    async def setup(self):
        
        """Setup the collector.
        
        Runs the parent method and creates the http session.
        
        Args:
            None
            
        Returns:
            None
        
        Raises:
            None
        """
        
        await super().setup()
        await self._connector.create_session()
    
    async def collect(self, query_statement:str , table: str, source: str, request_time_limit: int, url: str, parameter: dict, max_reconnects: int, stream: bool = True):
        
        """Collects data from the api endpoint and saves them.
        
        Collects data from the api endpoint and streams the formatted data to a database and a message broker. The method ensures that each request is done in a given intervall. So if request_time_limit is 1, each second one request is made.
        
        Args:
            query_statement (str):
                A string representing the query statement.
            table (str):
                A string representing the table in the database.
            source (str):
                A string representing the source, which will  be used to build the key for the message broker.
            request_time_limit (int):
                An integer representing the minimum time interval between each http request.
            url (str):
                A string representing the url target.
            parameter (dict):
                A dictionary with parameters for the request.
            max_reconnects (int):
                An integer representing the maximum number of reconnects.
            stream (bool):
                A boolean specifing if the data should be written into the database and the message broker or if it should be returned. 
            
        Returns:
            If stream is set on true the response from the http request gets returned.
            
        Raises:
            aiohttp.ClientResponseError, aiohttp.client_exceptions.ClientConnectorError:
                These exceptions will be raised after reaching the limit of allowed reconnects without establishing a successful connection.
        """
        difference, reconnects  = 0, 0
        while True:
            start_time = time.time()
            try:
                response = await self._connector.make_request(url, parameter)
            except (aiohttp.ClientResponseError, aiohttp.client_exceptions.ClientConnectorError)as error:
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
        
        """Shuts down the Api_collector.
        
        Before the program stops, this method runs the parent method and closes the http session.
        
        Args:
            None
            
        Returns:
            None
            
        Raises:
            None
        """
        
        super().shutdown()
        await self._connector.close_session()