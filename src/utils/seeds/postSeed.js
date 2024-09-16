const postsData = require("../../data/posts");
const Post = require("../../api/models/post");
const Account = require("../../api/models/account");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

// Conectarse a la base de datos
mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    const allPosts = await Post.find();

    // Si existen posts previamente, borraremos la colección
    if (allPosts.length) {
      await Post.collection.drop();
      console.log('Colección de Posts eliminada');
    }
  })
  .catch((err) => console.log(`Error eliminando datos: ${err}`))
  .then(async () => {
    // Asegurarse de que las cuentas existen para asociar posts
    const accounts = await Account.find();

    if (!accounts.length) {
      throw new Error('No hay cuentas en la base de datos. Inserta cuentas antes de los posts.');
    }

    // Asocia cada post a una cuenta existente
    const postsWithAccount = postsData.map(post => {
      const account = accounts.find(acc => acc.username === post.username);
      
      if (!account) {
        console.error(`No se encontró la cuenta para el usuario ${post.username}`);
        return null;
      }
      
      return { ...post, account: account._id };
    }).filter(post => post !== null); // Filtrar los posts que no tienen cuenta asociada

    // Insertar los datos de posts en la colección
    await Post.insertMany(postsWithAccount);
    console.log('Datos de Posts insertados');
  })
  .catch((err) => console.log(`Error creando datos: ${err}`))
  .finally(() => mongoose.disconnect());