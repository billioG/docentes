"""
Parser Centros Educativos Guatemala v3
Maneja: texto plano, tabla Markdown, Ciudad Capital (zonas), tablas con saltos de página.
"""
import re, os, json

BD_DIR = r"C:\Users\billi\Downloads\Curso STEAM 2.0\BD Centros Educativos"

DEPT_MAP = {
    'ALTA_VERAPAZ':   ('Alta Verapaz',    'ALTA VERAPAZ'),
    'BAJA_VERAPAZ':   ('Baja Verapaz',    'BAJA VERAPAZ'),
    'CHIMALTENANGO':  ('Chimaltenango',   'CHIMALTENANGO'),
    'CHIQUIMULA':     ('Chiquimula',      'CHIQUIMULA'),
    'CUIDAD_CAPITAL': ('Guatemala',       'CIUDAD CAPITAL'),  # ← usa CIUDAD CAPITAL
    'EL_PROGRESO':    ('El Progreso',     'EL PROGRESO'),
    'ESCUINTLA':      ('Escuintla',       'ESCUINTLA'),
    'HUEHUETENANGO':  ('Huehuetenango',   'HUEHUETENANGO'),
    'IZABAL':         ('Izabal',          'IZABAL'),
    'JALAPA':         ('Jalapa',          'JALAPA'),
    'JUTIAPA':        ('Jutiapa',         'JUTIAPA'),
    'PETEN':          ('Petén',           'PETEN'),
    'QUETZALTENANGO': ('Quetzaltenango',  'QUETZALTENANGO'),
    'QUICHE_NORTE':   ('Quiché',          'QUICHE'),  # QUICHE_NORTE antes que QUICHE
    'QUICHE':         ('Quiché',          'QUICHE'),
    'RETALHULEU':     ('Retalhuleu',      'RETALHULEU'),
    'SACATEPEQUEZ':   ('Sacatepéquez',    'SACATEPEQUEZ'),
    'SANTA_ROSA':     ('Santa Rosa',      'SANTA ROSA'),
    'SAN_MARCOS':     ('San Marcos',      'SAN MARCOS'),
    'SOLOLA':         ('Sololá',          'SOLOLA'),
    'SUCHITEPEQUEZ':  ('Suchitepéquez',   'SUCHITEPEQUEZ'),
    'TOTONICAPAN':    ('Totonicapán',     'TOTONICAPAN'),
    'ZACAPA':         ('Zacapa',          'ZACAPA'),
}

