import flask
 
app = flask.Flask(__name__)
 
@application.route('/')
def hello_world():
    return "Hello world!"
 
if __name__ == '__main__':
    app.run()