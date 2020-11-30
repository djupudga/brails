
all: clean deps build

deps:
	npm install

build: clean
	npx pkg . -t node10-linux-x64,node10-macos-x64,node10-alpine-x64 --out-path dist

docker-build:
	$(eval version := $(shell cat package.json | grep version | cut -d ":" -f 2 | cut -d "\"" -f 2))
	docker build -t djupudga/brails:$(version) .
	docker tag djupudga/brails:$(version) djupudga/brails:latest

clean:
	rm -rf dist

install-linux: build
	sudo mv dist/brails-linux /usr/bin/brails

release-test:
	test $(version)

release: release-test release-it-version github-release docker-build docker-push

release-patch: build release-it-patch github-release docker-build docker-push

release-it-version:
	npx release-it $(version) -n

release-it-patch:
	npx release-it patch -n

docker-push:
	$(eval version := $(shell cat package.json | grep version | cut -d ":" -f 2 | cut -d "\"" -f 2))
	docker push djupudga/brails:$(version)
	docker push djupudga/brails:latest

github-release:
	$(eval version := $(shell cat package.json | grep version | cut -d ":" -f 2 | cut -d "\"" -f 2))
	github-release upload \
		--user djupudga \
		--repo brails \
		--tag v$(version) \
		--name "brails-alpine" \
		--file dist/brails-alpine
	github-release upload \
		--user djupudga \
		--repo brails \
		--tag v$(version) \
		--name "brails-linux" \
		--file dist/brails-linux
	github-release upload \
		--user djupudga \
		--repo brails \
		--tag v$(version) \
		--name "brails-macos" \
		--file dist/brails-macos
