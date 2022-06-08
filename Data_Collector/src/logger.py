import logging
import sys
from logging import TimedRotatingFileHandler

class Logger:
    
    def __init__(self, formatter= "%(asctime)s - %(name)s - %(levelname)s - %(message)s", file_name=None, rotation_time="midnight"):
        self.formatter = logging.Formatter(formatter)
        self.log_file = file_name
        self.rotation = rotation_time
        self.logger = None
    
    def get_console_handler(self):
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(self.formatter)
        return console_handler
    
    def get_file_handler(self):
        file_handler = TimedRotatingFileHandler(self.log_file, when=self.rotation)
        file_handler.setFormatter(self.formatter)
        return file_handler

    def get_logger(self, logger_name):
        logger = logging.getLogger(logger_name)
        logger.setLevel(logging.DEBUG) 
        logger.addHandler(self.get_console_handler())
        logger.addHandler(self.get_file_handler())
        logger.propagate = False
        self.logger = logger
        return self.logger
    
    def set_logging_level(self, new_level):
        if new_level in ["INFO", "DEBUG", "WARN", "ERROR", "CRITICAL"]:
            self.logger.setLevel(new_level)
        else:
            raise ValueError("Invalid logging level")