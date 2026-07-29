-- ============================================================
-- FIX: get_card_time_aggregates() limitaba a 50 tarjetas (pensado
-- para un "top 15" en pantalla), pero el nuevo mapa de calor por
-- modulo necesita el dato de TODAS las tarjetas del curso, no solo
-- las 50 con mas vistas. Con ~650 tarjetas en total el resultado
-- sigue siendo liviano (3 numeros por fila).
-- Ejecutar en Supabase SQL Editor. Seguro de re-ejecutar.
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_card_time_aggregates()
RETURNS TABLE (card_id text, views_count bigint, avg_seconds numeric)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT
        resource_id::text                           AS card_id,
        COUNT(*)::bigint                            AS views_count,
        ROUND(AVG(time_spent_seconds), 1)           AS avg_seconds
    FROM public.resource_views
    WHERE resource_type = 'card'
      AND time_spent_seconds IS NOT NULL
      AND time_spent_seconds > 0
    GROUP BY resource_id
    ORDER BY views_count DESC, avg_seconds DESC
    LIMIT 3000;
$$;

GRANT EXECUTE ON FUNCTION public.get_card_time_aggregates() TO authenticated;
