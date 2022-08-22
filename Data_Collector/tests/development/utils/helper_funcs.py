import asyncio

def future_result(result):
    future = asyncio.Future()
    future.set_result(result)
    return future

def future_exception(exception):
    future = asyncio.Future()
    future.set_exception(exception)
    return future