from flask import Flask, jsonify,request,session
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
from bson import ObjectId
import json
import subprocess

app = Flask(__name__)
app.secret_key="ToolsProject"
CORS(app,supports_credentials=True)

process = subprocess.run(['mongosh','-f','database/mongoScript.js'], 
                         stdout=subprocess.PIPE, 
                         universal_newlines=True)
process


# the uri to connect to
MONGODB_URI = "mongodb://localhost:27017"

#established a connection to mongo SHOULD ONLY BE ONE CONNECTION ACROSS OUR APP
client = MongoClient(MONGODB_URI)

# specifying which database to use
db = client.clinic

#specifying the collection (table) to use



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
    
        user = {
            "email":email,
            "password":password
        } 
        
        
        # handle database
        # todo make sure it doesn't alreasy exist
        if(type == 1):
            patients_collection = db.patients
            patients_collection.insert_one(user)
        else:
            doctors_collection = db.doctors
            new_user = doctors_collection.insert_one(user)
            schedules_collection = db.schedules
            schedules_collection.insert_one({"doctorID":ObjectId(new_user.inserted_id)})
        
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
        patients_collection = db.patients
        doctors_collection = db.doctors
        if patients_collection.find_one({"email":email,"password":password}):
            result = patients_collection.find_one({"email":email,"password":password})
        elif doctors_collection.find_one({"email":email,"password":password}):
            result = doctors_collection.find_one({"email":email,"password":password})
        else:
            result = "Wrong credentials"
            return jsonify({'message': result})
        return json.loads(json_util.dumps(data))
    else:
       return jsonify({'message': 'Invalid data format'}) 


#Doctor set his schedule. (Inserting a slot)
@app.route("/Doctor",methods=["PUT"])
def insertSlot():
    pass
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
