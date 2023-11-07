from flask import Flask, jsonify,request,session
from flask_cors import CORS

app = Flask(__name__)
app.secret_key="ToolsProject"
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/SignUp",methods=["POST"])
def Signup():
    data=request.get_json()
    if "email" in data and "password" in data and "patient" in data :
        email = data["email"]
        session["email"]=email
        password =data["password"]
        type=data["patient"]
        print(email)
        
        
    # handle database
        return jsonify({'message': 'Signup successful'})
    else:
        return jsonify({'message': 'Invalid data format'})

@app.route("/Signin",methods=["POST"])
def Signin():
    data=request.get_json()
    if "email" in data and "password" in data:
        email = data["email"]
        session["email"]=email
        password =data["password"]
        # autheticate user with database
    else:
       return jsonify({'message': 'Invalid data format'}) 
   
#Doctor set his schedule. (Inserting a slot)
##@app.route("/Doctor",methods=["PUT"])
#Patients select doctor, view his available slots, then patient chooses a slot.
##@app.route("/Patient",methods=[])
#Patient can update his appointment by change the doctor or the slot.
##@app.route("/patient" ,methods=["PUT"])
#Patient can cancel his appointment.
##@app.route("/patient" ,methods=["DELETE"])
#Patients can view all his reservations.
##@app.route("/patient",methods=["GET"])
if __name__ =="__main__":
    app.run(debug=True)

