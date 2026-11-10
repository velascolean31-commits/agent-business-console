-- Agencia de webs para negocios locales: captación, web de muestra, reservas y cobro por suscripción.
alter type agent_key add value if not exists 'scout';
alter type agent_key add value if not exists 'forge';
alter type agent_key add value if not exists 'herald';
alter type agent_key add value if not exists 'ledger';
alter type agent_key add value if not exists 'atlas';

create table leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null check (char_length(business_name) between 2 and 120),
  category text not null default 'otro'
    check (category in ('peluqueria','restaurante','clinica','taller','tienda','otro')),
  city text not null check (char_length(city) between 2 and 80),
  phone text,
  email text,
  address text,
  opening_hours text,
  current_website text,
  notes text,
  slug text not null unique,
  status text not null default 'demo_ready'
    check (status in ('demo_ready','contacted','interested','client','paused','lost')),
  contacted_at timestamptz,
  became_client_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  source text not null default 'manual' check (source in ('manual','self_serve')),
  accepted_terms_at timestamptz,
  created_at timestamptz not null default now(),
  unique (owner_id, business_name, city)
);

-- Solicitudes de reserva que dejan los clientes finales en la web de un negocio ya cliente
create table booking_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references leads(id) on delete cascade,
  customer_name text not null check (char_length(customer_name) between 2 and 80),
  customer_contact text not null check (char_length(customer_contact) between 5 and 120),
  wanted_at text check (char_length(wanted_at) <= 80),
  message text check (char_length(message) <= 600),
  created_at timestamptz not null default now()
);

alter table leads enable row level security;
alter table booking_requests enable row level security;
create policy leads_select_own on leads for select to authenticated using (owner_id = auth.uid());
create policy booking_requests_select_own on booking_requests for select to authenticated using (owner_id = auth.uid());

-- El cliente no necesita ver los identificadores de Stripe
revoke select on leads from anon, authenticated;
grant select (id, owner_id, business_name, category, city, phone, email, address, opening_hours,
  current_website, notes, slug, status, source, contacted_at, became_client_at, created_at)
  on leads to authenticated;

-- Escrituras: solo servidor (service_role), tras validar la sesión o la firma de Stripe.
