### comandos a utilizar antes de iniciar a probar la página, no cambiar el orden:

### 1. Instalar librerías
npm install

### 2. Restablecer cualquier cambio en la BD.
npx dotenv sequelize db:migrate:undo:all

### 3. Crear las tablas y campos en la BD con los archivos de la carpeta migrations.
npx dotenv sequelize db:migrate

### 4. Cargar datos necesarios en algunas tablas.
npx dotenv sequelize db:seed:all

### 5. Iniciar la página en modo test.
npm start