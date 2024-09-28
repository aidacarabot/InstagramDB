# InstagramDB

InstagramDB es una API RESTful construida con Node.js, Express y MongoDB, diseñada para simular una base de datos de Instagram. Permite la creación, lectura, actualización y eliminación (CRUD) de cuentas de usuario y publicaciones, incluyendo la subida y gestión de imágenes a través de Cloudinary.

El sistema de autenticación de la API utiliza JSON Web Tokens (JWT) para proteger las rutas, asegurando que solo los usuarios autenticados puedan realizar operaciones. La autenticación se realiza mediante el esquema Bearer, donde los usuarios reciben un token JWT al iniciar sesión, el cual deben incluir en las cabeceras de las solicitudes a rutas protegidas.

Las contraseñas de los usuarios se gestionan utilizando bcrypt para asegurar el almacenamiento seguro, aplicando un hash a las contraseñas antes de almacenarlas en la base de datos. Este enfoque garantiza que incluso si la base de datos es comprometida, las contraseñas originales no serán expuestas.

## Características

- **CRUD completo**: Operaciones CRUD completas para las colecciones de `Accounts` y `Posts`.
- **Subida de archivos**: Manejo de la subida de imágenes tanto para perfiles de usuario (`profilePicture`) como para publicaciones (`imageUrl`), con almacenamiento en Cloudinary.
- **Eliminación de archivos**: Eliminación automática de las imágenes almacenadas en Cloudinary cuando se borra un `Account` o `Post`.
- **Relaciones entre colecciones**: Los `Posts` están relacionados con los `Accounts` a través de una referencia de MongoDB.
- **Autenticación**: Autenticación de usuarios mediante JWT, con protección de rutas a través del esquema Bearer.
- **Seguridad**: Gestión de contraseñas mediante bcrypt para asegurar que las contraseñas sean almacenadas de manera segura.
- **Semillas de datos**: Script para la carga inicial de datos en la base de datos.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework de Node.js para la construcción de aplicaciones web y APIs.
- **MongoDB Atlas**: Base de datos NoSQL para almacenar los datos de las cuentas y publicaciones.
- **Mongoose**: ODM para modelar datos en MongoDB.
- **Cloudinary**: Servicio para la gestión de imágenes, utilizado para almacenar imágenes de perfiles y publicaciones.
- **Multer**: Middleware para la gestión de archivos en solicitudes HTTP.
- **bcrypt**: Para el hasheo de contraseñas.
- **jsonwebtoken**: Para la generación y verificación de JWT.
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
   JWT_SECRET=<tu_secreto_jwt>
   ```

4. **Ejecutar el proyecto**:
   ```bash
   npm start
   ```

## Endpoints

### Accounts

- **POST /api/v1/account/**: Crea una nueva cuenta.
  - **Parámetros de la solicitud (form-data)**:
    - `username`: Nombre de usuario (string).
    - `password`: Contraseña del usuario (string).
    - `bio`: Biografía del usuario (string).
    - `profilePicture`: Imagen de perfil (archivo).

- **POST /api/v1/account/login**: Autentica al usuario y devuelve un token JWT.
  - **Parámetros de la solicitud (JSON)**:
    - `username`: Nombre de usuario (string).
    - `password`: Contraseña del usuario (string).

- **GET /api/v1/account/**: Obtiene todas las cuentas. **(Requiere Bearer Token)**

- **GET /api/v1/account/:id**: Obtiene una cuenta por su ID. **(Requiere Bearer Token)**

- **PUT /api/v1/account/:id**: Actualiza una cuenta existente. **(Requiere Bearer Token)**
  - **Parámetros de la solicitud (form-data)**:
    - `username`: Nombre de usuario (string).
    - `password`: Contraseña del usuario (string, opcional).
    - `bio`: Biografía del usuario (string).
    - `profilePicture`: Imagen de perfil (archivo).

- **DELETE /api/v1/account/:id**: Elimina una cuenta por su ID (incluyendo la imagen en Cloudinary). **(Requiere Bearer Token)**

### Posts

- **POST /api/v1/posts/**: Crea una nueva publicación. **(Requiere Bearer Token)**
  - **Parámetros de la solicitud (form-data)**:
    - `caption`: Descripción de la publicación (string).
    - `image`: Imagen de la publicación (archivo).
    - `account`: ID de la cuenta asociada (ObjectId).

- **GET /api/v1/posts/**: Obtiene todas las publicaciones. **(Requiere Bearer Token)**

- **GET /api/v1/posts/:id**: Obtiene una publicación por su ID. **(Requiere Bearer Token)**

- **PUT /api/v1/posts/:id**: Actualiza una publicación existente. **(Requiere Bearer Token)**
  - **Parámetros de la solicitud (form-data)**:
    - `caption`: Descripción de la publicación (string).
    - `image`: Imagen de la publicación (archivo).

- **DELETE /api/v1/posts/:id**: Elimina una publicación por su ID (incluyendo la imagen en Cloudinary). **(Requiere Bearer Token)**

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

### Subida de Imágenes

Las imágenes se suben a Cloudinary y se almacenan en carpetas específicas según el tipo de datos:

- **Profile_Pictures**: Carpeta donde se guardan las imágenes de perfil de los usuarios.
- **Instagram_Posts**: Carpeta donde se guardan las imágenes asociadas a las publicaciones.

### Eliminación de Imágenes

Las imágenes se eliminan automáticamente de Cloudinary cuando se elimina la cuenta o la publicación correspondiente en la base de datos. Esto asegura que no queden archivos huérfanos en el almacenamiento de Cloudinary.

## Reutilización del Storage en Cloudinary

El proyecto incluye la capacidad de reutilizar el almacenamiento en Cloudinary. Esto se logra configurando dinámicamente la carpeta de destino para las imágenes subidas, permitiendo que diferentes tipos de archivos se almacenen en subcarpetas adecuadas dentro de un mismo proyecto. Esta funcionalidad es útil para mantener organizado el contenido multimedia y se puede personalizar o comentar según las necesidades específicas del proyecto.

## Autenticación con Tokens y Bearer

### Autenticación

La API utiliza JSON Web Tokens (JWT) para autenticar a los usuarios. Cuando un usuario inicia sesión con éxito, se le proporciona un token JWT. Este token se debe incluir en el encabezado de autorización de las solicitudes a las rutas protegidas usando el esquema **Bearer**.

### Esquema Bearer

El token JWT se envía en las solicitudes mediante el esquema Bearer:

```plaintext
Authorization: Bearer <tu_token_jwt>
