# Echo · Esquema de producción de vídeos de ambiente

Basado en el análisis de los vídeos más vistos de YouTube (2 de noviembre de 2026): búsquedas de lluvia, chimenea,
olas, «cozy ambience» y lluvia en español, ordenadas por visualizaciones (históricas y de este año).

## 1. Lo que dicen los datos

| Hallazgo | Ejemplos reales |
|---|---|
| Los clásicos de siempre son **lluvia, chimenea y olas** en vídeos de **3, 8, 10 y 12 h** | «3 Hours of Gentle Night Rain» 251 M; «Fireplace Ambience» 10 h 166 M; «Ocean Sounds» 11 h 86 M |
| Lo que más crece **este año** son las **escenas acogedoras**: dormitorio con ventana, cabaña, cafetería, porche, biblioteca | «Heavy Rain Sounds Outside the Window Bedroom» 1:33 h, 2,6 M en 7 meses; «Acogedora tarde lluviosa de otoño» 3 h, 2,1 M en 2 meses |
| Combinar **2–3 sonidos** funciona mejor que uno solo | lluvia + chimenea, lluvia + truenos, tormenta + viento |
| La **pantalla negra** es un formato propio para dormir | «THUNDER and RAIN … BLACK SCREEN» 10 h, 220 M |
| Los **directos 24/7** reúnen miles de personas a la vez | «Heavy Rain and Thunder – Black Screen (Live)», 1.700–6.000 espectadores simultáneos |
| Los títulos **en español** funcionan y hay menos competencia | «Sin anuncios 🔥🌧️ Acogedora tarde lluviosa de otoño» 2,1 M |
| Parte del público rechaza la IA: hay canales que ponen **«NO AI»** en el título | «Gentle Night Rain – Sleep Fast TONIGHT (NO AI, NO ADS)» |

**Conclusión:** la oportunidad para Echo está en las **escenas acogedoras** de 1,5–3 h, con la calidad visual como
diferencia y siendo transparentes sobre el uso de IA, más vídeos largos de **8–10 h** para dormir.

## 2. Catálogo de escenas (cada vídeo combina una de cada columna)

| Lugar | Momento | Clima / elemento | Sonido principal + capa |
|---|---|---|---|
| Dormitorio con ventana grande | Noche | Lluvia suave | Lluvia en cristal + truenos lejanos |
| Cabaña de madera en el bosque | Atardecer | Tormenta | Lluvia en tejado + chimenea crepitando |
| Cafetería antigua vacía | Madrugada | Nieve | Viento suave + fuego |
| Porche de otoño | Mañana nublada | Niebla | Lluvia en hojas + arroyo |
| Biblioteca antigua | Noche | Lluvia intensa | Lluvia + chimenea + páginas (sutil) |
| Faro / casa junto al mar | Noche | Oleaje | Olas + viento |
| Camarote de barco de madera | Noche | Tormenta en el mar | Olas contra el casco + lluvia |
| Tienda de campaña en la montaña | Noche | Lluvia | Lluvia en lona + hoguera |
| Coche aparcado en el bosque | Noche | Lluvia intensa | Lluvia en techo de chapa + truenos |

Regla anti-repetición: **ningún vídeo repite la misma combinación lugar + momento + clima**. Echo guarda
cada combinación usada.

## 3. Duraciones y formatos

| Formato | Duración | Frecuencia |
|---|---|---|
| Escena acogedora | **3 h** (principal) | 2–3 por semana |
| Escena para dormir | **8–10 h** | 1 cada 2 semanas |
| Pantalla negra (solo sonido) | 10 h | Ocasional, cuesta 0 € de vídeo |
| Shorts | 30–45 s de cada escena | 1–2 por vídeo largo |
| Directo 24/7 | Continuo | Más adelante (requiere servidor de emisión) |

## 4. Fórmula del título

`[Emoji] [Beneficio honesto] [Escena] | [Sonidos] para [Usos] | [Duración] [Modificador]`

- **Beneficio honesto:** «Relájate», «Duerme profundamente», «Concéntrate». **Prohibido** inventar datos
  («97 % de los insomnes…», «duérmete en 3 minutos»): son afirmaciones falsas y van contra las normas de YouTube.
- **Usos:** Dormir, Estudiar, Leer, Relajarse.
- **Modificadores válidos:** «4K», «Sin música», «Pantalla oscura», «Sin cortes».
- **Idiomas:** título principal en inglés + **traducción al español** con la función de títulos traducidos
  de YouTube (`localizations` en la API), para llegar a los dos públicos con un solo vídeo.

Ejemplos:
- `🌧️ Rainy Night in a Cozy Wooden Cabin | Rain & Crackling Fireplace for Sleep, Study, Relax | 3 Hours 4K`
- `🌧️ Noche lluviosa en una cabaña acogedora | Lluvia y chimenea para dormir, estudiar y relajarse | 3 horas 4K`

## 5. Descripción (plantilla)

1. Dos frases que describan la escena y el ambiente.
2. Para qué sirve (dormir, estudiar, leer…).
3. Capítulos si hay cambios (por ejemplo, la tormenta se intensifica a mitad).
4. Aviso honesto: «Escena creada con herramientas de IA; sonidos con licencia libre o generados».
5. Invitación a suscribirse y enlace a la lista de reproducción de la serie.
6. 3–5 hashtags: `#rainsounds #cozyambience #sleepsounds`.

## 6. Miniatura

- El fotograma más bonito de la escena, con **luz cálida** (naranja/ámbar) contra exterior frío (azul).
- Texto grande de 2–3 palabras como mucho: «RAINY CABIN», «3 HOURS».
- Coherencia de canal: misma tipografía y posición del texto en todas.

## 7. Calidad mínima antes de publicar (lo revisa el usuario)

- [ ] El bucle no tiene saltos visibles ni audibles.
- [ ] Sin deformaciones típicas de IA (manos, texto raro, objetos que cambian).
- [ ] El sonido no tiene cortes ni picos de volumen; volumen constante y suave.
- [ ] La escena no repite una combinación ya publicada.
- [ ] Título y descripción sin afirmaciones inventadas.
- [ ] Marcado como contenido sintético (`status.containsSyntheticMedia`).

## 8. Organización del canal

- Listas de reproducción por serie: «Rainy Cabins», «Cozy Bedrooms», «Ocean Nights», «Sleep 10 Hours».
- Ritmo constante (mismos días de publicación).
- Fase siguiente, cuando el canal tenga tracción: música suave + ambiente (requiere música con licencia o
  generada con IA y declarada) y directos 24/7.
