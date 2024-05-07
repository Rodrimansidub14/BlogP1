
Un blog moderno con tematica de elden ring con capacidades de administración para una experiencia de usuario y administración eficiente y efectiva utilizando React y Vite.

# Cómo comenzar

1. **Clone este repositorio**

    Utilice Git para clonar este repositorio en su máquina local.

    ```
    git clone git@github.com:Rodrimansidub14/BlogP1.git
    ```

2. **Instale las dependencias**

    Navegue al directorio clonado e instale las dependencias necesarias.

    ```
    npm install
    ```

3. **Inicie el servidor de desarrollo**
   - Installe docker en su equipo
   - Dirijase a la carpeta backend
   - ejecute el comando:
    ```
    docker-compose up--build
    ```
    -Dirijase a la carpeta blogp1 y ejecute 
    ```
    npm run dev
    ```
    Esto ejecutará el proceso de construcción automatizado, iniciará un servidor web, y abrira la conexión a la base de datos en su navegador predeterminado.

   

5. **Disfruta del Blog**
- Dentro del blog encontraras las siguientes páginas:
  -Home: Página pública que permite observar todos los posts en la página
  -Login: Si cuenta con una cuenta con las credenciales necesarias puede acceder al AdminDashboard que se encarga de eliminar, actualizar y crear nuevas publicaciones al blog
  -Crea una cuenta 
6. **Construya para producción**

    Cuando esté listo para construir la versión de producción, ejecute:

    ```
    npm run build
    ```

    Esto optimizará su aplicación para el mejor rendimiento.

7. **Deploy**

    Despliegue su aplicación en servidores o plataformas de alojamiento como Netlify o GitHub Pages.

## Características

- **Visualización de publicaciones**: Cualquier visitante puede ver las publicaciones.
- **Área de administración protegida**: Solo usuarios autenticados pueden crear, editar o eliminar publicaciones.
- **Responsive**: Adaptable a diferentes tamaños de pantalla para asegurar que todos los usuarios puedan acceder al contenido adecuadamente.
## Tecnologías Utilizadas

- **[React](https://reactjs.org/)**: Para la construcción de la interfaz de usuario.
- **[Vite](https://vitejs.dev/)**: Como herramienta de construcción moderna que mejora la experiencia de desarrollo.
- **[Bootstrap](https://getbootstrap.com/)**: Para diseño responsive y componentes estilizados.
- **[React Router](https://reactrouter.com/)**: Utilizado para la navegación en la aplicación.
- **[JWT](https://jwt.io/)**: Para manejo de autenticación mediante tokens.
- **[ESLint](https://eslint.org/)**: Para asegurar la calidad del código.
- **[Babel](https://babeljs.io/)**: Para usar características modernas de JavaScript.
- **[SASS](https://sass-lang.com/)**: Para estilos avanzados.
- **[PostCSS](https://postcss.org/)**: Utilizado para autoprefijar CSS y otras transformaciones.

## Documentación Adicional

- **Dependencias**: Todas las dependencias están definidas en el archivo `package.json`, incluyendo librerías para el frontend y herramientas de desarrollo.

## Seguridad

Se implementa autenticación básica para el área de administración para proteger contra accesos no autorizados.

## Documentación Adicional

- **Dependencias**: Todas las dependencias están definidas en el archivo `package.json`, incluyendo librerías para el frontend y herramientas de desarrollo.

## Problemas Comunes y Soluciones

Si encuentra problemas al utilizar el proyecto, asegúrese de haber instalado todas las dependencias con `npm install` y que el servidor de desarrollo está corriendo con `docker-compose up--build`.

---


