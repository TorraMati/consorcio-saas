# Consorcio SaaS

Plataforma web full-stack para la gestión integral de consorcios residenciales. Multitenancy, pagos en línea, notificaciones automáticas y liquidaciones programadas.

## Funcionalidades

- **Autenticación y roles** — JWT con roles diferenciados (super admin, admin de consorcio, residente)
- **Gestión de edificios y unidades** — alta, modificación y control de ocupantes
- **Expensas y liquidaciones** — generación automática con cálculo de intereses por mora
- **Pagos** — integración con MercadoPago (checkout Pro) y confirmación de transferencias manuales
- **Notificaciones** — envío por email (Nodemailer) para vencimientos, novedades y pagos recibidos
- **Reservas de amenities** — calendario de reservas por unidad
- **Noticias del consorcio** — publicación interna por edificio
- **Tareas programadas** — `node-cron` para liquidaciones y recordatorios automáticos
- **Multitenancy** — cada consorcio opera de forma aislada con sus propios datos y límites

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React · React Query · Zustand · Framer Motion · Zod · React Hook Form · Tailwind CSS |
| Backend | Node.js · Express 5 · Sequelize · JWT · Helmet · Morgan · Winston |
| Base de datos | MySQL |
| Pagos | MercadoPago API |
| Email | Nodemailer |
| Scheduler | node-cron |

## Estructura

```
consorcio-saas/
├── backend/
│   └── src/
│       ├── modules/         # auth, buildings, units, expenses, payments...
│       ├── infrastructure/  # DB, modelos Sequelize, EmailService
│       └── presentation/    # middlewares (auth, roles, tenant context)
└── frontend/
    └── src/
        ├── features/        # módulos por dominio (dashboard, pagos, reservas...)
        ├── components/      # UI compartida
        └── store/           # Zustand (auth)
```

## Instalación

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # completar credenciales
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Variables requeridas (backend)**

Ver [`backend/.env.example`](backend/.env.example) — necesitás MySQL corriendo, credenciales SMTP y un Access Token de MercadoPago.

## Módulos del backend

`auth` · `buildings` · `units` · `tenants` · `users` · `expenses` · `payments` · `liquidations` · `interest` · `notifications` · `reservations` · `amenities` · `news` · `tenantLimits`

---

Desarrollado por [Matias Torrallardona](https://github.com/TorraMati)
