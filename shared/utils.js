/**
 * shared/utils.js — Utilidades compartidas (app + admin)
 * Cargar ANTES de app.js y admin.js:
 *   <script src="shared/utils.js"></script>
 */
(function (global) {
    'use strict';

    function esc(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function fmt(n) {
        return new Intl.NumberFormat('es').format(n);
    }

    function fmtTime(s) {
        if (!s || s <= 0) return '—';
        if (s < 60) return `${s}s`;
        if (s < 3600) return `${Math.round(s / 60)} min`;
        return `${(s / 3600).toFixed(1)}h`;
    }

    function fmtDate(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('es-GT', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    }

    function fmtDateShort(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('es-GT', {
            day: '2-digit', month: 'short',
        });
    }

    function fmtDateTime(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleString('es-GT', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    function localDateStr() {
        return new Date().toLocaleDateString('en-CA');
    }

    function parseLocalDateStr(dateStr) {
        const [y, m, d] = String(dateStr).split('-').map(Number);
        if (!y || !m || !d) return new Date();
        return new Date(y, m - 1, d);
    }

    function isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const t = email.trim();
        const at = t.indexOf('@');
        return at > 0 && at < t.length - 1;
    }

    function escapeCSV(v) {
        if (v === null || v === undefined) return '';
        const s = String(v);
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    }

    global.esc = esc;
    global.fmt = fmt;
    global.fmtTime = fmtTime;
    global.fmtDate = fmtDate;
    global.fmtDateShort = fmtDateShort;
    global.fmtDateTime = fmtDateTime;
    global.localDateStr = localDateStr;
    global.parseLocalDateStr = parseLocalDateStr;
    global._parseLocalDateStr = parseLocalDateStr;
    global.isValidEmail = isValidEmail;
    global.escapeCSV = escapeCSV;
    global.SteamUtils = {
        esc, fmt, fmtTime, fmtDate, fmtDateShort, fmtDateTime,
        localDateStr, parseLocalDateStr, isValidEmail, escapeCSV,
    };
})(typeof window !== 'undefined' ? window : globalThis);