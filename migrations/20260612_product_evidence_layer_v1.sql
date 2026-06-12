-- Product Evidence Layer v1
-- Backend/admin contract for RKicks inventory publishing.

create table if not exists rkicks_product_evidence (
  id bigserial primary key,
  product_id bigint not null references rkicks_products(id) on delete cascade,
  evidence_type text not null check (
    evidence_type in (
      'front',
      'left_side',
      'right_side',
      'heel',
      'outsole',
      'size_tag',
      'box_label',
      'top_down',
      'defect_closeup',
      'receipt'
    )
  ),
  asset_url text not null,
  sort_order integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, evidence_type, asset_url)
);

alter table rkicks_products
  add column if not exists evidence_status text not null default 'draft_only'
    check (evidence_status in ('draft_only', 'ready_to_publish')),
  add column if not exists evidence_score integer not null default 0,
  add column if not exists evidence_required_total integer not null default 8;

-- Publishing rule:
-- A product can be published only when all required evidence types exist:
-- front, left_side, right_side, heel, outsole, size_tag, box_label, top_down.
-- Enforce in the admin service before setting published = true.
