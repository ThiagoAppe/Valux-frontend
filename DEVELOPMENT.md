# Desarrollo del frontend

El perfil de desarrollo monta los archivos fuente en el contenedor y ejecuta
Vite con Hot Module Replacement (HMR). No modifica ni reinicia el contenedor
de producción `valux-frontend`.

## Iniciar

```bash
cd /home/alpha/System/frontend
sudo docker compose -f docker-compose.dev.yaml up
```

Abrí `http://localhost:5173`. Si trabajás desde otra computadora, creá un túnel
SSH y abrí esa misma dirección local:

```bash
ssh -L 5173:127.0.0.1:5173 alpha@valux.local
```

Al guardar un cambio en `src/`, Vite actualizará la página automáticamente.
La API de desarrollo debe estar disponible en `127.0.0.1:8000`, como se
documenta en `backend/DEPLOYMENT.md` bajo “Local-only smoke test without a
domain”. No uses esa API contra datos de producción para operaciones de
escritura.

## Detener y limpiar

```bash
cd /home/alpha/System/frontend
sudo docker compose -f docker-compose.dev.yaml down
```

Para eliminar también las dependencias cacheadas del entorno de desarrollo:

```bash
sudo docker compose -f docker-compose.dev.yaml down --volumes
```
