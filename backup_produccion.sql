--
-- PostgreSQL database dump
--

\restrict SigxJSS10WSkVfWi3ne1eAa9QqbIIOupBlEgmehyjjjbU0fcT8F8pr1HQAKPIt6

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tipo_sector; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_sector AS ENUM (
    'Tankers',
    'DB'
);


ALTER TYPE public.tipo_sector OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    ticket_1 character varying(255) NOT NULL,
    ticket_2 character varying(255),
    ticket_3 character varying(255),
    price numeric(10,2),
    mcap numeric(10,2),
    ev numeric(10,2),
    pnav numeric(8,2),
    ev_ebitda numeric(8,2),
    per numeric(8,2),
    fcf numeric(8,2),
    eps numeric(8,2),
    divi numeric(8,2),
    divi_yield numeric(8,2),
    excel_path character varying(255),
    sector character varying(50)
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: ob; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ob (
    id integer NOT NULL,
    sector public.tipo_sector NOT NULL,
    type character varying(255) NOT NULL,
    "2025" smallint,
    "2026" smallint,
    "2027" smallint,
    "2028" smallint,
    beyond smallint
);


ALTER TABLE public.ob OWNER TO postgres;

--
-- Name: ob_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ob_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ob_id_seq OWNER TO postgres;

--
-- Name: ob_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ob_id_seq OWNED BY public.ob.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer,
    expires timestamp with time zone,
    session_token text NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_id_seq OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: shorts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shorts (
    id integer NOT NULL,
    company character varying(255) NOT NULL,
    symbol character varying(255) NOT NULL,
    market character varying(255) NOT NULL,
    current_short integer NOT NULL,
    previous_short integer NOT NULL,
    outstanding numeric(10,1) NOT NULL,
    "float" numeric(10,1) NOT NULL,
    av_vol numeric(10,3) NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.shorts OWNER TO postgres;

--
-- Name: shorts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shorts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shorts_id_seq OWNER TO postgres;

--
-- Name: shorts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shorts_id_seq OWNED BY public.shorts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    premium boolean DEFAULT false NOT NULL,
    premium_model boolean DEFAULT false NOT NULL,
    password text CONSTRAINT users_password_hash_not_null NOT NULL,
    email character varying(255) NOT NULL,
    image text,
    country character varying(255),
    super boolean DEFAULT false,
    stripe_customer_id text,
    stripe_subscription_id text,
    subscription_ends_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vsales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vsales (
    id integer NOT NULL,
    sector public.tipo_sector NOT NULL,
    type character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    dwt integer NOT NULL,
    year_b smallint NOT NULL,
    yard character varying(255),
    country character varying(255),
    buyer character varying(255),
    price numeric(6,2),
    scrubber boolean DEFAULT false,
    comments character varying(255),
    year_r smallint NOT NULL,
    week smallint NOT NULL,
    status character varying(255) DEFAULT 'Reported'::character varying
);


ALTER TABLE public.vsales OWNER TO postgres;

--
-- Name: vsales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vsales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vsales_id_seq OWNER TO postgres;

--
-- Name: vsales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vsales_id_seq OWNED BY public.vsales.id;


--
-- Name: vv; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vv (
    id integer NOT NULL,
    sector public.tipo_sector NOT NULL,
    type character varying(255) NOT NULL,
    nb numeric(6,1) NOT NULL,
    "5" numeric(6,1) NOT NULL,
    "10" numeric(6,1) NOT NULL,
    "15" numeric(6,1) NOT NULL,
    "20" numeric(6,1) NOT NULL,
    scrap numeric(6,1) NOT NULL,
    year smallint NOT NULL,
    week smallint NOT NULL
);


ALTER TABLE public.vv OWNER TO postgres;

--
-- Name: vv_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vv_id_seq OWNER TO postgres;

--
-- Name: vv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vv_id_seq OWNED BY public.vv.id;


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: ob id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ob ALTER COLUMN id SET DEFAULT nextval('public.ob_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: shorts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shorts ALTER COLUMN id SET DEFAULT nextval('public.shorts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vsales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vsales ALTER COLUMN id SET DEFAULT nextval('public.vsales_id_seq'::regclass);


--
-- Name: vv id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vv ALTER COLUMN id SET DEFAULT nextval('public.vv_id_seq'::regclass);


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, ticket_1, ticket_2, ticket_3, price, mcap, ev, pnav, ev_ebitda, per, fcf, eps, divi, divi_yield, excel_path, sector) FROM stdin;
9	Frontline	FRO	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Tankers
10	Himalaya	SHSP	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	DB
11	DHT	DHT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1778842985723_DHT_051326.xlsx	Tankers
\.


--
-- Data for Name: ob; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ob (id, sector, type, "2025", "2026", "2027", "2028", beyond) FROM stdin;
7	Tankers	VLCC	910	31	81	23	1
8	Tankers	Suezmax	671	42	82	25	3
9	Tankers	Aframax	1200	71	109	27	6
10	Tankers	LR1	449	24	41	19	2
11	Tankers	MR	2215	126	126	48	4
17	DB	Newcastle	520	25	21	10	5
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, expires, session_token) FROM stdin;
4	5	2026-05-01 18:42:58.083+02	vaw57mmx6m1777567378083
5	5	2026-05-01 18:44:38.305+02	oycf5ik8ke1777567478305
6	5	2026-05-01 18:48:57.523+02	hb7lpuhedo91777567737523
7	5	2026-05-01 18:50:26.529+02	0z0ndo1uvsac1777567826529
10	7	2026-05-01 21:59:04.689+02	ry2dgblhgi1777579144689
15	7	2026-05-02 20:35:42.447+02	eqdc7sw9qvs1777660542447
16	6	2026-05-02 20:49:00.305+02	k814kv8rev1777661340305
17	6	2026-05-02 20:55:42.533+02	xaidna5idum1777661742533
18	6	2026-05-02 20:56:59.34+02	ie3dx4z2wvi1777661819340
20	6	2026-05-02 21:11:17.327+02	0c7nxga74p2n1777662677327
23	6	2026-05-02 21:49:52.874+02	jk0hlt55kd1777664992874
27	7	2026-05-05 21:55:41.177+02	hasbj0x3ock1777924541177
28	7	2026-05-08 21:32:20.922+02	6zqa0hfgh6n1778182340922
30	7	2026-05-10 12:12:24.106+02	0ry9zdh8d4wi1778321544106
35	7	2026-05-12 21:32:38.485+02	7cuj1mrks4d1778527958485
46	7	2026-05-15 21:19:34.067+02	tqkejfz1ejd1778786374067
47	7	2026-05-15 21:41:20.936+02	v5sb4om7i8o1778787680936
58	6	2026-05-16 13:03:22.9+02	04zhpuni0dj1778843002900
59	6	2026-05-16 15:24:49.866+02	cjreaf22fje1778851489866
60	6	2026-05-21 17:54:53.224+02	5a2pfevwtxs1779292493224
61	6	2026-05-21 18:05:05.703+02	b9a6upitakh1779293105703
62	6	2026-05-21 18:09:33.235+02	vsmd5f1viy1779293373235
63	6	2026-05-21 18:24:16.868+02	hvke7nh80oa1779294256868
64	6	2026-05-21 18:25:06.447+02	ku71tz26rfr1779294306447
66	6	2026-05-21 18:50:25.884+02	6lw0whykiuc1779295825884
72	6	2026-05-22 21:44:26.211+02	fp8q7d0dnhk1779392666211
73	7	2026-05-22 21:53:22.444+02	zlncu19q5c1779393202444
74	6	2026-05-22 21:54:12.809+02	wunyfxtte31779393252809
75	6	2026-05-22 21:54:41.311+02	xbf2gd048td1779393281311
\.


