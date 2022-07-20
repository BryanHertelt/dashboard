import asyncio
import websockets
import json
import aiohttp

from aiohttp import web


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

#websocket()

def web_server():
    

    async def handler(request: web.Request) -> web.Response:
        raise aiohttp.web.HTTPBadRequest()
        #return web.Response(text="SUCCESS")


    async def init_app() -> web.Application:
        app = web.Application()
        app.add_routes([web.get("/", handler)])
        return app


    web.run_app(init_app())

#web_server()