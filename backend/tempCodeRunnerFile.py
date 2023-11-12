@app.route("/Patient/viewSlots/<string:email>",methods=["GET"])
def viewSlots(email):

    doctors_collection = db.doctors
    doctor_id = doctors_collection.find_one({"email":email})
    schedule_collection = db.schedules
    schedule = schedule_collection.find_one({'doctorID':doctor_id['_id']})
    slots_lits = schedule['slots']
    
    return jsonify(slots_lits)
