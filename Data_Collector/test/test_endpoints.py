import asyncio
import websockets


def websocket():
  async def handler(websocket):
      while True:
          message = await websocket.recv()
          print(message)
          await websocket.send("bing bong")
          await asyncio.sleep(1)




  async def main():
      async with websockets.serve(handler, "", 8001):
          await asyncio.Future()  # run forever


  if __name__ == "__main__":
      asyncio.run(main())

websocket()
