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

app.config['SESSION_COOKIE_SECURE'] = True  # Set to False if not using HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True




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
            schedules_collection.insert_one({"doctorID":ObjectId(new_user.inserted_id),"slotNum":0,"slots":[]})
        
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
        result= True
        if patients_collection.find_one({"email":email,"password":password}):
            patient  = True
        elif doctors_collection.find_one({"email":email,"password":password}):
            patient  = False
        else:
            result = False
            return jsonify({'message': result})
        return jsonify({'message': result,'patient':patient})
 


#Doctor set his schedule. (Inserting a slot)
@app.route("/Doctor/insert/<email>",methods=["POST"])
def insertSlot(email):
    data=request.get_json()
    doctors_collection = db.doctors
      
    doctor_id = doctors_collection.find_one({"email":email})
    schedule_collection = db.schedules
    schedule_id = schedule_collection.find_one({'doctorID':doctor_id['_id']})
    count = schedule_id['slotNum'] + 1 
    new_slot = "slot"+str(count)
    schedule_collection.update_one({'doctorID':doctor_id['_id']},{'$set':{'slotNum':count}})
    schedule_collection.update_one({'doctorID':doctor_id['_id']},{'$push':{'slots':{new_slot:{'date':data['date'],'hour':data['hour'],'available':True}}}})

    return jsonify({"message":"slot added successfully"})

#edit and cancel

#Patients select doctor, view his available slots, then patient chooses a slot.
@app.route("/Patient/getDoctors",methods=["GET"])
def getDoctors():

    doctors_collection = db.doctors
    doctors = doctors_collection.find()
    doctors_list = [doctor.get("email") for doctor in doctors]
    
    return jsonify(doctors_list)

@app.route("/Patient/viewSlots/<email>",methods=["GET"])
def viewSlots(email):

    doctors_collection = db.doctors
    doctor_id = doctors_collection.find_one({"email":email})
    schedule_collection = db.schedules
    schedule = schedule_collection.find_one({'doctorID':doctor_id['_id']})
    slots_lits = schedule['slots']
    
    return jsonify(slots_lits)

#Patient can update his appointment by change the doctor or the slot.
##@app.route("/patient" ,methods=["PUT"])
#Patient can cancel his appointment.
##@app.route("/patient" ,methods=["DELETE"])
#Patients can view all his appointments.
##@app.route("/patient",methods=["GET"])

if __name__ =="__main__":
    app.run(debug=True)