MUNICS_BY_DEPT = {
    'ALTA VERAPAZ': ['COBAN','SANTA CRUZ VERAPAZ','SAN CRISTOBAL VERAPAZ','TACTIC','TAMAHU',
        'SAN MIGUEL TUCURU','PANZOS','SENAHU','SENAHÚ','CAHABON','SANTA MARIA CAHABON',
        'LANQUIN','CHAHAL','FRAY BARTOLOME DE LAS CASAS','LA TINTA','CHISEC','RAXRUHA',
        'SAN PEDRO CARCHA','SAN JUAN CHAMELCO'],
    'BAJA VERAPAZ': ['SALAMA','SAN MIGUEL CHICAJ','RABINAL','CUBULCO','GRANADOS',
        'EL CHOL','SAN JERONIMO','PURULHA','PURULHÁ'],
    'CHIMALTENANGO': ['CHIMALTENANGO','SAN JOSE POAQUIL','SAN MARTIN JILOTEPEQUE','COMALAPA',
        'SANTA APOLONIA','TECPAN GUATEMALA','PATZUN','POCHUTA','PATZICIA',
        'SANTA CRUZ BALANYA','ACATENANGO','SAN PEDRO YEPOCAPA','SAN ANDRES ITZAPA',
        'PARRAMOS','ZARAGOZA','EL TEJAR'],
    'CHIQUIMULA': ['CHIQUIMULA','SAN JOSE LA ARADA','SAN JUAN ERMITA','JOCOTAN',
        'CAMOTAN','OLOPA','ESQUIPULAS','CONCEPCION LAS MINAS','QUEZALTEPEQUE',
        'SAN JACINTO','IPALA'],
    'CIUDAD CAPITAL': [  # Zonas de la ciudad
        'ZONA 1','ZONA 2','ZONA 3','ZONA 4','ZONA 5','ZONA 6','ZONA 7','ZONA 8',
        'ZONA 9','ZONA 10','ZONA 11','ZONA 12','ZONA 13','ZONA 14','ZONA 15',
        'ZONA 16','ZONA 17','ZONA 18','ZONA 19','ZONA 21','ZONA 24','ZONA 25'],
    'EL PROGRESO': ['GUASTATOYA','MORAZAN','SAN AGUSTIN ACASAGUASTLAN',
        'SAN CRISTOBAL ACASAGUASTLAN','EL JICARO','SANSARE','SANARATE','SAN ANTONIO LA PAZ'],
    'ESCUINTLA': ['ESCUINTLA','SANTA LUCIA COTZUMALGUAPA','LA DEMOCRACIA','SIQUINALA',
        'MASAGUA','TIQUISATE','LA GOMERA','GUANAGAZAPA','SAN JOSE','IZTAPA',
        'PALIN','SAN VICENTE PACAYA','NUEVA CONCEPCION'],
    'HUEHUETENANGO': ['HUEHUETENANGO','CHIANTLA','MALACATANCITO','AGUACATAN','SANTA BARBARA',
        'CUILCO','NENTON','SAN PEDRO NECTA','JACALTENANGO','SAN PEDRO SOLOMA',
        'SAN ILDEFONSO IXTAHUACAN','SANTA ANA HUISTA','SAN ANTONIO HUISTA',
        'SAN SEBASTIAN HUEHUETENANGO','TECTITAN','CONCEPCION HUISTA','SAN JUAN IXCOY',
        'SAN ANTONIO IXTAHUACAN','SANTA EULALIA','SAN MARCOS HUEHUETENANGO',
        'LA LIBERTAD','LA DEMOCRACIA','SAN MIGUEL ACATAN','SAN RAFAEL LA INDEPENDENCIA',
        'TODOS SANTOS CUCHUMATAN','TODO SANTOS CUCHUMATAN','SAN JUAN ATITAN',
        'SANTA CATARINA IXTAHUACAN','SANTA CRUZ BARILLAS','SAN RAFAEL PETZAL',
        'SAN GASPAR IXCHIL','SANTIAGO CHIMALTENANGO','UNION CANTINIL'],
    'IZABAL': ['PUERTO BARRIOS','LIVINGSTON','EL ESTOR','MORALES','LOS AMATES'],
    'JALAPA': ['JALAPA','SAN PEDRO PINULA','SAN LUIS JILOTEPEQUE',
        'SAN MANUEL CHAPARRON','SAN CARLOS ALZATATE','MONJAS','MATAQUESCUINTLA'],
    'JUTIAPA': ['JUTIAPA','EL PROGRESO','SANTA CATARINA MITA','AGUA BLANCA',
        'ASUNCION MITA','YUPILTEPEQUE','ATESCATEMPA','JEREZ','EL ADELANTO',
        'ZAPOTITLAN','COMAPA','JALPATAGUA','CONGUACO','MOYUTA','PASACO',
        'SAN JOSE ACATEMPA','QUEZADA'],
    'PETEN': ['FLORES','SAN JOSE','SAN BENITO','SAN ANDRES','LA LIBERTAD','SAN FRANCISCO',
        'SANTA ANA','DOLORES','SAN LUIS','MELCHOR DE MENCOS','POPTUN','LAS CRUCES','EL CHAL'],
    'QUETZALTENANGO': ['QUETZALTENANGO','SALCAJA','OLINTEPEQUE','SAN CARLOS SIJA','SIBILIA',
        'CABRICAN','CAJOLA','SAN MIGUEL SIGUILA','OSTUNCALCO','SAN MATEO',
        'CONCEPCION CHIQUIRICHAPA','SAN MARTIN SACATEPEQUEZ','ALMOLONGA','CANTEL','HUITAN',
        'ZUNIL','COLOMBA','SAN FRANCISCO LA UNION','EL PALMAR','COATEPEQUE',
        'GENOVA','FLORES COSTA CUCA','LA ESPERANZA','PALESTINA DE LOS ALTOS'],
    'QUICHE': ['SANTA CRUZ DEL QUICHE','CHICHE','CHINIQUE','ZACUALPA',
        'CHICHICASTENANGO','PATZITE','SAN ANTONIO ILOTENANGO','SAN PEDRO JOCOPILAS',
        'CUNEN','SAN JUAN COTZAL','JOYABAJ','NEBAJ','SAN ANDRES SAJCABAJA',
        'USPANTAN','SACAPULAS','SAN BARTOLOME JOCOTENANGO','CANILLA','CHICAMAN',
        'IXCAN','PACHALUM','PLAYA GRANDE IXCAN'],
    'RETALHULEU': ['RETALHULEU','SAN SEBASTIAN','SANTA CRUZ MULUA','SAN MARTIN ZAPOTITLAN',
        'SAN FELIPE','SAN ANDRES VILLA SECA','CHAMPERICO','NUEVO SAN CARLOS','EL ASINTAL'],
    'SACATEPEQUEZ': ['ANTIGUA GUATEMALA','JOCOTENANGO','PASTORES','SUMPANGO',
        'SANTO DOMINGO XENACOJ','SANTIAGO SACATEPEQUEZ','SAN BARTOLOME MILPAS ALTAS',
        'SAN LUCAS SACATEPEQUEZ','SANTA LUCIA MILPAS ALTAS','MAGDALENA MILPAS ALTAS',
        'SANTA MARIA DE JESUS','CIUDAD VIEJA','SAN MIGUEL DUENAS','ALOTENANGO',
        'SAN ANTONIO AGUAS CALIENTES','SANTA CATARINA BARAHONA'],
    'SAN MARCOS': ['SAN MARCOS','SAN PEDRO SACATEPEQUEZ','SAN ANTONIO SACATEPEQUEZ',
        'COMITANCILLO','SAN MIGUEL IXTAHUACAN','CONCEPCION TUTUAPA','TAJUMULCO',
        'SIBINAL','TACANA','SAN CRISTOBAL CUCHO','SIPACAPA',
        'ESQUIPULAS PALO GORDO','RIO BLANCO','SAN LORENZO','LA REFORMA','PAJAPITA',
        'AYUTLA','MALACATAN','EL TUMBADOR','EL RODEO','NUEVO PROGRESO','LA BLANCA',
        'SAN RAFAEL PIE DE LA CUESTA','CATARINA'],
    'SANTA ROSA': ['CUILAPA','BARBERENA','SANTA ROSA DE LIMA','CASILLAS',
        'SAN RAFAEL LAS FLORES','ORATORIO','SAN JUAN TECUACO','CHIQUIMULILLA',
        'TAXISCO','SANTA MARIA IXHUATAN','GUAZACAPAN','SANTA CRUZ NARANJO',
        'PUEBLO NUEVO VIÑAS','NUEVA SANTA ROSA'],
    'SOLOLA': ['SOLOLA','SOLOLÁ','SAN JOSE CHACAYA','SANTA MARIA VISITACION',
        'SANTA LUCIA UTATLAN','NAHUALA','SANTA CATARINA IXTAHUACAN',
        'SANTA CLARA LA LAGUNA','CONCEPCION','SAN ANDRES SEMETABAJ','PANAJACHEL',
        'SANTA CATARINA PALOPO','SAN ANTONIO PALOPO','SAN LUCAS TOLIMAN',
        'SANTA CRUZ LA LAGUNA','SAN PABLO LA LAGUNA','SAN MARCOS LA LAGUNA',
        'SAN JUAN LA LAGUNA','SAN PEDRO LA LAGUNA','SANTIAGO ATITLAN'],
    'SUCHITEPEQUEZ': ['MAZATENANGO','CUYOTENANGO','SAN FRANCISCO ZAPOTITLAN',
        'SAN BERNARDINO','SAN JOSE EL IDOLO','SANTO DOMINGO SUCHITEPEQUEZ',
        'SAN LORENZO','SAMAYAC','SAN PABLO JOCOPILAS','SAN ANTONIO SUCHITEPEQUEZ',
        'SAN MIGUEL PANAN','SAN GABRIEL','CHICACAO','PATULUL','SANTA BARBARA',
        'SAN JUAN BAUTISTA','SANTO TOMAS LA UNION','ZUNILITO','PUEBLO NUEVO','RIO BRAVO'],
    'TOTONICAPAN': ['TOTONICAPAN','TOTONICAPÁN','SAN CRISTOBAL TOTONICAPAN',
        'SAN FRANCISCO EL ALTO','SAN ANDRES XECUL','MOMOSTENANGO',
        'SANTA MARIA CHIQUIMULA','SANTA LUCIA LA REFORMA','SAN BARTOLO'],
    'ZACAPA': ['ZACAPA','ESTANZUELA','RIO HONDO','GUALAN','TECULUTAN',
        'USUMATLAN','CABANAS','SAN DIEGO','LA UNION','HUITE'],
}

