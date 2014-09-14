import SimpleHTTPServer
import SocketServer
import logging
import cgi
import sys
import Tkinter as tk
import threading

class FullScreenApp(object):
    def __init__(self, master, **kwargs):
        self.master=master
        pad=3
        self._geom='200x200+0+0'
        master.geometry("{0}x{1}+0+0".format(
            master.winfo_screenwidth()-pad, master.winfo_screenheight()-pad))
        master.bind('<Escape>',self.toggle_geom)
    def toggle_geom(self,event):
        geom=self.master.winfo_geometry()
        print(geom,self._geom)
        self.master.geometry(self._geom)
        self._geom=geom

class ServerHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_GET(s):
        global root
        col = s.path.split('/')[-1]
        root.configure(background='#'+col)

        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
        s.wfile.write("<html><head><title>Title goes here.</title></head>")
        s.wfile.write("<body><p>This is a test.</p>")
        s.wfile.write("<p>You accessed path: %s</p>" % s.path)
        s.wfile.write("</body></html>")

class GuiThread (threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        global root
        root=tk.Tk()
        app=FullScreenApp(root)
        root.mainloop()


if __name__ == '__main__':

    GuiThread().start()

    Handler = ServerHandler
    httpd = SocketServer.TCPServer(("", 8500), Handler)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass

    httpd.server_close()
