// ═══════════════════════════════════════════════════════════════════════════════
//  CURSOS: ABV — Aprendizaje Basado en Videos
//          MICRO-LEARNING — Aprender en Pequeñas Dosis
//  Programa de Formación Docente — Guatemala
// ═══════════════════════════════════════════════════════════════════════════════

// CURSO: abv
{
    id: 'abv',
    title: 'Aprendizaje Basado en Videos',
    subtitle: 'Usa el video como herramienta pedagógica poderosa en tu aula',
    icon: '🎬',
    color: '#10B981',
    prerequisite: [],
    status: 'available',
    durationHours: 3,
    totalCards: 35,
    modules: [

        // ══════════════════════════════════════════════════════════════════════
        //  MÓDULO 1 — El video en el aprendizaje: ciencia y pedagogía (9 tarjetas)
        // ══════════════════════════════════════════════════════════════════════
        {
            id: 1,
            title: "🧠 Módulo 1: El video en el aprendizaje: ciencia y pedagogía",
            cards: [
                {
                    id: 1,
                    type: "content",
                    title: "🎬 El video no es solo entretenimiento",
                    content: "Durante décadas se pensó que los videos en clase eran un 'descanso' del aprendizaje real. La investigación actual demuestra lo contrario: el video activa simultáneamente los canales visual y auditivo del cerebro, lo que duplica la retención de información respecto a leer un texto solo.",
                    extra: "Un estudio del MIT encontró que los estudiantes retienen hasta el 65% de la información vista en video, frente al 10% de la lectura pasiva. En Guatemala, donde muchos estudiantes son aprendices visuales y kinestésicos, esto es especialmente relevante."
                },
                {
                    id: 2,
                    type: "content",
                    title: "🧩 Cómo aprende el cerebro con videos",
                    content: "La Teoría de la Codificación Dual de Richard Mayer explica que el cerebro humano procesa la información por dos canales: el verbal (palabras) y el no verbal (imágenes y movimiento). Cuando ambos canales trabajan juntos —como en un video bien diseñado— el aprendizaje es más profundo y duradero.",
                    extra: "Esto se llama 'efecto multimedia'. No todos los videos aprovechan este principio: un video con texto que se lee en voz alta mientras aparece en pantalla satura los canales y reduce el aprendizaje."
                },
                {
                    id: 3,
                    type: "content",
                    title: "⏱️ La duración importa mucho",
                    content: "La investigación de Philip Guo (MIT, 2014) analizó 6.9 millones de visualizaciones en cursos en línea y encontró que la atención cae drásticamente después de los 6 minutos. Los videos de 0-3 minutos tienen el mayor nivel de atención. Los mejores videos educativos son breves y enfocados en un solo concepto.",
                    extra: "Regla práctica: si un video dura más de 8 minutos, busca si hay uno más corto sobre el mismo tema. Si no existe, planifica pausas activas cada 5-6 minutos durante la reproducción."
                },
                {
                    id: 4,
                    type: "quiz",
                    title: "✅ Quiz: Teoría de la Codificación Dual",
                    question: "Según la Teoría de la Codificación Dual, ¿por qué los videos bien diseñados favorecen el aprendizaje?",
                    options: [
                        "Porque entretienen a los estudiantes y los mantienen atentos",
                        "Porque activan simultáneamente el canal verbal y el no verbal del cerebro",
                        "Porque reducen el trabajo del docente en clase",
                        "Porque son más fáciles de evaluar que los textos"
                    ],
                    correct: 1,
                    explanation: "La Teoría de la Codificación Dual de Mayer establece que el aprendizaje es más efectivo cuando se activan a la vez el canal verbal (palabras) y el no verbal (imágenes/movimiento). Los videos bien diseñados logran exactamente eso."
                },
                {
                    id: 5,
                    type: "content",
                    title: "📺 Tipos de videos educativos",
                    content: "Existen varios formatos de video educativo, cada uno con propósitos distintos: (1) Tutoriales: muestran un proceso paso a paso. (2) Documentales: exploran un tema con profundidad y contexto. (3) Videos de proceso: muestran cómo se hace algo en tiempo real. (4) Screencasts: grabaciones de pantalla para explicar software o pasos digitales. (5) Animaciones: ideales para conceptos abstractos o invisibles.",
                    extra: "En el aula guatemalteca, los tutoriales y videos de proceso son especialmente útiles en ciencias y matemáticas, donde ver el 'cómo se hace' paso a paso refuerza la comprensión."
                },
                {
                    id: 6,
                    type: "content",
                    title: "🎭 Animaciones para conceptos abstractos",
                    content: "Las animaciones permiten visualizar lo que no se puede ver: el movimiento de los átomos, el ciclo del agua, cómo funciona el corazón o el recorrido de una ley en el Congreso. Para estudiantes guatemaltecos que tienen acceso limitado a laboratorios o museos, las animaciones compensan esa brecha experiencial.",
                    extra: "Canales como 'Kurzgesagt' (en inglés) y 'Smile and Learn' (en español) producen animaciones educativas de alta calidad. Muchos videos de Smile and Learn están disponibles gratuitamente en YouTube."
                },
                {
                    id: 7,
                    type: "content",
                    title: "🖥️ Screencasts: explica lo que haces en pantalla",
                    content: "Un screencast es la grabación de lo que ocurre en tu pantalla mientras explicas con tu voz. Es ideal para enseñar a usar aplicaciones, plataformas educativas o herramientas digitales. No requiere edición sofisticada: bastan herramientas como Loom, OBS Studio o incluso la función de grabación de pantalla del celular.",
                    extra: "Como docente, puedes grabar screencasts para que tus estudiantes revisen los pasos de una tarea o el uso de una aplicación cuantas veces necesiten, sin depender de que tú repitas la explicación."
                },
                {
                    id: 8,
                    type: "quiz",
                    title: "✅ Quiz: Tipos de video",
                    question: "Un docente quiere mostrar a sus estudiantes cómo realizar una operación matemática paso a paso. ¿Qué tipo de video sería más apropiado?",
                    options: [
                        "Un documental sobre la historia de las matemáticas",
                        "Una animación sobre conceptos abstractos",
                        "Un tutorial que muestre el proceso paso a paso",
                        "Un screencast de una página web de ejercicios"
                    ],
                    correct: 2,
                    explanation: "Los tutoriales son el formato ideal para mostrar procesos paso a paso, como la resolución de operaciones matemáticas. Su estructura secuencial guía al estudiante desde el inicio hasta el resultado."
                },
                {
                    id: 9,
                    type: "content",
                    title: "🇬🇹 El video en el contexto guatemalteco",
                    content: "En Guatemala, el video tiene un impacto especial: muchos estudiantes tienen acceso a YouTube desde sus celulares, incluso sin internet fijo en casa. Además, el aprendizaje visual es culturalmente significativo en comunidades donde la tradición oral e iconográfica (arte, tejidos, murales) es central. El video conecta con esa forma de aprender.",
                    extra: "Dato: según la ENCOVI 2021, más del 60% de los hogares guatemaltecos tienen acceso a smartphones. Esto significa que YouTube puede ser un canal educativo accesible para la mayoría de tus estudiantes fuera del aula."
                }
            ]
        },

        // ══════════════════════════════════════════════════════════════════════
        //  MÓDULO 2 — Seleccionar y usar videos en clase (9 tarjetas)
        // ══════════════════════════════════════════════════════════════════════
        {
            id: 2,
            title: "🔍 Módulo 2: Seleccionar y usar videos en clase",
            cards: [
                {
                    id: 10,
                    type: "content",
                    title: "✅ Criterios para seleccionar un buen video",
                    content: "No todos los videos de YouTube son confiables o pedagógicamente adecuados. Antes de usar un video en clase, evalúa: (1) Fuente: ¿quién lo produjo? ¿Es una institución educativa, científica o un creador reconocido? (2) Fecha: ¿es información actualizada? (3) Rigor: ¿cita fuentes o presenta datos verificables? (4) Lenguaje: ¿es adecuado para la edad de tus estudiantes?",
                    extra: "Prefiere videos producidos por universidades, museos, organismos internacionales (como la OPS, UNESCO, UNICEF) o canales con historial verificable. Evita videos sin autoría clara o con afirmaciones sensacionalistas."
                },
                {
                    id: 11,
                    type: "content",
                    title: "⏳ La duración ideal según el nivel educativo",
                    content: "La duración adecuada de un video varía según la edad: Primaria (6-11 años): videos de 2-4 minutos. Básicos (12-15 años): videos de 4-7 minutos. Diversificado y adultos: videos de 6-10 minutos, con pausas. Superar estos tiempos sin planificar pausas activas reduce significativamente la atención y el aprendizaje.",
                    extra: "Truco guatemalteco: si el video está en inglés y tus estudiantes no lo manejan, busca si tiene subtítulos en español automáticos o si existe una versión doblada. YouTube ofrece subtítulos automáticos traducidos que, aunque imperfectos, funcionan para videos claros."
                },
                {
                    id: 12,
                    type: "quiz",
                    title: "✅ Quiz: Criterios de selección",
                    question: "¿Cuál de los siguientes criterios es MENOS relevante al seleccionar un video educativo para clase?",
                    options: [
                        "La fuente o institución que produjo el video",
                        "Que el video tenga muchas vistas y 'me gusta'",
                        "Que la información esté actualizada y sea verificable",
                        "Que el lenguaje sea adecuado para la edad de los estudiantes"
                    ],
                    correct: 1,
                    explanation: "El número de vistas o 'me gusta' no garantiza la calidad educativa de un video. Un video puede ser viral por razones de entretenimiento sin ofrecer información correcta o pedagógicamente adecuada. Siempre prioriza la fuente, el rigor y la pertinencia."
                },
                {
                    id: 13,
                    type: "content",
                    title: "🔮 Antes del video: activar predicciones",
                    content: "Una técnica poderosa es pedir a los estudiantes que predigan el contenido del video antes de verlo. Por ejemplo: 'Este video trata sobre la fotosíntesis. ¿Qué creen que necesita una planta para fabricar su alimento?' Las predicciones activan el conocimiento previo y crean una 'pregunta mental' que el video responde.",
                    extra: "Puedes hacer esto oralmente, en tarjetas de papel o en un chat de grupo de WhatsApp. Cuando el video confirma o corrige una predicción, el cerebro registra esa información con más fuerza que si la hubiera recibido pasivamente."
                },
                {
                    id: 14,
                    type: "content",
                    title: "⏸️ Durante el video: pausas reflexivas",
                    content: "Las pausas planificadas durante el video transforman la experiencia pasiva en activa. Detén el video en momentos clave y pregunta: '¿Qué acaba de pasar?' '¿Por qué creen que ocurre esto?' '¿Esto les recuerda algo que vieron antes?' Estas micro-reflexiones consolidan el aprendizaje en tiempo real.",
                    extra: "Planifica pausas cada 3-5 minutos. Antes de reproducir el video, avisa a los estudiantes que habrá paradas para pensar juntos. Esto los mantiene en estado de alerta activa durante toda la reproducción."
                },
                {
                    id: 15,
                    type: "content",
                    title: "💬 Después del video: preguntas que profundizan",
                    content: "Las mejores preguntas post-video no preguntan '¿qué dijo el video?' sino que invitan a pensar: '¿Están de acuerdo con lo que presentó el video? ¿Por qué?' '¿Qué preguntas les surgieron?' '¿Cómo se conecta esto con lo que vivimos en Guatemala?' Estas preguntas desarrollan pensamiento crítico.",
                    extra: "Técnica '3-2-1': pide a cada estudiante que anote 3 cosas que aprendió, 2 que le sorprendieron y 1 pregunta que le quedó. Es rápido, efectivo y funciona desde tercero primaria hasta diversificado."
                },
                {
                    id: 16,
                    type: "quiz",
                    title: "✅ Quiz: Pausas reflexivas",
                    question: "¿Cuál es el principal beneficio pedagógico de hacer pausas durante la reproducción de un video?",
                    options: [
                        "Permite que los estudiantes descansen y recarguen energía",
                        "Transforma la experiencia pasiva de ver en aprendizaje activo",
                        "Reduce el tiempo total que el docente necesita para cubrir el tema",
                        "Evita que los estudiantes se distraigan con el celular"
                    ],
                    correct: 1,
                    explanation: "Las pausas reflexivas transforman la experiencia pasiva (solo ver) en aprendizaje activo. Al detenerse y preguntar, los estudiantes procesan, conectan y consolidan la información en lugar de simplemente recibirla."
                },
                {
                    id: 17,
                    type: "content",
                    title: "📋 La guía de visualización: estructura tu clase con video",
                    content: "Una guía de visualización es una hoja sencilla que el estudiante completa mientras ve el video. Puede incluir: espacio para anotar 3 ideas principales, una pregunta abierta para responder al final, o un organizador gráfico que completan con pausas. Este instrumento sencillo aumenta dramáticamente la retención.",
                    extra: "No necesita ser elaborada. Puede ser media hoja de cuaderno con el título del video, tres renglones para ideas y una pregunta final. Lo importante es que el estudiante sepa que debe estar atento y tiene una tarea mientras ve."
                },
                {
                    id: 18,
                    type: "content",
                    title: "🔁 El video como recurso para repasar",
                    content: "Una ventaja única del video sobre la clase magistral: se puede repetir. Comparte el enlace del video con tus estudiantes para que lo revean en casa, lo muestren a sus familias o lo usen para estudiar antes de una evaluación. En contextos guatemaltecos con datos móviles limitados, descarga el video con anticipación usando herramientas como 'yt-dlp' o compártelo por WhatsApp.",
                    extra: "Puedes crear una lista de reproducción privada en YouTube con todos los videos de tu curso y compartir el enlace con tus estudiantes. Así tienen un 'banco de recursos' organizado y gratuito disponible en todo momento."
                }
            ]
        },

        // ══════════════════════════════════════════════════════════════════════
        //  MÓDULO 3 — Crear tus propios videos educativos (9 tarjetas)
        // ══════════════════════════════════════════════════════════════════════
        {
            id: 3,
            title: "📱 Módulo 3: Crear tus propios videos educativos",
            cards: [
                {
                    id: 19,
                    type: "content",
                    title: "🎙️ Por qué crear tus propios videos",
                    content: "Cuando un docente crea su propio video, conecta el contenido con la realidad local de sus estudiantes: usa ejemplos de la comunidad, habla en el idioma familiar (incluso puede usar palabras en idiomas mayas), y adapta el ritmo a lo que sus estudiantes necesitan. Un video tuyo, aunque sencillo, supera en pertinencia a cualquier producción internacional.",
                    extra: "No necesitas equipo profesional. Miles de docentes en Latinoamérica crean contenido educativo valioso solo con su celular, buena iluminación natural y un guión de 5 oraciones."
                },
                {
                    id: 20,
                    type: "content",
                    title: "📝 El guión: tu mejor aliado",
                    content: "Antes de grabar, escribe un guión breve. No necesita ser palabra por palabra; puede ser una lista de puntos: (1) Saludo y tema, (2) ¿Por qué importa esto?, (3) Explicación del concepto con un ejemplo, (4) Resumen de 2-3 ideas clave, (5) Pregunta o tarea para el estudiante. Un guión de este tipo puede escribirse en 10 minutos y salvará tu grabación.",
                    extra: "Guión de bolsillo: escribe tus 5 puntos en un papel y pégalo detrás del celular mientras grabas. Puedes mirarlo discretamente sin que se note demasiado. Es una técnica sencilla usada por muchos youtubers educativos."
                },
                {
                    id: 21,
                    type: "quiz",
                    title: "✅ Quiz: Ventajas del video docente",
                    question: "¿Cuál es la principal ventaja de que un docente guatemalteco cree su propio video educativo frente a usar uno de YouTube?",
                    options: [
                        "Los videos propios siempre tienen mejor calidad de imagen",
                        "El docente puede adaptar el contenido al contexto local y la realidad de sus estudiantes",
                        "Los videos propios se pueden subir a YouTube y ganar suscriptores",
                        "El Ministerio de Educación exige que los docentes produzcan su propio material"
                    ],
                    correct: 1,
                    explanation: "La principal ventaja es la pertinencia contextual: un video propio puede usar ejemplos locales, hablar en el idioma o dialecto familiar, y adaptarse exactamente a lo que los estudiantes de esa comunidad necesitan. Eso no lo puede hacer ningún video internacional."
                },
                {
                    id: 22,
                    type: "content",
                    title: "💡 Iluminación y audio: los dos factores clave",
                    content: "La calidad de un video educativo depende principalmente del audio y la iluminación, no de la resolución de la cámara. Para audio: graba en un espacio tranquilo, sin ruido de tráfico o viento. Para iluminación: usa luz natural de frente (frente a una ventana), nunca con la ventana detrás de ti. Estas dos mejoras hacen que cualquier video sea profesional.",
                    extra: "Prueba de audio antes de grabar: graba 30 segundos y escúchalos con audífonos. Si escuchas tu voz clara y sin eco fuerte, estás listo. Si hay mucho eco, coloca ropa, cortinas o cojines alrededor para absorber el sonido."
                },
                {
                    id: 23,
                    type: "content",
                    title: "📐 Encuadre y posición de la cámara",
                    content: "Para videos donde apareces tú explicando: coloca el celular a la altura de los ojos (nunca desde abajo). Usa la regla de tercios: no te posiciones exactamente al centro, sino ligeramente a un lado. Deja espacio entre tu cabeza y el borde superior del encuadre. Esto hace que el video se vea más profesional sin ningún esfuerzo adicional.",
                    extra: "Si hablas frente a una pizarra o material físico: asegúrate de que el material sea visible y legible. Prueba filmando, revisando el video y ajustando la posición antes de grabar la versión final."
                },
                {
                    id: 24,
                    type: "content",
                    title: "🛠️ Herramientas para grabar y editar",
                    content: "Para grabar: la cámara de tu celular es suficiente. Para editar de forma sencilla, estas apps son gratuitas y fáciles de usar: (1) CapCut: edición intuitiva, subtítulos automáticos, ideal para principiantes. (2) InShot: recorta, une clips y agrega música. (3) Canva Video: plantillas para videos explicativos. Para screencasts: Loom (desde computadora) o la grabación de pantalla nativa del celular.",
                    extra: "Si nunca has editado video, empieza con CapCut. Tiene tutoriales en español dentro de la misma app y una curva de aprendizaje muy amigable. En 2 horas puedes producir tu primer video educativo editado."
                },
                {
                    id: 25,
                    type: "quiz",
                    title: "✅ Quiz: Calidad de video",
                    question: "Si tienes que elegir entre mejorar la cámara de tu celular o mejorar el audio de tus videos educativos, ¿qué recomienda la buena práctica?",
                    options: [
                        "Mejorar la cámara, porque la imagen es lo primero que nota el espectador",
                        "Ambos son igualmente importantes y deben mejorarse al mismo tiempo",
                        "Mejorar el audio, porque un video con imagen regular pero audio claro funciona bien",
                        "Ninguno: los estudiantes aceptan cualquier calidad si el docente es bueno"
                    ],
                    correct: 2,
                    explanation: "El audio es el factor más crítico en un video educativo. Los espectadores toleran imágenes de menor calidad, pero abandonan un video con audio malo o inaudible. Invierte primero en mejorar el ambiente de grabación para un buen sonido."
                },
                {
                    id: 26,
                    type: "content",
                    title: "🔒 Privacidad y uso responsable al publicar",
                    content: "Antes de publicar un video donde aparecen estudiantes, obtén el consentimiento escrito de sus padres o encargados. Si publicas en YouTube, puedes configurar el video como 'no listado' (solo accesible con el enlace) para compartirlo con tus estudiantes sin exponerlo al público general. Nunca publiques videos de menores sin autorización expresa.",
                    extra: "Alternativa segura: graba solo materiales donde apareces tú explicando, sin incluir el rostro o voz de estudiantes. Así puedes compartir libremente sin preocupaciones de privacidad."
                },
                {
                    id: 27,
                    type: "content",
                    title: "🚀 Tu primer video en 5 pasos",
                    content: "Sigue este proceso para tu primera producción: (1) Elige un concepto pequeño que puedas explicar en 3 minutos. (2) Escribe 5 puntos clave en un papel. (3) Graba en un lugar tranquilo con luz natural de frente. (4) Revisa el audio y la imagen. Si está aceptable, no perfecciones más: publícalo. (5) Comparte con un colega de confianza para recibir retroalimentación antes de usarlo con estudiantes.",
                    extra: "El perfeccionismo es el mayor obstáculo para crear contenido. Tu primer video no tiene que ser perfecto, tiene que existir. Con cada video mejorarás naturalmente."
                }
            ]
        },

        // ══════════════════════════════════════════════════════════════════════
        //  MÓDULO 4 — Evaluación y canales recomendados (8 tarjetas)
        // ══════════════════════════════════════════════════════════════════════
        {
            id: 4,
            title: "📊 Módulo 4: Evaluación y canales recomendados",
            cards: [
                {
                    id: 28,
                    type: "content",
                    title: "📏 ¿Cómo evaluar el aprendizaje a través de videos?",
                    content: "La evaluación del aprendizaje basado en video debe ir más allá de 'vieron el video'. Estrategias efectivas: (1) Cuestionarios post-video con preguntas de comprensión y análisis. (2) Mapas conceptuales construidos después de ver. (3) Ensayos breves de opinión. (4) Debates o discusiones estructuradas basadas en el contenido. (5) Proyectos donde los estudiantes crean su propio video respondiendo a lo aprendido.",
                    extra: "La evaluación más poderosa es pedir a los estudiantes que enseñen el concepto: 'Explica con tus propias palabras lo que aprendiste del video'. Si pueden explicarlo, lo aprendieron."
                },
                {
                    id: 29,
                    type: "content",
                    title: "🎯 Rúbricas para evaluar videos creados por estudiantes",
                    content: "Cuando los estudiantes crean videos como evidencia de aprendizaje, necesitas una rúbrica clara. Evalúa: (1) Precisión del contenido: ¿es correcto lo que explican? (2) Claridad: ¿se entiende la explicación? (3) Uso de ejemplos: ¿ilustran con ejemplos concretos? (4) Organización: ¿tiene inicio, desarrollo y cierre? La producción técnica es secundaria.",
                    extra: "Comparte la rúbrica ANTES de que empiecen a grabar. Cuando los estudiantes conocen los criterios, su producción mejora significativamente y el proceso se convierte en un aprendizaje en sí mismo."
                },
                {
                    id: 30,
                    type: "quiz",
                    title: "✅ Quiz: Evaluación con video",
                    question: "Un docente pide a sus estudiantes que graben un video explicando el proceso de la fotosíntesis. ¿Qué criterio debería tener más peso en la evaluación?",
                    options: [
                        "La calidad visual y de audio del video",
                        "La duración del video (que cumpla con el tiempo asignado)",
                        "La precisión y claridad del contenido explicado",
                        "El número de efectos visuales y música de fondo"
                    ],
                    correct: 2,
                    explanation: "En la evaluación de videos educativos creados por estudiantes, la precisión y claridad del contenido siempre tiene mayor peso que la producción técnica. El objetivo es evaluar el aprendizaje del tema, no las habilidades de edición."
                },
                {
                    id: 31,
                    type: "content",
                    title: "📺 YouTube como canal educativo: organízalo",
                    content: "YouTube puede ser un caos o una biblioteca organizada: depende de ti. Crea una cuenta de YouTube exclusivamente para tus recursos docentes. Organiza tus videos favoritos en listas de reproducción por grado, materia o unidad. Comparte solo el enlace de la lista con tus estudiantes. Así tendrán acceso a recursos curados, no al algoritmo general de YouTube.",
                    extra: "Activa el 'Modo restringido' de YouTube para filtrar contenido inapropiado. En la cuenta del colegio o en los dispositivos del aula, este ajuste se puede configurar para que siempre esté activo."
                },
                {
                    id: 32,
                    type: "content",
                    title: "🌟 Canales en español recomendados: ciencias",
                    content: "Para ciencias naturales y exactas: (1) Veritasium en Español: fenómenos científicos con experimentos. (2) Ciencia y Más: biología, química y física de forma visual. (3) Khan Academy en Español: matemáticas y ciencias con explicaciones graduadas. (4) Cosmos: Carl Sagan y Neil deGrasse Tyson con subtítulos en español. (5) TED-Ed en Español: ideas científicas en menos de 10 minutos.",
                    extra: "Khan Academy en Español es especialmente valiosa: es gratuita, sin anuncios, cubre todos los niveles desde primaria hasta bachillerato y tiene ejercicios interactivos que complementan los videos."
                },
                {
                    id: 33,
                    type: "content",
                    title: "📚 Canales en español recomendados: humanidades",
                    content: "Para historia, lengua, arte y ciencias sociales: (1) Crash Course en Español: historia universal con animaciones. (2) Academia Play: historia y cultura en videos cortos. (3) El Orden Mundial: geopolítica y actualidad. (4) Date un Vlog: historia de forma entretenida. (5) Yulay: exploración cultural y geográfica. Para Guatemala específicamente: el canal del INGUAT y el Archivo General de Centroamérica tienen material valioso.",
                    extra: "Busca también documentales de la BBC en español disponibles en YouTube. Son rigurosos, bien producidos y abordan temas de historia universal con perspectiva latinoamericana en muchos casos."
                },
                {
                    id: 34,
                    type: "quiz",
                    title: "✅ Quiz: Organización de YouTube",
                    question: "¿Cuál es la mejor práctica para compartir videos de YouTube con estudiantes de primaria?",
                    options: [
                        "Dar acceso libre a YouTube para que cada estudiante busque lo que necesita",
                        "Crear listas de reproducción curadas con los videos seleccionados y compartir solo ese enlace",
                        "Descargar todos los videos y copiarlos en memorias USB para cada estudiante",
                        "Proyectar los videos en clase sin que los estudiantes tengan acceso al enlace"
                    ],
                    correct: 1,
                    explanation: "Las listas de reproducción curadas permiten compartir recursos seleccionados sin exponer a los estudiantes al algoritmo general de YouTube, que puede recomendar contenido inapropiado. Es la práctica más segura y pedagógicamente organizada."
                },
                {
                    id: 35,
                    type: "content",
                    title: "🏁 Tu plan de acción: primeros pasos",
                    content: "Para empezar a usar videos educativos de forma efectiva esta semana: (1) Identifica un tema de tu próxima clase y busca un video de menos de 6 minutos en YouTube. (2) Evalúalo con los criterios aprendidos en este curso. (3) Prepara 3 preguntas para discutir después del video. (4) Úsalo en clase con al menos una pausa reflexiva. (5) Reflexiona: ¿qué funcionó? ¿qué cambiarías? Así empieza la mejora continua.",
                    extra: "No esperes tener todo perfecto para empezar. Un video bien seleccionado con tres buenas preguntas al final ya transforma una clase. La práctica constante y la reflexión son lo que convierte a un docente en experto en ABV."
                }
            ]
        }
    ]
},