def title_mun(s):
    preps = {'de','del','la','las','el','los','y','e','en','a'}
    words = s.strip().lower().split()
    return ' '.join(w if (i>0 and w in preps) else w.capitalize() for i, w in enumerate(words))

def clean(t):
    t = re.sub(r'<br\s*/?>', ' ', t, flags=re.I)
    return re.sub(r'\s+', ' ', t).strip()

NIVEL_END_RE = re.compile(
    r'\s+(INICIAL|PARVULOS|PARVULARIA|PRIMARIA|BASICO|DIVERSIFICADO)\s+'
    r'(OFICIAL|PRIVADO|COOPERATIVA|MUNICIPAL|POR COOPERATIVA|TECNICO)\s*\d{0,8}\s*$', re.I)
HEADER_RE = re.compile(r'^(PLA-PLT|F O R M|INFORMACIÓN|Del proceso|Todos los|NO\.\s+CÓDIGO|\*{2})', re.I)
CODE_RE = re.compile(r'^\d+\s+\d{2}-\d{2}-\d{4}-\d{2}\s+')

def find_mun(after_dept_upper, dept_key):
    munics = MUNICS_BY_DEPT.get(dept_key, [])
    for m in sorted(munics, key=len, reverse=True):
        mu = m.upper()
        if after_dept_upper.startswith(mu + ' ') or after_dept_upper == mu:
            return m, len(mu)
        # Sin espacios
        mu_nsp = mu.replace(' ', '')
        adu_nsp = after_dept_upper.replace(' ', '')
        if adu_nsp.startswith(mu_nsp):
            # contar chars originales
            consumed, ci = 0, 0
            for ch in after_dept_upper:
                if ci >= len(mu_nsp): break
                if ch != ' ': ci += 1
                consumed += 1
            return m, consumed
    return None, 0

