create table users(
	id serial not null primary key,
	email varchar(64) not null unique,
	password char(60) not null,
	hash uuid,
	flags bigint not null default 0,
	awards bigint not null default 0
);

insert into users (email, password, flags, awards) values(
	'davis.matthewjames@gmail.com',
	'$2a$12$M5glQD99/0LxTzX7DdKl/uwfgLFPCR3G0JgfqsM7U2X2lLQ4C5nSu', --password
	3 --can login and add locations,
	0
);

-- alter table users add awards bigint not null default 0