# Danny AI Lab

Danny AI Lab es la plataforma matriz para productos SaaS multiempresa y automatizaciones especializadas. Comparte infraestructura sin mezclar la lógica de negocio de cada producto.

## Productos

- **Olive Rentals:** producto actual para disponibilidad de rentas.
- **Olive Dispatch:** futuro.
- **Olive Landscaping:** futuro.

## Estructura del monorepo

- `apps/`: aplicaciones desplegables y lógica de producto.
- `packages/`: componentes compartidos futuros.
- `infrastructure/`: configuración de infraestructura.
- `docs/`: documentación operativa y de seguridad.
- `scripts/`: validación y despliegue seguro.

## Documentación

- [Arquitectura](ARCHITECTURE.md)
- [Despliegue](docs/DEPLOYMENT.md)
- [Seguridad](docs/SECURITY.md)

## Uso

Validación local, desde la raíz del repositorio:

```bash
bash scripts/check-all.sh
```

Despliegue desde EC2, después de publicar los cambios en GitHub:

```bash
bash scripts/deploy-olive-rentals.sh
```

No se debe desplegar desde el equipo local ni con cambios sin commit en EC2.
