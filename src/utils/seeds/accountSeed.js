const accountsData = require("../../data/accounts");
const Account = require("../../api/models/account");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

// Conectarse a la base de datos
mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    const allAccounts = await Account.find();

    // Si existen cuentas previamente, borraremos la colección
    if (allAccounts.length) {
      await Account.collection.drop();
      console.log('Colección de Accounts eliminada');
    }
  })
  .catch((err) => console.log(`Error eliminando datos: ${err}`))
  .then(async () => {
    // Insertar los datos del archivo accounts en la colección
    await Account.insertMany(accountsData);
    console.log('Datos de Accounts insertados');
  })
  .catch((err) => console.log(`Error creando datos: ${err}`))
  .finally(() => mongoose.disconnect());