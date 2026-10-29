"""Genera abarrotes_trimestre.sql: las ventas de Abarrotes La Esquina de octubre a diciembre de 2026.

Se usa desde la Unidad 2 del M2. La semilla es fija, así que el archivo sale idéntico cada vez;
si se cambia algo aquí, hay que volver a verificar todas las lecciones (`npm run verificar`).

Uso: python generar_trimestre.py
"""
import random
from datetime import date, timedelta
from pathlib import Path

PRODUCTOS = [
    # producto, categoría, precio por pieza, piezas por venta (mín, máx)
    ('Refresco 600 ml', 'Bebidas', 18, 1, 6),
    ('Agua 1 L', 'Bebidas', 12, 1, 6),
    ('Jugo de naranja 1 L', 'Bebidas', 32, 1, 3),
    ('Café soluble 120 g', 'Bebidas', 65, 1, 2),
    ('Pan de caja', 'Panadería', 45, 1, 2),
    ('Bolillo', 'Panadería', 3, 4, 18),
    ('Pan dulce', 'Panadería', 12, 1, 8),
    ('Leche 1 L', 'Lácteos', 28, 1, 4),
    ('Yogur 1 L', 'Lácteos', 38, 1, 2),
    ('Queso fresco 250 g', 'Lácteos', 55, 1, 2),
    ('Papas fritas', 'Botanas', 20, 1, 5),
    ('Galletas', 'Botanas', 22, 1, 5),
    ('Cacahuates 150 g', 'Botanas', 25, 1, 4),
    ('Arroz 1 kg', 'Abarrotes', 32, 1, 3),
    ('Frijol 1 kg', 'Abarrotes', 40, 1, 3),
    ('Aceite 1 L', 'Abarrotes', 48, 1, 2),
]
SUCURSALES = ['Norte', 'Centro', 'Sur']

# Ventas de mayoreo: las más grandes del trimestre, cada una con su historia
MAYOREO = {
    date(2026, 11, 1): ('Pan dulce', 24, 'Centro'),          # Día de Muertos
    date(2026, 11, 2): ('Agua 1 L', 30, 'Norte'),            # el panteón de enfrente
    date(2026, 11, 20): ('Refresco 600 ml', 21, 'Sur'),       # posada de la escuela
    date(2026, 12, 24): ('Bolillo', 40, 'Centro'),           # Nochebuena
    date(2026, 12, 31): ('Refresco 600 ml', 36, 'Sur'),       # Año Nuevo
}

azar = random.Random(2026)
filas = []
dia = date(2026, 10, 1)
while dia <= date(2026, 12, 31):
    ventas_del_dia = azar.randint(2, 4)
    for _ in range(ventas_del_dia):
        producto, categoria, precio, minimo, maximo = azar.choice(PRODUCTOS)
        filas.append([dia.isoformat(), producto, categoria, azar.randint(minimo, maximo), precio, azar.choice(SUCURSALES)])
    if dia in MAYOREO:
        producto, cantidad, sucursal = MAYOREO[dia]
        _, categoria, precio, _, _ = next(p for p in PRODUCTOS if p[0] == producto)
        filas.append([dia.isoformat(), producto, categoria, cantidad, precio, sucursal])
    dia += timedelta(days=1)

lineas = [
    '-- Dataset: ventas de Abarrotes La Esquina, octubre a diciembre de 2026 (3 sucursales).',
    '-- Se usa desde la Unidad 2 del M2. Generado con generar_trimestre.py (semilla fija): no editar a mano.',
    'CREATE TABLE ventas (',
    '  id_venta INTEGER, fecha TEXT, producto TEXT, categoria TEXT,',
    '  cantidad INTEGER, precio_unitario INTEGER, sucursal TEXT',
    ');',
    'INSERT INTO ventas VALUES',
]
valores = [f"({i},'{f}','{p}','{c}',{q},{pr},'{s}')" for i, (f, p, c, q, pr, s) in enumerate(filas, start=1)]
lineas.append(',\n'.join(valores) + ';')
Path(__file__).with_name('abarrotes_trimestre.sql').write_text('\n'.join(lineas) + '\n', encoding='utf-8', newline='\n')
print(f'{len(filas)} ventas escritas')
