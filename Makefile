all:
	mkdir -p ./db
	docker compose up --build -d
clean:
	docker compose down -v
fclean:
	rm -rf ./db/*
	docker compose down -v
	docker image prune -af
re:
	make fclean
	make all
log:
	docker compose logs -f
db:
	docker exec -it postgre_container bash
server:
	docker exec -it nest_container bash
.PHONY: all clean fclean re