def strip_dept(text, dept_raw):
    """Quita el nombre de departamento del inicio del texto (con y sin espacios)."""
    tu = text.upper()
    du = dept_raw.upper()
    if tu.startswith(du + ' ') or tu == du:
        return text[len(du):].strip()
    # Sin espacios
    du_nsp = du.replace(' ','')
    consumed, ci = 0, 0
    for ch in tu:
        if ci >= len(du_nsp): break
        if ch != ' ': ci += 1
        consumed += 1
    if ci == len(du_nsp):
        return text[consumed:].strip()
    return text

def extract_name(rest):
    """Quita NIVEL SECTOR TELEFONO del final."""
    name = NIVEL_END_RE.sub('', rest).strip()
    return clean(name)

# ── Parser texto plano ─────────────────────────────────────────
def parse_plain(content, dept_title, dept_raw):
    dept_key = dept_raw.upper()
    lines = []
    for ln in content.splitlines():
        ln2 = ln.strip().lstrip('#').strip()
        if HEADER_RE.match(ln2) or not ln2:
            continue
        lines.append(ln2)

    records_raw = []
    current = None
    for ln in lines:
        if CODE_RE.match(ln):
            if current is not None:
                records_raw.append(current)
            current = ln
        elif current is not None:
            current += ' ' + ln
    if current:
        records_raw.append(current)

    results = []
    for rec in records_raw:
        rec = clean(rec)
        m = CODE_RE.match(rec)
        if not m: continue
        after_code = rec[m.end():]
        after_dept = strip_dept(after_code, dept_raw)
        mun_raw, pos = find_mun(after_dept.upper(), dept_key)
        if not mun_raw: continue
        rest = after_dept[pos:].strip()
        name = extract_name(rest)
        if len(name) < 2: continue
        results.append((mun_raw, name))
    return results

