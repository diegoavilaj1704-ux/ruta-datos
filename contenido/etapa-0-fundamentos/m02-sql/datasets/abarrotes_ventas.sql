-- Dataset: ventas de Abarrotes La Esquina (3 sucursales)
-- Se carga automáticamente en el editor de la app para el M2.
CREATE TABLE ventas (
  id_venta INTEGER, fecha TEXT, producto TEXT, categoria TEXT,
  cantidad INTEGER, precio_unitario INTEGER, sucursal TEXT
);
INSERT INTO ventas VALUES
(1,'2026-10-01','Refresco 600 ml','Bebidas',3,18,'Centro'),
(2,'2026-10-01','Pan de caja','Panadería',1,45,'Norte'),
(3,'2026-10-02','Leche 1 L','Lácteos',2,28,'Centro'),
(4,'2026-10-02','Refresco 600 ml','Bebidas',5,18,'Sur'),
(5,'2026-10-03','Galletas','Botanas',4,22,'Norte'),
(6,'2026-10-03','Leche 1 L','Lácteos',1,28,'Sur'),
(7,'2026-10-04','Papas fritas','Botanas',2,20,'Centro'),
(8,'2026-10-04','Agua 1 L','Bebidas',6,12,'Norte');
