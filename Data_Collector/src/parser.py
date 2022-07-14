from typing import Union

class Parser:
    
    """Formats raw data.
    
    Formats raw data, which is derived from a connector. The target format is a standard format for the whole application.
    
    Attributes:
        None
    """
    
    @staticmethod
    def parse(data: Union[str,list]):
        
        """Parses the data.
        
        Parses the data with the function, which gets implemented by a subclass.
        
        Args:
            data (Union[list, str]):
                A list or string, which specifies the raw data.
                
        Returns:
            It returns the formatted data.
        
        Raises:
            NotImplementedError:
                This exceptions is raised, when the parse() method gets called outside of a subclass.

        """
        
        raise NotImplementedError
