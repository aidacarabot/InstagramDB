# InstagramDB

InstagramDB es una API RESTful construida con Node.js, Express y MongoDB, diseñada para simular una base de datos de Instagram. Permite la creación, lectura, actualización y eliminación (CRUD) de cuentas de usuario y publicaciones, incluyendo la subida y gestión de imágenes a través de Cloudinary.

## Características

- **CRUD completo**: Operaciones CRUD completas para las colecciones de `Accounts` y `Posts`.
- **Subida de archivos**: Manejo de la subida de imágenes tanto para perfiles de usuario (`profilePicture`) como para publicaciones (`imageUrl`), con almacenamiento en Cloudinary.
- **Eliminación de archivos**: Eliminación automática de las imágenes almacenadas en Cloudinary cuando se borra un `Account` o `Post`.
- **Relaciones entre colecciones**: Los `Posts` están relacionados con los `Accounts` a través de una referencia de MongoDB.
- **Semillas de datos**: Script para la carga inicial de datos en la base de datos.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework de Node.js para la construcción de aplicaciones web y APIs.
- **MongoDB Atlas**: Base de datos NoSQL para almacenar los datos de las cuentas y publicaciones.
- **Mongoose**: ODM para modelar datos en MongoDB.
- **Cloudinary**: Servicio para la gestión de imágenes, utilizado para almacenar imágenes de perfiles y publicaciones.
- **Multer**: Middleware para la gestión de archivos en solicitudes HTTP.
- **dotenv**: Módulo para manejar variables de entorno.

## Instalación

Sigue los pasos a continuación para clonar y configurar el proyecto en tu entorno local:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/aidact3/InstagramDB.git
   cd InstagramDB
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   DB_URL=<tu_mongoDB_atlas_url>
   CLOUDINARY_CLOUD_NAME=<tu_nombre_de_cloudinary>
   CLOUDINARY_API_KEY=<tu_api_key_de_cloudinary>
   CLOUDINARY_API_SECRET=<tu_api_secret_de_cloudinary>
   ```

4. **Ejecutar el proyecto**:
   ```bash
   npm start
   ```

## Endpoints

### Accounts

- **POST /api/accounts/**: Crea una nueva cuenta.
  - Parámetros de la solicitud (form-data):
    - `username`: Nombre de usuario (string).
    - `bio`: Biografía del usuario (string).
    - `profilePicture`: Imagen de perfil (archivo).

- **GET /api/accounts/**: Obtiene todas las cuentas.

- **GET /api/accounts/:id**: Obtiene una cuenta por su ID.

- **PUT /api/accounts/:id**: Actualiza una cuenta existente.
  - Parámetros de la solicitud (form-data):
    - `username`: Nombre de usuario (string).
    - `bio`: Biografía del usuario (string).
    - `profilePicture`: Imagen de perfil (archivo).

- **DELETE /api/accounts/:id**: Elimina una cuenta por su ID (incluyendo la imagen en Cloudinary).

### Posts

- **POST /api/posts/**: Crea una nueva publicación.
  - Parámetros de la solicitud (form-data):
    - `caption`: Descripción de la publicación (string).
    - `image`: Imagen de la publicación (archivo).
    - `account`: ID de la cuenta asociada (ObjectId).

- **GET /api/posts/**: Obtiene todas las publicaciones.

- **GET /api/posts/:id**: Obtiene una publicación por su ID.

- **PUT /api/posts/:id**: Actualiza una publicación existente.
  - Parámetros de la solicitud (form-data):
    - `caption`: Descripción de la publicación (string).
    - `image`: Imagen de la publicación (archivo).

- **DELETE /api/posts/:id**: Elimina una publicación por su ID (incluyendo la imagen en Cloudinary).

## Semillas de Datos

Para poblar la base de datos con datos iniciales, puedes ejecutar los scripts de semillas incluidos:

- **Accounts**: 
  ```bash
  npm run seedAccount
  ```
  
- **Posts**: 
  ```bash
  npm run seedPost
  ```

Estos scripts crearán cuentas y publicaciones de ejemplo en tu base de datos.

## Gestión de Archivos en Cloudinary

- **Subida de Imágenes**: Las imágenes se suben a Cloudinary a carpetas específicas según el tipo de datos (`Profile_Pictures` para cuentas y `Instagram_Posts` para publicaciones).
- **Eliminación de Imágenes**: Las imágenes se eliminan automáticamente de Cloudinary cuando se elimina la cuenta o la publicación correspondiente.

## Reutilización del Storage en Cloudinary

El proyecto incluye la capacidad de reutilizar el almacenamiento en Cloudinary, permitiendo cambiar dinámicamente la carpeta de destino para las imágenes. Esta funcionalidad se puede personalizar o comentar según las necesidades específicas.

