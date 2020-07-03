CREATE TABLE inventory (
    inventory_id serial primary key ,
    restaurant_id int not null references restaurants(id),
    block_date date not null ,
    start_time time not null ,
    end_time time not null ,
    reservation_spaces int default 0
);

CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY ,
    restaurant_id INT not null references restaurants(id),
    start_date_time timestamp not null ,
    party_size int not null ,
    party_name varchar(255),
    party_email varchar(255)
);
