CREATE DATABASE likeme;

\c likeme

CREATE TABLE posts (id SERIAL, title VARCHAR(25), img VARCHAR(1000),
description VARCHAR(255), likes INT );

