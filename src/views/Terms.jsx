import Card from '../components/ui/Card'

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

export default function Terms() {
  const today = new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="py-6 md:py-10 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Términos y Condiciones
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última actualización: {today}
          </p>
        </div>

        <Card variant="elevated" className="p-6 md:p-8 flex flex-col gap-7">
          <Section title="1. Identificación del sitio">
            <p>
              Este sitio web pertenece y es operado por{' '}
              <span className="font-medium text-foreground">DXN Internacional Chile SpA</span>, RUT{' '}
              <span className="font-medium text-foreground">76.071.295-7</span>, distribuidor
              independiente de productos DXN en Chile. Contacto:{' '}
              <a href="https://wa.me/56975716555" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                +56 9 7571 6555
              </a>.
            </p>
            <p>
              Al acceder, navegar o registrarte en este sitio, declaras que has leído, comprendido y
              aceptado los presentes Términos y Condiciones.
            </p>
          </Section>

          <Section title="2. Objeto del sitio">
            <p>
              El sitio tiene por objeto ofrecer un catálogo de productos DXN, permitir la
              acumulación de puntos de volumen (PV) por producto, y gestionar pedidos de productos
              por parte de distribuidores independientes DXN. El sitio opera como una herramienta de
              apoyo para el comercio; no reemplaza los canales oficiales de DXN ni su plan de
              compensación.
            </p>
          </Section>

          <Section title="3. Registro de usuarios">
            <ul className="list-disc pl-5 space-y-1">
              <li>Podrán registrarse personas mayores de 18 años con capacidad legal para contratar.</li>
              <li>Debes proporcionar datos reales, veraces y completos: nombre completo, país, número de documento (RUT en Chile), código de distribuidor DXN y dirección.</li>
              <li>El código de distribuidor es único e intransferible. Debe corresponder al código DXN que el usuario posee o gestiona como distribuidor.</li>
              <li>Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades realizadas con tu cuenta.</li>
              <li>El sitio podrá rechazar o eliminar cuentas con datos falsos, duplicados o que infrinjan estos términos.</li>
            </ul>
          </Section>

          <Section title="4. Puntos de volumen (PV)">
            <ul className="list-disc pl-5 space-y-1">
              <li>Cada producto tiene un valor en pesos chilenos (CLP) y un valor en puntos de volumen (PV) asignado según la tabla de precios DXN vigente.</li>
              <li>El total de PV de un pedido corresponde a la suma del PV de cada producto multiplicado por su cantidad.</li>
              <li>Los PV se acumulan y se muestran como referencia del volumen del pedido. No constituyen dinero, saldo ni crédito canjeable en este sitio.</li>
              <li>El reconocimiento de PV, rangos y bonificaciones ante DXN se rige exclusivamente por el plan de compensación oficial de DXN y no por este sitio.</li>
            </ul>
          </Section>

          <Section title="5. Pedidos y aprobación">
            <ul className="list-disc pl-5 space-y-1">
              <li>Al confirmar un pedido, este queda en estado "pendiente" hasta que el administrador del sitio lo apruebe o rechace.</li>
              <li>La aprobación está sujeta a la disponibilidad de stock. El administrador podrá rechazar pedidos sin stock suficiente o con datos incorrectos.</li>
              <li>La confirmación de un pedido no garantiza su despacho: la venta se perfecciona al momento de la aprobación.</li>
              <li>El sitio se reserva el derecho de corregir errores de precio, PV o stock notificando al usuario antes de despachar.</li>
            </ul>
          </Section>

          <Section title="6. Precios y pagos">
            <ul className="list-disc pl-5 space-y-1">
              <li>Los precios se expresan en pesos chilenos (CLP) e incluyen IVA (19%) cuando corresponda.</li>
              <li>Este sitio no realiza cobros en línea. El pago se coordina con el comercio mediante transferencia bancaria o efectivo, acordado por WhatsApp.</li>
              <li>El pago mediante transferencia bancaria se realiza a Banco de Chile en las siguientes cuentas:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>
                    Empresa:{' '}
                    <span className="font-medium text-foreground">DXN Internacional Chile SpA</span> — RUT{' '}
                    <span className="font-medium text-foreground">76.071.295-7</span> — Cuenta Corriente N°{' '}
                    <span className="font-medium text-foreground">0111074054</span>
                  </li>
                  <li>
                    Personal:{' '}
                    <span className="font-medium text-foreground">Pablo Mauricio Plata</span> — RUT{' '}
                    <span className="font-medium text-foreground">24.148.931-0</span> — Cuenta Corriente N°{' '}
                    <span className="font-medium text-foreground">001073985204</span>
                  </li>
                </ul>
              </li>
              <li>Indica tu código de distribuidor como referencia de la transferencia.</li>
              <li>El pedido se despacha una vez verificado el pago y aprobado por el administrador.</li>
            </ul>
          </Section>

          <Section title="7. Boleta electrónica y uso de datos tributarios">
            <ul className="list-disc pl-5 space-y-1">
              <li>Conforme a la normativa del Servicio de Impuestos Internos (SII) de Chile, cada venta genera una boleta electrónica (DTE).</li>
              <li>Los datos del comprador —nombre, RUT, dirección y código de distribuidor DXN— se utilizan para emitir la boleta correspondiente a la venta.</li>
              <li>La boleta electrónica se emite por la empresa DXN Internacional Chile SpA, RUT 76.071.295-7.</li>
              <li>Es tu responsabilidad que los datos tributarios proporcionados sean correctos y correspondan a tu titularidad.</li>
              <li>La boleta se entrega por medios digitales (WhatsApp, correo electrónico o QR), conforme a las reglas vigentes del SII.</li>
            </ul>
          </Section>

          <Section title="8. Envío y retiro">
            <ul className="list-disc pl-5 space-y-1">
              <li>La entrega de los productos se coordina por WhatsApp con el comprador.</li>
              <li>Los plazos y costos de envío o las condiciones de retiro en punto de venta se informan en cada operación y no son parte de estos términos generales.</li>
              <li>El riesgo del transporte se transfiere al comprador una vez entregado el producto, salvo que las partes acuerden otra cosa.</li>
            </ul>
          </Section>

          <Section title="9. Devoluciones y cambios">
            <ul className="list-disc pl-5 space-y-1">
              <li>Los productos pueden presentar fallas de fabricación dentro de los plazos que establece la ley chilena (Ley 19.496, protección al consumidor).</li>
              <li>Los productos sellados no podrán devolverse si fueron abiertos o manipulados, salvo defecto de fábrica.</li>
              <li>Para gestionar una devolución o cambio, contacta al comercio por WhatsApp dentro de los plazos legales, indicando el número de pedido.</li>
            </ul>
          </Section>

          <Section title="10. Protección de datos personales">
            <ul className="list-disc pl-5 space-y-1">
              <li>Los datos personales entregados al registrarte (nombre, documento, dirección, código DXN) se tratan conforme a la Ley 19.628 de Chile y su normativa complementaria.</li>
              <li>Estos datos se utilizan para gestionar tu cuenta, procesar pedidos y emitir la documentación tributaria correspondiente.</li>
              <li>Tus datos no se venden ni se ceden a terceros fuera de lo necesario para la operación y el cumplimiento legal.</li>
              <li>Puedes solicitar la corrección o eliminación de tus datos contactando al comercio por WhatsApp.</li>
            </ul>
          </Section>

          <Section title="11. Propiedad intelectual">
            <p>
              Las marcas, logos, nombres de productos y materiales DXN pertenecen a sus respectivos
              titulares. Este sitio es operado por un distribuidor independiente y no representa una
              afiliación oficial con DXN Holdings Berhad ni con DXN International Chile SpA. Los
              contenidos propios del sitio (diseño, textos, código) pertenecen a su operador y no
              pueden reproducirse sin autorización.
            </p>
          </Section>

          <Section title="12. Limitación de responsabilidad">
            <p>
              El sitio se proporciona "tal cual" y no garantiza disponibilidad ininterrumpida. No
              nos hacemos responsables por daños indirectos derivados del uso del sitio o de la
              información de productos, los cuales son complementos alimenticios y no medicamentos.
              Consulta a un profesional de la salud antes de consumirlos.
            </p>
          </Section>

          <Section title="13. Modificación de términos">
            <p>
              El comercio podrá modificar estos términos en cualquier momento. La versión vigente
              estará siempre disponible en esta página con su fecha de actualización. El registro o
              uso continuo del sitio implica la aceptación de los términos vigentes.
            </p>
          </Section>

          <Section title="14. Ley aplicable y jurisdicción">
            <p>
              Estos términos se rigen por la legislación de la República de Chile. Cualquier
              controversia será sometida a los tribunales ordinarios de justicia de Chile, sin
              perjuicio de los derechos que la ley reconozca al consumidor.
            </p>
          </Section>
        </Card>
      </div>
    </div>
  )
}
