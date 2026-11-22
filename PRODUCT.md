# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Familias y personas de Granada, Nicaragua que buscan alimentos frescos a domicilio. Incluye personas que no pueden salir de casa (adultos mayores, personas con movilidad limitada, padres con niños pequeños) y familias que quieren ahorrar tiempo evitando filas en supermercados. El cliente valora la atención personalizada y el carisma en el trato.

## Product Purpose

Llevar alimentos frescos hasta la puerta del hogar de familias granadinas, especialmente a quienes no pueden salir de casa. La tienda en línea permite explorar el catálogo de productos (carnes, embutidos, abarrotes, frutas, verduras), armar un carrito y enviar el pedido directamente por WhatsApp para coordinar entrega a domicilio o retiro en tienda.

## Positioning

Carnicería de barrio con precios más accesibles que las cadenas grandes (La Colonia, La Unión), atención carismática y personalizada, y la comodidad de comprar desde casa con entrega a domicilio. No es un supermercado masivo — es tu carnicería de confianza del barrio, ahora en línea.

## Operating Context

- Tienda física en Barrio Domingazo, Granada (del colegio Carmela Noguera 1 cuadra al Oeste, media cuadra al norte)
- Horario: Lunes a Sábado 8:00 AM — 7:00 PM, Domingo 8:00 AM — 12:00 PM
- Pedidos se coordinan por WhatsApp (envío de resumen del carrito al número del negocio)
- Entrega a domicilio en Granada o retiro en tienda
- Catálogo manejado desde Supabase (productos, categorías, variantes, precios en NIO y USD)
- Población objetivo: familias de barrio granadinas, no usuarios de grandes cadenas

## Capabilities and Constraints

- Catálogo de productos con categorías, variantes de corte/presentación, precios en córdobas y dólares
- Carrito persistente en localStorage
- Checkout vía WhatsApp con resumen formateado del pedido
- Selector de moneda (NIO/USD) con tipo de cambio configurable
- Búsqueda por nombre, SKU y código de barras
- Panel de administración para gestionar productos y precios
- Restricción: no hay checkout de pago en línea (efectivo contra entrega o transferencia)
- Restricción: no hay sistema de autenticación de usuarios (pedido anónimo vía WhatsApp)
- Restricción: un solo negocio/tienda (no multi-sucursal)

## Brand Commitments

- Nombre: Carnicería El Domingazo
- Logo: /logo-domingazo.jpg
- Voz: cercana, carismática, de barrio — "tu carnicería de confianza"
- Colores: rojo (#8b1e1e) como primario, dorado (#facc15) como acento
- Tipografía: Plus Jakarta Sans (Google Fonts)
- Referencia visual del usuario: La Colonia (lacolonia.com.ni) como estándar de calidad visual, adaptado con identidad El Domingazo

## Evidence on Hand

- Logo propio: logo-domingazo.jpg
- Catálogo de productos en Supabase (RPC get_public_store_data)
- Tipos de datos definidos en src/types.ts (BusinessInfo, Product, Category, CartItem)
- Componentes React existentes (Navbar, HeroBanner, CategoryGrid, ProductCard, CartDrawer, Footer, ProductDetailModal, SortBar, StoreAdminModal)

## Product Principles

1. **Frescura y confianza** — La calidad de los productos es primaria; la frescura es la promesa central
2. **Accesibilidad** — Precios de barrio vs cadenas grandes; la tienda debe ser fácil de usar para cualquier persona
3. **Sin fricción** — Pedir debe ser tan simple como enviar un WhatsApp; cero barreras entre el antojo y la puerta
4. **Carisma** — La atención personalizada es el diferenciador; el diseño debe sentirse humano, no corporativo
5. **Comunidad** — Es la carnicería del barrio, no un supermercado genérico; Granada es el hogar