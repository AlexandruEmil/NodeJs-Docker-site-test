from flask import Flask
from flask import request
from flask import *
import logging

logging.basicConfig(filename='server.log', level=logging.DEBUG, format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/date")
def hello():
    print(str(request.method)+"\n"+str(request.headers)+"\n"+str(request.args)+"\n"+str(request.form)+"\n"+str(request.files)+"\n"+str(request.values))
    return "<p>Hello, World!</p>"

@app.route('/api/data', methods=['GET', 'POST'])
def apiData():
    app.logger.debug("mesaj debug")
    app.logger.info("mesaj info")
    app.logger.warning("mesaj warning")
    app.logger.error("mesaj error")
    app.logger.critical("mesaj critical")
    app.logger.info(request.method)
    app.logger.info(request.headers)
    app.logger.info(request.args)
    app.logger.info(request.form)
    app.logger.info(request.files)
    app.logger.info(request.values)

    return "Hello World!"

if __name__ == "__main__":
    app.run(debug=True)
