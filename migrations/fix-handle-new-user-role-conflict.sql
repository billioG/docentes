-- ============================================================
-- FIX: handle_new_user_role() rompía TODA invitación/registro nuevo
-- Ejecutar en Supabase SQL Editor. Seguro re-ejecutar.
-- ============================================================
--
-- La migración multi-tenant-phase1.sql cambió la unique constraint de
-- user_roles de UNIQUE(user_id) a UNIQUE NULLS NOT DISTINCT(tenant_id,
-- user_id), pero esta función (creada antes, en audit-fixes.sql /
-- fix-single-admin.sql) se quedó con "ON CONFLICT (user_id)" — Postgres
-- exige que el target de ON CONFLICT matchee EXACTO una constraint
-- existente, y esa ya no existe. Resultado: cualquier alta nueva en
-- auth.users (invite, signup) tira "there is no unique or exclusion
-- constraint matching the ON CONFLICT specification" (SQLSTATE 42P10) y
-- GoTrue responde 500 "Database error saving new user" — bloqueaba TODAS
-- las invitaciones del sistema (reclutamiento y curso), no solo tenants.
--
-- tenant_id se deja NULL aquí a propósito: este trigger corre para CUALQUIER
-- alta en auth.users, incluida gente que se registra directo (sin invite de
-- colegio) — esas siguen siendo cuentas de 1bot/plataforma general. Las
-- invitaciones CON tenant (admin-users → invite/provisionCandidate) ya
-- hacen su propio upsert después con el tenant_id correcto, sobrescribiendo
-- esta fila inicial vía el mismo onConflict:'tenant_id,user_id'.

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, tenant_id, role)
    VALUES (
        new.id,
        NULL,
        CASE
            WHEN new.email = 'billy@1bot.org' THEN 'admin'
            ELSE 'student'
        END
    )
    ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = EXCLUDED.role;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