# ── Parser tabla Markdown ──────────────────────────────────────
def parse_table(content, dept_title, dept_raw):
    """
    Parsea tablas Markdown. Maneja:
    - Filas de 9 celdas (completas): NO | CÓDIGO | DEPT | MUN | NOMBRE | DIR | NIVEL | SECTOR | TEL
    - Filas de 8 celdas (sin DIRECCIÓN, frecuente tras saltos de página)
    - <br> como separador dentro de celdas
    """
    results = []
    for line in content.splitlines():
        line = line.strip()
        if not line.startswith('|'):
            continue
        cells = [clean(c) for c in line.split('|') if c.strip() not in ('', '---', '----')]
        if len(cells) < 5:
            continue
        no = cells[0].strip()
        if not re.match(r'^\d+$', no):
            continue
        # Determinar posiciones según número de celdas
        if len(cells) >= 9:
            # NO | CODE | DEPT | MUN | NOMBRE | DIR | NIVEL | SECTOR | TEL
            mun_f   = cells[3]
            nombre_f = cells[4]
        elif len(cells) == 8:
            # NO | CODE | DEPT | MUN | NOMBRE | NIVEL | SECTOR | TEL (sin DIR)
            mun_f   = cells[3]
            nombre_f = cells[4]
        elif len(cells) == 7:
            # Puede que DEPT esté ausente
            mun_f   = cells[2]
            nombre_f = cells[3]
        else:
            continue
        mun   = clean(mun_f)
        nombre = clean(nombre_f)
        if not mun or not nombre or len(nombre) < 2:
            continue
        if nombre.upper() in ('NOMBRE_ESTABLECIMIENTO', 'NOMBRE', 'NO.', ''):
            continue
        results.append((mun, nombre))
    return results

# ── Main ───────────────────────────────────────────────────────
all_schools = {}
seen_global = set()
total = 0

md_files = sorted(f for f in os.listdir(BD_DIR) if f.lower().endswith('.md') and '(1)' not in f)

for fname in md_files:
    fu = fname.upper()
    dept_title = dept_raw = None
    for key in sorted(DEPT_MAP, key=len, reverse=True):
        if key in fu:
            dept_title, dept_raw = DEPT_MAP[key]
            break
    if not dept_title:
        print(f"  [SKIP] {fname}")
        continue

    fpath = os.path.join(BD_DIR, fname)
    with open(fpath, encoding='utf-8', errors='replace') as f:
        content = f.read()

    if '|---|' in content or '| --- |' in content:
        records = parse_table(content, dept_title, dept_raw)
        fmt = 'tabla'
    else:
        records = parse_plain(content, dept_title, dept_raw)
        fmt = 'plano'

    count = 0
    for mun_raw, nombre in records:
        mun_clean   = title_mun(mun_raw)
        # Nombre: aplicar title() si está todo en mayúsculas
        nombre_clean = nombre.title() if nombre.isupper() else nombre
        # Limpiar dobles espacios que quedaron
        nombre_clean = re.sub(r'\s+', ' ', nombre_clean).strip()
        label = f"{nombre_clean} · {mun_clean}"
        key = f"{nombre_clean.upper()}||{mun_clean.upper()}||{dept_title}"
        if key in seen_global: continue
        seen_global.add(key)
        if dept_title not in all_schools:
            all_schools[dept_title] = []
        all_schools[dept_title].append(label)
        count += 1
        total += 1
    print(f"{fname}: {count} ({fmt})")

for dept in all_schools:
    all_schools[dept] = sorted(set(all_schools[dept]))

print(f"\nTotal únicos: {total}")
print(f"Departamentos con datos: {len(all_schools)}")

out_path = r"C:\Users\billi\Downloads\Curso STEAM 2.0\schools_gt.js"
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('/* Centros Educativos Guatemala — DIGEACE 2026 */\n')
    f.write('const SCHOOLS_GT=')
    json.dump(all_schools, f, ensure_ascii=False, separators=(',',':'))
    f.write(';\n')

size = os.path.getsize(out_path)
print(f"Generado: {out_path} ({size//1024} KB)")
