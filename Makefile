COMPOSE = docker compose -f ./srcs/docker-compose.yml

all: up

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

exec-frontend:
	$(COMPOSE) exec -it frontend bash

exec-proxy:
	$(COMPOSE) exec -it proxy bash

exec-backend:
	$(COMPOSE) exec -it backend bash

exec-database:
	$(COMPOSE) exec -it database bash

# exec-ollama:
# 	$(COMPOSE) exec -it ollama bash

logs:
	$(COMPOSE) logs -f

clean: down

fclean: down
	$(COMPOSE) down -v --rmi local

