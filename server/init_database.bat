@echo off
echo Deshaciendo todas las migraciones...
npx dotenv sequelize db:migrate:undo:all

echo Ejecutando todas las migraciones...
npx dotenv sequelize db:migrate

echo Ejecutando todas las semillas...
npx dotenv sequelize db:seed:all