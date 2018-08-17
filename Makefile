
all:
	docker build -t djupudga/brails:latest .

publish: all
	docker push djupudga/brails:latest