--
-- Data for Name: shorts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shorts (id, company, symbol, market, current_short, previous_short, outstanding, "float", av_vol, date) FROM stdin;
12	Frontline	FRO	NYSE	5000000	4000000	222.5	142.9	3.914	2026-04-15
13	Okeanis	ECO	NYSE	50000	90000	36.1	20.6	0.499	2026-04-15
14	DHT	DHT	NYSE	8560237	9500000	161.0	145.0	4.742	2026-04-15
34	Frontline	FRO	NYSE	6302120	5015499	222.6	142.9	3.881	2026-04-30
35	Okeanis	ECO	NYSE	137085	78662	36.1	20.6	0.522	2026-04-30
36	DHT	DHT	NYSE	8096281	8560237	161.0	145.0	4.737	2026-04-30
37	CMBT	CMBT	NYSE	961143	890759	316.0	111.4	1.725	2026-04-30
38	Teekay Tankers	TNK	NYSE	845213	905990	30.0	23.9	0.560	2026-04-30
39	NAT	NAT	NYSE	18647101	10635172	211.8	202.5	5.041	2026-04-30
40	International S.	INSW	NYSE	1669216	1558813	49.5	41.1	0.615	2026-04-30
41	Torm	TRMD	NNM	649733	665121	102.1	87.9	0.925	2026-04-30
42	Hafnia	HAFN	NYSE	3601587	3204813	512.6	255.0	1.926	2026-04-30
43	Scorpio Tankers	STNG	NYSE	1776140	2150651	76.5	44.0	1.258	2026-04-30
44	Ardmore	ASC	NYSE	1946330	2203773	44.4	34.9	0.726	2026-04-30
45	Imperial Petroleum	IMPP	SC	2822951	2920099	49.5	31.9	0.710	2026-04-30
46	Tsakos Energy	TEN	NYSE	436238	449319	30.8	21.9	0.488	2026-04-30
47	Safe Bulkers	SBLK	NYSE	1744312	1799891	105.3	53.9	0.627	2026-04-30
48	Genco	GNK	NYSE	1075424	1195994	43.6	32.1	0.448	2026-04-30
49	Eurodry	EDRY	SC	2433	5389	2.9	1.3	0.033	2026-04-30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, created_at, premium, premium_model, password, email, image, country, super, stripe_customer_id, stripe_subscription_id, subscription_ends_at) FROM stdin;
5	felipe	2026-04-30 18:25:09.01088	f	f	$2b$10$XNuw6RL.GE8./bbQR818z.oAfhCvjhknnaPCStGk20qxdIFVHVfTa	felipe@gmail.com	\N	\N	f	\N	\N	\N
7	abel	2026-04-30 21:57:30.042753	f	f	$2b$10$TpdPx3OVrrh/j0e1n7Zmm.3RDTLUrJhM2KLBvfwO9wfI/x6ANDpD6	abgrodriguezlpl@gmail.com	\N	\N	t	\N	\N	\N
6	Lucía	2026-04-30 18:55:02.751499	t	f	$2b$10$2wwsBjJo3tHxmKd5k64VF.UZEdLnd/3IrH/HhwOHflEeBBWcLRD/2	lucia@gmail.com	/uploads/1777707585714-IMG_20191225_104136.jpg	Spain	f	\N	\N	2030-01-01 00:00:00
\.