// CURSO: micro-learning
{
    id: 'micro-learning',
    title: 'Micro-learning: Aprender en Pequeñas Dosis',
    subtitle: 'Diseña cápsulas de aprendizaje de 2 a 10 minutos que realmente funcionan',
    icon: '⚡',
    color: '#6366F1',
    prerequisite: [],
    status: 'available',
    durationHours: 3,
    totalCards: 35,
    modules: [

        // ══════════════════════════════════════════════════════════════════════
        //  MÓDULO 1 — ¿Qué es el micro-learning y por qué funciona? (9 tarjetas)
        // ══════════════════════════════════════════════════════════════════════
        {
            id: 1,
            title: "⚡ Módulo 1: ¿Qué es el micro-learning y por qué funciona?",
            cards: [
                {
                    id: 1,
                    type: "content",
                    title: "⚡ ¿Qué es el micro-learning?",
                    content: "El micro-learning es una estrategia educativa que organiza el aprendizaje en cápsulas breves y enfocadas de 2 a 10 minutos, cada una dedicada a un solo concepto o habilidad. A diferencia de las clases largas, cada cápsula tiene un objetivo claro, un formato específico y termina con una acción concreta que el estudiante puede realizar de inmediato.",
                    extra: "El término viene del inglés 'microlearning', pero el concepto es tan antiguo como los refranes y los proverbios: pequeñas dosis de sabiduría diseñadas para ser recordadas fácilmente. Lo nuevo es aplicarlo con intención pedagógica y herramientas digitales."
                },
                {
                    id: 2,
                    type: "content",
                    title: "🧠 La curva del olvido de Ebbinghaus",
                    content: "En 1885, el psicólogo alemán Hermann Ebbinghaus demostró que olvidamos el 50% de lo aprendido en la primera hora, el 70% en 24 horas y hasta el 90% en una semana, si no repasamos. Este fenómeno se llama la 'curva del olvido' y explica por qué las clases largas sin repetición son poco efectivas.",
                    extra: "El micro-learning combate la curva del olvido de dos formas: (1) Reparte el aprendizaje en pequeñas dosis que se pueden revisar frecuentemente. (2) Cada cápsula termina con una acción o reflexión que consolida la memoria antes de que ocurra el olvido."
                },
                {
                    id: 3,
                    type: "content",
                    title: "🔋 Memoria de trabajo: por qué menos es más",
                    content: "La memoria de trabajo es la 'pantalla mental' donde procesamos información consciente. Su capacidad es limitada: el psicólogo George Miller demostró que solo podemos manejar 7 (±2) elementos a la vez. Una clase densa de 45 minutos con 15 conceptos nuevos satura esta capacidad. Una cápsula de 5 minutos con 1-2 conceptos la respeta.",
                    extra: "Cuando la memoria de trabajo se satura, el cerebro empieza a 'botar' información para hacer espacio. Por eso, al final de una clase larga y densa, los estudiantes recuerdan el principio y el final, pero poco del medio. El micro-learning diseña para esta limitación."
                },
                {
                    id: 4,
                    type: "quiz",
                    title: "✅ Quiz: Curva del olvido",
                    question: "Según la curva del olvido de Ebbinghaus, ¿qué porcentaje aproximado de lo aprendido olvidamos en las primeras 24 horas sin repasar?",
                    options: [
                        "Aproximadamente el 20%",
                        "Aproximadamente el 40%",
                        "Aproximadamente el 70%",
                        "Aproximadamente el 90%"
                    ],
                    correct: 2,
                    explanation: "Ebbinghaus demostró que olvidamos aproximadamente el 70% de la información nueva en las primeras 24 horas si no ocurre ningún repaso. Este dato fundamenta la necesidad de estrategias como el micro-learning, que distribuyen y repiten el aprendizaje en el tiempo."
                },
                {
                    id: 5,
                    type: "content",
                    title: "🎯 Atención sostenida: el límite real",
                    content: "Estudios de neurociencia muestran que la atención sostenida de alta calidad dura entre 10 y 20 minutos en adultos, y menos en niños y adolescentes. Después, la atención 'colapsa' aunque la persona siga físicamente presente. El micro-learning trabaja dentro de esta ventana natural de atención en lugar de luchar contra ella.",
                    extra: "En el contexto escolar guatemalteco, donde muchos estudiantes llegan a clase con fatiga, hambre o preocupaciones familiares, la ventana de atención real puede ser incluso más corta. El micro-learning es una respuesta pedagógica realista a este contexto."
                },
                {
                    id: 6,
                    type: "content",
                    title: "📱 Por qué el micro-learning encaja con la vida digital",
                    content: "Los estudiantes actuales consumen contenido en TikTok, YouTube Shorts, Instagram Reels: todos formatos de 15 segundos a 3 minutos. No es que tengan 'menos atención'; es que están habituados a formatos densos y breves. El micro-learning no lucha contra esto: lo aprovecha para la educación.",
                    extra: "Un estudio de Software Advice encontró que el 58% de empleados y estudiantes prefieren aprender en módulos de menos de 10 minutos. Diseñar para esta preferencia no es 'bajar el nivel', es ser pedagógicamente inteligente."
                },
                {
                    id: 7,
                    type: "content",
                    title: "🇬🇹 Micro-learning en el aula guatemalteca",
                    content: "En Guatemala, el micro-learning tiene sentido práctico adicional: muchos docentes tienen períodos de 45 minutos compartidos entre contenido, disciplina y logística. Una secuencia de 3 cápsulas de 8 minutos con 5 minutos de actividad cada una cubre exactamente ese período. Además, las cápsulas pueden compartirse por WhatsApp para estudiantes que faltaron.",
                    extra: "El micro-learning también funciona para la formación continua de docentes: una cápsula de 5 minutos por semana sobre una estrategia pedagógica es más sostenible que un taller de 8 horas cada semestre."
                },
                {
                    id: 8,
                    type: "quiz",
                    title: "✅ Quiz: Memoria de trabajo",
                    question: "¿Cuántos elementos puede manejar la memoria de trabajo humana de forma simultánea, según George Miller?",
                    options: [
                        "Entre 3 y 5 elementos",
                        "Entre 7 y 9 elementos (7 ± 2)",
                        "Entre 12 y 15 elementos",
                        "Depende completamente de la persona y no hay un límite general"
                    ],
                    correct: 1,
                    explanation: "George Miller estableció en su influyente artículo de 1956 que la memoria de trabajo puede manejar 7 (±2) elementos a la vez, es decir entre 5 y 9 piezas de información. Superar este límite satura la capacidad de procesamiento y reduce el aprendizaje."
                },
                {
                    id: 9,
                    type: "content",
                    title: "✨ El principio clave: un concepto, una cápsula",
                    content: "La regla de oro del micro-learning es: una cápsula, un objetivo, una acción. Cada unidad de aprendizaje responde a una sola pregunta o enseña una sola habilidad. Este principio parece sencillo, pero rompe con la tradición educativa que mezcla varios conceptos en una misma clase.",
                    extra: "Ejercicio de reflexión: piensa en tu próxima clase. ¿Cuántos conceptos distintos planeas enseñar? Si son más de 3, es candidata perfecta para convertirse en una secuencia de micro-cápsulas en lugar de una clase tradicional."
                }
            ]
        },

        // ══════════════════════════════════════════════════════════════════════
        //  MÓDULO 2 — Diseñando micro-cápsulas efectivas (9 tarjetas)
        // ══════════════════════════════════════════════════════════════════════
        {
            id: 2,
            title: "🎨 Módulo 2: Diseñando micro-cápsulas efectivas",
            cards: [
                {
                    id: 10,
                    type: "content",
                    title: "🏗️ La anatomía de una micro-cápsula",
                    content: "Toda micro-cápsula efectiva tiene tres partes: (1) Gancho (0-30 segundos): una pregunta, dato sorprendente o problema que activa la curiosidad. (2) Núcleo (el 80% del tiempo): la explicación del único concepto, con un ejemplo concreto. (3) Cierre-acción (últimos 30 segundos): qué puede hacer el estudiante ahora mismo con lo aprendido.",
                    extra: "El cierre-acción es lo que diferencia el micro-learning del simple 'contenido breve'. La acción puede ser: responder una pregunta, probar algo, reflexionar sobre su práctica, o buscar un ejemplo en su entorno."
                },
                {
                    id: 11,
                    type: "content",
                    title: "🎯 Cómo redactar un objetivo específico para tu cápsula",
                    content: "Un buen objetivo de micro-cápsula empieza con un verbo de acción observable y se puede lograr en el tiempo de la cápsula. Ejemplos malos: 'Entender la fotosíntesis' (demasiado amplio). Ejemplos buenos: 'Identificar los tres ingredientes que necesita la fotosíntesis' o 'Distinguir entre respiración celular y fotosíntesis usando un ejemplo'.",
                    extra: "Pregunta de verificación: ¿Puedes saber si el estudiante logró el objetivo en 30 segundos de conversación o con una pregunta directa? Si la respuesta es sí, el objetivo es suficientemente específico para una micro-cápsula."
                },
                {
                    id: 12,
                    type: "quiz",
                    title: "✅ Quiz: Anatomía de la micro-cápsula",
                    question: "¿Qué elemento de la micro-cápsula la diferencia del simple contenido breve y asegura que el aprendizaje sea activo?",
                    options: [
                        "El gancho inicial que activa la curiosidad",
                        "La calidad visual del material utilizado",
                        "El cierre con una acción concreta que el estudiante puede realizar",
                        "La duración exacta de la cápsula (ni más ni menos de 5 minutos)"
                    ],
                    correct: 2,
                    explanation: "El cierre-acción es el elemento que transforma una cápsula de información en una cápsula de aprendizaje. Pedir al estudiante que haga algo con lo aprendido (responder, probar, reflexionar) consolida el conocimiento y lo hace aplicable."
                },
                {
                    id: 13,
                    type: "content",
                    title: "🖼️ Formatos de micro-cápsulas",
                    content: "El micro-learning no tiene un solo formato. Puedes usar: (1) Video corto de 2-5 minutos. (2) Infografía de una sola página con 5-7 datos clave. (3) Audio o podcast de 3-8 minutos (ideal para desplazamientos). (4) Tarjeta didáctica digital (como las de esta plataforma). (5) Texto con imagen: una pantalla de contenido más una pregunta. Elige el formato según el concepto y los recursos disponibles.",
                    extra: "Regla de oro del formato: el formato debe servir al concepto, no al revés. Un concepto que requiere ver movimiento (como una célula dividiéndose) pide video. Un concepto que requiere comparar datos pide infografía. Un concepto que requiere escuchar un modelo de pronunciación pide audio."
                },
                {
                    id: 14,
                    type: "content",
                    title: "✍️ Escribir para micro-learning: el arte de la brevedad",
                    content: "Escribir micro-contenido es más difícil que escribir largo: requiere eliminar todo lo que no es esencial. Técnica de los tres pasos: (1) Escribe lo que quieres decir sin limitación. (2) Subraya solo las ideas que el estudiante NECESITA para el objetivo. (3) Elimina todo lo demás. Lo que queda es el núcleo de tu micro-cápsula.",
                    extra: "Si una idea importante no cabe en la cápsula, no la comprimas: crea otra cápsula para ella. Comprimir demasiado produce textos densos e ilegibles. La solución siempre es dividir, no comprimir."
                },
                {
                    id: 15,
                    type: "content",
                    title: "🔑 El ejemplo concreto: el corazón de cada cápsula",
                    content: "Todo concepto abstracto necesita al menos un ejemplo concreto y local. En Guatemala: cuando expliques fracciones, usa ejemplos de comida típica (mitad de un tamal, un cuarto de tortilla). Cuando expliques ecosistemas, usa ejemplos del altiplano, la costa o el Petén. El ejemplo concreto es lo que ancla el concepto en la memoria.",
                    extra: "Investigación sobre pedagogía culturalmente pertinente muestra que los estudiantes guatemaltecos retienen hasta 40% más cuando los ejemplos se conectan con su contexto familiar inmediato: comida, mercado, naturaleza local, vida comunitaria."
                },
                {
                    id: 16,
                    type: "quiz",
                    title: "✅ Quiz: Objetivos de micro-cápsula",
                    question: "¿Cuál de los siguientes es un objetivo ADECUADO para una micro-cápsula de aprendizaje?",
                    options: [
                        "Comprender la historia completa de la Revolución de Octubre de 1944 en Guatemala",
                        "Identificar dos causas principales que motivaron la Revolución de Octubre",
                        "Valorar la importancia de los movimientos sociales para la democracia",
                        "Estudiar el contexto político, económico y social de Guatemala en la primera mitad del siglo XX"
                    ],
                    correct: 1,
                    explanation: "Identificar dos causas específicas es un objetivo acotado, verificable y alcanzable en el tiempo de una micro-cápsula. Los otros objetivos son demasiado amplios o abstractos para una sola cápsula de 2-10 minutos."
                },
                {
                    id: 17,
                    type: "content",
                    title: "🔁 La repetición espaciada: refuerza sin aburrir",
                    content: "La repetición espaciada es la práctica de revisar la misma información en intervalos crecientes: hoy, mañana, en 3 días, en una semana, en un mes. El micro-learning es ideal para implementarla: una cápsula de 2 minutos de repaso el día siguiente consolida el aprendizaje mejor que estudiar el mismo tema por 20 minutos una sola vez.",
                    extra: "Puedes implementar repetición espaciada de forma sencilla: al inicio de cada clase, dedica 3 minutos a revisar lo de ayer. Una pregunta oral o una tarjeta de repaso es suficiente. Este 'micro-repaso' al inicio de cada sesión transforma la retención de tus estudiantes."
                },
                {
                    id: 18,
                    type: "content",
                    title: "🧩 De la cápsula al concepto complejo: planificación en capas",
                    content: "Un concepto complejo se puede enseñar en micro-capas: Día 1: ¿Qué es? (definición y ejemplo). Día 2: ¿Cómo funciona? (proceso o mecanismo). Día 3: ¿Por qué importa? (aplicación y relevancia). Día 4: ¿Cómo lo uso yo? (práctica guiada). Día 5: Repaso integrador. Así, en 5 cápsulas de 5-8 minutos, has cubierto un concepto complejo con profundidad real.",
                    extra: "Este enfoque en capas es especialmente útil para conceptos científicos abstractos, gramática compleja o procesos matemáticos de varios pasos. Cada capa debe ser comprensible por sí sola, pero también conectar con las capas anteriores."
                }
            ]
        },

        // ══════════════════════════════════════════════════════════════════════
        //  MÓDULO 3 — Herramientas y canales para micro-learning (9 tarjetas)
        // ══════════════════════════════════════════════════════════════════════
        {
            id: 3,
            title: "🛠️ Módulo 3: Herramientas y canales para micro-learning",
            cards: [
                {
                    id: 19,
                    type: "content",
                    title: "📊 Infografías como micro-cápsulas visuales",
                    content: "Una infografía bien diseñada puede transmitir en 30 segundos lo que un texto tarda 5 minutos. Para crear infografías educativas: (1) Un solo tema por infografía. (2) Máximo 7 datos o puntos. (3) Jerarquía visual clara: el dato más importante, más grande. (4) Herramientas gratuitas: Canva (con plantillas educativas), Piktochart o Adobe Express.",
                    extra: "Para docentes guatemaltecos sin mucho tiempo: Canva tiene plantillas educativas en español que se pueden adaptar en 15 minutos. Descarga la app en tu celular y puedes crear infografías en cualquier momento libre."
                },
                {
                    id: 20,
                    type: "content",
                    title: "🎵 Audios educativos: el micro-learning para el oído",
                    content: "Los audios son cápsulas perfectas para temas que requieren escuchar: pronunciación de idiomas, lectura en voz alta de textos literarios, explicaciones para estudiantes con dificultades de lectura, o contenido para escuchar durante el desplazamiento. Herramientas gratuitas: Anchor (ahora Spotify for Podcasters), grabaciones de voz en WhatsApp, o la grabadora nativa del celular.",
                    extra: "Los audios son especialmente valiosos para comunidades guatemaltecas con alta diversidad lingüística: puedes crear versiones de tus micro-cápsulas en español y en el idioma maya de tu comunidad, haciendo el contenido realmente accesible para todos."
                },
                {
                    id: 21,
                    type: "quiz",
                    title: "✅ Quiz: Selección de formato",
                    question: "Un docente quiere enseñar la diferencia entre 'b' y 'v' en español a estudiantes de segundo primaria. ¿Qué formato de micro-cápsula sería más efectivo?",
                    options: [
                        "Una infografía con la diferencia visual entre las dos letras",
                        "Un texto escrito con las reglas ortográficas de uso",
                        "Un audio con ejemplos de palabras con 'b' y 'v' para escuchar y repetir",
                        "Un video de dibujos animados sobre el abecedario"
                    ],
                    correct: 2,
                    explanation: "Aprender a distinguir sonidos requiere escucharlos, no solo verlos. Un audio con ejemplos claros de palabras con 'b' y 'v' activa el canal auditivo de aprendizaje, que es el más adecuado para este objetivo. El video podría funcionar si combina audio con visuales del movimiento de la boca."
                },
                {
                    id: 22,
                    type: "content",
                    title: "💬 WhatsApp como canal de micro-learning",
                    content: "WhatsApp es la plataforma más usada en Guatemala, presente en prácticamente todos los hogares con smartphone. Úsalo para micro-learning: (1) Notas de voz de 2-3 minutos con una explicación. (2) Imágenes de infografías con una pregunta reflexiva. (3) Videos cortos del docente explicando un concepto. (4) Preguntas del día para reflexionar. Todo esto puede enviarse al grupo de clase.",
                    extra: "Protocolo de uso responsable: establece desde el inicio las normas del grupo (solo contenido educativo, respeto mutuo, sin reenvíos externos). Informa a los padres sobre el propósito del grupo. Usa listas de difusión en lugar de grupos si prefieren que los estudiantes no se comuniquen entre sí."
                },
                {
                    id: 23,
                    type: "content",
                    title: "🌟 Stickers educativos en WhatsApp",
                    content: "Los stickers personalizados son un recurso micro-learning poco explorado. Puedes crear packs de stickers con: reglas gramaticales ilustradas, fórmulas matemáticas, vocabulario con imagen, líneas de tiempo en miniatura. Herramientas: WhatsApp Sticker Maker (app gratuita) o Canva (que exporta en formato de sticker).",
                    extra: "Los stickers educativos funcionan como 'recordatorios visuales' que los estudiantes ven en su vida cotidiana de WhatsApp. Un estudiante que usa stickers de gramática cuando chatea está reforzando reglas de forma completamente natural."
                },
                {
                    id: 24,
                    type: "content",
                    title: "🃏 Tarjetas didácticas digitales",
                    content: "Las tarjetas didácticas (flashcards) digitales son la forma más clásica de micro-learning. Plataformas como Quizlet, Anki y Brainscape permiten crear colecciones de tarjetas con pregunta y respuesta que el estudiante repasa con repetición espaciada automática. Son ideales para vocabulario, fórmulas, fechas históricas y conceptos de definición.",
                    extra: "Anki es completamente gratuita (app móvil y web) y usa un algoritmo de repetición espaciada muy sofisticado. Quizlet tiene una versión gratuita con funciones suficientes para uso escolar. Ambas tienen colecciones de tarjetas ya creadas en español que puedes usar directamente."
                },
                {
                    id: 25,
                    type: "quiz",
                    title: "✅ Quiz: WhatsApp educativo",
                    question: "¿Cuál de las siguientes es una práctica recomendada al usar WhatsApp para micro-learning con estudiantes?",
                    options: [
                        "Agregar a todos los contactos del colegio al mismo grupo para mayor alcance",
                        "Enviar mensajes a cualquier hora del día para aprovechar todos los momentos",
                        "Establecer normas claras del grupo e informar a los padres sobre su propósito",
                        "Reenviar contenido de otros grupos para diversificar los recursos"
                    ],
                    correct: 2,
                    explanation: "Las normas claras y la comunicación con las familias son fundamentales para el uso responsable de WhatsApp en educación. Sin estas bases, el grupo puede perder su propósito educativo o generar problemas de privacidad y convivencia digital."
                },
                {
                    id: 26,
                    type: "content",
                    title: "🎬 Videos cortos como micro-cápsulas",
                    content: "TikTok, YouTube Shorts y los Reels de Instagram han popularizado el video de menos de 3 minutos. Como docente puedes usar estos formatos: graba explicaciones de 60-90 segundos de un concepto clave, con un ejemplo visual y una pregunta al final. No necesitas publicarlos en redes: puedes enviarlos directamente por WhatsApp o almacenarlos en Google Drive.",
                    extra: "Técnica del 'video reels pedagógico': graba de pie, en vertical (como una foto de celular), con texto sobreimpreso mostrando los puntos clave mientras hablas. CapCut y InShot permiten agregar estos textos de forma muy sencilla."
                },
                {
                    id: 27,
                    type: "content",
                    title: "🗂️ Organiza tu banco de micro-cápsulas",
                    content: "Conforme crees micro-cápsulas, necesitas organizarlas para reutilizarlas. Estrategia sencilla: crea una carpeta en Google Drive con subcarpetas por grado y materia. Usa nombres descriptivos: '5to_primaria_fracciones_que_es.mp4'. Comparte la carpeta con colegas del mismo grado para construir un banco colectivo de recursos.",
                    extra: "Un banco colectivo de micro-cápsulas entre docentes del mismo colegio puede ahorrarte horas de trabajo: si tu colega ya creó una cápsula excelente sobre el sistema respiratorio, puedes usarla directamente o adaptarla, en lugar de crearla desde cero."
                }
            ]
        },

        // ══════════════════════════════════════════════════════════════════════
        //  MÓDULO 4 — Secuencias y evaluación del micro-aprendizaje (8 tarjetas)
        // ══════════════════════════════════════════════════════════════════════
        {
            id: 4,
            title: "📈 Módulo 4: Secuencias y evaluación del micro-aprendizaje",
            cards: [
                {
                    id: 28,
                    type: "content",
                    title: "🔗 Cómo encadenar cápsulas: la secuencia de aprendizaje",
                    content: "Las micro-cápsulas son más poderosas cuando se encadenan en una secuencia con lógica pedagógica. Tipos de secuencias: (1) Lo simple a lo complejo: empieza con el concepto básico y avanza gradualmente. (2) Lo concreto a lo abstracto: empieza con un ejemplo tangible y llega al principio general. (3) Problema-solución: presenta el problema primero, luego las cápsulas que lo resuelven.",
                    extra: "Analogía guatemalteca: una secuencia de micro-cápsulas es como un tejido maya. Cada hilo (cápsula) es completo por sí solo, pero el patrón completo (la secuencia) revela el diseño total. Cada cápsula debe tener sentido sola Y contribuir al conjunto."
                },
                {
                    id: 29,
                    type: "content",
                    title: "🗓️ Planificando una secuencia semanal",
                    content: "Ejemplo de secuencia semanal para un concepto complejo como 'La célula': Lunes: ¿Qué es la célula? (definición + ejemplo cotidiano). Martes: Las partes de la célula (membrana, núcleo, citoplasma). Miércoles: Diferencias entre célula animal y vegetal. Jueves: ¿Cómo se reproduce la célula? Viernes: Mini-evaluación + repaso. Cinco cápsulas de 5-7 minutos equivalen a 25-35 minutos de aprendizaje concentrado y efectivo.",
                    extra: "Esta secuencia puede funcionar como actividad de inicio de clase (7 minutos) o como tarea diaria enviada por WhatsApp. En ambos casos, el aprendizaje se distribuye en el tiempo respetando la curva del olvido de Ebbinghaus."
                },
                {
                    id: 30,
                    type: "quiz",
                    title: "✅ Quiz: Secuencias de micro-learning",
                    question: "¿Cuál es la principal ventaja de organizar las micro-cápsulas en una secuencia pedagógica en lugar de usarlas de forma aislada?",
                    options: [
                        "Las secuencias son más fáciles de crear que las cápsulas individuales",
                        "Permiten construir conceptos complejos distribuyendo el aprendizaje en el tiempo",
                        "Evitan que los estudiantes tengan que interactuar con el contenido fuera del aula",
                        "Reducen la necesidad de evaluar cada cápsula por separado"
                    ],
                    correct: 1,
                    explanation: "La secuencia pedagógica permite construir conceptos complejos de forma gradual, distribuyendo el aprendizaje en el tiempo y aprovechando la curva del olvido para reforzar en los momentos óptimos. Esto es imposible con cápsulas aisladas sin conexión entre sí."
                },
                {
                    id: 31,
                    type: "content",
                    title: "📊 Cómo evaluar el micro-learning: estrategias rápidas",
                    content: "La evaluación del micro-learning debe ser tan ágil como el contenido. Estrategias de evaluación breve: (1) Una pregunta de verificación al final de cada cápsula (oral o escrita, 1 minuto). (2) 'Ticket de salida': en una tarjeta, el estudiante escribe una cosa que aprendió y una pregunta que le quedó. (3) Mini-quiz de 3 preguntas al final de la semana. (4) Autoevaluación: '¿Puedo explicar esto a un compañero? Sí / No / Más o menos'.",
                    extra: "El 'ticket de salida' es una de las estrategias de evaluación formativa más investigadas y efectivas. Tarda menos de 2 minutos, da información valiosa al docente sobre lo que se comprendió y lo que no, y activa la metacognición del estudiante."
                },
                {
                    id: 32,
                    type: "content",
                    title: "📱 Seguimiento digital del aprendizaje",
                    content: "Herramientas gratuitas para hacer seguimiento del micro-learning: (1) Google Forms: envía el mini-quiz como formulario y las respuestas se organizan automáticamente en una hoja de cálculo. (2) Kahoot o Quizizz: evaluación gamificada de 5-10 preguntas en 5 minutos. (3) Mentimeter: preguntas en tiempo real con visualización de respuestas. (4) Poll Everywhere: encuestas y preguntas rápidas para grupos grandes.",
                    extra: "Google Forms es la herramienta más accesible en Guatemala: es completamente gratuita, funciona bien con datos móviles limitados, y los resultados permiten identificar rápidamente qué conceptos necesitan más atención antes de avanzar."
                },
                {
                    id: 33,
                    type: "quiz",
                    title: "✅ Quiz: Evaluación formativa",
                    question: "¿Qué es un 'ticket de salida' en el contexto del micro-learning?",
                    options: [
                        "Un certificado que el estudiante recibe al completar todas las cápsulas de una secuencia",
                        "Una tarjeta o nota breve donde el estudiante escribe qué aprendió y qué pregunta le quedó",
                        "Un código QR que permite al docente registrar la asistencia digital de los estudiantes",
                        "Una evaluación sumativa de 20 preguntas al finalizar la unidad"
                    ],
                    correct: 1,
                    explanation: "El ticket de salida es una estrategia de evaluación formativa rápida: el estudiante escribe en 2 minutos qué aprendió y qué duda le quedó. Informa al docente sobre la comprensión real del grupo y activa la metacognición del estudiante."
                },
                {
                    id: 34,
                    type: "content",
                    title: "🏆 Indicadores de éxito del micro-learning",
                    content: "¿Cómo saber si tu secuencia de micro-learning está funcionando? Indicadores cualitativos: los estudiantes hacen preguntas más profundas, los estudiantes pueden explicar el concepto a otros, los errores en las evaluaciones disminuyen. Indicadores cuantitativos: participación en los quizzes, resultados de los tickets de salida, calificaciones en evaluaciones formales.",
                    extra: "El indicador más honesto: pregúntate si un estudiante que faltó una semana puede ponerse al día usando solo las micro-cápsulas. Si la respuesta es sí, tu secuencia tiene suficiente claridad y autoexplicación."
                },
                {
                    id: 35,
                    type: "content",
                    title: "🚀 Tu plan de micro-learning: empieza esta semana",
                    content: "Para implementar micro-learning esta semana: (1) Identifica un concepto que tus estudiantes encuentran difícil. (2) Diseña 3 cápsulas de 5-7 minutos: qué es, cómo funciona, para qué sirve. (3) Elige un formato para cada una (video, audio o infografía). (4) Crea la primera cápsula hoy. (5) Compártela mañana. Evalúa con un ticket de salida. (6) Mejora la siguiente cápsula con lo que aprendiste. El micro-learning también es iterativo.",
                    extra: "Recuerda: el objetivo no es la perfección técnica, sino el aprendizaje de tus estudiantes. Una nota de voz de 5 minutos enviada por WhatsApp esta noche puede ser tu primera micro-cápsula. ¡El momento para empezar es ahora!"
                }
            ]
        }
    ]
}
