-- Módulo: cuentas, integraciones, publicación e ingresos (Fase 1)
-- Principios:
--  * Ningún token ni secreto vive en estas tablas: solo `secret_ref`, una referencia
--    a un sistema de secretos del servidor (p. ej. Supabase Vault).
--  * El cliente (rol authenticated) solo lee; las escrituras sensibles pasan por el servidor
--    con service_role tras validar permisos.
--  * Restricciones únicas para evitar registros duplicados (sobre todo ingresos).

create extension if not exists pgcrypto;

-- ---------- Tipos ----------
create type connection_status as enum ('connected','pending_authorization','expired','error','disconnected');
create type data_origin as enum ('real','estimated','demo');
create type approval_status as enum ('pending','approved','rejected','expired','cancelled');
create type agent_key as enum ('alpha','bravo','charlie','delta','sargento');
create type revenue_status as enum ('estimated','confirmed','pending_settlement','paid','refunded','chargeback');
create type payout_status as enum ('pending','in_transit','paid','failed','cancelled');

-- ---------- Propiedad: cada fila pertenece a un usuario ----------
-- 1. platform_connections: catálogo de integraciones disponibles/configuradas por usuario
create table platform_connections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,                       -- 'youtube', 'gumroad', ...
  display_name text not null,
  status connection_status not null default 'disconnected',
  status_detail text,                            -- qué falta si no está conectada
  scopes_granted text[] not null default '{}',
  last_sync_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, platform)
);

-- 2. connected_accounts: cuenta concreta dentro de una plataforma
create table connected_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid not null references platform_connections(id) on delete cascade,
  external_account_id text not null,
  handle text,
  purpose text,                                  -- para qué se usa
  secret_ref text,                               -- REFERENCIA al secreto; nunca el token
  status connection_status not null default 'pending_authorization',
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  unique (connection_id, external_account_id)
);

-- 3. agent_platform_permissions: qué agente puede usar qué cuenta y con qué permisos
create table agent_platform_permissions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  agent agent_key not null,
  account_id uuid not null references connected_accounts(id) on delete cascade,
  permissions text[] not null default '{}',      -- permisos mínimos, p. ej. {'upload','read_analytics'}
  shared_use_allowed boolean not null default false, -- solo true si los términos de la plataforma lo permiten
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (agent, account_id)
);

-- 4. monetization_profiles
create table monetization_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references connected_accounts(id) on delete cascade,
  eligibility text not null default 'unknown' check (eligibility in ('unknown','not_eligible','eligible','active')),
  holder_name text,
  verification_status text not null default 'unknown' check (verification_status in ('unknown','unverified','pending','verified')),
  min_payout_threshold numeric(12,2),
  currency char(3),
  updated_at timestamptz not null default now(),
  unique (account_id)
);

-- 5. payout_methods (sin datos bancarios completos)
create table payout_methods (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  monetization_profile_id uuid references monetization_profiles(id) on delete set null,
  provider text not null,                        -- 'stripe', 'paypal', 'bank_via_platform', ...
  holder_name text,
  masked_reference text,                         -- p. ej. '****1234'
  provider_secret_ref text,                      -- referencia, nunca credenciales
  verification_status text not null default 'unverified',
  requires_adult_guardian boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. payout_transactions: solo se marca 'paid' con confirmación del proveedor
create table payout_transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  payout_method_id uuid references payout_methods(id) on delete set null,
  platform text not null,
  external_payout_id text not null,
  amount numeric(14,2) not null,
  currency char(3) not null,
  status payout_status not null default 'pending',
  provider_confirmed_at timestamptz,
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (platform, external_payout_id),
  check (status <> 'paid' or provider_confirmed_at is not null)
);

