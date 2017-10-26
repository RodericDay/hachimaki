SRC = $(wildcard src/*.ts)
DEMO_SRC = $(wildcard demos/ts/*ts)

main: build/hachimaki.js demos.txt
	echo done

build/hachimaki.js: $(SRC)
	tsc

demos.txt: $(DEMO_SRC)
	rm demos/js/*
	(cd demos && tsc)
	find demos/js -type f > demos.txt
