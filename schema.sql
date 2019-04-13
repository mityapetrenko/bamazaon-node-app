DROP DATABASE IF EXISTs bamazon;
create database bamazon;
use bamazon;

create table products(
item_id int not null auto_increment,
product_name varchar(100) not null,
department_name varchar(100) not null,
price decimal(10,2) not null,
stock_quantity int (10) not null,
primary key (item_id)
);
