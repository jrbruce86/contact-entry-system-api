
create table public.contacts
(
    id uuid primary key,
    name_first text not null,
    name_middle text,
    name_last text not null,
    address_street text not null,
    address_city text not null,
    address_state text not null,
    address_zip text not null,
    phone_number text not null,
    phone_is_home boolean not null,
    phone_is_mobile boolean not null,
    phone_is_work boolean not null,
    email text not null
)