--
-- Data for Name: vsales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vsales (id, sector, type, name, dwt, year_b, yard, country, buyer, price, scrubber, comments, year_r, week, status) FROM stdin;
2	DB	Capesize	su nombre	181000	2022	Imabari	Japan	Undisclosed	62.00	t	TC Attached	2026	18	Reported
3	Tankers	Suezmax	Aegean Horizon	158700	2007	Hyundai Samho	Japan	Undisclosed	50.10	f		2026	17	reported
4	Tankers	Aframax	Pusaka Borneo	108459	2018	Tsuneishi Shipbuilding		Undisclosed	78.00	f	ECO ME	2026	17	Reported
5	Tankers	Aframax	Southern Reverence	108534	2018	Tsuneishi	Japan	Undisclosed	74.50	t	Dely Jun-Aug 26	2026	18	Reported
6	DB	Kamsarmax	Elway	81911	2012	Jiangsu	China	Blue Seas Shipping	16.20	f		2026	18	Reported
7	DB	Supramax	V Bravo	56659	2012	Zheijiang	China	Undisclosed	14.00	f		2026	18	Reported
8	DB	Supramax	Valiant Wave	53490	2005	Imabari	Japan	Undisclosed	10.30	f		2026	18	Reported
13	DB	Supramax	Sea Credence	55640	2010	Mitsui	Japan	Chinese	16.00	f		2026	19	Reported
14	DB	Supramax	Jaima Topic	51966	2006	Tsuneishi Cebu	Philippines	Undisclosed	12.00	t		2026	19	Reported
15	DB	Supramax	Meraklis	50296	2001	Mitsui	Japan	Undisclosed	6.30	f		2026	19	Reported
23	DB	Supramax	Jaima Topic	51966	2006	Tsuneishi Cebu	Philippines	Undisclosed	75.00	t		2026	20	Reported
24	DB	Supramax	Meraklis	50296	2001	Mitsui	Japan	Undisclosed	75.00	f		2026	20	Reported
\.


