FROM python:3.8.18-alpine3.18

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY main.py .

ENV  FLASK_APP=main.py

ENTRYPOINT flask run