-- Negocio de cada agente (para vincular ingresos/gastos)
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  agent agent_key not null,
  name text not null,
  business_model text not null,
  budget_limit numeric(14,2) not null default 0 check (budget_limit >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 7. revenue_records
create table revenue_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references businesses(id),
  agent agent_key not null,
  platform text not null,
  external_id text not null,                      -- id del ingreso en la plataforma: evita doble conteo
  published_content_id uuid,
  amount numeric(14,2) not null,
  fee numeric(14,2) not null default 0,
  currency char(3) not null,
  status revenue_status not null default 'estimated',
  origin data_origin not null default 'real',
  occurred_at timestamptz not null,
  payout_id uuid references payout_transactions(id),
  created_at timestamptz not null default now(),
  unique (platform, external_id)
);

-- 8. expense_records
create table expense_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references businesses(id),
  agent agent_key not null,
  category text not null,
  description text,
  amount numeric(14,2) not null check (amount >= 0),
  currency char(3) not null,
  approval_id uuid,
  external_ref text,
  occurred_at timestamptz not null default now(),
  unique (business_id, external_ref)
);

-- 9. published_content
create table published_content (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references businesses(id),
  agent agent_key not null,
  account_id uuid references connected_accounts(id),
  platform text not null,
  external_url text,
  external_id text,
  title text,
  status text not null default 'draft' check (status in ('draft','in_review','approved','scheduled','published','failed')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (platform, external_id)
);
alter table revenue_records
  add constraint revenue_content_fk foreign key (published_content_id) references published_content(id);

-- 10. integration_sync_logs
create table integration_sync_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid references platform_connections(id) on delete set null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  ok boolean,
  records_read integer not null default 0,
  error_message text
);

-- 11. approval_requests
create table approval_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  agent agent_key not null,
  kind text not null check (kind in ('publish','spend','subscription','domain','ads','transfer','payout_change','human_task','other')),
  summary text not null,
  amount numeric(14,2),
  currency char(3),
  status approval_status not null default 'pending',
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
alter table expense_records
  add constraint expense_approval_fk foreign key (approval_id) references approval_requests(id);

-- 12. audit_logs (append-only)
create table audit_logs (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  actor text not null,                            -- 'user' | agente | 'system'
  action text not null,
  entity text,
  entity_id text,
  detail jsonb not null default '{}',
  cost numeric(14,2),
  created_at timestamptz not null default now()
);

create or replace function audit_logs_immutable() returns trigger language plpgsql as $$
begin raise exception 'audit_logs es de solo anexado'; end $$;
create trigger audit_logs_no_update before update or delete on audit_logs
  for each row execute function audit_logs_immutable();

-- Control de presupuesto: un gasto no puede superar el presupuesto del negocio
create or replace function enforce_budget() returns trigger language plpgsql as $$
declare spent numeric; lim numeric;
begin
  select budget_limit into lim from businesses where id = new.business_id;
  select coalesce(sum(amount),0) into spent from expense_records where business_id = new.business_id;
  if spent + new.amount > lim then
    raise exception 'Gasto supera el presupuesto autorizado del negocio';
  end if;
  return new;
end $$;
create trigger expense_budget_check before insert on expense_records
  for each row execute function enforce_budget();

-- ---------- RLS: cada usuario solo ve lo suyo; el cliente solo lee ----------
do $$
declare t text;
begin
  foreach t in array array[
    'platform_connections','connected_accounts','agent_platform_permissions','monetization_profiles',
    'payout_methods','payout_transactions','businesses','revenue_records','expense_records',
    'published_content','integration_sync_logs','approval_requests','audit_logs'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy %I on %I for select to authenticated using (owner_id = auth.uid())', t||'_select_own', t);
  end loop;
end $$;

-- El usuario puede decidir sus propias aprobaciones desde el cliente (nada más)
create policy approval_requests_decide_own on approval_requests
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Revocar columnas sensibles al cliente
revoke select (secret_ref) on connected_accounts from authenticated;
revoke select (provider_secret_ref) on payout_methods from authenticated;

-- Escrituras en el resto de tablas: solo servidor (service_role omite RLS).
