CREATE TABLE IF NOT EXISTS "admin"(ID SERIAL PRIMARY KEY, username VARCHAR(255), "password" VARCHAR(255), "name" VARCHAR(255), "mail" VARCHAR(255));
CREATE TABLE IF NOT EXISTS "user"(ID SERIAL PRIMARY KEY, ID_admin INT REFERENCES admin(ID), username VARCHAR(255), "password" VARCHAR(255), type_user VARCHAR(255));
CREATE TABLE IF NOT EXISTS "encargado_inventario"(ID SERIAL PRIMARY KEY, ID_user INT REFERENCES "user"(ID), "name" VARCHAR(255), "mail" VARCHAR(255), telefono INT);
CREATE TABLE IF NOT EXISTS "personal_medico"(ID SERIAL PRIMARY KEY, ID_user INT REFERENCES "user"(ID), "name" VARCHAR(255), "area" VARCHAR(255), "mail" VARCHAR(255), telefono INT);
CREATE TABLE IF NOT EXISTS "item_inventario"(ID SERIAL PRIMARY KEY, "name_product" VARCHAR(255), "descripcion" VARCHAR(255), cantidad INT, precio INT);
CREATE TABLE IF NOT EXISTS "ei_inventario"(ID SERIAL PRIMARY KEY, ID_ei INT REFERENCES encargado_inventario(ID), ID_producto INT REFERENCES item_inventario(ID), fecha_operacion TIMESTAMP, tipo_operacion INT);
CREATE TABLE IF NOT EXISTS "pm_inventario"(ID SERIAL PRIMARY KEY, ID_pm INT REFERENCES personal_medico(ID), ID_producto INT REFERENCES item_inventario(ID), fecha_operacion TIMESTAMP);