--
-- Data for Name: vv; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vv (id, sector, type, nb, "5", "10", "15", "20", scrap, year, week) FROM stdin;
16	Tankers	VLCC	125.2	131.8	98.6	67.4	58.1	22.0	2026	18
17	Tankers	Suezmax	84.9	89.6	72.8	51.8	42.9	11.0	2026	18
18	Tankers	Aframax	73.5	74.8	61.6	42.0	31.8	8.0	2026	18
19	Tankers	LR2	74.0	75.3	62.1	42.5	32.3	9.0	2026	18
20	Tankers	LR1	53.0	48.1	38.3	25.5	17.4	6.0	2026	18
21	Tankers	MR / MR2	45.8	44.9	35.3	22.4	14.9	5.0	2026	18
22	DB	Newcastle	76.1	70.0	50.5	36.5	25.8	12.1	2026	18
23	DB	Capesize	72.8	65.3	46.1	31.9	22.5	10.8	2026	18
24	DB	PostPanamax	38.0	34.7	24.5	16.0	12.7	7.7	2026	18
25	DB	Kamsarmax	36.5	34.5	24.1	15.3	12.2	6.8	2026	18
26	DB	Panamax	30.9	29.1	21.1	14.4	11.8	6.1	2026	18
27	DB	Ultramax	35.2	34.4	23.9	15.3	12.1	5.4	2026	18
28	DB	Supramax	30.5	27.4	19.4	13.4	11.2	5.9	2026	18
42	Tankers	VLCC	125.2	131.8	98.6	67.4	58.1	22.0	2026	17
43	Tankers	Suezmax	84.9	89.6	72.8	51.8	42.9	11.0	2026	17
44	Tankers	Aframax	73.5	74.8	61.6	42.0	31.8	8.0	2026	17
45	Tankers	LR2	74.0	75.3	62.1	42.5	32.3	9.0	2026	17
46	Tankers	LR1	53.0	48.1	38.3	25.5	17.4	6.0	2026	17
47	Tankers	MR / MR2	45.8	44.9	35.3	22.4	14.9	5.0	2026	17
48	DB	Newcastle	76.1	70.0	50.5	36.5	25.8	12.1	2026	17
49	DB	Capesize	72.8	65.3	46.1	31.9	22.5	10.8	2026	17
50	DB	PostPanamax	38.0	34.7	24.5	16.0	12.7	7.7	2026	17
51	DB	Kamsarmax	36.5	34.5	24.1	15.3	12.2	6.8	2026	17
52	DB	Panamax	30.9	29.1	21.1	14.4	11.8	6.1	2026	17
53	DB	Ultramax	35.2	34.4	23.9	15.3	12.1	5.4	2026	17
54	DB	Supramax	30.5	27.4	19.4	13.4	11.2	5.9	2026	17
\.


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 11, true);


--
-- Name: ob_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ob_id_seq', 17, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sessions_id_seq', 79, true);


--
-- Name: shorts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shorts_id_seq', 49, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: vsales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vsales_id_seq', 30, true);


--
-- Name: vv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vv_id_seq', 54, true);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: ob ob_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ob
    ADD CONSTRAINT ob_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_token_key UNIQUE (session_token);


--
-- Name: shorts shorts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shorts
    ADD CONSTRAINT shorts_pkey PRIMARY KEY (id);


--
-- Name: ob unique_sector_type_ob; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ob
    ADD CONSTRAINT unique_sector_type_ob UNIQUE (sector, type);


--
-- Name: shorts unique_symbol_date_idx; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shorts
    ADD CONSTRAINT unique_symbol_date_idx UNIQUE (symbol, date);


--
-- Name: vsales unique_vessel_sale; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vsales
    ADD CONSTRAINT unique_vessel_sale UNIQUE (name, year_r, week);


--
-- Name: vv unique_vv_type_year_week; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vv
    ADD CONSTRAINT unique_vv_type_year_week UNIQUE (type, year, week);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vsales vsales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vsales
    ADD CONSTRAINT vsales_pkey PRIMARY KEY (id);


--
-- Name: vv vv_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vv
    ADD CONSTRAINT vv_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict SigxJSS10WSkVfWi3ne1eAa9QqbIIOupBlEgmehyjjjbU0fcT8F8pr1HQAKPIt6

