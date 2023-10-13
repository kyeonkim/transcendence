all:
	mkdir -p ./db
	docker compose up --build
clean:
	docker compose down -v
fclean:
	rm -rf ./db/*
	docker compose down -v
	docker image prune -af
re:
	make fclean
	make all

.PHONY: all clean fclean re