from flask import Flask, jsonify,request,session
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
from bson import ObjectId
import json
import subprocess
from kafka import KafkaProducer, KafkaConsumer



app = Flask(__name__)
app.secret_key="ToolsProject"
CORS(app,supports_credentials=True)

app.config['SESSION_COOKIE_SECURE'] = True  # Set to False if not using HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True

'''
kafka_bootstrap_servers = 'localhost:9092'
kafka_topic = 'clinic'


#producer setup
producer = KafkaProducer(bootstrap_servers=kafka_bootstrap_servers, value_serializer=lambda v: str(v).encode('utf-8'))

#consumer setup
consumer = KafkaConsumer(kafka_topic, bootstrap_servers=kafka_bootstrap_servers,
                         group_id='reservation_consumer_group',  
                         auto_offset_reset='earliest',
                         value_deserializer=lambda x: eval(x.decode('utf-8')))
 
'''




# the uri to connect to
MONGODB_URI = "mongodb://mongo_container:27017"

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
            
            if patients_collection.find_one({"email":email}):
                return jsonify({'message':'user already exists'})
            else:
                
                new_user=patients_collection.insert_one(user)
                appointments_collection =db.appointments
                appointments_collection.insert_one({"patientID":ObjectId(new_user.inserted_id),"slots":[]})
            
        else:
            doctors_collection = db.doctors
            if doctors_collection.find_one({"email":email}):
                return jsonify({'message':'user already exists'})
            else:
                new_user = doctors_collection.insert_one(user)
                schedules_collection = db.schedules
                schedules_collection.insert_one({"doctorID":ObjectId(new_user.inserted_id),"slots":[]})
        
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
    schedule_collection.update_one({'doctorID':doctor_id['_id']},{'$push':{'slots':{'date':data['date'],'hour':data['hour'],'available':True}}})

    return jsonify({"message":"slot added successfully"})

@app.route("/Doctor/edit/<email>",methods=["POST"])
def editSlot(email):
    data = request.get_json()

    doctors_collection = db.doctors
    doctor = doctors_collection.find_one({"email":email})
    
    schedule_collection = db.schedules
    schedule = schedule_collection.find_one({'doctorID':doctor['_id']})
    slots = schedule['slots']
    for i in range(len(slots)):
        if slots[i]['date'] == data['oldDate'] and slots[i]['hour'] == data['oldTime']:
            slots[i]['date'] = data['newDate']
            slots[i]['hour'] = data['newTime']
            break
    schedule_collection.update_one({'doctorID':doctor['_id']},{'$set':{'slots':slots}})
    return jsonify({"message":"slot edited successfully"}) 
    

#cancel
@app.route("/Doctor/cancel/<email>",methods=["POST"])
def cancelSlot(email):
    data = request.get_json()

    doctors_collection = db.doctors
    doctor = doctors_collection.find_one({"email":email})
    
    schedule_collection = db.schedules
    schedule = schedule_collection.find_one({'doctorID':doctor['_id']})
    slots = schedule['slots'] 
    index = next((i for i, slot in enumerate(slots) if slot['date'] == data['oldDate'] and slot['hour'] == data['oldTime']), None)  
    del slots[index]
    schedule_collection.update_one({'doctorID':doctor['_id']},{'$set':{'slots':slots}})
    return jsonify({"message":"slot canceled successfully"})
    

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

#patient chooses a slot. ->add appoinment
#change availability of slot in the doctors schedule
@app.route("/Patient/choose/<email>",methods=["POST"])
def chooseSlot(email):
    data =request.get_json()
    date,time= data['Appointment'].split(" ")
    
    patients_collection=db.patients
    patient_id = patients_collection.find_one({"email":email})
    

    
    appoinments_collection=db.appointments
    appoinments_id = appoinments_collection.find_one({'patientID':patient_id['_id']})
    
    appoinments_collection.update_one({'patientID':patient_id['_id']},{'$push':{'slots':{'date':date,'hour':time,'dremail':data['Doctor']}}})


    event_data = {
        'doctorEmail': data['Doctor'],
        'patientEmail': email,
        'Operation':'ReservationCreated'
    }
    
    #producer.send(kafka_topic, value=event_data)
    return jsonify({"message":"appoinment added successfully"})
    
    
    
    
    
#Patient can update his appointment by change the doctor or the slot.
@app.route("/Patient/update/<email>" ,methods=["POST"])
def updateApp(email):
    data =request.get_json()
    new_date,new_time= data['newTime'].split(" ")
    old_date,old_time= data['oldTime'].split(" ")
    
    patients_collection=db.patients
    patient_id = patients_collection.find_one({"email":email})
    

    
    appoinments_collection=db.appointments
    appoinments= appoinments_collection.find_one({'patientID':patient_id['_id']})
    
    slots = appoinments['slots']
    for i in range(len(slots)):
        if slots[i]['date'] == old_date and slots[i]['hour'] == old_time and slots[i]['dremail']==data['oldDr']:
            slots[i]['date'] = new_date
            slots[i]['hour'] = new_time
            slots[i]['dremail'] = data['newDr']
            break
    appoinments_collection.update_one({'patientID':patient_id['_id']},{'$set':{'slots':slots}})
    
    event_data = {
        'doctorEmail': data['newDr'],
        'patientEmail': email,
        'Operation':'ReservationUpdated'
    }
    
    #producer.send(kafka_topic, value=event_data)
    return jsonify({"message":"appoinment edited successfully"})
    


#Patient can cancel his appointment.
@app.route("/Patient/cancel/<email>" ,methods=["POST"])
def cancelApp(email):
    data =request.get_json()
    old_date ,old_time = data['oldTime'].split(' ')
    
    patients_collection=db.patients
    patient_id = patients_collection.find_one({"email":email})
    
    
    
    appoinments_collection=db.appointments
    appoinments= appoinments_collection.find_one({'patientID':patient_id['_id']})
    
    slots = appoinments['slots'] 
    index = next((i for i, slot in enumerate(slots) if slot['date'] == old_date and slot['hour'] == old_time and slot['dremail']== data['oldDr']), None)  
    del slots[index]
    appoinments_collection.update_one({'patientID':patient_id['_id']},{'$set':{'slots':slots}})
    event_data = {
        'doctorEmail': data['oldDr'],
        'patientEmail': email,
        'Operation':'ReservationCanceled'
    }
    #producer.send(kafka_topic, value=event_data)
    return jsonify({"message":"appoinment  canceled successfully"})
  
'''  
#Consume an event
@app.route("/consumeEvents",methods=["GET"])
def consume_events():
    events = []
    messages = consumer.poll()
    for message in messages.values():
        message_value = message.value
        events.append(message_value)
        
    
        

   
    return jsonify(events)
    '''
    

#Patients can view all his appointments.
@app.route("/Patient/viewApp/<email>",methods=["GET"])
def viewApp(email):
   patients_collection=db.patients
   patient_id = patients_collection.find_one({"email":email})
   
   appoinments_collection=db.appointments
   appoinments= appoinments_collection.find_one({'patientID':patient_id['_id']}) 
   
   appt_list=appoinments['slots']
   
   return jsonify(appt_list)    

if __name__ =="__main__":
    app.run(host='0.0.0.0',debug=True)
