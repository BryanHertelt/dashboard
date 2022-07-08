from typing import Union

class Parser:
    
    """Formats raw data.
    
    Formats raw data, which is derived from a connector. The target format is a standard format for the whole application.
    
    Attributes:
        None
    """
    
    def parse(self, data: Union[str,list]):
        
        """Parses the data.
        
        Parses the data with the self._formatter() method.
        
        Args:
            data (Union[list, str]):
                A list or string, which specifies the raw data.
                
        Returns:
            It returns the formatted data.
        
        Raises:
            None
        """
        
        return self._fromatter(data)
    
    def _formatter(self, data: Union[list, str]):
        
        """Formats the data.
        
        Formats the data and gets implemented in a subclass.
        
        Args:
            data (Union[list, str]):
                 A list or string, which specifies the raw data.
        
        Returns:
            None
            
        Raises:
            None   
        """
        
        raise NotImplementedError
