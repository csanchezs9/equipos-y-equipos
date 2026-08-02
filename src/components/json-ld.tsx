// Renderiza datos estructurados (schema.org) como <script type="application/ld+json">.
// Server component: cero JS al cliente. SEO + GEO (motores generativos / IA).
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es JSON propio (no input de usuario): seguro serializarlo.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
