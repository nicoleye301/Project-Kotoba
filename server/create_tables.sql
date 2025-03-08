drop table if exists
    "user",
    friendship,
    chat_group,
    group_member,
    message,
    post,
    post_like,
    post_comment;

create table "user"(
    id serial primary key,
    username text unique not null,
    password text not null,
    sex text,
    phone text,
    email text,
    avatar text,
    setting text,   --is a json string
    status text
);

create table friendship(
    id serial primary key,
    user_id int not null,
    friend_id int not null,
    nickname text,  --nickname for friend
    direct_chat_group_id int,   --for direct chat
    status text --pending, accepted, deleted
);

create table chat_group(
    id serial primary key,
    owner_id int,
    is_group bool not null default false,   --could be direct chat
    group_name text,
    check (not is_group or group_name is not null),
    last_update_time timestamp(3),   --used for chat list ordering
    muted bool not null default false
);

create table group_member(
    id serial primary key,
    user_id int not null,
    group_id int not null,
    unread_messages int,    --used for notification bubble
    status text
);

create table message(
    id serial primary key,
    content text not null,  --text or url to file
    sender_id int not null,
    group_id int not null,
    type text not null, --plaintext, image, voice, etc.
    sent_time timestamp(3),
    status text
);

create table post(
    id serial primary key,
    content text not null,
    image_url text, --url to image file
    sender_id int not null,
    sent_time timestamp(3)
);

create table post_comment(
    id serial primary key,
    post_id int not null,
    sender_id int not null,
    content text not null,
    sent_time timestamp(3)
);

create table post_like(
    id serial primary key,
    post_id int not null,
    sender_id int not null,
    content text not null
)