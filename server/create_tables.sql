drop table if exists users, friendships, chat_groups, group_members, messages;
create table users(
    id serial primary key,
    username varchar(100) unique not null,
    password varchar(100) not null
);
create table friendships(
    user_id int not null,
    friend_id int not null,
    primary key (user_id, friend_id)
);
create table chat_groups(
    id serial primary key,
    owner_id int not null,
    is_group bool not null,
    group_name varchar(100),
    check (not is_group or group_name is not null)
);
create table group_members(
    user_id int not null,
    group_id int not null,
    primary key (user_id, group_id)
);
create table messages(
    id serial primary key,
    content text not null,
    sender_id int not null,
    group_id int not null
)
