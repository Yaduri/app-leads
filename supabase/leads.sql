-- =============================================================
-- CRM de Leads - Migracao inicial (Supabase / PostgreSQL)
-- Execute este script em: Dashboard > SQL Editor > New query > Run
-- =============================================================

-- Tabela de leads
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nicho text,
  nome text not null,
  whatsapp text,
  link_perfil text,
  status_prospeccao text not null default 'Novo Lead'
    check (status_prospeccao in ('Novo Lead', 'Em Andamento', 'Em Negociação', 'Concluído', 'Sem interesse')),
  venda_realizada text not null default 'Em aberto'
    check (venda_realizada in ('Sim', 'Não', 'Negociação', 'Em aberto')),
  observacoes text,
  data_contato date,
  msg_a_mandar text,
  valor_venda numeric(10, 2) not null default 0.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================
-- Row Level Security (cada usuario ve/apenas seus registros)
-- =============================================================
alter table public.leads enable row level security;

drop policy if exists "select own leads"  on public.leads;
drop policy if exists "insert own leads"  on public.leads;
drop policy if exists "update own leads"  on public.leads;
drop policy if exists "delete own leads"  on public.leads;

create policy "select own leads" on public.leads
  for select using (auth.uid() = user_id);

create policy "insert own leads" on public.leads
  for insert to anon, authenticated
  with check (user_id is not null);

create policy "update own leads" on public.leads
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "delete own leads" on public.leads
  for delete using (auth.uid() = user_id);

-- Garante que os roles do Supabase acessem a tabela
grant select, insert, update, delete on table public.leads to authenticated;
grant select, insert on table public.leads to anon;

-- =============================================================
-- Indices para consultas comuns
-- =============================================================
create index if not exists leads_user_id_idx   on public.leads (user_id);
create index if not exists leads_nicho_idx     on public.leads (user_id, nicho);
create index if not exists leads_status_idx    on public.leads (user_id, status_prospeccao);
create index if not exists leads_venda_idx     on public.leads (user_id, venda_realizada);
create index if not exists leads_data_idx      on public.leads (user_id, data_contato);

-- =============================================================
-- Trigger para manter updated_at atualizado
-- =============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();