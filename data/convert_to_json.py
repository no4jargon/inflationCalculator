import zipfile
import xml.etree.ElementTree as ET
import json, sys

xlsx_file = 'CPI-Jan13-To-May25.xlsx'

with zipfile.ZipFile(xlsx_file) as z:
    with z.open('xl/sharedStrings.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()
        ns = {'': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        strings = [t.text for t in root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')]
    with z.open('xl/worksheets/sheet1.xml') as f:
        tree = ET.parse(f)
        sheet = tree.getroot()

# Build map of row data
rows = sheet.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
header = None
cpi = {}
for r in rows:
    r_idx = int(r.attrib['r'])
    cells = r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c')
    values = {}
    for c in cells:
        ref = c.attrib['r']
        col = ''.join(filter(str.isalpha, ref))
        v_elem = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
        val = v_elem.text if v_elem is not None else ''
        if c.attrib.get('t') == 's':
            val = strings[int(val)]
        values[col] = val
    if r_idx == 3:
        header = values
    elif r_idx > 3:
        year = values.get('A')
        month = values.get('B')
        combined = values.get('I')
        if not year or not month or not combined:
            continue
        try:
            combined = float(combined)
        except:
            continue
        if year not in cpi:
            cpi[year] = {}
        cpi[year][month] = combined

json.dump(cpi, sys.stdout, indent=2)
