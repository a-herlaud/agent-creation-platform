FROM python:3.14-slim

WORKDIR /app

RUN apt update
COPY dependencies/requirements.txt dependencies/requirements.txt
RUN pip install --no-cache-dir -r dependencies/requirements.txt

COPY app/* .

CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port 8001"]
