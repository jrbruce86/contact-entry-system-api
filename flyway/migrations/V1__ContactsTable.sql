
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
    phone_number_home text unique,
    phone_number_mobile text unique,
    phone_number_work text unique,
    email text not null,
    unique(name_first,
           name_middle,
           name_last,
           address_street,
           address_city,
           address_state,
           address_zip)
);

create index call_list_search_index on public.contacts (phone_number_home, name_last, name_first);
