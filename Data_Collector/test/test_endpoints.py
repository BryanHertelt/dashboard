import asyncio
import websockets
import json


def websocket():
  async def handler(websocket):
      while True:
          #message = await websocket.recv()
          #print(message)
          await websocket.send(json.dumps([("BTC", 100, 420)]))
          await asyncio.sleep(1)




  async def main():
      async with websockets.serve(handler, "", 8001):
          await asyncio.Future()  # run forever


  if __name__ == "__main__":
      asyncio.run(main())

websocket()
