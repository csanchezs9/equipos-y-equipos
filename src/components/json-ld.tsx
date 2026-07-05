// Renderiza datos estructurados (schema.org) como <script type="application/ld+json">.
// Server component: cero JS al cliente. SEO + GEO (motores generativos / IA).
//
// Un <script> por objeto (nunca un array en uno solo): varias herramientas de
// SEO leen el script asumiendo un objeto con "@context" en la raíz, y truenan
// (`r["@context"].toLowerCase()`) si reciben un array.
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // El contenido es JSON propio (no input de usuario): seguro serializarlo.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
