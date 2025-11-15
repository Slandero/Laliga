# Instrucciones para Configurar Apache con Proyecto Liga

## Requisitos Previos
- Apache instalado y funcionando
- Módulos habilitados: `mod_rewrite`, `mod_headers`, `mod_mime`

## Opción 1: Usar el Directorio Actual (Recomendado para Desarrollo)

### Paso 1: Configurar el DocumentRoot de Apache
1. Abre el archivo de configuración de Apache (`httpd.conf` o `apache2.conf`)
2. Busca la sección `<Directory>` del DocumentRoot
3. Asegúrate de que el directorio tenga permisos:
   ```apache
   <Directory "E:/Escuela/Programacion Web/Tareas/ProyectoLiga">
       Options Indexes FollowSymLinks
       AllowOverride All
       Require all granted
   </Directory>
   ```

### Paso 2: Habilitar .htaccess
- Verifica que `AllowOverride All` esté configurado (ya incluido arriba)

### Paso 3: Reiniciar Apache
```bash
# Windows (XAMPP/WAMP)
# Usa el panel de control o reinicia el servicio Apache

# Linux
sudo systemctl restart apache2
# o
sudo service apache2 restart
```

### Paso 4: Acceder al Proyecto
- Abre tu navegador y ve a: `http://localhost/ProyectoLiga`
- O si configuraste un virtual host: `http://proyectoliga.local`

## Opción 2: Configurar Virtual Host (Recomendado para Producción)

### Paso 1: Editar el archivo hosts (Windows)
1. Abre como administrador: `C:\Windows\System32\drivers\etc\hosts`
2. Agrega esta línea:
   ```
   127.0.0.1    proyectoliga.local
   ```

### Paso 2: Configurar Virtual Host en Apache
1. Abre el archivo de configuración de Apache
2. Agrega el contenido de `apache-config.conf` al final del archivo
3. Ajusta la ruta `DocumentRoot` si es necesario

### Paso 3: Reiniciar Apache
```bash
# Reinicia el servicio Apache
```

### Paso 4: Acceder al Proyecto
- Abre: `http://proyectoliga.local`

## Verificar que Funciona

1. Abre el navegador
2. Ve a la URL configurada
3. Deberías ver:
   - La barra de navegación con el logo
   - El contenido de la página de inicio
   - Los botones de navegación funcionando

## Solución de Problemas

### Error 403 (Forbidden)
- Verifica los permisos del directorio
- Asegúrate de que `Require all granted` esté en la configuración

### Error 404 (Not Found)
- Verifica que la ruta del DocumentRoot sea correcta
- Asegúrate de que `mod_rewrite` esté habilitado
- Verifica que el archivo `.htaccess` esté en el directorio raíz

### Los módulos ES6 no cargan
- Verifica que `mod_mime` esté habilitado
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que Apache esté sirviendo los archivos `.js` con el tipo MIME correcto

### Habilitar módulos necesarios (si no están habilitados)
```bash
# Linux
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod mime
sudo systemctl restart apache2
```

## Estructura de Archivos

```
ProyectoLiga/
├── .htaccess              # Configuración de Apache
├── apache-config.conf     # Configuración de Virtual Host
├── index.html             # Página principal
├── js/                    # Archivos JavaScript
├── styles/                # Archivos CSS
├── images/                # Imágenes
└── ...
```

## Notas Importantes

- El archivo `.htaccess` ya está configurado para trabajar con SPA (Single Page Application)
- Todas las rutas se redirigen a `index.html` excepto archivos estáticos
- Los módulos ES6 están configurados para funcionar correctamente
- Para producción, considera deshabilitar CORS y configurar HTTPS

