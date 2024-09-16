const cloudinary = require('cloudinary').v2;

const deleteImgCloudinary = (imgUrl) => {
  //----Con los siguientes métodos de JavaScript accederemos a la ruta de la imagen, su nombre, su carpeta y el id con el que se almacena en cloudinary para localizarlo nivel a nivel.
  const imgSplited = imgUrl.split('/')
  const nameSplited = imgSplited.at(-1).split('.')[0]
  const folderSplited = imgSplited.at(-2);
  const public_id = `${folderSplited}/${nameSplited}`;

  //----Con el método destroy localizamos nuestro archivo e imprimimos por callback un console.log indicando que se ha podido destruir correctamente.
  cloudinary.uploader.destroy(public_id, () => {
      console.log('Imagen eliminada en cloudinary')
  })
}

module.exports = { deleteImgCloudinary }