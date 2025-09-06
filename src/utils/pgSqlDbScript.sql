CREATE TABLE public.user(id serial primary key, name varchar(60) not null, email varchar(40) not null, age integer, gender varchar(10), password varchar(100) not null, access_token varchar, refresh_token varchar);

INSERT INTO public.user(name, email, age, gender, password) 
VALUES('Admin', 'admin@abc.com', 30, 'male', 'admin123');

-- UPDATE public.user SET  gender=40 WHERE 'draft' LIKE '%' || LOWER(gender) || '%';a