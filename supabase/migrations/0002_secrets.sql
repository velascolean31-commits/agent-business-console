-- Almacén de secretos sobre Supabase Vault.
-- Las tablas solo guardan el uuid devuelto (secret_ref). Estas funciones solo las puede
-- ejecutar service_role, es decir, código de servidor; nunca el navegador.

create extension if not exists supabase_vault with schema vault;

create or replace function app_store_secret(p_name text, p_secret text)
returns uuid
language plpgsql
security definer
set search_path = public, vault
as $$
declare existing uuid; new_id uuid;
begin
  select id into existing from vault.secrets where name = p_name;
  if existing is not null then
    delete from vault.secrets where id = existing;
  end if;
  new_id := vault.create_secret(p_secret, p_name);
  return new_id;
end $$;

create or replace function app_read_secret(p_id uuid)
returns text
language sql
security definer
set search_path = public, vault
as $$
  select decrypted_secret from vault.decrypted_secrets where id = p_id;
$$;

create or replace function app_delete_secret(p_id uuid)
returns void
language sql
security definer
set search_path = public, vault
as $$
  delete from vault.secrets where id = p_id;
$$;

revoke all on function app_store_secret(text, text) from public, anon, authenticated;
revoke all on function app_read_secret(uuid) from public, anon, authenticated;
revoke all on function app_delete_secret(uuid) from public, anon, authenticated;
grant execute on function app_store_secret(text, text) to service_role;
grant execute on function app_read_secret(uuid) to service_role;
grant execute on function app_delete_secret(uuid) to service_role;

-- Corrección: ocultar de verdad las columnas de referencias a secretos al cliente
revoke select on connected_accounts from anon, authenticated;
grant select (id, owner_id, connection_id, external_account_id, handle, purpose, status, last_sync_at, created_at)
  on connected_accounts to authenticated;
revoke select on payout_methods from anon, authenticated;
grant select (id, owner_id, monetization_profile_id, provider, holder_name, masked_reference, verification_status, requires_adult_guardian, created_at)
  on payout_methods to authenticated;
