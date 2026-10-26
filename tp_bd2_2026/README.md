# AulaDB

Aplicación Next.js para administrar la base académica del proyecto. El esquema se lee desde la base MySQL activa: el explorador muestra tablas, columnas, tipos, claves primarias y referencias foráneas; el formulario permite insertar registros y el editor permite ejecutar consultas SQL.

## Requisitos

- Node.js 20.9 o posterior.
- Una base MySQL/MariaDB ya creada con el esquema del proyecto.
- Una clave privada para proteger el acceso a la aplicación.

## Configuración local

Desde esta carpeta (`tp_bd2_2026`), instalá dependencias y creá `.env.local`:

```env
APP_ACCESS_TOKEN=una-clave-larga-y-privada
MYSQLHOST=host-de-mysql
MYSQLPORT=3306
MYSQLUSER=usuario
MYSQLPASSWORD=contraseña
MYSQLDATABASE=nombre_de_la_base
```

También se puede configurar `MYSQL_URL` o `DATABASE_URL` con una URL `mysql://usuario:contraseña@host:3306/base`. Si el servidor requiere TLS, agregá `MYSQL_SSL=true`.

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000` e ingresá el mismo valor de `APP_ACCESS_TOKEN`. La clave se conserva solo en `sessionStorage` durante la sesión actual del navegador.

## Despliegue en Railway

Desplegá esta carpeta como servicio web y configurá sus variables de entorno con las variables de conexión que Railway proporciona para el servicio MySQL (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`). Agregá también `APP_ACCESS_TOKEN` como secreto independiente. El comando de build es `npm run build` y el comando de inicio es `npm run start`.

No publiques el servicio sin `APP_ACCESS_TOKEN`: las rutas de esquema, inserción y consultas SQL exigen autenticación. No compartas la clave ni la URL de conexión.

## Permisos de la consola

La consola acepta consultas de lectura y escritura, incluyendo `SELECT`, `INSERT`, `UPDATE`, `DELETE` y otras operaciones SQL. `CREATE TABLE`, `DROP TABLE` y `TRUNCATE TABLE` se rechazan en el servidor. Las consultas se ejecutan contra la base configurada para la aplicación; usá credenciales de base con los permisos mínimos necesarios y evitá ejecutar operaciones irreversibles.
