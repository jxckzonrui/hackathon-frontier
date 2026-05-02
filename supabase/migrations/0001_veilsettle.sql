create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  creator_wallet text not null,
  payer_hash text not null,
  metadata_hash text not null,
  amount_commitment text not null,
  due_date_hash text not null,
  status text not null check (status in ('created', 'paid', 'voided')),
  payment_proof_reference text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table public.encrypted_invoice_blobs (
  invoice_id uuid primary key references public.invoices(id) on delete cascade,
  encrypted_blob jsonb not null,
  authorized_wallets text[] not null,
  blob_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.invoices enable row level security;
alter table public.encrypted_invoice_blobs enable row level security;
