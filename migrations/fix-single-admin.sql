-- ============================================================
-- FIX: un solo admin (billy@1bot.org) — profebillio@gmail.com deja de serlo
-- Ejecutar en Supabase SQL Editor. Seguro de re-ejecutar.
-- ============================================================

-- Trigger de nuevos usuarios: solo billy@1bot.org entra como admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
        new.id,
        CASE
            WHEN new.email = 'billy@1bot.org' THEN 'admin'
            ELSE 'student'
        END
    )
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Degradar cualquier cuenta que no sea billy@1bot.org y hoy tenga role='admin'
UPDATE public.user_roles
SET role = 'student'
WHERE role = 'admin'
  AND user_id NOT IN (
      SELECT id FROM auth.users WHERE email = 'billy@1bot.org'
  );

-- Confirmar billy@1bot.org como admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'billy@1bot.org'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
