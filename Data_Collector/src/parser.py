class Parser:
    
    def parse(self, data):
        return self._fromatter(data)
    
    def _formatter(self, data):
        raise NotImplementedError
