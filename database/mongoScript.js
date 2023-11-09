db = connect( 'mongodb://localhost/27017' );

db = db.getSiblingDB('clinic');

db.createCollection("doctors")
db.createCollection("patients")
db.createCollection("appointments")
db.createCollection("schedules")