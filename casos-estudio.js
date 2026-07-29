// casos-estudio.js
// Branching Case Studies — Formación Docente en Pedagogía Innovadora
// Guatemala 2026

const CASE_STUDIES = [

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 1: "El aula de Mariana" — STEAM
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs1',
    title: 'El aula de Mariana',
    course: 'STEAM',
    color: '#07B0E4',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
    duration: '20-25 min',
    description: 'Mariana quiere hacer su primer proyecto STEAM en una escuela rural de Guatemala sin tecnología ni materiales comerciales. Acompáñala a tomar decisiones pedagógicas que transforman las limitaciones en oportunidades.',
    start: 'cs1_n1',
    nodes: {

      // ── LEVEL 1: Choose the project ──────────────────────────────────────
      'cs1_n1': {
        type: 'scenario',
        text: 'Mariana enseña cuarto grado en la Escuela Oficial Rural Mixta Cantón El Quetzal, en Chiquimula. Tiene 28 estudiantes, ninguna computadora, y un presupuesto mensual de Q40 para materiales. Esta semana escuchó sobre STEAM y se emocionó — pero al revisar su aula, ve pupitres de madera, tres marcadores y una ventana que da al monte. Quiere hacer un proyecto auténtico, no un experimento de ciencias de diez minutos.',
        context: 'El director le ha dado tres semanas para presentar algo ante los padres de familia. Los estudiantes viven en comunidades cafetaleras y maiceras. Tienen acceso al río, al bosque, y a las tradiciones de sus abuelos.',
        choices: [
          {
            text: 'Proponer un proyecto de purificación de agua usando materiales locales: arena, piedrín, carbón vegetal y telas.',
            next: 'cs1_n2a',
            isCorrect: true
          },
          {
            text: 'Pedir a los padres que compren un kit de robótica básica de internet para que los niños aprendan tecnología "de verdad".',
            next: 'cs1_n2b',
            isCorrect: false
          },
          {
            text: 'Recrear el Popol Vuh a través del arte y la ciencia: ilustrar los elementos naturales usando propiedades físicas y químicas reales.',
            next: 'cs1_n2c',
            isCorrect: false
          }
        ]
      },

      // LEVEL 2 branch A (correct path)
      'cs1_n2a': {
        type: 'feedback_correct',
        text: 'Excelente elección. Al anclar el proyecto en el agua — un recurso vital, presente, y problemático en la comunidad — Mariana conecta el STEAM con la realidad inmediata de sus estudiantes. El problema es auténtico: muchas familias del cantón no tienen acceso a agua purificada. Esto convierte el proyecto en algo con propósito real, no solo académico.',
        tip: 'Principio pedagógico: El aprendizaje STEAM más poderoso ocurre cuando el problema a resolver existe en el mundo real del estudiante. La "T" de tecnología no requiere dispositivos electrónicos — es la aplicación de conocimiento para resolver problemas.',
        next: 'cs1_n3a',
        xp: 10
      },

      // LEVEL 2 branch B (wrong path)
      'cs1_n2b': {
        type: 'feedback_wrong',
        text: 'Este camino tiene varios problemas. Primero, los kits de robótica cuestan entre Q800 y Q3,000 — muy fuera del alcance de las familias. Segundo, pedir ese gasto a padres cafetaleros en época de baja cosecha crea tensión entre la escuela y la comunidad. Tercero, y más importante: reduce la "T" de STEAM a gadgets electrónicos, ignorando que la tecnología es cualquier solución humana a un problema. Mariana necesita replantear su concepción del proyecto.',
        tip: 'Error común: confundir "tecnología" con "dispositivos digitales". En contextos rurales de Guatemala, un sistema de filtración de agua construido con materiales locales ES tecnología — y un proyecto STEAM más auténtico que un kit importado.',
        next: 'cs1_n3b',
        xp: 0
      },

      // LEVEL 2 branch C (partial path)
      'cs1_n2c': {
        type: 'feedback_wrong',
        text: 'La idea tiene valor cultural y puede ser hermosa, pero tiene una debilidad pedagógica: la conexión entre arte, ciencia y el Popol Vuh requiere una cuidadosa ingeniería curricular para no quedarse en decoración temática. Si no se diseña con rigor, los estudiantes aprenden sobre el Popol Vuh pero no integran realmente las disciplinas STEAM. Mariana necesita pensar si puede construir esa conexión profunda en tres semanas sin apoyo adicional.',
        tip: 'Considerar: los proyectos interdisciplinarios necesitan que cada disciplina aporte de forma genuina, no decorativa. ¿Qué preguntas científicas específicas respondería este proyecto? ¿Qué problema resuelve?',
        next: 'cs1_n3c',
        xp: 0
      },

      // ── LEVEL 3 branches ─────────────────────────────────────────────────

      // Path A: Good project, now faces parent complaint
      'cs1_n3a': {
        type: 'scenario',
        text: 'El proyecto de purificación de agua arranca bien. Los estudiantes están divididos en equipos y construyendo filtros con botellas plásticas, arena gruesa, piedrín y carbón de la cocina de leña. Pero al tercer día, el papá de uno de los estudiantes —Don Rigoberto, vocal de la junta escolar— se presenta en el aula y dice en voz alta frente a los niños: "Señorita, esto no es escuela. Mis hijos necesitan aprender matemáticas y gramática, no jugar con piedras."',
        context: 'Los estudiantes se detienen. Algunos miran a Mariana con incertidumbre. Don Rigoberto es respetado en la comunidad y su opinión pesa.',
        choices: [
          {
            text: 'Invitar a Don Rigoberto a quedarse y mostrarle cómo los estudiantes están usando fracciones para calcular las proporciones de los materiales y redactando hipótesis escritas.',
            next: 'cs1_n4a',
            isCorrect: true
          },
          {
            text: 'Disculparse y decirle que tiene razón — parar el proyecto y volver a los libros de texto para el resto de la semana.',
            next: 'cs1_n4b',
            isCorrect: false
          },
          {
            text: 'Pedirle que hable con el director y continuar la clase como si nada — los padres no deben interrumpir.',
            next: 'cs1_n4c',
            isCorrect: false
          }
        ]
      },

      // Path B: Had to reconceive project, now starting late
      'cs1_n3b': {
        type: 'scenario',
        text: 'Tras reflexionar, Mariana descarta el kit de robótica y vuelve a la comunidad como fuente. Habla con doña Eulalia, una abuela que sabe tejer huipiles, y nota que los patrones geométricos del tejido son matemática pura. Propone un proyecto STEAM alternativo: documentar y analizar los patrones geométricos del tejido maya local. Pero ahora perdió cinco días y solo tiene dos semanas. Los estudiantes están algo confundidos por el cambio de planes.',
        context: 'Mariana necesita reconstruir el entusiasmo del grupo y ajustar el alcance del proyecto para ser realista con el tiempo restante.',
        choices: [
          {
            text: 'Ser honesta con los estudiantes: explicar que cambió de dirección porque encontró algo más valioso, y pedirles que le ayuden a diseñar el nuevo proyecto juntos.',
            next: 'cs1_n4d',
            isCorrect: true
          },
          {
            text: 'Simplemente cambiar de tema sin explicar — los niños son pequeños y no necesitan saber el porqué de las decisiones del docente.',
            next: 'cs1_n4e',
            isCorrect: false
          }
        ]
      },

      // Path C: Popol Vuh project, needs to add rigor
      'cs1_n3c': {
        type: 'scenario',
        text: 'Mariana decide continuar con el proyecto del Popol Vuh pero lo rediseña con más profundidad. Ahora los estudiantes deben identificar elementos naturales del relato (agua, fuego, maíz, viento) e investigar sus propiedades físicas y químicas reales. Están documentando hallazgos en un "libro científico del Popol Vuh". Sin embargo, al llegar al tercer nivel de profundidad, nota que varios estudiantes están decorando más que investigando.',
        context: 'El proyecto tiene potencial pero algunos equipos lo están convirtiendo en un proyecto de arte sin contenido científico.',
        choices: [
          {
            text: 'Detener la clase y establecer una "pregunta científica obligatoria" que cada equipo debe responder con evidencia antes de continuar decorando.',
            next: 'cs1_n4f',
            isCorrect: true
          },
          {
            text: 'Dejar que cada equipo siga su propio camino — la creatividad es más importante que el rigor científico en primaria.',
            next: 'cs1_n4g',
            isCorrect: false
          }
        ]
      },

      // ── LEVEL 4 branches ─────────────────────────────────────────────────

      'cs1_n4a': {
        type: 'feedback_correct',
        text: 'Mariana hace algo brillante: convierte la interrupción en una oportunidad de visibilizar el aprendizaje. Toma el cuaderno de un estudiante y muestra a Don Rigoberto las fracciones escritas (1/4 de arena, 1/4 de carbón...), el vocabulario nuevo en las hipótesis, y el problema real que están resolviendo. Don Rigoberto se sienta, escucha, y termina ayudando a un niño a calcular el caudal del filtro. Al salir, dice: "No sabía que así se enseñaba."',
        tip: 'Principio: La comunicación con familias sobre metodologías activas requiere hacer visible el aprendizaje disciplinar que está ocurriendo. Los padres no rechazan la innovación — rechazan lo que perciben como pérdida de rigor. La solución es demostrar el rigor, no eliminarlo.',
        next: 'cs1_n5a',
        xp: 10
      },

      'cs1_n4b': {
        type: 'feedback_wrong',
        text: 'Detener el proyecto envía un mensaje poderoso y dañino a los estudiantes: que la opinión de un adulto externo vale más que su proceso de aprendizaje, y que los proyectos complejos se abandonan ante la primera crítica. También refuerza la idea de Don Rigoberto de que el proyecto era "solo juego". Mariana pierde una oportunidad de demostrar el valor del enfoque y de construir confianza con la comunidad.',
        tip: 'Reflexión: Ceder ante la presión sin diálogo no es humildad — es una forma de privar a los estudiantes de una experiencia valiosa. El docente tiene la responsabilidad de defender el aprendizaje con argumentos, no solo con autoridad.',
        next: 'cs1_n5b',
        xp: 0
      },

      'cs1_n4c': {
        type: 'feedback_wrong',
        text: 'Ignorar a Don Rigoberto y enviarlo al director genera conflicto institucional innecesario. En comunidades rurales de Guatemala, la relación entre docente y familia es fundamental. Una respuesta defensiva puede convertir a un padre curioso en un oponente activo del proyecto — y del docente. Además, el director ahora enfrenta una queja sin contexto.',
        tip: 'Considerar: La participación de padres en el aula, aunque incómoda, puede convertirse en un recurso. La clave está en transformar la interrupción en colaboración, no en conflicto.',
        next: 'cs1_n5c',
        xp: 0
      },

      'cs1_n4d': {
        type: 'feedback_correct',
        text: 'La transparencia de Mariana tiene un efecto inesperado: los estudiantes se sienten respetados como participantes del proceso, no solo receptores. Cuando ella dice "cometí un error al elegir algo fuera de nuestro alcance — ¿qué piensan de este nuevo camino?", los niños se involucran inmediatamente. Diseñan juntos el alcance reducido: cada equipo documentará los patrones de un tejido diferente y presentará sus hallazgos matemáticos.',
        tip: 'Principio: Modelar la metacognición y la honestidad intelectual enseña más que pretender que todo fue planificado. Los docentes que muestran cómo ajustan su pensamiento enseñan a los estudiantes a hacer lo mismo.',
        next: 'cs1_n5d',
        xp: 10
      },

      'cs1_n4e': {
        type: 'feedback_wrong',
        text: 'Cambiar de tema sin explicación crea confusión y erosiona la confianza. Los niños de cuarto grado notan perfectamente cuando algo cambia sin razón — y aprenden que los adultos no explican sus decisiones. Esto además pierde una oportunidad de modelar flexibilidad y aprendizaje reflexivo.',
        tip: 'Los niños aprenden metacognición cuando ven a adultos pensar en voz alta sobre sus propias decisiones. Ocultar los cambios de rumbo priva a los estudiantes de ese modelo.',
        next: 'cs1_n5e',
        xp: 0
      },

      'cs1_n4f': {
        type: 'feedback_correct',
        text: 'Al establecer que cada equipo debe responder una pregunta científica específica — "¿Por qué el maíz se endurece cuando se seca?" o "¿Qué hace que el fuego necesite aire?" — Mariana rescata el rigor sin matar la creatividad. Los estudiantes que estaban decorando ahora buscan respuestas antes de continuar. El proyecto se transforma en una investigación ilustrada, que es exactamente lo que debería ser.',
        tip: 'Principio: En proyectos interdisciplinarios, la pregunta es el andamio. Una buena pregunta científica dentro de un proyecto artístico garantiza que el arte no desplace el pensamiento — sino que lo exprese.',
        next: 'cs1_n5f',
        xp: 10
      },

      'cs1_n4g': {
        type: 'feedback_wrong',
        text: 'Dejar que la creatividad reemplace el rigor convierte el proyecto STEAM en un proyecto de manualidades temáticas. Al final, los estudiantes habrán producido algo visualmente hermoso pero sin haber ejercitado el pensamiento científico. La integración disciplinar requiere que cada disciplina aporte con su propia lógica, no solo con su estética.',
        tip: 'STEAM no significa que las artes suplantan a las ciencias — significa que se integran. Un docente STEAM mantiene el rigor científico mientras abre espacio para la expresión creativa.',
        next: 'cs1_n5g',
        xp: 0
      },

      // ── LEVEL 5 branches ─────────────────────────────────────────────────

      'cs1_n5a': {
        type: 'scenario',
        text: 'La presentación final se acerca. Los filtros de agua están construidos y los equipos han probado su eficacia con agua del río. Pero Mariana nota que Tomás, un estudiante con dislexia que lucha para leer y escribir, se ha quedado callado durante los ensayos de presentación oral. Su equipo habla por él. Tomás sabe perfectamente cómo funciona el filtro — lo construyó casi solo — pero en el momento de presentar frente a los padres, se paraliza.',
        context: 'La presentación es en dos días. Hay 40 padres invitados. Tomás tiene mucho que decir pero le aterroriza hacerlo con palabras.',
        choices: [
          {
            text: 'Trabajar con Tomás para que presente usando el filtro físico como guía: que demuestre el proceso en lugar de recitar, señalando cada capa mientras su compañero lee la explicación.',
            next: 'cs1_outcome_success',
            isCorrect: true
          },
          {
            text: 'Dejar que su equipo presente por él para no causarle estrés — a veces es mejor proteger a los estudiantes que exponerlos.',
            next: 'cs1_outcome_partial',
            isCorrect: false
          },
          {
            text: 'Pedirle a Tomás que practique más y que supere su timidez — todos los estudiantes deben presentar de la misma forma.',
            next: 'cs1_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs1_n5b': {
        type: 'scenario',
        text: 'Mariana detuvo el proyecto y volvió al libro de texto. Pero después de dos días de lecciones tradicionales, nota algo: los estudiantes están desmotivados y Don Rigoberto, cuando se enteró, le preguntó al director por qué pararon "ese proyecto tan bonito de los filtros". La situación se invirtió — ahora el padre que protestó quiere que sigan. El director le da a Mariana la opción de retomarlo.',
        context: 'Tiene una semana para recuperar el proyecto. Los estudiantes han perdido el ritmo pero no el interés.',
        choices: [
          {
            text: 'Retomar el proyecto y usarlo como oportunidad para hablar con los estudiantes sobre resiliencia: los buenos proyectos merecen ser defendidos.',
            next: 'cs1_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Negarse a retomarlo — ya es muy tarde y es mejor terminar el trimestre con calificaciones claras.',
            next: 'cs1_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs1_n5c': {
        type: 'scenario',
        text: 'El director medió entre Mariana y Don Rigoberto, y se organizó una reunión. La conversación fue incómoda pero abrió un diálogo sobre qué significa aprender en la escuela. Al final, Don Rigoberto pidió ver el proyecto. Mariana lo invitó. Cuando vio a su hijo explicar fracciones con el filtro en la mano, se emocionó visiblemente. Ahora hay una oportunidad de presentación pública más grande de lo que Mariana planeó.',
        context: 'El conflicto se convirtió en una plataforma. Pero Mariana está nerviosa — la presentación ahora tiene más presión.',
        choices: [
          {
            text: 'Usar la mayor audiencia como motivación adicional para los estudiantes: explicarles que su trabajo importa tanto que más personas quieren verlo.',
            next: 'cs1_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Simplificar la presentación para reducir riesgos — con más gente es mejor hacer algo seguro y breve.',
            next: 'cs1_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs1_n5d': {
        type: 'scenario',
        text: 'El proyecto de tejidos matemáticos llega a su presentación. Cada equipo tiene un huipil o tela prestada por una abuela de la comunidad, y ha documentado los patrones geométricos con mediciones y clasificaciones. Pero la estudiante más brillante del grupo, Lucía, quiere ir más lejos: quiere probar que los patrones del tejido siguen secuencias de Fibonacci. Tiene intuición pero no sabe cómo demostrarlo formalmente.',
        context: 'La presentación es mañana. No hay tiempo para enseñar Fibonacci desde cero, pero la observación de Lucía es matemáticamente interesante.',
        choices: [
          {
            text: 'Ayudar a Lucía a formular su observación como una hipótesis abierta: "creemos que hay un patrón numérico, queremos investigarlo más" — honrar la curiosidad sin fingir certeza.',
            next: 'cs1_outcome_success',
            isCorrect: true
          },
          {
            text: 'Decirle a Lucía que eso es muy avanzado y que mejor presente solo lo que ya aprendió el grupo.',
            next: 'cs1_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs1_n5e': {
        type: 'scenario',
        text: 'El proyecto de tejidos avanza pero sin el entusiasmo del inicio. Los estudiantes lo hacen porque Mariana lo pide, no porque les importe. Durante la presentación ante los padres, los equipos recitan datos sin convicción. Una madre pregunta: "¿Por qué estudiaron esto?" y ningún estudiante tiene una respuesta clara. Mariana se da cuenta de que le faltó conectar el proyecto con el "para qué".',
        context: 'La presentación terminó. Mariana tiene que reflexionar sobre qué cambiaría.',
        choices: [
          {
            text: 'Hacer una clase de cierre donde los estudiantes identifiquen qué aprendieron y por qué importó — aunque sea tarde, el procesamiento metacognitivo tiene valor.',
            next: 'cs1_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Pasar a la siguiente unidad — el proyecto terminó y hay que avanzar con el curriculum.',
            next: 'cs1_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs1_n5f': {
        type: 'scenario',
        text: 'El "Libro Científico del Popol Vuh" está casi terminado. Cada equipo tiene páginas ilustradas con explicaciones científicas reales. Pero Mariana enfrenta el momento de evaluación: ¿cómo califica esto? No hay respuestas correctas únicas, cada libro es diferente, y el director espera ver notas numéricas en el boletín.',
        context: 'Mariana tiene que traducir un proceso de aprendizaje rico y complejo a una calificación que el sistema escolar reconozca.',
        choices: [
          {
            text: 'Crear una rúbrica simple con criterios científicos (¿tiene hipótesis?, ¿tiene evidencia?, ¿explica el fenómeno?) y criterios de proceso (participación, revisión), y compartirla con los estudiantes antes de calificar.',
            next: 'cs1_outcome_success',
            isCorrect: true
          },
          {
            text: 'Calificar basándose en qué tan bonitos quedaron los libros — si se esforzaron en la presentación visual, merecen buena nota.',
            next: 'cs1_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs1_n5g': {
        type: 'scenario',
        text: 'Los libros finales son visualmente impresionantes pero superficiales en contenido científico. Al presentarlos, los padres los celebran por lo bonitos. Pero cuando el director revisa el trabajo, pregunta: "¿Qué ciencia aprendieron exactamente?" Mariana no tiene una respuesta clara. Ha producido un proyecto artístico con temática científica, no un proyecto verdaderamente interdisciplinar.',
        context: 'El director no está conforme pero tampoco quiere desacreditar el esfuerzo. Le pide a Mariana que reflexione.',
        choices: [
          {
            text: 'Aceptar la crítica y diseñar una actividad complementaria de una semana donde los estudiantes profundicen en la ciencia detrás de sus ilustraciones.',
            next: 'cs1_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Defender el proyecto tal como está — la creatividad importa y el director no entiende la pedagogía moderna.',
            next: 'cs1_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      // ── OUTCOMES ─────────────────────────────────────────────────────────

      'cs1_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        title: 'Mariana: Docente STEAM auténtica',
        text: 'Mariana demostró que STEAM no requiere tecnología cara ni laboratorios equipados — requiere problemas reales, pensamiento disciplinar genuino y flexibilidad pedagógica. Sus estudiantes presentaron filtros funcionales, explicaron propiedades físicas y químicas, usaron fracciones con propósito, y aprendieron que la ciencia puede nacer del monte y el río de su propia comunidad. Tomás presentó con su cuerpo lo que no pudo con palabras — y fue el momento más aplaudido de la tarde.',
        badge: 'Docente STEAM Contextualizada',
        xpReward: 50
      },
      'cs1_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        title: 'Mariana: En camino, con lecciones',
        text: 'El proyecto tuvo valor real, pero algunas decisiones limitaron su potencial. Mariana aprendió algo fundamental: los proyectos STEAM viven y mueren por las decisiones que el docente toma en los momentos de presión — ante un padre que protesta, ante un estudiante que no puede presentar como los demás, ante un proyecto que pierde rumbo. Cada una de esas decisiones es una lección para el próximo proyecto.',
        badge: 'Docente Reflexiva',
        xpReward: 25
      },
      'cs1_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        title: 'Mariana: Primer intento, primeras lecciones',
        text: 'El primer proyecto STEAM de Mariana no salió como esperaba. Pero el fracaso pedagógico honesto es más valioso que el éxito superficial. Las decisiones que tomó — aunque imperfectas — le revelan algo sobre sus supuestos como docente: sobre la autoridad, sobre la evaluación, sobre quién "puede" presentar y cómo. El siguiente proyecto de Mariana será mejor porque este existió.',
        badge: 'Docente en Proceso',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 2: "El proyecto que no funcionó" — ABP
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs2',
    title: 'El proyecto que no funcionó',
    course: 'ABP',
    color: '#F59E0B',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    duration: '20-25 min',
    description: 'El proyecto ABP de Carlos sobre problemas urbanos de Guatemala City se ha estancado. Los estudiantes están desconectados, hay conflicto entre compañeros, y el plazo vence en dos semanas. ¿Puede salvarlo?',
    start: 'cs2_n1',
    nodes: {

      'cs2_n1': {
        type: 'scenario',
        text: 'Carlos es docente de Ciencias Sociales en un instituto de secundaria en la zona 6 de Guatemala City. Hace tres semanas lanzó un proyecto ABP sobre "problemas urbanos de nuestra ciudad" con gran entusiasmo. Hoy, semana cuatro de seis, la realidad es dura: tres de cinco equipos no han avanzado más allá de buscar imágenes en internet, un equipo tiene dos estudiantes que no se hablan, y cuando Carlos pregunta "¿cómo va su investigación?", los estudiantes lo miran con indiferencia o con el teléfono en la mano.',
        context: 'Faltan dos semanas para la presentación final ante una audiencia externa (la municipalidad de la zona). Carlos siente que algo falló desde el inicio pero no sabe exactamente qué.',
        choices: [
          {
            text: 'Reiniciar el proyecto desde cero con un nuevo tema y estructura — con dos semanas es mejor empezar limpio.',
            next: 'cs2_n2a',
            isCorrect: false
          },
          {
            text: 'Pausar el trabajo de los equipos e investigar la causa real de la desconexión antes de tomar cualquier decisión.',
            next: 'cs2_n2b',
            isCorrect: true
          },
          {
            text: 'Reducir el alcance del proyecto para que sea manejable: cancelar la presentación ante la municipalidad y convertirlo en una tarea individual escrita.',
            next: 'cs2_n2c',
            isCorrect: false
          }
        ]
      },

      'cs2_n2a': {
        type: 'feedback_wrong',
        text: 'Reiniciar con dos semanas es casi garantía de un segundo fracaso. El problema no es el tema — es algo más profundo en cómo está diseñado el proyecto. Si Carlos no diagnostica la causa real antes de actuar, va a repetir los mismos errores. Además, cancelar el trabajo de los equipos sin razón clara destruye aún más la motivación.',
        tip: 'En ABP, cuando un proyecto se estanca, el diagnóstico debe preceder a la intervención. Actuar antes de entender la causa convierte la solución en otro problema.',
        next: 'cs2_n3a',
        xp: 0
      },

      'cs2_n2b': {
        type: 'feedback_correct',
        text: 'Carlos hace algo valioso: reconoce que no puede resolver lo que no entiende. Dedica la siguiente clase a escuchar. Hace entrevistas rápidas con cada equipo (5 minutos por grupo) y hace una sola pregunta: "¿Qué tiene que ver este proyecto con tu vida real?" Las respuestas son reveladoras: "No sé", "Nada", "Los problemas de la zona 6 no me afectan a mí". La pregunta motriz — demasiado genérica — no conectó con las vidas reales de los estudiantes.',
        tip: 'Principio ABP: La pregunta motriz es el corazón del proyecto. Si los estudiantes no pueden conectarla con algo que les importa personalmente, el proyecto nunca generará motivación intrínseca. La autenticidad del problema no la define el docente — la define el estudiante.',
        next: 'cs2_n3b',
        xp: 10
      },

      'cs2_n2c': {
        type: 'feedback_wrong',
        text: 'Reducir a tarea individual elimina todo lo que hace al ABP valioso: la colaboración, la audiencia real, la resolución de problemas auténticos. Carlos estaría convirtiendo un proyecto en un ensayo — y enviando el mensaje de que cuando algo es difícil, se simplifica hasta que ya no importa.',
        tip: 'Cuando un proyecto ABP enfrenta dificultades, la respuesta raramente es eliminarlo. Generalmente requiere un ajuste quirúrgico — al problema, al proceso, o a las estructuras de apoyo — no una amputación.',
        next: 'cs2_n3c',
        xp: 0
      },

      // LEVEL 3

      'cs2_n3a': {
        type: 'scenario',
        text: 'Carlos reinicia el proyecto con un nuevo tema: "el transporte público en Guatemala City". Los equipos arrancan con algo más de energía inicial, pero en dos días el patrón se repite: los estudiantes buscan información sin propósito claro. Carlos nota que la "pregunta motriz" del nuevo proyecto tiene el mismo problema que el anterior: "¿Cómo podemos mejorar el transporte de nuestra ciudad?" es demasiado amplia y no conecta con su experiencia diaria.',
        context: 'Carlos está en el mismo punto, ahora con menos tiempo. Pero ha identificado el patrón: la pregunta es el problema.',
        choices: [
          {
            text: 'Reformular la pregunta con los estudiantes usando sus experiencias reales: "¿Por qué el camión que tomas todos los días llega tarde o no llega?" como punto de partida.',
            next: 'cs2_n4a',
            isCorrect: true
          },
          {
            text: 'Dejar la pregunta como está y aumentar la estructura: dar a los estudiantes una lista de pasos exactos a seguir cada día.',
            next: 'cs2_n4b',
            isCorrect: false
          }
        ]
      },

      'cs2_n3b': {
        type: 'scenario',
        text: 'Armado con este diagnóstico, Carlos toma una decisión valiente: va a reconstruir la pregunta motriz en medio del proyecto. En lugar de cambiar el tema, va a hacerlo más personal. Convoca a los estudiantes y les dice: "Tienen razón — la pregunta que puse no conecta con ustedes. Quiero que me ayuden a arreglarla." Pero antes de continuar, enfrenta el conflicto en el equipo 3: Andrea y Sebastián no se dirigen la palabra desde hace una semana.',
        context: 'El conflicto interpersonal es urgente — si no se resuelve, el equipo no puede funcionar y la nueva pregunta motriz no importará.',
        choices: [
          {
            text: 'Hablar con Andrea y Sebastián por separado primero — escuchar cada perspectiva individualmente antes de juntarlos.',
            next: 'cs2_n4c',
            isCorrect: true
          },
          {
            text: 'Juntar a Andrea y Sebastián frente al equipo y pedirles que resuelvan su conflicto ahora — el grupo necesita ver que los problemas se enfrentan directamente.',
            next: 'cs2_n4d',
            isCorrect: false
          },
          {
            text: 'Ignorar el conflicto por ahora — con la nueva pregunta motriz, la energía del proyecto resolverá la tensión naturalmente.',
            next: 'cs2_n4e',
            isCorrect: false
          }
        ]
      },

      'cs2_n3c': {
        type: 'scenario',
        text: 'La tarea individual escrita produce resultados previsibles: párrafos copiados de internet sobre "problemas del tráfico en Guatemala" sin análisis propio. Algunos estudiantes copian textualmente de Wikipedia. Carlos califica y saca a flote las notas, pero sabe que nadie aprendió nada significativo. El director nota que la presentación ante la municipalidad fue cancelada y pregunta por qué.',
        context: 'Carlos tiene que explicar la decisión y enfrentar la pregunta implícita: ¿podría haber hecho algo diferente?',
        choices: [
          {
            text: 'Reconocer honestamente con el director que tomó una decisión de gestión (reducir el alcance) cuando necesitaba una decisión pedagógica (rediseñar el problema).',
            next: 'cs2_n4f',
            isCorrect: true
          },
          {
            text: 'Explicar que los estudiantes no estaban listos para ABP y que necesitan más años de preparación antes de intentarlo.',
            next: 'cs2_n4g',
            isCorrect: false
          }
        ]
      },

      // LEVEL 4

      'cs2_n4a': {
        type: 'feedback_correct',
        text: 'Cuando Carlos reformula la pregunta usando las experiencias concretas de los estudiantes — sus rutas diarias, sus esperas reales, sus frustraciones vividas — algo cambia en la sala. Un estudiante que no había hablado en semanas dice: "El 65 me dejó tirado ayer y llegué tarde al examen." Ese comentario se convierte en el centro del proyecto. La investigación ahora tiene urgencia personal.',
        tip: 'Principio ABP: La pregunta motriz más poderosa es la que el estudiante podría haber formulado él mismo si hubiera tenido el andamio para hacerlo. El docente no impone el problema — ayuda al estudiante a articular el que ya está viviendo.',
        next: 'cs2_n5a',
        xp: 10
      },

      'cs2_n4b': {
        type: 'feedback_wrong',
        text: 'Aumentar la estructura sin cambiar la pregunta es darle a un paciente más ibuprofeno sin tratar la causa de su dolor. Los estudiantes seguirán los pasos mecánicamente pero sin motivación real. El andamio procedimental no reemplaza la relevancia del problema.',
        tip: 'En ABP, la estructura y los andamios deben servir a una pregunta que importe. Si la pregunta no importa, los andamios solo producen cumplimiento sin aprendizaje.',
        next: 'cs2_n5b',
        xp: 0
      },

      'cs2_n4c': {
        type: 'feedback_correct',
        text: 'Al hablar por separado, Carlos descubre que el conflicto no es personal — es sobre la dirección del proyecto. Andrea quiere investigar el transporte en buses urbanos; Sebastián quiere enfocarse en el tráfico de motocicletas, porque su hermano tuvo un accidente. Ambas perspectivas son válidas y complementarias. Carlos les propone integrar ambos enfoques en un solo análisis del riesgo vial. La conversación individual permitió escuchar lo que el grupo nunca habría revelado.',
        tip: 'Principio: El conflicto en equipos de trabajo raramente es solo interpersonal — generalmente refleja una diferencia de visión o de prioridades. El docente que escucha antes de mediar transforma el conflicto en información valiosa sobre el proyecto.',
        next: 'cs2_n5c',
        xp: 10
      },

      'cs2_n4d': {
        type: 'feedback_wrong',
        text: 'Resolver conflictos interpersonales en público rara vez funciona y frecuentemente empeora la situación. Andrea y Sebastián se sienten expuestos ante sus compañeros, se ponen a la defensiva, y el grupo observa cómo dos personas son confrontadas — no cómo dos personas resuelven algo. El conflicto se intensifica y el resto del equipo se incomoda.',
        tip: 'Los conflictos interpersonales necesitan privacidad para resolverse. La mediación pública convierte el problema en espectáculo y activa la vergüenza, que cierra el diálogo en lugar de abrirlo.',
        next: 'cs2_n5d',
        xp: 0
      },

      'cs2_n4e': {
        type: 'feedback_wrong',
        text: 'Los conflictos no resueltos no desaparecen — se agravan. Andrea y Sebastián continúan sin comunicarse, y cuando la nueva pregunta motriz revitaliza al resto del grupo, el equipo 3 sigue paralizado. El entusiasmo general hace que su estancamiento sea más visible y más humillante para ambos.',
        tip: 'En proyectos colaborativos, un conflicto interpersonal no resuelto bloquea el trabajo del equipo completo. El docente debe intervenir — no para imponer una solución, sino para crear las condiciones en que los estudiantes puedan encontrarla.',
        next: 'cs2_n5d',
        xp: 0
      },

      'cs2_n4f': {
        type: 'feedback_correct',
        text: 'La honestidad de Carlos ante el director crea algo inesperado: una conversación real sobre qué significa el ABP y por qué falla cuando se implementa sin formación suficiente. El director, en lugar de criticar, propone que Carlos lidere una sesión de reflexión con otros docentes sobre lo que aprendió. El fracaso se convierte en un recurso institucional.',
        tip: 'La reflexión honesta sobre el fracaso pedagógico — especialmente ante superiores — es una forma de liderazgo. Los docentes que aprenden en voz alta crean culturas escolares donde el aprendizaje es posible para todos, incluyendo los adultos.',
        next: 'cs2_n5e',
        xp: 10
      },

      'cs2_n4g': {
        type: 'feedback_wrong',
        text: 'Culpar a los estudiantes de la falla del proyecto es la respuesta más común y la más dañina. No solo es imprecisa — el problema era el diseño, no los estudiantes — sino que también cierra la posibilidad de aprender de la experiencia y de mejorar el próximo diseño.',
        tip: 'Cuando un proyecto ABP falla, la primera pregunta debe ser sobre el diseño, no sobre los estudiantes. ¿La pregunta motriz era auténtica? ¿El problema era relevante? ¿Había andamios suficientes? Estas son las variables que controla el docente.',
        next: 'cs2_n5f',
        xp: 0
      },

      // LEVEL 5

      'cs2_n5a': {
        type: 'scenario',
        text: 'La audiencia ante la municipalidad fue reprogramada. Los equipos han trabajado con la nueva pregunta y tienen hallazgos reales: encuestas a vecinos, mapas de rutas problemáticas, testimonios. Pero tres días antes de la presentación, el funcionario municipal que coordinaba la visita cancela — "agenda apretada", dice el correo. Los estudiantes, que por primera vez estaban comprometidos, reciben la noticia con desolación.',
        context: 'La audiencia real era parte del corazón del proyecto. Su cancelación amenaza con confirmar la sospecha de los estudiantes de que "esto no importa a nadie".',
        choices: [
          {
            text: 'Reencuadrar la audiencia: presentar ante la comunidad escolar (padres, otros docentes, vecinos) y documentar la presentación en video para enviarla al funcionario municipal con una carta firmada por los estudiantes.',
            next: 'cs2_outcome_success',
            isCorrect: true
          },
          {
            text: 'Presentar de todas formas en el salón de clases ante Carlos solamente — el aprendizaje tiene valor aunque no haya audiencia.',
            next: 'cs2_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs2_n5b': {
        type: 'scenario',
        text: 'Los estudiantes siguen los pasos pero sin energía. Producen presentaciones con datos de internet bien organizadas pero sin perspectiva propia. Cuando Carlos les pregunta "¿qué proponen ustedes?", los estudiantes quedan en silencio. Han investigado el problema pero no se sienten capaces de proponer soluciones.',
        context: 'La presentación ante la municipalidad es en dos días. El trabajo es técnicamente aceptable pero vacío de voz propia.',
        choices: [
          {
            text: 'Dedicar las dos últimas clases exclusivamente a que cada equipo articule UNA propuesta concreta basada en su investigación, aunque sea pequeña e imperfecta.',
            next: 'cs2_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Presentar lo que hay — la investigación tiene valor y el tiempo no alcanza para más.',
            next: 'cs2_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs2_n5c': {
        type: 'scenario',
        text: 'El equipo de Andrea y Sebastián produce el trabajo más rico: un análisis del riesgo vial que integra datos de accidentes, testimonios personales y propuestas de señalización. Cuando presentan ante la municipalidad, el funcionario les hace preguntas reales y toma nota. Al final del evento, un estudiante que al inicio decía "esto no me importa" pregunta: "¿Podemos dar seguimiento a esto el próximo año?" Carlos tiene que decidir cómo cerrar el proyecto con intención.',
        context: 'El proyecto funcionó. Pero el cierre importa tanto como la ejecución.',
        choices: [
          {
            text: 'Hacer una sesión de reflexión final donde cada estudiante escribe qué cambiaría de su proceso y qué aprendió que pueda aplicar fuera del aula.',
            next: 'cs2_outcome_success',
            isCorrect: true
          },
          {
            text: 'Celebrar el éxito y pasar directamente a la siguiente unidad — el proyecto habló por sí mismo.',
            next: 'cs2_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs2_n5d': {
        type: 'scenario',
        text: 'La presentación del equipo 3 es el punto débil del evento. Andrea y Sebastián presentan por separado, casi sin mirarse, con diapositivas que duplican información sin integrarse. El funcionario municipal nota la incomodidad. Después, Carlos reflexiona: una intervención a tiempo habría cambiado el resultado para ambos estudiantes y para el equipo.',
        context: 'El proyecto terminó pero la lección sobre manejo de conflictos sigue presente.',
        choices: [
          {
            text: 'Usar el cierre del proyecto para tener una conversación explícita sobre colaboración: qué hace que un equipo funcione y qué lo rompe.',
            next: 'cs2_outcome_partial',
            isCorrect: true
          },
          {
            text: 'No mencionar lo sucedido — señalar públicamente que un equipo tuvo problemas sería perjudicial para Andrea y Sebastián.',
            next: 'cs2_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs2_n5e': {
        type: 'scenario',
        text: 'Carlos da la sesión de reflexión con sus colegas. Al compartir lo que aprendió, tres docentes reconocen que sus propios proyectos "activos" tienen el mismo problema: preguntas motrices que no conectan con las vidas reales de los estudiantes. Se forma un pequeño grupo de mejora pedagógica. Un fracaso se convierte en el inicio de algo más grande. Al final, un estudiante de Carlos le escribe un mensaje: "Profe, aunque el proyecto tuvo problemas, aprendí más que en cualquier otro."',
        context: 'El aprendizaje de Carlos ha tenido impacto más allá de su aula.',
        choices: [
          {
            text: 'Responder al estudiante con honestidad: "Yo también aprendí más en este proyecto que en muchos anteriores. Gracias por aguantar el proceso."',
            next: 'cs2_outcome_success',
            isCorrect: true
          },
          {
            text: 'Agradecer al estudiante pero no profundizar — compartir las dificultades del docente puede disminuir su autoridad.',
            next: 'cs2_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs2_n5f': {
        type: 'scenario',
        text: 'Carlos termina el semestre con la certeza de que sus estudiantes no aprendieron lo que él esperaba — pero sin haber cambiado nada en su comprensión del por qué. Cuando el director le pregunta si quiere intentar ABP el próximo año, Carlos dice "sí" por compromiso institucional, no por convicción. El próximo intento tiene muchas probabilidades de repetir los mismos errores.',
        context: 'Sin reflexión, el ciclo continúa.',
        choices: [
          {
            text: 'Antes de comenzar el próximo año, buscar formación específica en diseño de preguntas motrices y gestión de equipos en ABP.',
            next: 'cs2_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Confiar en que la experiencia acumulada bastará para mejorar naturalmente.',
            next: 'cs2_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs2_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        title: 'Carlos: Del fracaso al aprendizaje real',
        text: 'Carlos aprendió que un proyecto ABP salvado a la mitad puede ser más poderoso que uno que salió bien desde el inicio. Al diagnosticar antes de actuar, al reformular la pregunta con los estudiantes, y al convertir el conflicto en información pedagógica, demostró que el ABP no es un método que se ejecuta — es una forma de pensar sobre el aprendizaje que se practica y se afina. Sus estudiantes llegaron a la presentación no con respuestas perfectas, sino con preguntas propias.',
        badge: 'Docente ABP Reflexivo',
        xpReward: 50
      },
      'cs2_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        title: 'Carlos: Progreso real, camino pendiente',
        text: 'El proyecto de Carlos tuvo momentos valiosos y momentos perdidos. Aprendió algo sobre preguntas motrices, algo sobre conflictos en equipos, y algo sobre su propia tendencia a tomar decisiones de gestión cuando necesita decisiones pedagógicas. Ese aprendizaje vale, aunque el proyecto no alcanzó su potencial completo.',
        badge: 'Docente en Construcción',
        xpReward: 25
      },
      'cs2_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        title: 'Carlos: El ciclo sin romper',
        text: 'El proyecto terminó sin que Carlos comprendiera del todo qué lo hizo fallar. Sin ese diagnóstico, el próximo proyecto ABP enfrenta los mismos riesgos. La buena noticia: las condiciones para aprender están todas ahí — la experiencia, los estudiantes, la institución. Solo falta la reflexión deliberada que convierte la experiencia en aprendizaje.',
        badge: 'Docente con Experiencia Pendiente de Procesar',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 3: "La estudiante invisible" — Conoce a Quien Enseñas
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs3',
    title: 'La estudiante invisible',
    course: 'Conoce a Quien Enseñas',
    color: '#10B981',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    duration: '20-25 min',
    description: 'Ana es docente de primer año. Sofía (9 años) nunca participa, mira por la ventana, y está reprobando — aunque es claramente inteligente. ¿Cómo puede Ana ver a quien tiene enfrente?',
    start: 'cs3_n1',
    nodes: {

      'cs3_n1': {
        type: 'scenario',
        text: 'Ana lleva seis semanas en su primer año como docente en una escuela primaria urbana de Quetzaltenango. Tiene 30 estudiantes. Uno de ellos, Sofía, de 9 años, ha llamado su atención de una forma que la preocupa: nunca levanta la mano, rara vez mira al frente, y pasa los recreos dibujando sola en su cuaderno en lugar de jugar. Sus calificaciones están por debajo del promedio, aunque cuando Ana la observa dibujando, los detalles son extraordinarios — capta perspectiva, sombras, proporciones. En conversación directa, Sofía habla de forma sofisticada y articulada.',
        context: 'El boletín trimestral se entrega en dos semanas. Sofía está reprobando Matemáticas y Comunicación y Lenguaje. La madre de Sofía aún no ha sido contactada.',
        choices: [
          {
            text: 'Llamar a los padres inmediatamente para informar las notas bajas y preguntar si hay algo "en casa" que explique el comportamiento.',
            next: 'cs3_n2a',
            isCorrect: false
          },
          {
            text: 'Observar a Sofía durante una semana con atención deliberada: cuándo participa, qué la activa, qué la cierra, cómo aprende cuando nadie la observa.',
            next: 'cs3_n2b',
            isCorrect: true
          },
          {
            text: 'Preguntar a la docente del año anterior qué "problema tiene" Sofía y qué estrategias usó con ella.',
            next: 'cs3_n2c',
            isCorrect: false
          }
        ]
      },

      'cs3_n2a': {
        type: 'feedback_wrong',
        text: 'Llamar a los padres para reportar notas bajas sin haber investigado el contexto convierte a la familia en receptora de un problema, no en aliada de una solución. Además, la pregunta "¿hay algo en casa?" puede leerse como una atribución de culpa sin evidencia. Ana aún no sabe por qué Sofía no está participando — y sin ese diagnóstico, la conversación con los padres no tiene dirección.',
        tip: 'El primer contacto con familias sobre dificultades académicas debe ocurrir después del diagnóstico docente, no antes. La familia es un aliado, no un receptor de reportes de falla.',
        next: 'cs3_n3a',
        xp: 0
      },

      'cs3_n2b': {
        type: 'feedback_correct',
        text: 'La semana de observación deliberada de Ana produce hallazgos que ningún test podría dar. Sofía participa activamente cuando la clase hace algo manual: doblar papel, construir, dibujar un mapa. Se paraliza cuando se le pide responder en voz alta sin preparación previa. Entiende las instrucciones verbales solo cuando van acompañadas de demostración visual. Sus cuadernos están llenos de esquemas y diagramas que nadie pidió — es su forma de procesar.',
        tip: 'Principio: La observación sistemática es la herramienta diagnóstica más poderosa que tiene un docente. No requiere psicólogo ni especialista — requiere atención intencionada y un registro honesto de patrones.',
        next: 'cs3_n3b',
        xp: 10
      },

      'cs3_n2c': {
        type: 'feedback_wrong',
        text: 'Consultar a la docente anterior puede parecer sensato, pero tiene un riesgo alto: recibir una narrativa ya formada sobre Sofía que puede contaminar la observación de Ana con prejuicios previos. Si la docente anterior decía "es floja" o "tiene problemas en casa", Ana podría empezar a confirmar esa interpretación en lugar de construir la propia.',
        tip: 'El sesgo de confirmación es especialmente peligroso con estudiantes que ya tienen una reputación formada. El docente nuevo tiene la ventaja única de mirar sin historia — esa ventaja debe protegerse.',
        next: 'cs3_n3c',
        xp: 0
      },

      // LEVEL 3

      'cs3_n3a': {
        type: 'scenario',
        text: 'La madre de Sofía llega a la reunión a la defensiva — alguien le dijo que Sofía "tenía problemas". La conversación es tensa. Ana no tiene suficiente información sobre Sofía para proponer nada concreto, y la madre siente que la están culpando. Al final, la madre dice: "Lo mismo de siempre. Nunca entienden a mi hija." La reunión termina sin plan de acción.',
        context: 'Ana ha perdido la confianza de la madre antes de haber construido ninguna relación. Necesita recuperarla.',
        choices: [
          {
            text: 'Llamar a la madre una semana después, esta vez con observaciones específicas y positivas sobre Sofía: qué hace bien, qué la activa, qué le sorprendió descubrir.',
            next: 'cs3_n4a',
            isCorrect: true
          },
          {
            text: 'Esperar a que la madre tome la iniciativa — la relación está tensa y es mejor no presionar.',
            next: 'cs3_n4b',
            isCorrect: false
          }
        ]
      },

      'cs3_n3b': {
        type: 'scenario',
        text: 'Con los hallazgos de la semana de observación, Ana tiene claridad: Sofía es una aprendiz kinestésica y visual que está atrapada en un aula diseñada para aprendices auditivos y verbales. No es que no pueda aprender — es que la forma en que Ana enseña no llega a ella. Ana decide hacer cambios. Pero tiene 29 estudiantes más y tiempo limitado.',
        context: 'Ana enfrenta el dilema clásico: ¿cómo diferencia sin que el aula se vuelva imposible de manejar?',
        choices: [
          {
            text: 'Incorporar elementos visuales y kinestésicos en las actividades de todo el grupo — no como "adaptación para Sofía" sino como enriquecimiento general: mapas conceptuales, manipulativos, demostraciones con objetos.',
            next: 'cs3_n4c',
            isCorrect: true
          },
          {
            text: 'Darle a Sofía una hoja diferente con actividades visuales mientras el resto trabaja normalmente — es la forma más eficiente de atender sus necesidades.',
            next: 'cs3_n4d',
            isCorrect: false
          },
          {
            text: 'Hablar con el orientador escolar para que Sofía sea evaluada por un especialista — esto requiere apoyo profesional más allá del aula.',
            next: 'cs3_n4e',
            isCorrect: false
          }
        ]
      },

      'cs3_n3c': {
        type: 'scenario',
        text: 'La docente anterior le dice a Ana que Sofía "tiene problemas de atención" y "probablemente TDAH, aunque nunca la diagnosticaron", y que lo mejor es "sentarla al frente y repetirle las instrucciones más veces". Ana sigue el consejo. Sofía, al frente, se siente vigilada y se cierra más. El rendimiento no mejora. Ana está perpleja — hizo lo que le dijeron.',
        context: 'Ana se da cuenta de que está siguiendo un protocolo diseñado para otro estudiante imaginario, no para Sofía.',
        choices: [
          {
            text: 'Empezar de cero con observación propia: apartar el consejo previo y observar a Sofía durante tres días como si fuera la primera vez que la ve.',
            next: 'cs3_n4f',
            isCorrect: true
          },
          {
            text: 'Buscar más consejos de más colegas — cuantas más perspectivas tenga, mejor entenderá a Sofía.',
            next: 'cs3_n4g',
            isCorrect: false
          }
        ]
      },

      // LEVEL 4

      'cs3_n4a': {
        type: 'feedback_correct',
        text: 'El segundo contacto cambia el tono de la relación. Cuando Ana llama y le dice a la madre: "Noté que cuando Sofía puede dibujar o construir algo, entiende en seguida — sus cuadernos tienen esquemas que ningún otro estudiante hizo", la madre se queda en silencio un momento y luego dice: "Siempre ha sido así. En casa aprende todo tocando." La conversación da un giro completo. La madre se convierte en aliada informada y agradecida.',
        tip: 'La alianza familia-docente se construye cuando el docente demuestra que ve al estudiante completo — sus fortalezas, no solo sus déficits. La primera conversación sobre un estudiante con dificultades debe incluir siempre lo que ese estudiante hace bien.',
        next: 'cs3_n5a',
        xp: 10
      },

      'cs3_n4b': {
        type: 'feedback_wrong',
        text: 'Esperar a que la madre tome la iniciativa después de una reunión difícil es abandonar la responsabilidad de reconstruir la relación. En contextos donde las familias ya tienen historias de malentendidos con la escuela, esperar es equivalente a confirmar sus sospechas: que la escuela no cambia, que sus hijos no son vistos.',
        tip: 'Reconstruir la confianza con una familia requiere que el docente dé el primer paso, especialmente después de un primer contacto que no funcionó. La proactividad del docente es la señal de que algo diferente está pasando.',
        next: 'cs3_n5b',
        xp: 0
      },

      'cs3_n4c': {
        type: 'feedback_correct',
        text: 'La decisión de Ana de hacer las clases más visuales y kinestésicas para todos tiene un efecto inesperado: cinco estudiantes más que también estaban en silencio empiezan a participar. Sofía, al hacer un mapa conceptual con colores en lugar de responder preguntas orales, produce el análisis más rico del grupo. Ana se da cuenta de que estaba enseñando para un tipo de estudiante imaginario, no para sus 30 estudiantes reales.',
        tip: 'Principio del Diseño Universal para el Aprendizaje (DUA): cuando adaptamos para el estudiante que menos encaja con el modelo estándar, frecuentemente mejoramos la experiencia de todos. La diferenciación más efectiva no es la que aísla — es la que enriquece el espacio común.',
        next: 'cs3_n5c',
        xp: 10
      },

      'cs3_n4d': {
        type: 'feedback_wrong',
        text: 'Dar a Sofía una hoja diferente mientras todos trabajan igual la señala como "diferente" ante sus compañeros — algo que a los 9 años puede ser socialmente costoso y que puede hacer que Sofía rechace precisamente las adaptaciones que la ayudan. La diferenciación visible y aislante puede hacer más daño que el problema que intenta resolver.',
        tip: 'La diferenciación más poderosa es la que no se nota como tal — cuando el docente diseña actividades con múltiples formas de participación, todos los estudiantes pueden elegir el modo que les funciona sin sentirse señalados.',
        next: 'cs3_n5d',
        xp: 0
      },

      'cs3_n4e': {
        type: 'feedback_wrong',
        text: 'Derivar a Sofía a un especialista antes de haber agotado las adaptaciones pedagógicas básicas es un error frecuente de docentes nuevos que equiparan "diferencia de aprendizaje" con "condición clínica". Sofía puede estar necesitando solo un cambio en cómo se le enseña — y ese cambio está dentro del alcance de Ana.',
        tip: 'La derivación a especialistas es valiosa cuando se han implementado adaptaciones pedagógicas y no han funcionado. Hacerlo como primer paso medicaliza diferencias que son primariamente pedagógicas y puede estigmatizar al estudiante innecesariamente.',
        next: 'cs3_n5d',
        xp: 0
      },

      'cs3_n4f': {
        type: 'feedback_correct',
        text: 'Al observar a Sofía desde cero, Ana descubre algo que el consejo anterior ocultó: Sofía presta atención perfectamente — pero a los objetos, no a las palabras. Cuando Ana pone una regla sobre el escritorio para explicar fracciones, Sofía la mira con intensidad y resuelve el problema. Cuando Ana solo habla, Sofía mira por la ventana buscando algo concreto que ancle el concepto.',
        tip: 'La observación directa sin hipótesis previas es el método más honesto de conocer a un estudiante. Las etiquetas heredadas (TDAH, lento, difícil) son hipótesis que deben ser probadas, no verdades que deben ser administradas.',
        next: 'cs3_n5e',
        xp: 10
      },

      'cs3_n4g': {
        type: 'feedback_wrong',
        text: 'Acumular opiniones de colegas sobre un estudiante no produce conocimiento — produce un mosaico de interpretaciones que se contradicen y que comparten el problema de estar basadas en las mismas limitaciones pedagógicas. Ana necesita datos primarios, no más segundas opiniones.',
        tip: 'El conocimiento de un estudiante específico requiere observación directa de ese estudiante específico. Las narrativas colectivas sobre un estudiante tienden a ser más reveladoras de las limitaciones del sistema que del estudiante en sí.',
        next: 'cs3_n5f',
        xp: 0
      },

      // LEVEL 5

      'cs3_n5a': {
        type: 'scenario',
        text: 'Sofía ha mejorado notablemente. Pasa las matemáticas y sus textos escritos, aunque cortos, son cuidadosos y originales. Pero llega fin de año y Ana nota que Diego, un niño que hasta ahora pasaba desapercibido porque cumplía con todo lo que se pedía, está sacando notas bajas en comprensión lectora. Diego es completamente diferente a Sofía: muy verbal, muy social, siempre en movimiento. Las notas bajas no tienen sentido hasta que Ana revisa sus respuestas: son correctas en contenido pero muy breves, como si Diego no pudiera o no quisiera profundizar.',
        context: 'Ana enfrenta el reto de aplicar lo que aprendió con Sofía a un perfil completamente diferente, en menos tiempo y con más experiencia.',
        choices: [
          {
            text: 'Aplicar el mismo método: observar durante una semana sin hipótesis previas, esta vez buscando cuándo Diego profundiza y cuándo se detiene.',
            next: 'cs3_outcome_success',
            isCorrect: true
          },
          {
            text: 'Asumir que Diego es un "estudiante social" que necesita más trabajo en equipo — el perfil verbal y social suena a aprendiz auditivo-social.',
            next: 'cs3_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs3_n5b': {
        type: 'scenario',
        text: 'La madre de Sofía nunca más se comunicó con Ana. Sofía pasó el trimestre con adaptaciones mínimas — Ana la sentó cerca del pizarrón y le dio más tiempo en los exámenes. Al final del año, Sofía aprueba con lo mínimo. Sigue sin participar. Sigue dibujando en su cuaderno. La historia no cambió — solo mejoró lo suficiente para no alarmar a nadie.',
        context: 'Ana siente que algo quedó incompleto. Tiene razón.',
        choices: [
          {
            text: 'Escribir una nota detallada sobre las observaciones de Sofía para la docente del próximo año — al menos la cadena de conocimiento no se romperá.',
            next: 'cs3_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Aceptar que hizo lo que pudo en las circunstancias — no todos los casos tienen solución completa en un año.',
            next: 'cs3_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs3_n5c': {
        type: 'scenario',
        text: 'El cambio en el aula de Ana ha sido notable. Pero algunos estudiantes empiezan a comentar entre ellos que "Sofía siempre hace cosas diferentes" — se refieren a que ella a veces entrega mapas en lugar de textos escritos. Un estudiante pregunta directamente en clase: "¿Por qué a Sofía le valen los dibujos y a nosotros no?" La pregunta es legítima y merece una respuesta honesta.',
        context: 'La equidad en el aula requiere que los estudiantes entiendan que "igual" no significa "idéntico".',
        choices: [
          {
            text: 'Abrir la conversación al grupo: explicar que diferentes formas de mostrar lo que se sabe son igualmente válidas, y preguntar qué formas les gustarían a ellos.',
            next: 'cs3_outcome_success',
            isCorrect: true
          },
          {
            text: 'Responder que "cada quien tiene sus propias necesidades" y cerrar el tema — los estudiantes no necesitan entender las razones pedagógicas.',
            next: 'cs3_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs3_n5d': {
        type: 'scenario',
        text: 'Sofía termina el año con notas suficientes pero sin haber encontrado su lugar en el aula. La adaptación que recibió fue correcta en concepto pero incómoda en implementación — ser la única con hoja diferente la hizo sentir señalada. En la última semana, Sofía le da a Ana un dibujo: un aula llena de niños mirando al frente, y ella sentada sola con una hoja diferente. Ana lo recibe como lo que es: información pedagógica.',
        context: 'El dibujo de Sofía es la evaluación más honesta que Ana ha recibido.',
        choices: [
          {
            text: 'Agradecer el dibujo a Sofía y decirle: "Este dibujo me enseña algo importante. El próximo año, la docente que te tenga va a saber esto sobre ti."',
            next: 'cs3_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Guardar el dibujo y no comentarlo — ya terminó el año y reabrir la conversación podría hacer que Sofía se sienta peor.',
            next: 'cs3_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs3_n5e': {
        type: 'scenario',
        text: 'Con las adaptaciones visuales y kinestésicas, Sofía florece en el segundo semestre. En la clase de Ciencias, construye un modelo del sistema solar con arcilla y palitos que es tan preciso que Ana lo usa para enseñar a los demás. Llega el examen estandarizado departamental — formato de respuestas orales y escritas, sin opción visual. Sofía se paraliza. Ana necesita preparar a Sofía para un sistema que aún no está diseñado para ella.',
        context: 'El examen estandarizado es obligatorio. Ana no puede cambiarlo pero sí puede preparar a Sofía para navegarlo.',
        choices: [
          {
            text: 'Preparar a Sofía con simulaciones del examen, pero también enseñarle a traducir sus ideas visuales a palabras escritas paso a paso — darle herramientas para el formato, no solo para el contenido.',
            next: 'cs3_outcome_success',
            isCorrect: true
          },
          {
            text: 'Hablar con el director para solicitar una adaptación formal al examen — Sofía tiene el derecho a ser evaluada de forma justa.',
            next: 'cs3_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs3_n5f': {
        type: 'scenario',
        text: 'Sofía termina el año sin mayores cambios. Ana aplicó el consejo de múltiples colegas — sentarla al frente, repetirle instrucciones, darle más tiempo — pero ninguna de estas medidas tocó la causa real. Al escribir el informe final, Ana nota que no puede describir cómo aprende Sofía. Solo puede describir lo que Sofía no hace.',
        context: 'Un informe docente que solo describe déficits es una señal de que el diagnóstico fue insuficiente.',
        choices: [
          {
            text: 'Tomarse media hora para observar a Sofía una última vez y escribir aunque sea tres cosas que ella SÍ hace bien y cómo las hace.',
            next: 'cs3_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Completar el informe con los datos disponibles — observar a Sofía ahora, al final del año, es demasiado tarde para cambiar algo.',
            next: 'cs3_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs3_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        title: 'Ana: La docente que aprendió a ver',
        text: 'Ana llegó a su primer año con la habilidad más importante que puede tener un docente: la disposición a mirar antes de concluir. Al observar a Sofía sin hipótesis previas, descubrió no solo cómo aprende Sofía — descubrió cómo enseñaba ella misma, y lo que su enseñanza asumía sobre quién es "un buen estudiante". Esa segunda lección es la que transformó su aula para todos. Y cuando Diego apareció con sus propios enigmas, Ana ya sabía qué hacer.',
        badge: 'Docente Observadora',
        xpReward: 50
      },
      'cs3_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        title: 'Ana: Pasos en la dirección correcta',
        text: 'Ana hizo algo importante: vio a Sofía cuando otros no lo habían hecho. Aunque algunas de sus decisiones tuvieron consecuencias no previstas — y aunque el proceso no fue tan elegante como podría haber sido — el impulso de comprender antes de calificar es la base de todo lo demás. Ese impulso, cultivado, la convertirá en la docente que sus estudiantes necesitan.',
        badge: 'Docente Empática',
        xpReward: 25
      },
      'cs3_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        title: 'Ana: Sofía seguirá esperando ser vista',
        text: 'Sofía pasó por el aula de Ana sin ser comprendida del todo. Eso no la define a ella ni define a Ana permanentemente — pero sí señala algo que vale la pena nombrar: conocer a quien enseñamos requiere más que buenas intenciones. Requiere métodos, tiempo, y la disposición de cuestionar lo que creemos saber. Ana tiene las intenciones. El próximo paso es desarrollar los métodos.',
        badge: 'Docente con Intención',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 4: "La evaluación que asusta" — Evaluación Formativa
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs4',
    title: 'La evaluación que asusta',
    course: 'Evaluación Formativa',
    color: '#8B5CF6',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
    duration: '20-25 min',
    description: 'Roberto lleva 15 años evaluando con exámenes tradicionales. Su escuela exige "evaluación auténtica" y un supervisor llegará en 3 semanas. ¿Cómo transita del miedo al cambio genuino?',
    start: 'cs4_n1',
    nodes: {

      'cs4_n1': {
        type: 'scenario',
        text: 'Roberto tiene 15 años de experiencia como docente de Matemáticas en un instituto de secundaria en Escuintla. Es respetado, sus estudiantes aprueban, y sus exámenes son conocidos por ser rigurosos. Pero en la última jornada pedagógica, la directora presentó un plan de "evaluación auténtica y formativa" para toda la escuela. Roberto no sabe exactamente qué significa, pero sabe que implica cambiar algo que le ha funcionado por años. Y para colmo, un supervisor del distrito viene a observar en tres semanas.',
        context: 'Roberto tiene miedo —no a enseñar, sino a ser evaluado como docente bajo criterios que no entiende del todo. Ese miedo es útil: es el mismo miedo que sienten sus estudiantes ante cada examen.',
        choices: [
          {
            text: 'Crear rúbricas detalladas para cada actividad esta semana — si va a implementar evaluación auténtica, mejor hacerlo completamente desde ya.',
            next: 'cs4_n2a',
            isCorrect: false
          },
          {
            text: 'Empezar con una sola técnica formativa pequeña esta semana: las tarjetas de salida (exit tickets) al final de cada clase para saber qué entendieron los estudiantes.',
            next: 'cs4_n2b',
            isCorrect: true
          },
          {
            text: 'Hablar con la directora para que su clase sea una excepción temporal — Matemáticas es diferente y necesita exámenes para verificar procedimientos.',
            next: 'cs4_n2c',
            isCorrect: false
          }
        ]
      },

      'cs4_n2a': {
        type: 'feedback_wrong',
        text: 'Crear rúbricas para todo en una semana sin formación en evaluación auténtica es como construir una casa empezando por el techo. Las rúbricas creadas apresuradamente tienden a ser listas de verificación disfrazadas, no herramientas de retroalimentación genuina. Roberto se agotará, las rúbricas serán de baja calidad, y el cambio se sentirá como una carga burocrática en lugar de una transformación pedagógica.',
        tip: 'El cambio pedagógico sostenible es gradual y reflexivo. Empezar con una sola técnica, implementarla bien, y aprender de ella es más poderoso que implementar diez técnicas superficialmente.',
        next: 'cs4_n3a',
        xp: 0
      },

      'cs4_n2b': {
        type: 'feedback_correct',
        text: 'Las tarjetas de salida son la elección perfecta para un inicio: simples, rápidas, informativas y de bajo riesgo para los estudiantes. Roberto decide que al final de cada clase pedirá a los estudiantes que respondan una pregunta en un papel: "¿Qué entendiste hoy?" y "¿Qué te quedó confuso?" En tres días tiene 90 papelitos con datos reales sobre lo que está y no está llegando. Por primera vez, tiene evidencia de aprendizaje entre examen y examen.',
        tip: 'Principio de evaluación formativa: la diferencia entre evaluación sumativa y formativa no es el instrumento — es el uso que se hace de los datos. Las tarjetas de salida son formativas porque Roberto va a usar lo que lee para cambiar lo que hace mañana.',
        next: 'cs4_n3b',
        xp: 10
      },

      'cs4_n2c': {
        type: 'feedback_wrong',
        text: 'Pedir una excepción para Matemáticas perpetúa el mito de que las ciencias exactas son incompatibles con la evaluación formativa. Es precisamente en Matemáticas donde la evaluación formativa es más poderosa: identificar en qué paso del procedimiento se pierde cada estudiante es información que ningún examen final puede dar con suficiente detalle.',
        tip: 'Matemáticas no es el obstáculo para la evaluación formativa — es el terreno donde más se necesita. Los errores matemáticos tienen patrones identificables, y la evaluación formativa permite intervenir sobre esos patrones antes del examen final.',
        next: 'cs4_n3c',
        xp: 0
      },

      // LEVEL 3

      'cs4_n3a': {
        type: 'scenario',
        text: 'Roberto terminó la semana con rúbricas para cada actividad pero los estudiantes no las entienden bien y él tampoco sabe cómo usarlas para retroalimentar. Las rúbricas tienen criterios como "excelente comprensión" sin definir qué significa eso. Algunos estudiantes preguntan: "¿Esto cuenta para la nota?" — y Roberto no sabe qué responder. La directora le pregunta cómo va y Roberto dice "bien" pero siente que todo es más complicado de lo que esperaba.',
        context: 'Roberto tiene instrumentos sin propósito claro. Necesita simplificar antes de poder avanzar.',
        choices: [
          {
            text: 'Elegir UNA de las rúbricas que hizo, la que considera más importante, y compartirla con los estudiantes antes de la próxima actividad para que sepan exactamente por qué criterios serán evaluados.',
            next: 'cs4_n4a',
            isCorrect: true
          },
          {
            text: 'Mantener todas las rúbricas pero explicarlas mejor — la evaluación auténtica requiere más criterios, no menos.',
            next: 'cs4_n4b',
            isCorrect: false
          }
        ]
      },

      'cs4_n3b': {
        type: 'scenario',
        text: 'Después de una semana con tarjetas de salida, Roberto tiene un problema que no esperaba: casi todos los estudiantes escriben "entendí todo" o "no tengo dudas". Las tarjetas no están dando información real. Roberto sospecha que los estudiantes temen que decir "no entendí" tenga consecuencias negativas. Necesita rediseñar la técnica para que sea psicológicamente segura.',
        context: 'El problema no es la técnica — es el ambiente. Los estudiantes no sienten que es seguro decir que no entendieron.',
        choices: [
          {
            text: 'Cambiar el formato de la tarjeta: hacerla anónima, y añadir la pregunta "¿Qué pregunta tendrías si pudieras preguntar sin que nadie supiera que eres tú?"',
            next: 'cs4_n4c',
            isCorrect: true
          },
          {
            text: 'Leer algunas tarjetas en voz alta y comentar las que dicen "no entendí" de forma positiva — para que los estudiantes vean que es seguro ser honesto.',
            next: 'cs4_n4d',
            isCorrect: false
          },
          {
            text: 'Abandonar las tarjetas de salida y probar con otra técnica — si los estudiantes no cooperan, la técnica no funciona.',
            next: 'cs4_n4e',
            isCorrect: false
          }
        ]
      },

      'cs4_n3c': {
        type: 'scenario',
        text: 'La directora no acepta la excepción. Le explica a Roberto con paciencia que la evaluación formativa no reemplaza los exámenes — los complementa. Le pide que pruebe algo pequeño antes de la visita del supervisor. Roberto lo ve como una tarea más, no como una oportunidad. Busca en internet "evaluación formativa ejemplos" y copia un formato de otra escuela sin adaptarlo.',
        context: 'Roberto está en modo de cumplimiento, no de aprendizaje. Necesita algo que lo mueva de la resistencia a la curiosidad.',
        choices: [
          {
            text: 'Probar el formato copiado pero observar honestamente qué pasa: ¿los estudiantes lo toman en serio? ¿Da información útil? Usar la observación para ajustar.',
            next: 'cs4_n4f',
            isCorrect: true
          },
          {
            text: 'Implementar el formato sin observar su efecto — cumplió con lo pedido, eso es suficiente por ahora.',
            next: 'cs4_n4g',
            isCorrect: false
          }
        ]
      },

      // LEVEL 4

      'cs4_n4a': {
        type: 'feedback_correct',
        text: 'Al compartir la rúbrica antes de la actividad, algo inesperado ocurre: los estudiantes empiezan a hacer mejores preguntas durante la tarea. Saben qué se espera de ellos y pueden auto-regularse. Uno de los estudiantes dice: "Profe, en el criterio de \'justificación\' — ¿cuenta si uso el procedimiento que vimos ayer o solo el nuevo?" Roberto se da cuenta de que la rúbrica compartida se convirtió en una herramienta de aprendizaje, no solo de calificación.',
        tip: 'Principio: La rúbrica compartida antes de la tarea es una herramienta de aprendizaje. La rúbrica usada solo para calificar después es solo burocracia. El momento en que se comparte lo cambia todo.',
        next: 'cs4_n5a',
        xp: 10
      },

      'cs4_n4b': {
        type: 'feedback_wrong',
        text: 'Mantener muchas rúbricas confusas no produce más evaluación auténtica — produce más confusión para todos. La complejidad de los instrumentos no garantiza la calidad de la evaluación. Un solo criterio claro y bien usado vale más que diez criterios que nadie entiende.',
        tip: 'Menos es más en evaluación formativa, especialmente al inicio. La claridad de los criterios es más importante que su cantidad. Un estudiante que entiende perfectamente un criterio puede autorregularse; uno que enfrenta diez criterios vagos solo puede adivinar.',
        next: 'cs4_n5b',
        xp: 0
      },

      'cs4_n4c': {
        type: 'feedback_correct',
        text: 'Las tarjetas anónimas con la pregunta reformulada producen información que Roberto no esperaba. Una tarjeta dice: "¿Por qué dividimos el denominador y no el numerador?" — una confusión conceptual que Roberto nunca habría detectado con un examen porque los estudiantes aprenden a hacer el procedimiento sin entenderlo. Otra dice: "Nunca entendí por qué en el libro dice X pero usted explicó Y." Roberto usa esa información al día siguiente y dedica diez minutos a la confusión más frecuente.',
        tip: 'El anonimato en la evaluación formativa reduce el filtro del miedo y produce datos más honestos. La pregunta reformulada ("si pudieras preguntar sin que nadie supiera...") hace explícita la seguridad psicológica que normalmente está ausente.',
        next: 'cs4_n5c',
        xp: 10
      },

      'cs4_n4d': {
        type: 'feedback_wrong',
        text: 'Leer tarjetas en voz alta, aunque sea con intención positiva, elimina el anonimato y confirma el miedo: los estudiantes pueden reconocer la escritura, el contenido, o la forma en que Roberto lo comenta puede señalar indirectamente al autor. Incluso si Roberto lo hace bien, el riesgo percibido es suficiente para que los estudiantes sigan escribiendo "todo bien".',
        tip: 'La seguridad psicológica en el aula no se construye diciendo "es seguro cometer errores" — se construye con estructuras que hacen imposible o innecesaria la exposición. El anonimato es una estructura, no solo un gesto.',
        next: 'cs4_n5d',
        xp: 0
      },

      'cs4_n4e': {
        type: 'feedback_wrong',
        text: 'El problema no era la técnica — era el ambiente de seguridad. Cambiar de técnica sin entender por qué la anterior no funcionó lleva a repetir el mismo error con un instrumento diferente. Roberto perdería tiempo y acumularía frustración sin aprender nada sobre evaluación formativa.',
        tip: 'Cuando una técnica de evaluación formativa "no funciona", la primera pregunta es sobre el ambiente, no sobre la técnica. ¿Los estudiantes sienten que es seguro ser honestos? ¿Entienden para qué sirve la información que dan?',
        next: 'cs4_n5d',
        xp: 0
      },

      'cs4_n4f': {
        type: 'feedback_correct',
        text: 'Al observar el formato copiado en acción, Roberto nota algo interesante: el formato pide a los estudiantes que "evalúen su confianza en el tema" en una escala de 1 a 5. Los estudiantes que marcan 5 (muy seguros) cometen los mismos errores en el ejercicio siguiente. Roberto se da cuenta de que la metacognición de sus estudiantes está descalibrada — creen que entienden cuando no entienden. Ese dato es oro pedagógico.',
        tip: 'Incluso una herramienta copiada, observada con curiosidad, puede revelar información valiosa. La actitud investigativa convierte cualquier instrumento en una oportunidad de aprendizaje. El problema no era el formato — era la ausencia de observación.',
        next: 'cs4_n5e',
        xp: 10
      },

      'cs4_n4g': {
        type: 'feedback_wrong',
        text: 'Implementar sin observar produce datos que no se usan — y datos que no se usan no son evaluación formativa, son papeleo. El ciclo de la evaluación formativa requiere: recoger datos, analizarlos, ajustar la enseñanza. Roberto completó el primero pero omitió los otros dos.',
        tip: 'La evaluación formativa no es un instrumento — es un ciclo. Recoger datos sin analizarlos es como medir la temperatura de un paciente y no leer el termómetro.',
        next: 'cs4_n5f',
        xp: 0
      },

      // LEVEL 5

      'cs4_n5a': {
        type: 'scenario',
        text: 'El supervisor llega y observa la clase. Roberto está en medio de ajustar su explicación porque las tarjetas de la clase anterior mostraron que el 60% no entendió la factorización por agrupación. En lugar de seguir su plan original, Roberto dice en voz alta: "Ayer revisé sus tarjetas y vi que este paso confundió a muchos — así que hoy vamos a dedicar más tiempo aquí antes de avanzar." El supervisor toma nota. Después de la clase, el supervisor le pregunta: "¿Dónde está su libro de calificaciones?" Roberto no sabe cómo responder.',
        context: 'El supervisor está buscando un sistema de calificación numérica. Roberto ha estado usando datos de proceso, no notas numéricas, para informar su enseñanza.',
        choices: [
          {
            text: 'Explicar al supervisor el ciclo que ha establecido: tarjetas de salida informan la clase siguiente, el ajuste es visible y documentado, y los datos de proceso se convierten en evidencia de aprendizaje antes del examen final.',
            next: 'cs4_outcome_success',
            isCorrect: true
          },
          {
            text: 'Mostrarle su libro de calificaciones tradicional y decirle que la evaluación formativa es "adicional" — no quiere complicar la conversación.',
            next: 'cs4_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs4_n5b': {
        type: 'scenario',
        text: 'El supervisor llega y ve rúbricas en las paredes, en los cuadernos y en los escritorios de los estudiantes. Pero cuando le pregunta a un estudiante "¿qué significa este criterio?", el estudiante no puede explicarlo. El supervisor nota la cantidad de instrumentos pero la ausencia de comprensión. Roberto se siente expuesto — invirtió mucho tiempo en crear documentos que nadie entiende.',
        context: 'Roberto tiene la forma pero no el fondo. Necesita una forma de reconocerlo sin desacreditar todo su esfuerzo.',
        choices: [
          {
            text: 'Reconocer honestamente con el supervisor que está en proceso de aprendizaje y que el próximo paso es simplificar y trabajar los criterios con los estudiantes antes de aplicarlos.',
            next: 'cs4_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Defenderle al supervisor que los estudiantes sí entienden y que la observación fue muy corta para evaluar el proceso.',
            next: 'cs4_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs4_n5c': {
        type: 'scenario',
        text: 'Con las tarjetas anónimas bien implementadas, Roberto tiene datos valiosos y los ha estado usando para ajustar sus clases. El supervisor observa que Roberto cambia su plan a mitad de clase basándose en las respuestas de los estudiantes. Lo que el supervisor ve lo sorprende: un docente que usa evidencia en tiempo real. Al final del año, Roberto necesita convertir todo este proceso en calificaciones para el sistema oficial.',
        context: 'El sistema escolar sigue requiriendo números en el boletín. Roberto necesita puentes entre sus datos formativos y las calificaciones sumativas.',
        choices: [
          {
            text: 'Diseñar un examen final que recoja los conceptos más frecuentemente confundidos según sus tarjetas — así el examen sumativo está informado por el proceso formativo.',
            next: 'cs4_outcome_success',
            isCorrect: true
          },
          {
            text: 'Usar el promedio de las participaciones y tarjetas como nota — si el estudiante participó, merece una buena calificación.',
            next: 'cs4_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs4_n5d': {
        type: 'scenario',
        text: 'La visita del supervisor ocurre en un día en que Roberto está usando el formato copiado de internet. El supervisor lo reconoce — es un formato del Ministerio de Educación que fue distribuido hace dos años. Le pregunta a Roberto si lo adaptó. Roberto dice que lo está probando. El supervisor acepta eso como una respuesta honesta y le pregunta qué ha aprendido de usarlo.',
        context: 'El supervisor no busca perfección — busca reflexión. Roberto tiene una oportunidad.',
        choices: [
          {
            text: 'Compartir honestamente lo que observó: que los estudiantes que dicen tener alta confianza cometen los mismos errores, y que está pensando en qué hacer con eso.',
            next: 'cs4_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Decir que el formato funciona bien y que los estudiantes están respondiendo positivamente — no quiere que el supervisor piense que tiene dificultades.',
            next: 'cs4_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs4_n5e': {
        type: 'scenario',
        text: 'Roberto ha descubierto que sus estudiantes tienen baja metacognición: no saben lo que no saben. Eso explica por qué siempre se sorprenden al ver sus notas de examen. Con tres semanas antes de fin de curso, Roberto diseña actividades de metacognición: antes de cada ejercicio, los estudiantes predicen qué tan bien lo harán y después comparan con el resultado real. La calibración mejora visiblemente. Ahora Roberto necesita comunicar a los padres este enfoque.',
        context: 'Los padres están acostumbrados a recibir notas numéricas como única información. Roberto quiere darles algo más.',
        choices: [
          {
            text: 'Enviar junto con el boletín una nota que explique qué encontró sobre el aprendizaje de su hijo/a y qué hicieron para mejorarlo — un párrafo por estudiante.',
            next: 'cs4_outcome_success',
            isCorrect: true
          },
          {
            text: 'Usar el boletín estándar — los padres no están preparados para recibir información pedagógica detallada.',
            next: 'cs4_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs4_n5f': {
        type: 'scenario',
        text: 'Roberto llega a fin de año con datos sin procesar y un libro de calificaciones en el que los números no reflejan lo que él sabe sobre el aprendizaje de sus estudiantes. Hay estudiantes con nota alta que conceptualmente están perdidos, y estudiantes con nota baja que demostraron comprensión real pero fallaron en los exámenes por ansiedad. Roberto lo sabe — pero sus datos no están organizados para probarlo.',
        context: 'La brecha entre lo que Roberto sabe pedagógicamente y lo que puede demostrar institucionalmente es el problema central.',
        choices: [
          {
            text: 'Documentar el próximo trimestre con mayor rigor: guardar las tarjetas, anotar los ajustes que hizo, registrar las mejoras observadas — para construir evidencia del proceso.',
            next: 'cs4_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Aceptar que el sistema de calificaciones y la evaluación formativa son mundos separados — uno para cumplir, otro para enseñar de verdad.',
            next: 'cs4_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs4_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        title: 'Roberto: El docente que cerró el ciclo',
        text: 'Roberto aprendió que la evaluación formativa no es un formato ni una rúbrica — es un ciclo de escucha, ajuste y evidencia. Al empezar con algo pequeño (las tarjetas de salida), al crear seguridad para la honestidad, al usar los datos para ajustar antes del examen y no solo para calificar después, demostró ante el supervisor algo que los 15 años de exámenes rigurosos nunca habían mostrado: que sabía qué estaban aprendiendo sus estudiantes en tiempo real, y que hacía algo con esa información. Eso es enseñar.',
        badge: 'Docente Formativo',
        xpReward: 50
      },
      'cs4_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        title: 'Roberto: La transición en proceso',
        text: 'Roberto dio pasos reales hacia un enfoque más formativo. No todo funcionó perfectamente — algunos instrumentos fueron demasiado complejos, algunos datos quedaron sin usar, algunas conversaciones se evitaron. Pero el movimiento fue real. Y lo más importante: Roberto ya no ve la evaluación formativa como una amenaza a su forma de enseñar. La ve como información que no tenía antes.',
        badge: 'Docente en Transición',
        xpReward: 25
      },
      'cs4_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        title: 'Roberto: El cambio que no ocurrió todavía',
        text: 'Roberto terminó el año con más papeles y menos claridad que al inicio. La evaluación auténtica sigue siendo una demanda externa, no una convicción interna. Pero hay algo valioso en este punto: Roberto sabe que algo no está funcionando. Esa incomodidad — si no se evita — es el inicio del cambio. La pregunta es si Roberto puede convertirla en curiosidad en lugar de resistencia.',
        badge: 'Docente ante el Umbral',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 5: "La Creatividad de Lucía" — Docente Creativo
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs5',
    title: 'La Creatividad de Lucía',
    course: 'Docente Creativo',
    color: '#E83C8D',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.5-1.5 4.5-3 6l-1 1H9l-1-1C6.5 13.5 5 11.5 5 9a7 7 0 017-7z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="9.5" y1="7" x2="9" y2="5"/><line x1="14.5" y1="7" x2="15" y2="5"/><line x1="7" y1="9.5" x2="5" y2="9"/><line x1="17" y1="9.5" x2="19" y2="9"/></svg>',
    duration: '20-25 min',
    description: 'Lucía es docente en una escuela urbana de Guatemala City y quiere aplicar técnicas de creatividad, pero sus estudiantes están acostumbrados a clases tradicionales. Acompáñala a transformar su aula en un espacio donde el error es bienvenido y la imaginación tiene lugar.',
    start: 'cs5_n1',
    nodes: {

      'cs5_n1': {
        type: 'scenario',
        text: 'Lucía da clases de Ciencias Sociales en el Instituto Nacional Mixto Central de Guatemala City. Sus 32 estudiantes de tercero básico son brillantes — pero callados. Acostumbrados a copiar del pizarrón y a responder solo cuando tienen la respuesta "correcta". Hoy Lucía quiere hacer su primera sesión de brainstorming sobre la identidad cultural guatemalteca.',
        context: 'Cuando Lucía dice "escriban lo primero que se les venga a la mente cuando piensan en Guatemala", los estudiantes se miran entre sí. Silencio. Nadie escribe. Una niña en la fila de atrás pregunta: "¿Qué nota tiene esta actividad?"',
        choices: [
          { text: 'Empezar con un ejemplo personal: compartir lo primero que a Lucía le viene a la mente y normalizar respuestas "imperfectas".', next: 'cs5_n2a', points: 10 },
          { text: 'Dar una lista de temas sugeridos para que los estudiantes elijan y "no se equivoquen".', next: 'cs5_n2b', points: 5 },
          { text: 'Regañarlos por el silencio y exigirles que participen porque "esto tiene nota".', next: 'cs5_n2c', points: 0 }
        ]
      },

      'cs5_n2a': {
        type: 'feedback_correct',
        text: 'Lucía dice en voz alta: "Yo escribí: el olor de la marimba en la madrugada del 15 de septiembre". Los estudiantes ríen. Luego alguien escribe. Después otro. En cinco minutos el pizarrón está lleno: barriletes de Sumpango, el mercado de Chichicastenango, el ruido de los cohetillos, el frío del altiplano, el güipil de la abuela.',
        feedback: 'La modelización docente rompe el bloqueo creativo mejor que cualquier instrucción. Cuando el docente muestra vulnerabilidad y normaliza la respuesta "rara", los estudiantes comprenden que el objetivo no es adivinar la respuesta correcta sino explorar ideas genuinas.',
        choices: [
          { text: 'Usar las respuestas del pizarrón como base para clasificar y profundizar.', next: 'cs5_n3a', points: 10 },
          { text: 'Decirles que esas ideas son el "primer borrador" y que ahora hay que corregirlas.', next: 'cs5_n3b', points: 3 }
        ]
      },

      'cs5_n2b': {
        type: 'feedback_partial',
        text: 'Los estudiantes eligen temas de la lista, pero las respuestas son predecibles: "quetzal", "lago Atitlán", "Tikal". El brainstorming funciona técnicamente, pero pierde su propósito: generar conexiones inesperadas y pensamiento divergente. La lista actúa como un techo cognitivo.',
        feedback: 'Dar opciones cerradas en un brainstorming contradice su naturaleza. Los andamiajes de creatividad deben abrir posibilidades, no acotarlas. Una alternativa mejor sería dar categorías amplias ("sonidos", "olores", "recuerdos") en vez de respuestas específicas.',
        choices: [
          { text: 'Ampliar la actividad pidiendo que a cada idea le agreguen una sensación o recuerdo personal.', next: 'cs5_n3a', points: 7 },
          { text: 'Continuar con la lista original y pasar a la siguiente actividad.', next: 'cs5_n3b', points: 2 }
        ]
      },

      'cs5_n2c': {
        type: 'feedback_incorrect',
        text: 'El silencio se convierte en tensión. Dos o tres estudiantes escriben algo rápido para evitar problemas. El resto espera a copiar lo que escriben sus compañeros. La sesión de brainstorming produce respuestas homogéneas escritas por miedo, no por genuina exploración creativa.',
        feedback: 'La amenaza de calificación activa el sistema de evitación de riesgo en los adolescentes. El pensamiento creativo requiere seguridad psicológica — la certeza de que una respuesta "equivocada" no tendrá consecuencias. La presión externa bloquea la divergencia cognitiva que es la esencia de la creatividad.',
        choices: [
          { text: 'Reconocer el error y transformar el ambiente: "Olvidemos la nota por hoy. Quiero saber qué piensan DE VERDAD."', next: 'cs5_n3a', points: 6 },
          { text: 'Mantener la presión y recoger los papeles para calificar.', next: 'cs5_n3c', points: 0 }
        ]
      },

      'cs5_n3a': {
        type: 'scenario',
        text: 'La clase está en movimiento. Lucía quiere llevar la creatividad más lejos: propone que los estudiantes creen una "instalación artística" en el aula usando materiales que traigan de sus casas — telas típicas, fotografías, objetos de sus comunidades. Pero en ese momento el ambiente se vuelve ruidoso y desordenado. Varios grupos hablan al mismo tiempo, algunos están de pie, dos estudiantes están discutiendo sobre qué objeto es "más representativo".',
        context: 'El docente de la aula de al lado toca la pared y dice "¡silencio!" a través del muro. El director pasa por el corredor y mira hacia adentro con cara de preocupación.',
        choices: [
          { text: 'Establecer un protocolo claro: cada grupo tiene 3 minutos para hablar, un vocero designado y una señal de silencio acordada.', next: 'cs5_n4a', points: 10 },
          { text: 'Pedir a todos que se sienten y bajen la voz, regresando a la actividad individual.', next: 'cs5_n4b', points: 4 },
          { text: 'Ignorar el caos y dejar que los grupos "se organicen solos" sin intervenir.', next: 'cs5_n4c', points: 2 }
        ]
      },

      'cs5_n3b': {
        type: 'scenario',
        text: 'Las ideas del brainstorming se perdieron sin profundizarse. Lucía pasa directamente a la siguiente actividad: un cuestionario sobre "elementos de la cultura guatemalteca". Los estudiantes responden correctamente pero mecánicamente. Lucía siente que algo se perdió en la sesión.',
        context: 'Al salir de clase, una estudiante le dice: "Maestra, esa actividad del principio estuvo bonita. ¿La vamos a volver a hacer?"',
        choices: [
          { text: 'Tomar nota de ese comentario y planificar una siguiente sesión que sí desarrolle las ideas del brainstorming.', next: 'cs5_n4a', points: 7 },
          { text: 'Continuar con el programa sin modificar nada.', next: 'cs5_n4c', points: 1 }
        ]
      },

      'cs5_n3c': {
        type: 'scenario',
        text: 'Los papeles están calificados: la mayoría reprobó o sacó notas bajas porque no hubo ideas "suficientemente desarrolladas". Lucía siente que la actividad fue un fracaso. Varios estudiantes se ven desanimados.',
        context: 'Lucía reflexiona sola después de clase: "¿Estoy midiendo creatividad o estoy midiendo el miedo a equivocarse?"',
        choices: [
          { text: 'Reconocer que el instrumento de evaluación no era adecuado para medir creatividad y rediseñarlo.', next: 'cs5_n4a', points: 6 },
          { text: 'Abandonar las actividades creativas porque "no funcionan con este grupo".', next: 'cs5_nFIN_c', points: 0 }
        ]
      },

      'cs5_n4a': {
        type: 'scenario',
        text: 'La instalación artística quedó increíble. Hay un güipil de Nebaj colgado junto a una foto del lago Atitlán y un barrilete de papel china hecho a mano. Un estudiante trajo el bordado de su abuela; otro pegó una entrada al mercado de artesanías. Pero ahora llega el momento más difícil: ¿cómo evalúa Lucía esto sin poner una nota numérica que destruya el espíritu de la actividad?',
        context: 'El reglamento del instituto exige una nota de 0-100 en todas las actividades. La subdirectora le pregunta a Lucía cómo va a registrar esta actividad en el libro de calificaciones.',
        choices: [
          { text: 'Crear una rúbrica de proceso que evalúe criterios creativos: originalidad, conexión personal, uso de elementos culturales, colaboración — y no el resultado estético final.', next: 'cs5_n5a', points: 10 },
          { text: 'Poner una nota de participación (todos 90 puntos) para cumplir con el requisito sin destruir el espíritu.', next: 'cs5_n5b', points: 5 },
          { text: 'Decir a la subdirectora que fue "actividad extra" y no registrarla.', next: 'cs5_n5c', points: 2 }
        ]
      },

      'cs5_n4b': {
        type: 'scenario',
        text: 'La actividad se calmó pero también perdió energía. Los grupos terminaron haciendo algo correcto pero sin la chispa del principio. Lucía siente que frenó algo importante por querer control.',
        context: 'Un estudiante le dice después: "Profe, estábamos bien emocionados. ¿Por qué nos bajaron?"',
        choices: [
          { text: 'Reflexionar sobre cómo equilibrar estructura y libertad en actividades creativas grupales.', next: 'cs5_n5a', points: 6 },
          { text: 'Concluir que las actividades grupales creativas son demasiado complicadas.', next: 'cs5_n5c', points: 1 }
        ]
      },

      'cs5_n4c': {
        type: 'scenario',
        text: 'Sin estructura, el caos duró toda la clase. Algunos grupos avanzaron; otros no hicieron nada. La brecha entre grupos motivados y grupos perdidos se amplió. Al final, Lucía no sabe qué aprendió cada quien.',
        context: 'Al revisar los "productos" de cada grupo, nota que son muy desiguales — no en calidad creativa, sino en esfuerzo y comprensión.',
        choices: [
          { text: 'Usar esa desigualdad como diagnóstico: identificar qué grupos necesitan más andamiaje en el próximo proyecto.', next: 'cs5_n5a', points: 5 },
          { text: 'Calificar todo igual para evitar conflictos.', next: 'cs5_n5c', points: 0 }
        ]
      },

      'cs5_n5a': {
        type: 'scenario',
        text: 'Lucía quiere consolidar todo lo aprendido en un proyecto final: los estudiantes van a crear una "Cápsula de Creatividad Cultural" — una caja donde guardan un objeto, un texto y una imagen que representen algo único de su comunidad o familia. Lo presentarán ante sus compañeros en una exposición abierta, como si fuera un festival de barrilete pero de ideas.',
        context: 'Algunos estudiantes traen tejidos de sus madres, semillas de milpa, fotografías de la marimba en una fiesta patronal. Otros traen cosas inesperadas: un silbato de barro, la letra de una canción que inventaron, una receta de pepián escrita a mano.',
        choices: [
          { text: 'Celebrar la diversidad de las cápsulas y crear un "museo de aula" donde todos puedan ver y escuchar cada historia.', next: 'cs5_nFIN_a', points: 10 },
          { text: 'Pedir que todas las cápsulas tengan el mismo formato para que sea más fácil de evaluar.', next: 'cs5_nFIN_b', points: 5 }
        ]
      },

      'cs5_n5b': {
        type: 'scenario',
        text: 'Lucía asignó los 90 puntos sin mayor reflexión. Los estudiantes lo recibieron bien, pero al preguntarles por qué obtuvieron esa nota, nadie supo responder. La nota cumplió la función administrativa pero no la pedagógica.',
        context: 'Una semana después, cuando Lucía propone otra actividad creativa, escucha: "¿Esto también tiene los 90 de siempre?"',
        choices: [
          { text: 'Diseñar una rúbrica sencilla para que los estudiantes sepan qué se valora en las actividades creativas.', next: 'cs5_nFIN_b', points: 6 },
          { text: 'Mantener el sistema de los 90 puntos fijos porque "funciona sin conflictos".', next: 'cs5_nFIN_c', points: 1 }
        ]
      },

      'cs5_n5c': {
        type: 'scenario',
        text: 'Las decisiones tomadas llevaron a Lucía a un punto de tensión: siente que quiere enseñar creativamente pero el sistema, el tiempo, el ruido y la evaluación la empujan de vuelta a lo tradicional.',
        context: 'En una reunión de maestros, escucha a un colega decir: "La creatividad en el aula es un lujo. Nosotros tenemos programa que cumplir."',
        choices: [
          { text: 'Rebatir respetuosamente: "La creatividad no es el tema — es la forma de enseñar cualquier tema."', next: 'cs5_nFIN_b', points: 5 },
          { text: 'Estar de acuerdo y decidir que "ya será en otro momento".', next: 'cs5_nFIN_c', points: 0 }
        ]
      },

      'cs5_nFIN_a': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Lucía: El aula que se convirtió en festival',
        text: 'La exposición de las Cápsulas de Creatividad fue el momento más memorable del año escolar. Los padres de familia vinieron. Uno de ellos — un tejedor de Momostenango — enseñó a tres estudiantes un nudo tradicional durante la presentación. La marimba sonó en un video que grabó un estudiante en su teléfono. Lucía entendió que la creatividad no es una materia — es una manera de ver el mundo que se aprende cuando el aula se convierte en un lugar seguro para compartir lo que eres.',
        badge: 'Docente Creativa',
        xpReward: 50
      },

      'cs5_nFIN_b': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 70,
        title: 'Lucía: La semilla plantada',
        text: 'Lucía no logró todo lo que se propuso, pero plantó algo importante: sus estudiantes vivieron al menos una experiencia donde su identidad y su imaginación importaban. Algunos proyectos quedaron a medias, algunas evaluaciones no capturaron bien lo que los estudiantes aprendieron — pero el rumbo cambió. Y eso, en pedagogía, es el comienzo de todo.',
        badge: 'Docente en Florecimiento',
        xpReward: 25
      },

      'cs5_nFIN_c': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 40,
        title: 'Lucía: El potencial sin desarrollar',
        text: 'Lucía tiene el instinto correcto — quiere que sus estudiantes creen, imaginen y conecten. Pero las presiones del sistema, el miedo al desorden y la falta de herramientas para evaluar la creatividad la hicieron retroceder a lo conocido. Lo valioso es que Lucía sabe que algo le falta. Esa incomodidad, si se convierte en pregunta, puede ser el punto de partida de una transformación real.',
        badge: 'Docente ante el Umbral Creativo',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 6: "Mario y el Celular" — Mobile Learning
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs6',
    title: 'Mario y el Celular',
    course: 'Mobile Learning',
    color: '#F59E0B',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M8.5 7c.5-1 1.5-1.5 3-1.5s2.5.5 3 1.5"/><path d="M7 10c.8-2 2.5-3 5-3s4.2 1 5 3"/></svg>',
    duration: '20-25 min',
    description: 'Mario enseña en un colegio de Quetzaltenango y quiere usar m-learning, pero solo la mitad de sus estudiantes tiene smartphone y hay problemas de conectividad. Acompáñalo a diseñar un modelo de aprendizaje móvil que sea equitativo, funcional y pedagógicamente sólido.',
    start: 'cs6_n1',
    nodes: {

      'cs6_n1': {
        type: 'scenario',
        text: 'Mario es docente de Comunicación y Lenguaje en el Colegio Privado Mixto San Marcos, en Quetzaltenango. Su directora le ha pedido que "incorpore tecnología móvil" después de una capacitación sobre m-learning. Mario hace un diagnóstico rápido: de sus 35 estudiantes de segundo básico, 17 tienen smartphone, 10 tienen teléfono básico sin internet, y 8 no tienen ningún dispositivo. La conectividad del colegio es irregular — el wifi del aula cae varias veces al día.',
        context: 'Mario quiere ser innovador, pero antes de entusiasmarse demasiado, necesita tomar una decisión fundamental sobre cómo va a manejar la inequidad digital en su salón.',
        choices: [
          { text: 'Diseñar todas las actividades para que funcionen sin internet, usando el celular como herramienta offline (cámara, notas de voz, apps descargadas).', next: 'cs6_n2a', points: 10 },
          { text: 'Pedir a los estudiantes sin celular que trabajen en parejas con quienes sí tienen, y usar solo actividades que requieren internet.', next: 'cs6_n2b', points: 5 },
          { text: 'Esperar a que el colegio resuelva el problema de conectividad antes de implementar m-learning.', next: 'cs6_n2c', points: 2 }
        ]
      },

      'cs6_n2a': {
        type: 'feedback_correct',
        text: 'Mario decide que el celular en su aula va a ser una herramienta, no un requisito de conectividad. Planifica actividades donde los estudiantes usan la cámara para documentar, el micrófono para grabar, y apps descargadas previamente — sin depender del wifi. Para los 8 estudiantes sin dispositivo, negocia con la dirección el préstamo de 4 tablets antiguas del laboratorio.',
        feedback: 'El m-learning efectivo en contextos de baja conectividad parte de un principio clave: el dispositivo móvil como herramienta cognitiva, no como ventana a internet. En zonas como el altiplano guatemalteco, donde los datos móviles son costosos y el wifi es inestable, el diseño offline-first no es un plan B — es la estrategia principal.',
        choices: [
          { text: 'Empezar con una actividad de documentación fotográfica del entorno del colegio como práctica de escritura descriptiva.', next: 'cs6_n3a', points: 10 },
          { text: 'Comenzar enseñando a los estudiantes a usar WhatsApp como herramienta de aprendizaje colaborativo.', next: 'cs6_n3b', points: 6 }
        ]
      },

      'cs6_n2b': {
        type: 'feedback_partial',
        text: 'El sistema de parejas funciona a medias. Los estudiantes con celular tienden a acaparar la herramienta mientras el compañero sin dispositivo observa pasivamente. Además, cuando cae el wifi, toda la actividad se detiene. Mario nota que la mitad del tiempo de clase se pierde esperando que la conexión vuelva.',
        feedback: 'El trabajo en parejas con un solo dispositivo puede ser poderoso — pero requiere roles claramente definidos y rotación de quién "maneja" el dispositivo. Sin esa estructura, el estudiante sin celular se convierte en espectador. La dependencia del internet en contextos de conectividad inestable es un riesgo pedagógico que hay que planificar antes, no resolver cuando ya falló.',
        choices: [
          { text: 'Rediseñar las actividades para que sean offline-first y establecer roles claros en cada pareja.', next: 'cs6_n3a', points: 7 },
          { text: 'Mantener las actividades en línea pero crear un "plan B en papel" para cuando caiga el wifi.', next: 'cs6_n3b', points: 4 }
        ]
      },

      'cs6_n2c': {
        type: 'feedback_incorrect',
        text: 'Un mes después, el wifi sigue igual. La directora pregunta por los avances en tecnología móvil. Mario no tiene nada que mostrar. La oportunidad de innovar se está convirtiendo en presión institucional sin avance pedagógico real.',
        feedback: 'Esperar condiciones perfectas para implementar m-learning es una trampa común. Las condiciones perfectas rara vez llegan — especialmente en contextos educativos con recursos limitados. El m-learning exitoso en contextos como Quetzaltenango comienza con lo que ya existe: los dispositivos que los estudiantes ya tienen y las apps que ya conocen, como WhatsApp.',
        choices: [
          { text: 'Comenzar con lo disponible: hacer un diagnóstico de qué apps tienen instaladas los estudiantes y diseñar desde ahí.', next: 'cs6_n3a', points: 6 },
          { text: 'Pedir a los padres de familia que compren datos para que los estudiantes participen en actividades en línea.', next: 'cs6_n3c', points: 1 }
        ]
      },

      'cs6_n3a': {
        type: 'scenario',
        text: 'Mario lanza la primera actividad: los estudiantes fotografían tres objetos del patio del colegio y escriben una descripción de 50 palabras para cada uno usando la app de notas de su teléfono. Los estudiantes con tablets del laboratorio hacen lo mismo. La actividad fluye — hasta que Mario recibe un mensaje de WhatsApp de la presidenta del comité de padres de familia: "Maestro, ¿para qué están usando el celular en clase? Mi hijo me dice que la maestra del año pasado los castigaba por tenerlo."',
        context: 'Mario sabe que tiene que responder pronto. La reunión de padres es en tres días y el tema del celular en clase puede convertirse en conflicto si no se maneja bien.',
        choices: [
          { text: 'Convocar una reunión informativa con padres y mostrarles ejemplos concretos de lo que los estudiantes han producido con el celular como herramienta pedagógica.', next: 'cs6_n4a', points: 10 },
          { text: 'Enviar una circular explicando la nueva política de uso del celular en clase.', next: 'cs6_n4b', points: 6 },
          { text: 'Suspender el uso del celular hasta que la situación con los padres se calme.', next: 'cs6_n4c', points: 1 }
        ]
      },

      'cs6_n3b': {
        type: 'scenario',
        text: 'Mario decide usar WhatsApp como plataforma de aprendizaje: crea un grupo de clase y les pide a los estudiantes que envíen audios de dos minutos respondiendo preguntas de comprensión lectora. La actividad es un éxito parcial: 20 estudiantes participan activamente. Los 15 restantes no tienen datos o tienen teléfonos sin WhatsApp.',
        context: 'Mario se da cuenta de que WhatsApp, siendo la app más usada en Guatemala (incluso en zonas con poco acceso a datos), puede ser su puente pedagógico — pero necesita diseñar para quienes no tienen acceso.',
        choices: [
          { text: 'Crear versiones duales de cada actividad: digital (WhatsApp/audio) para quienes tienen acceso, y análoga (papel/oral en clase) para quienes no.', next: 'cs6_n4a', points: 8 },
          { text: 'Pedir a los 15 estudiantes que busquen wifi en casa de un familiar o en un cyber para participar.', next: 'cs6_n4c', points: 2 }
        ]
      },

      'cs6_n3c': {
        type: 'scenario',
        text: 'Algunos padres compraron datos. Otros no pudieron. La actividad funcionó para un tercio del grupo. Los demás se quedaron fuera o improvisaron con wifi de un vecino. Mario siente que creó una actividad que amplió la brecha en vez de reducirla.',
        context: 'Un estudiante le dice en privado: "Profe, mi mamá se enojó porque le pedimos datos y no teníamos para la recarga. ¿Puedo hacer otra cosa?"',
        choices: [
          { text: 'Reconocer el error y rediseñar para que ninguna actividad requiera datos comprados por los estudiantes.', next: 'cs6_n4a', points: 6 },
          { text: 'Mantener el modelo pero decirle al estudiante que puede "ponerse al día" cuando tenga datos.', next: 'cs6_n4c', points: 0 }
        ]
      },

      'cs6_n4a': {
        type: 'scenario',
        text: 'La reunión de padres fue bien. Mario mostró los textos descriptivos que los estudiantes escribieron, los audios de comprensión lectora y un video corto que grabó durante la actividad en el patio. Un padre — que trabaja en una empresa de telecomunicaciones en Xela — ofreció gestionar una donación de 10 tarjetas SIM con datos para los estudiantes sin acceso. Ahora Mario enfrenta un nuevo reto: ¿cómo establece normas de uso del celular que sean claras, justas y pedagógicamente coherentes?',
        context: 'Sin normas claras, el celular puede convertirse en distractor. Con normas demasiado rígidas, pierde su potencial como herramienta. Mario quiere un término medio.',
        choices: [
          { text: 'Co-construir las normas con los estudiantes: hacer una sesión donde ellos propongan reglas de uso y las justifiquen pedagógicamente.', next: 'cs6_n5a', points: 10 },
          { text: 'Establecer un reglamento firmado por el docente y los estudiantes con consecuencias claras.', next: 'cs6_n5b', points: 6 },
          { text: 'No establecer normas formales y manejar cada situación en el momento.', next: 'cs6_n5c', points: 2 }
        ]
      },

      'cs6_n4b': {
        type: 'scenario',
        text: 'La circular fue leída por pocos padres. En la reunión mensual, el tema del celular surgió de todas formas y Mario tuvo que explicarlo sin la preparación adecuada. Algunos padres expresaron preocupación, otros apoyaron. El ambiente quedó incómodo.',
        context: 'La directora le dice a Mario en privado: "La próxima vez que hagamos algo así, avisame antes para que yo también pueda respaldarte."',
        choices: [
          { text: 'Aprender de la situación: documentar mejor las actividades y presentarlas de forma proactiva.', next: 'cs6_n5a', points: 6 },
          { text: 'Reducir las actividades con celular para evitar más conflictos con padres.', next: 'cs6_n5c', points: 2 }
        ]
      },

      'cs6_n4c': {
        type: 'scenario',
        text: 'Sin comunicación clara con padres ni normas establecidas, las actividades con celular generan tensión constante. Un día, un estudiante usa el celular para jugar durante una explicación. Mario lo regaña. El estudiante responde que "el profe dice que el celular es para aprender y él estaba aprendiendo con un juego".',
        context: 'Mario se da cuenta de que sin un marco compartido, el celular es terreno de negociación permanente — y él siempre pierde.',
        choices: [
          { text: 'Usar ese momento como punto de quiebre para co-construir normas con el grupo.', next: 'cs6_n5a', points: 6 },
          { text: 'Prohibir el celular durante el resto del bimestre como consecuencia del incidente.', next: 'cs6_n5c', points: 1 }
        ]
      },

      'cs6_n5a': {
        type: 'scenario',
        text: 'Las normas co-construidas funcionaron sorprendentemente bien. Los estudiantes propusieron reglas más estrictas de las que Mario hubiera impuesto — y las cumplieron mejor, porque eran propias. Ahora Mario diseña su proyecto final de m-learning: una "Guía de Quetzaltenango en Audio" donde cada estudiante graba un segmento sobre un lugar, tradición o personaje de la ciudad, usando solo el micrófono del celular y notas escritas a mano.',
        context: 'El proyecto no requiere internet. Los audios se guardan en los dispositivos y se comparten en clase vía bluetooth o cables de audio. Es 100% offline. Pero Mario enfrenta la pregunta final: ¿cómo evalúa el aprendizaje en un proyecto así?',
        choices: [
          { text: 'Evaluar el proceso completo: planificación, grabación, edición oral y presentación — con retroalimentación entre pares.', next: 'cs6_nFIN_a', points: 10 },
          { text: 'Evaluar solo el producto final: la calidad del audio y la precisión de la información.', next: 'cs6_nFIN_b', points: 5 }
        ]
      },

      'cs6_n5b': {
        type: 'scenario',
        text: 'El reglamento fue firmado y publicado. Funcionó bien durante las primeras semanas. Luego empezó a volverse letra muerta — nadie lo recordaba, y Mario tampoco lo aplicaba consistentemente.',
        context: 'Mario reflexiona: "Las normas que yo hice para ellos duran poco. Las que hacemos juntos duran más."',
        choices: [
          { text: 'Revisar las normas con el grupo y co-construir una versión que ellos sientan propia.', next: 'cs6_nFIN_b', points: 6 },
          { text: 'Reforzar el reglamento original con más consecuencias para quienes no lo cumplan.', next: 'cs6_nFIN_c', points: 2 }
        ]
      },

      'cs6_n5c': {
        type: 'scenario',
        text: 'Sin normas claras y con tensión constante, el uso del celular en clase se convirtió en problema en vez de herramienta. Mario llega al final del bimestre con actividades incompletas, padres preocupados y estudiantes confundidos sobre cuándo sí y cuándo no pueden usarlo.',
        context: 'La directora le pide un informe sobre los "resultados del proyecto de m-learning". Mario no sabe bien qué escribir.',
        choices: [
          { text: 'Escribir un informe honesto: qué funcionó, qué no, y qué cambiaría — como docente reflexivo.', next: 'cs6_nFIN_b', points: 5 },
          { text: 'Escribir un informe positivo para evitar problemas y abandonar el m-learning silenciosamente.', next: 'cs6_nFIN_c', points: 0 }
        ]
      },

      'cs6_nFIN_a': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Mario: La Guía de Quetzaltenango que nadie esperaba',
        text: 'La "Guía de Quetzaltenango en Audio" se convirtió en el proyecto más memorable del año. Un estudiante grabó a su abuelo contando la historia del mercado La Democracia. Otro documentó la preparación del caldo de res de su mamá como "patrimonio culinario de Xela". Una estudiante entrevistó a una tejedora del barrio de La Democracia sobre los significados de los colores en el tejido. El celular dejó de ser el dispositivo que había que controlar y se convirtió en la herramienta que dio voz a las historias que nadie más estaba documentando.',
        badge: 'Docente Mobile',
        xpReward: 50
      },

      'cs6_nFIN_b': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 70,
        title: 'Mario: El puente digital en construcción',
        text: 'Mario no resolvió todos los problemas de equidad digital, no diseñó el modelo perfecto de m-learning y no convenció a todos los padres. Pero movió la aguja: sus estudiantes usaron el celular para aprender algo real, documentaron su entorno y descubrieron que la tecnología que tienen en el bolsillo puede ser una herramienta pedagógica. En Quetzaltenango, con wifi inestable y datos escasos, eso ya es un logro significativo.',
        badge: 'Docente Móvil en Progreso',
        xpReward: 25
      },

      'cs6_nFIN_c': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 40,
        title: 'Mario: La tecnología que asustó más que enseñó',
        text: 'El m-learning de Mario terminó siendo una fuente de conflicto en vez de aprendizaje. La brecha digital se amplió, los padres quedaron desconfiados, las normas no funcionaron y el celular fue visto como problema. Pero Mario sabe algo que no sabía al principio: el m-learning no es poner el celular en el aula — es diseñar pedagógicamente para lo que el dispositivo puede hacer en ese contexto específico. Esa comprensión, si Mario la convierte en acción el próximo año, puede cambiar todo.',
        badge: 'Docente ante el Umbral Digital',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 7: "Sofía y el Aula Invertida" — Flipped Classroom
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs7',
    title: 'Sofía y el Aula Invertida',
    course: 'Flipped Classroom',
    color: '#EF4444',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 10l5-4 5 4" transform="rotate(180 12 9)"/><path d="M7 10l5 4 5-4"/></svg>',
    duration: '20-25 min',
    description: 'Sofía quiere implementar el aula invertida en Escuintla, pero muchos estudiantes no tienen internet en casa y algunos no ven los videos. Acompáñala a diseñar un modelo flipped que funcione en contextos con conectividad limitada.',
    start: 'cs7_n1',
    nodes: {

      'cs7_n1': {
        type: 'scenario',
        text: 'Sofía es docente de Ciencias Naturales en el Instituto Nacional de Educación Básica de Escuintla. Acaba de conocer el modelo de aula invertida en una capacitación y está emocionada: grabar videos para que los estudiantes vean en casa y usar el tiempo de clase para profundizar. Tiene 38 estudiantes de segundo básico. Pero al hacer un sondeo rápido, descubre que solo 12 tienen internet en casa. Los otros 26 no tienen o tienen datos muy limitados en el celular familiar.',
        context: 'La capacitación asumía que todos los estudiantes tienen acceso a internet en casa. La realidad de Escuintla es diferente: muchas familias viven en colonias periféricas donde el internet fijo es caro y los datos móviles se comparten entre varios miembros de la familia.',
        choices: [
          { text: 'Grabar los videos de todas formas y pedirle a los estudiantes sin internet que busquen wifi en el cyber o en casa de un vecino.', next: 'cs7_n2a', points: 2 },
          { text: 'Diseñar una estrategia "sin internet" para distribuir el contenido: grabar los videos y copiarlos en USB o como archivos descargables, y también crear guías impresas como alternativa al video.', next: 'cs7_n2b', points: 10 },
          { text: 'Abandonar la idea del aula invertida porque no es viable sin internet — buscar otra metodología.', next: 'cs7_n2c', points: 1 }
        ]
      },

      'cs7_n2a': {
        type: 'feedback_incorrect',
        text: 'La solución "busca wifi donde puedas" transfiere la responsabilidad de la brecha digital al estudiante y a su familia. En Escuintla, un cyber cobra Q3-5 por hora — un costo real para familias con ingresos mínimos. Además, pedir que el estudiante dependa de un tercero (vecino, familiar) para acceder al material del colegio no es una estrategia pedagógica: es esperar que el problema se resuelva solo. Dos semanas después, la mitad del grupo llega sin haber visto los videos.',
        feedback: 'El flipped classroom falla cuando el "flipping" asume condiciones que no existen. La responsabilidad de diseñar para el contexto real es del docente, no del estudiante.',
        choices: [
          { text: 'Reconocer el problema y rediseñar: copiar los videos en USB y crear guías impresas para quienes no puedan ver el video.', next: 'cs7_n3a', points: 8 },
          { text: 'Continuar igual y simplemente repetir el contenido del video en clase para quienes no lo vieron.', next: 'cs7_n3b', points: 3 }
        ]
      },

      'cs7_n2b': {
        type: 'feedback_correct',
        text: 'Sofía adopta un enfoque "offline-first" para el flipped classroom. Graba sus videos en el celular (5-8 minutos) y los comparte de tres formas: en un USB rotativo que los estudiantes pueden llevar a casa de turno en turno, como archivo descargable en el grupo de WhatsApp de padres (donde muchos tienen datos), y como guía impresa resumida para quienes no puedan ver el video de ninguna forma. El modelo no es perfecto, pero incluye a todos.',
        feedback: 'El aula invertida exitosa en contextos de baja conectividad requiere "múltiples puertas de entrada" al contenido previo. El video es una puerta; la guía impresa es otra; el audio grabado puede ser una tercera. Lo que el modelo necesita es que el estudiante llegue a clase habiendo encontrado el concepto — no necesariamente a través del mismo medio.',
        choices: [
          { text: 'Diseñar la actividad presencial pensando en qué hacer con los estudiantes que sí vieron el video y los que llegaron solo con la guía impresa.', next: 'cs7_n3c', points: 10 },
          { text: 'Asumir que todos verán el video o la guía y diseñar la clase como si todos llegaran con el mismo nivel de preparación.', next: 'cs7_n3b', points: 4 }
        ]
      },

      'cs7_n2c': {
        type: 'feedback_incorrect',
        text: 'Descartar el aula invertida ante el primer obstáculo es abandonar antes de explorar las adaptaciones posibles. En Guatemala, muchos docentes han implementado versiones "analógicas" del flipped classroom: la tarea de casa es una lectura o un ejercicio guiado en papel, no necesariamente un video. El principio — que el primer contacto con el contenido ocurra antes de la clase — puede funcionar sin internet.',
        feedback: 'El flipped classroom es un principio pedagógico, no una tecnología específica. El principio puede adaptarse al contexto. Lo que requiere internet es UNA forma de implementarlo — no la única.',
        choices: [
          { text: 'Reconsiderar: diseñar un flipped classroom "analógico" donde la tarea previa es una guía de lectura o un ejercicio en papel.', next: 'cs7_n3a', points: 7 },
          { text: 'Buscar otra metodología completamente diferente y abandonar el flipped classroom.', next: 'cs7_n3b', points: 2 }
        ]
      },

      'cs7_n3a': {
        type: 'scenario',
        text: 'Sofía adopta el modelo "analógico + digital": una guía impresa de dos páginas que los estudiantes deben leer en casa, con preguntas de comprensión al final. Para los que quieran más, el video está disponible en USB. El primer ciclo arranca. Pero después de la primera semana, Sofía nota que muchos estudiantes no hicieron la tarea previa — ya sea el video o la guía. Llegan a clase sin haber encontrado el concepto.',
        context: 'El problema de la responsabilidad fuera del aula es uno de los mayores retos del flipped classroom: no todos los estudiantes completan las tareas previas, y si la clase presencial asume que sí lo hicieron, los que no hicieron la tarea quedan perdidos desde el inicio.',
        choices: [
          { text: 'Dedicar los primeros 10 minutos de clase a una actividad de "calentamiento" que le permite a Sofía saber quién trajo el concepto y quién no, sin humillar a nadie.', next: 'cs7_n4a', points: 10 },
          { text: 'Regañar al grupo por no haber hecho la tarea y repetir el contenido del video/guía de forma expositiva.', next: 'cs7_n4b', points: 2 },
          { text: 'Ignorar quién hizo y quién no hizo la tarea, y proceder con la actividad presencial como si todos estuvieran al mismo nivel.', next: 'cs7_n4c', points: 1 }
        ]
      },

      'cs7_n3b': {
        type: 'scenario',
        text: 'La clase presencial transcurre con muchos estudiantes perdidos: no vieron el video ni la guía, y la actividad presupone que ya encontraron el concepto. Sofía termina explicando el contenido en clase, convirtiendo el aula invertida en una clase tradicional con video de tarea. Los estudiantes que sí vieron el video están aburridos esperando. Los que no lo vieron, perdidos.',
        context: 'Sofía se da cuenta de que tiene dos grupos dentro de un mismo salón: los que llegaron preparados y los que no. Necesita una estrategia para manejar esta heterogeneidad.',
        choices: [
          { text: 'Usar la heterogeneidad como recurso: poner en cada grupo un estudiante que haya visto el video para que pueda explicar a los que no lo hicieron durante la actividad inicial.', next: 'cs7_n4a', points: 7 },
          { text: 'Volver al modelo tradicional — el aula invertida no funciona si los estudiantes no cooperan.', next: 'cs7_n4d', points: 1 }
        ]
      },

      'cs7_n3c': {
        type: 'scenario',
        text: 'Sofía diseña la clase presencial con tres momentos: 1) Una actividad de apertura que todos pueden hacer, hayan visto el video o no. 2) Una actividad central que aprovecha el conocimiento previo de quienes sí prepararon la tarea. 3) Un cierre donde todos consolidan el aprendizaje. En la primera clase con este diseño, algo inesperado ocurre: una estudiante que no tiene internet en casa — y solo leyó la guía impresa — hace la pregunta más profunda de todo el grupo.',
        context: 'La guía impresa, al requerir que la estudiante subrayara y anotara, la obligó a procesar el contenido de forma más activa que simplemente ver el video.',
        choices: [
          { text: 'Usar ese momento para validar frente al grupo que hay múltiples formas de prepararse, y que el formato no determina la calidad del aprendizaje.', next: 'cs7_n4e', points: 10 },
          { text: 'Tomar nota en privado pero no comentarlo — señalar que la estudiante sin internet hizo mejor tarea podría incomodar a los demás.', next: 'cs7_n4a', points: 6 }
        ]
      },

      'cs7_n4a': {
        type: 'scenario',
        text: 'La actividad de diagnóstico inicial funciona bien. Sofía usa una pregunta rápida en papel — anónima — al inicio de clase: "Escribe en una oración qué entendiste del tema de hoy. Si no leíste ni viste nada, escribe una pregunta que tengas sobre el tema." Con esto sabe en 5 minutos qué tiene el grupo. Pero ahora enfrenta la pregunta más difícil del flipped classroom: ¿cómo graba un buen video con un celular básico sin estudio, sin micrófono externo y sin edición?',
        context: 'Sofía tiene un celular de gama media, poca luz en su casa por las noches, y mucho ruido de fondo (tráfico, familia, televisión). Sus primeros videos suenan mal y se ve oscuro.',
        choices: [
          { text: 'Optimizar las condiciones básicas de grabación: grabar de día junto a una ventana, usar la cámara trasera, hablar cerca del micrófono, y hacer el video de máximo 7 minutos con un guion escrito antes.', next: 'cs7_n5a', points: 10 },
          { text: 'Buscar videos ya hechos en YouTube sobre los mismos temas y usarlos en lugar de grabar los propios.', next: 'cs7_n5b', points: 5 },
          { text: 'Grabar de todas formas aunque la calidad sea mala — el contenido importa más que la producción.', next: 'cs7_n5c', points: 3 }
        ]
      },

      'cs7_n4b': {
        type: 'scenario',
        text: 'El regaño genera silencio y defensividad. Los estudiantes que no hicieron la tarea se cierran; los que sí la hicieron se sienten invisibles. Sofía repite el contenido del video en 20 minutos de clase expositiva. Al final, apenas queda tiempo para la actividad presencial que era el propósito del modelo flipped. Sofía se da cuenta de que está haciendo doble trabajo: enseñando en casa (video) y enseñando en clase (explicación) sin aprovechar las ventajas de ninguno de los dos momentos.',
        context: 'El aula invertida requiere que la clase presencial sea cualitativamente diferente — más activa, más profunda, más colaborativa — no solo "más de lo mismo".',
        choices: [
          { text: 'Rediseñar el momento presencial para que funcione con el nivel de preparación real del grupo, no con el nivel ideal.', next: 'cs7_n5a', points: 7 },
          { text: 'Mantener la estructura actual y esperar que con el tiempo los estudiantes se acostumbren a hacer la tarea previa.', next: 'cs7_n5c', points: 2 }
        ]
      },

      'cs7_n4c': {
        type: 'scenario',
        text: 'La clase avanza con una brecha invisible pero real: unos estudiantes participan con el concepto claro, otros están perdidos desde el inicio y no lo dicen. Al terminar la unidad, las notas revelan la fractura: los que hicieron la tarea previa consistentemente tienen notas altas; los que no la hicieron, bajas. Pero Sofía no sabe si la diferencia se debe al aprendizaje o simplemente a quién tiene más acceso en casa.',
        context: 'La equidad en el flipped classroom requiere que el docente diagnostique activamente quién está llegando preparado y quién no — y por qué.',
        choices: [
          { text: 'Hacer un diagnóstico honesto: hablar individualmente con los estudiantes de notas bajas para entender si el problema es acceso, motivación o comprensión.', next: 'cs7_n5a', points: 6 },
          { text: 'Asumir que quien no hizo la tarea previa simplemente no quiso hacerla y calificar en consecuencia.', next: 'cs7_n5d', points: 0 }
        ]
      },

      'cs7_n4d': {
        type: 'scenario',
        text: 'Sofía abandona el flipped classroom y regresa al modelo tradicional. Los estudiantes no notan mucha diferencia. La directora le pregunta por los "resultados del experimento de aula invertida" en la siguiente reunión pedagógica. Sofía no tiene mucho que contar.',
        context: 'La directora le pregunta: "¿Qué aprendiste del proceso?" — y esa pregunta abre una conversación más interesante de lo esperado.',
        choices: [
          { text: 'Compartir honestamente lo que funcionó, lo que no, y qué haría diferente: el flipped classroom no falló — la implementación necesitaba más andamiaje.', next: 'cs7_n5a', points: 6 },
          { text: 'Decir que el modelo no es viable en este contexto y cerrar el tema.', next: 'cs7_n5d', points: 1 }
        ]
      },

      'cs7_n4e': {
        type: 'scenario',
        text: 'La validación de Sofía hacia la estudiante con guía impresa tiene un efecto multiplicador: varios estudiantes preguntan si pueden "entregar la guía en papel" en vez de ver el video. Sofía dice que sí — lo que importa es que lleguen con el concepto, no el formato. En las semanas siguientes, nota algo inesperado: los estudiantes que usan la guía impresa tienen mayor retención en las actividades presenciales, posiblemente porque leer activamente requiere más procesamiento que ver un video de forma pasiva.',
        context: 'Sofía está descubriendo algo importante sobre el diseño del aprendizaje previo en el flipped classroom.',
        choices: [
          { text: 'Rediseñar la guía impresa para que sea aún más activa: incluir un espacio para que el estudiante escriba UNA pregunta propia y UNA conexión con algo que ya sabe.', next: 'cs7_n5a', points: 10 },
          { text: 'Mantener la guía tal como está — ya funciona bien y no es necesario complicarla.', next: 'cs7_n5b', points: 5 }
        ]
      },

      'cs7_n5a': {
        type: 'scenario',
        text: 'El modelo de Sofía ha evolucionado: video de 7 minutos + guía impresa de 2 páginas + actividad presencial diseñada para lo que el video/guía no puede hacer (debate, experimento, resolución de casos). Los resultados son visibles. Pero llega el momento de la evaluación final de la unidad. Sofía quiere que la evaluación sea coherente con el modelo flipped: no un examen que mide solo memorización, sino algo que evidencie lo que pudieron hacer con el conocimiento que construyeron.',
        context: 'El sistema escolar exige una nota numérica. Sofía necesita un instrumento que sea auténtico pero que también sea reconocible por el sistema.',
        choices: [
          { text: 'Diseñar una "evaluación aplicada": los estudiantes resuelven un caso real de Escuintla usando los conceptos de la unidad, y son evaluados con una rúbrica que incluye criterios de proceso y de producto.', next: 'cs7_nFIN_a', points: 10 },
          { text: 'Usar un examen tradicional pero incluir preguntas de análisis y aplicación además de memorización.', next: 'cs7_nFIN_b', points: 6 }
        ]
      },

      'cs7_n5b': {
        type: 'scenario',
        text: 'Sofía usa videos de YouTube en español sobre los temas. Algunos son excelentes; otros tienen errores conceptuales o usan ejemplos de México o España que no conectan con la realidad guatemalteca. Un estudiante llega con una confusión que viene directamente de un dato incorrecto del video de YouTube que vio.',
        context: 'Sofía se da cuenta de que los videos de terceros tienen el riesgo de no estar alineados con el currículo local ni con el contexto cultural de sus estudiantes.',
        choices: [
          { text: 'Grabar sus propios videos cortos para los temas más críticos, y usar YouTube solo como recurso complementario para quien quiera profundizar.', next: 'cs7_nFIN_b', points: 7 },
          { text: 'Continuar usando YouTube y añadir al inicio de clase una revisión de "qué decía el video y qué ajustamos para Guatemala".', next: 'cs7_nFIN_b', points: 5 }
        ]
      },

      'cs7_n5c': {
        type: 'scenario',
        text: 'Los videos con mala calidad de audio generan un patrón preocupante: los estudiantes los abren, no pueden escuchar bien, y los cierran a los 2 minutos. Las estadísticas de visualización que Sofía pide a los estudiantes reportar muestran que el tiempo de visualización real es mucho menor que el que debería ser.',
        context: 'Un video que no se ve no cumple ninguna función pedagógica, sin importar cuán rico sea el contenido.',
        choices: [
          { text: 'Invertir una tarde en aprender las técnicas básicas de grabación y re-grabar los videos más importantes con mejor calidad.', next: 'cs7_nFIN_b', points: 6 },
          { text: 'Reemplazar los videos con podcasts de audio grabados con auriculares como micrófono — mejor calidad de sonido con lo que ya tiene.', next: 'cs7_nFIN_b', points: 7 }
        ]
      },

      'cs7_n5d': {
        type: 'scenario',
        text: 'Al final del bimestre, los resultados del flipped classroom son desiguales. Los estudiantes con mejores condiciones en casa progresaron; los de condiciones más difíciles quedaron más rezagados que antes. El modelo amplificó la brecha en lugar de reducirla. Sofía siente que algo salió mal pero no puede identificar exactamente qué.',
        context: 'El flipped classroom puede amplificar las desigualdades existentes si no se diseña específicamente para contrarrestarlas.',
        choices: [
          { text: 'Hacer una reflexión honesta: identificar exactamente en qué momento del diseño la inequidad se amplificó y qué cambiaría en la próxima implementación.', next: 'cs7_nFIN_c', points: 5 },
          { text: 'Concluir que el flipped classroom no es apropiado para este contexto y no intentarlo de nuevo.', next: 'cs7_nFIN_c', points: 1 }
        ]
      },

      'cs7_nFIN_a': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Sofía: El aula invertida que sí incluyó a todos',
        text: 'El modelo de Sofía demostró que el flipped classroom no necesita internet universal ni producción profesional de video. Necesita un docente que entienda el principio (el primer contacto con el concepto ocurre antes de la clase) y que diseñe múltiples caminos para llegar a ese primer contacto. En Escuintla, con USB, guías impresas y videos de 7 minutos grabados junto a la ventana de su cocina, Sofía logró que sus estudiantes llegaran a clase listos para pensar — no solo para escuchar. La actividad presencial se convirtió en el mejor momento de la semana.',
        badge: 'Docente Flipped Contextualizada',
        xpReward: 50
      },

      'cs7_nFIN_b': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 70,
        title: 'Sofía: El flip que se fue ajustando',
        text: 'Sofía no implementó el flipped classroom perfecto — pero sí implementó uno real. Algunos momentos funcionaron mejor que otros; algunas decisiones de diseño tuvieron consecuencias no previstas. Pero el movimiento fue hacia adelante: sus estudiantes tuvieron al menos algunos momentos en que llegaron con un concepto propio y lo usaron en clase para hacer algo más que copiar. En pedagogía, eso ya es un cambio significativo.',
        badge: 'Docente Flipped en Proceso',
        xpReward: 25
      },

      'cs7_nFIN_c': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 40,
        title: 'Sofía: El primer intento con lecciones reales',
        text: 'El flipped classroom de Sofía no funcionó como esperaba. Pero el fracaso tiene información valiosa: revela que el modelo amplifica las condiciones previas — si las condiciones en casa son desiguales y el diseño no lo contempla, el modelo profundiza la brecha. La próxima vez, Sofía sabe que el primer paso no es grabar un video — es diseñar para la realidad de sus 38 estudiantes, no para el promedio imaginario de la capacitación.',
        badge: 'Docente ante el Umbral Flipped',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 8: "Pedro y los Videos" — Aprendizaje Basado en Videos
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs8',
    title: 'Pedro y los Videos',
    course: 'Aprendizaje Basado en Videos',
    color: '#10B981',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>',
    duration: '20-25 min',
    description: 'Pedro usa YouTube con sus estudiantes, pero hay distracciones, los videos son en inglés o muy largos, y algunos no tienen datos. Acompáñalo a diseñar un modelo de aprendizaje basado en videos que sea pedagógicamente sólido y equitativo.',
    start: 'cs8_n1',
    nodes: {

      'cs8_n1': {
        type: 'scenario',
        text: 'Pedro es docente de Ciencias en el Colegio Evangélico de Chiquimula. Sus 30 estudiantes de tercero básico tienen celular (la mayoría) o acceso al celular familiar. Pedro quiere usar videos de YouTube para enriquecer sus clases de biología. La semana pasada intentó proyectar un video sobre el sistema circulatorio: el projector tardó 10 minutos en conectarse, el video era en inglés con subtítulos en español, duraba 22 minutos, y para el minuto 8 ya había tres estudiantes mirando otros videos en sus propios celulares. El experimento fue un caos.',
        context: 'Pedro sabe que el video PUEDE ser una herramienta poderosa. El problema no es el medio — es la forma en que lo está usando. Necesita replantear su enfoque completo.',
        choices: [
          { text: 'Buscar mejores videos: más cortos, en español, con animaciones. El problema fue la selección del video, no la estrategia.', next: 'cs8_n2a', points: 5 },
          { text: 'Diseñar una "guía de visualización" para que los estudiantes no vean el video de forma pasiva sino con preguntas específicas que deben responder mientras lo ven.', next: 'cs8_n2b', points: 10 },
          { text: 'Abandonar el uso de videos en clase — si los estudiantes no pueden verlos sin distraerse, no es el momento.', next: 'cs8_n2c', points: 1 }
        ]
      },

      'cs8_n2a': {
        type: 'feedback_partial',
        text: 'Mejor selección de videos es un paso necesario pero no suficiente. Los videos más cortos y en español reducen algunas barreras, pero no resuelven el problema pedagógico de fondo: los estudiantes están viendo el video de forma pasiva, sin propósito claro, sin estructura para procesar lo que ven. Un video mejor seleccionado sin una guía de visualización sigue siendo entretenimiento, no aprendizaje.',
        feedback: 'La selección del video es el primer paso; la estructura pedagógica alrededor del video es el segundo y más importante. Un video de 5 minutos con una guía de visualización activa produce más aprendizaje que un documental de 45 minutos sin estructura.',
        choices: [
          { text: 'Combinar la mejor selección con una guía de visualización activa.', next: 'cs8_n3a', points: 9 },
          { text: 'Continuar solo con la mejor selección de videos y observar si la calidad del video resuelve el problema de atención.', next: 'cs8_n3b', points: 4 }
        ]
      },

      'cs8_n2b': {
        type: 'feedback_correct',
        text: 'Pedro diseña su primera "guía de visualización": una hoja con 5 preguntas que los estudiantes responden MIENTRAS ven el video, haciendo pausa cada vez que encuentran la respuesta. Las preguntas no son de memorización — son de observación y conexión: "¿Qué pasa con el oxígeno cuando llega al corazón?" y "¿Qué conecta esto con lo que estudiamos la semana pasada?". La segunda vez que intenta el video, el ambiente es completamente diferente.',
        feedback: 'La guía de visualización transforma el video de espectáculo a herramienta cognitiva. Al pedirle al estudiante que busque respuestas específicas, la atención tiene dirección. Al incluir preguntas de conexión, el video se integra al aprendizaje previo en lugar de flotar como isla de información.',
        choices: [
          { text: 'Diseñar actividades para ANTES y DESPUÉS del video, además de la guía durante la visualización.', next: 'cs8_n3c', points: 10 },
          { text: 'Mantener solo la guía de visualización — ya es una mejora significativa.', next: 'cs8_n3a', points: 6 }
        ]
      },

      'cs8_n2c': {
        type: 'feedback_incorrect',
        text: 'Abandonar el video como herramienta por la dificultad de la primera implementación es como descartar el pizarrón porque la primera vez que se usó un estudiante se durmió. El problema no era el video — era la falta de estructura pedagógica alrededor de él. Los videos son una de las herramientas más poderosas disponibles para un docente de ciencias en contextos con recursos limitados: permiten mostrar procesos invisibles (el interior de una célula, el movimiento de las placas tectónicas, el latido del corazón) que ningún libro de texto puede mostrar de la misma forma.',
        feedback: 'La herramienta no es el problema. La estructura pedagógica alrededor de la herramienta es lo que determina si produce aprendizaje o distracción.',
        choices: [
          { text: 'Intentar de nuevo con una guía de visualización que le dé estructura al momento del video.', next: 'cs8_n3a', points: 7 },
          { text: 'Buscar otra herramienta completamente diferente y no usar videos.', next: 'cs8_n3b', points: 1 }
        ]
      },

      'cs8_n3a': {
        type: 'scenario',
        text: 'Pedro ha mejorado su selección de videos y usa una guía de visualización básica. El ambiente en clase es mejor pero sigue habiendo un problema: 8 estudiantes que no tienen datos en su celular no pueden ver los videos que Pedro a veces asigna para ver en casa. Y los videos que proyecta en clase dependen del wifi del colegio, que es irregular. Pedro necesita una estrategia para que el aprendizaje basado en videos sea equitativo.',
        context: 'En Chiquimula, como en muchas áreas de Guatemala, el acceso a datos es desigual y costoso. Un plan de datos puede costar entre Q50-Q100 al mes — significativo para muchas familias.',
        choices: [
          { text: 'Descargar los videos con anticipación y proyectarlos desde el celular o computadora sin depender del wifi, y para la tarea en casa, compartir el video descargado vía WhatsApp o USB.', next: 'cs8_n4a', points: 10 },
          { text: 'Pedir a los estudiantes sin datos que vean los videos en el cyber del municipio fuera del horario escolar.', next: 'cs8_n4b', points: 2 },
          { text: 'Crear versiones en texto de los videos para los estudiantes sin acceso — un resumen de lo que muestra el video.', next: 'cs8_n4c', points: 6 }
        ]
      },

      'cs8_n3b': {
        type: 'scenario',
        text: 'Sin guía de visualización, los estudiantes ven los videos mejorados con más interés inicial — la calidad ayuda — pero el aprendizaje sigue siendo superficial. En el siguiente examen, las preguntas relacionadas con los contenidos de los videos muestran un rendimiento bajo. Los estudiantes pueden describir imágenes del video pero no explican procesos.',
        context: 'Ver un video sin estructura produce memoria visual pero no comprensión conceptual. Los estudiantes "recuerdan" el video pero no pueden usar el conocimiento.',
        choices: [
          { text: 'Añadir una actividad post-video de 5 minutos: los estudiantes escriben "3 cosas que aprendieron y 1 pregunta que aún tienen".', next: 'cs8_n4a', points: 7 },
          { text: 'Continuar mejorando la selección de videos y esperar que el aprendizaje mejore con el tiempo.', next: 'cs8_n4d', points: 2 }
        ]
      },

      'cs8_n3c': {
        type: 'scenario',
        text: 'Pedro diseña el ciclo completo: ANTES del video, los estudiantes activan conocimiento previo con una pregunta de 3 minutos. DURANTE, usan la guía de visualización. DESPUÉS, hacen una actividad de consolidación (un organizador gráfico, un resumen de 5 líneas, o una discusión en parejas). La primera vez que usa el ciclo completo, Pedro queda sorprendido: el tiempo de clase se le va rápido — y se da cuenta de que ha estado proyectando videos muy largos para el tiempo disponible.',
        context: 'Un video de 15 minutos con ciclo completo antes-durante-después requiere 30-35 minutos de clase total. Pedro necesita recalibrar la duración de los videos.',
        choices: [
          { text: 'Adoptar la regla "máximo 7 minutos por video" para que el ciclo completo quepa en una clase de 45 minutos con tiempo para más.', next: 'cs8_n4a', points: 10 },
          { text: 'Dividir el ciclo en dos clases: un día el video, al siguiente día la actividad post-video.', next: 'cs8_n4c', points: 6 }
        ]
      },

      'cs8_n4a': {
        type: 'scenario',
        text: 'El modelo de Pedro está funcionando. Los videos son cortos (máximo 7 minutos), en español, descargados con anticipación para no depender del wifi, y compartidos por WhatsApp o USB para quien los necesite en casa. El ciclo antes-durante-después es consistente. Pero ahora Pedro quiere dar el siguiente paso: grabar sus propios videos. Tiene contenidos que no encuentra en YouTube en español o que necesitan contexto guatemalteco (por ejemplo, un video sobre la biodiversidad del Bosque Nuboso de Chiquimula, no de Costa Rica).',
        context: 'Pedro tiene un celular con buena cámara pero nunca ha grabado un video educativo. No sabe por dónde empezar.',
        choices: [
          { text: 'Empezar con lo más simple: grabar un video de "experimento en casa" donde Pedro demuestra un concepto con materiales cotidianos — sin edición, sin título, solo él y el experimento.', next: 'cs8_n5a', points: 10 },
          { text: 'Esperar a tener mejores herramientas (micrófono, luz, trípode) antes de grabar — un video mal producido hace más daño que no tener video.', next: 'cs8_n5b', points: 4 },
          { text: 'Pedir a los estudiantes que graben los videos ellos mismos como actividad de aprendizaje.', next: 'cs8_n5c', points: 8 }
        ]
      },

      'cs8_n4b': {
        type: 'scenario',
        text: 'Pedir a los estudiantes que vayan al cyber genera las mismas inequidades de siempre: los que pueden pagar van, los que no pueden no van. Después de dos semanas, Pedro nota que los 8 estudiantes sin datos tienen consistentemente menor participación en las actividades basadas en videos. La brecha de aprendizaje se amplía.',
        context: 'La equidad no se logra diciendo "ve a buscarlo donde puedas" — se logra diseñando para que el acceso no dependa de los recursos del estudiante.',
        choices: [
          { text: 'Cambiar el modelo: descargar todos los videos con anticipación y distribuirlos por USB o WhatsApp sin costo para los estudiantes.', next: 'cs8_n4a', points: 8 },
          { text: 'Hablar con la dirección para que el colegio pague el acceso a internet de los estudiantes sin datos.', next: 'cs8_n4c', points: 4 }
        ]
      },

      'cs8_n4c': {
        type: 'scenario',
        text: 'Las versiones en texto ayudan a los estudiantes sin acceso a seguir el contenido, pero Pedro nota algo: los estudiantes con el texto tienen diferentes conceptos de los estudiantes con el video, porque el video muestra procesos dinámicos que el texto solo puede describir. En una discusión sobre el sistema circulatorio, los estudiantes que vieron el video hablan de "ver la sangre moverse"; los que leyeron el texto hablan de "leer que la sangre se mueve". La experiencia es cualitativamente diferente.',
        context: 'Pedro enfrenta la tensión entre equidad de acceso y equidad de experiencia.',
        choices: [
          { text: 'Priorizar que TODOS vean el video, aunque sea en clase: proyectarlo dos veces si es necesario, o crear una "sesión de recuperación" en recreo para quienes no pudieron verlo en casa.', next: 'cs8_n5a', points: 8 },
          { text: 'Aceptar que habrá diferencias en la experiencia y compensar con actividades en clase que nivelan.', next: 'cs8_n5b', points: 5 }
        ]
      },

      'cs8_n4d': {
        type: 'scenario',
        text: 'Los resultados no mejoran significativamente. Pedro sigue invirtiendo tiempo en buscar buenos videos, pero sin estructura pedagógica, el aprendizaje sigue siendo superficial. Al final del bimestre, los estudiantes "conocen" muchos videos pero no pueden aplicar los conceptos que mostraban.',
        context: 'Pedro siente que está trabajando mucho para resultados mediocres. Tiene razón en que algo falta — pero no sabe qué.',
        choices: [
          { text: 'Buscar formación específica en aprendizaje basado en videos: aprender sobre el ciclo antes-durante-después y la guía de visualización.', next: 'cs8_n5a', points: 7 },
          { text: 'Reducir el uso de videos y regresar a clases más tradicionales.', next: 'cs8_n5d', points: 1 }
        ]
      },

      'cs8_n5a': {
        type: 'scenario',
        text: 'Pedro graba su primer video: en el patio del colegio, con el celular en la mano, explica el proceso de fotosíntesis usando una planta de frijol. El video dura 6 minutos, tiene ruido de fondo de pájaros, y la imagen se mueve un poco. Pero el contenido es claro, la planta es reconocible para los estudiantes de Chiquimula, y Pedro habla con la naturalidad que tiene en clase. Cuando lo proyecta, algo notable ocurre: los estudiantes prestan más atención que con cualquier video de YouTube.',
        context: 'El video propio, aunque técnicamente imperfecto, tiene algo que los videos de YouTube no tienen: el docente familiar, el entorno reconocible, el lenguaje adaptado al grupo.',
        choices: [
          { text: 'Continuar grabando videos propios para los temas más importantes, y usar YouTube para complementar con animaciones o procesos que el celular no puede capturar.', next: 'cs8_nFIN_a', points: 10 },
          { text: 'Mejorar la calidad técnica antes de seguir grabando: comprar un trípode y un micrófono de solapa básico.', next: 'cs8_nFIN_b', points: 7 }
        ]
      },

      'cs8_n5b': {
        type: 'scenario',
        text: 'Esperando las herramientas perfectas, Pedro no graba ningún video propio durante el bimestre. Los videos de YouTube siguen siendo el único recurso visual. Al final del año, reflexiona sobre los momentos en que el aprendizaje fue más rico y recuerda que fueron las pocas veces que él mismo demostró algo en el pizarrón o en el patio — y que si hubiera grabado esos momentos, habrían sido videos perfectos sin necesitar ningún equipo adicional.',
        context: 'La perfección técnica es el enemigo del video educativo bueno y oportuno.',
        choices: [
          { text: 'Comenzar el próximo año grabando los momentos de clase ya existentes — las demostraciones, los experimentos, las explicaciones en el pizarrón.', next: 'cs8_nFIN_b', points: 7 },
          { text: 'Aceptar que el video propio no es para todos los docentes y continuar con YouTube.', next: 'cs8_nFIN_c', points: 3 }
        ]
      },

      'cs8_n5c': {
        type: 'scenario',
        text: 'Los estudiantes graban sus propios videos explicando conceptos de biología. El resultado es sorprendente: para grabar un video explicando el sistema circulatorio, los estudiantes tienen que entenderlo profundamente — no pueden leer un papel, tienen que explicarlo con sus propias palabras. La actividad genera más aprendizaje que ver cualquier video de YouTube. Pero algunos grupos tienen dificultades técnicas y Pedro no sabe cómo evaluarlos.',
        context: 'El "video como producto de aprendizaje" es una de las estrategias más potentes del aprendizaje basado en videos — más que ver videos, crear videos.',
        choices: [
          { text: 'Diseñar una rúbrica que evalúe el contenido científico (¿es correcto?) y la comunicación (¿se entiende?) — no la calidad técnica de la imagen o el sonido.', next: 'cs8_nFIN_a', points: 10 },
          { text: 'Evaluar los videos principalmente por su calidad técnica porque eso fue lo que más trabajo requirió a los estudiantes.', next: 'cs8_nFIN_c', points: 2 }
        ]
      },

      'cs8_n5d': {
        type: 'scenario',
        text: 'Pedro regresa al modelo tradicional. Los estudiantes lo notan y algunos preguntan si van a usar más videos. Pedro dice que "por ahora no". Al final del año, en la evaluación de satisfacción del colegio, varios estudiantes mencionan que les hubiera gustado "usar más tecnología en Ciencias".',
        context: 'Los estudiantes querían los videos — el problema nunca fue la herramienta sino la falta de estructura pedagógica alrededor de ella.',
        choices: [
          { text: 'Comenzar el próximo año con la estructura antes-durante-después desde el primer video — aplicar lo aprendido.', next: 'cs8_nFIN_c', points: 5 },
          { text: 'Mantener el modelo tradicional — es más predecible y seguro.', next: 'cs8_nFIN_c', points: 1 }
        ]
      },

      'cs8_nFIN_a': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Pedro: El docente que convirtió el video en aprendizaje real',
        text: 'Pedro descubrió que el aprendizaje basado en videos no es poner YouTube en el proyector — es diseñar un ciclo pedagógico donde el video es el detonador, no el destino. Sus estudiantes de Chiquimula terminaron el año habiendo visto docenas de videos, pero sobre todo habiendo creado sus propios: videos sobre la biodiversidad del bosque local, sobre los ríos de la región, sobre los cultivos de la familia. En el proceso de crear esos videos, aprendieron biología de una forma que ningún examen hubiera podido evaluar completamente.',
        badge: 'Docente de Video',
        xpReward: 50
      },

      'cs8_nFIN_b': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 70,
        title: 'Pedro: El video como herramienta, en construcción',
        text: 'Pedro mejoró significativamente su uso del video como herramienta pedagógica. No todo funcionó perfectamente, y todavía hay momentos donde el video se convierte en espectáculo en lugar de aprendizaje. Pero sus estudiantes llegaron al final del año con más exposición a contenido visual bien estructurado que cualquier generación anterior de su escuela — y con la experiencia de al menos algunos momentos donde el video fue el inicio de una conversación, no el final de una clase.',
        badge: 'Docente Video en Progreso',
        xpReward: 25
      },

      'cs8_nFIN_c': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 40,
        title: 'Pedro: El potencial del video sin desarrollar',
        text: 'Pedro tiene acceso a una de las bibliotecas visuales más ricas de la historia — YouTube en español tiene millones de videos educativos. Pero sin estructura pedagógica, ese acceso produce distracción más que aprendizaje. La buena noticia: Pedro sabe que algo falta. El ciclo antes-durante-después, la guía de visualización, el video como producto — todas estas herramientas están disponibles y no requieren tecnología adicional. Solo requieren que Pedro las conozca y las pruebe.',
        badge: 'Docente ante el Umbral del Video',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 9: "Carmen y las Cápsulas" — Micro-learning
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs9',
    title: 'Carmen y las Cápsulas',
    course: 'Micro-learning',
    color: '#6366F1',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M11.5 8l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5L8 13l2.5-1 1-2.5z" fill="currentColor" stroke="none"/><path d="M17 3l.5 1.5 1.5.5-1.5.5L17 7l-.5-1.5L15 5l1.5-.5L17 3z" fill="currentColor" stroke="none"/></svg>',
    duration: '20-25 min',
    description: 'Carmen quiere enviar micro-cápsulas de aprendizaje por WhatsApp a sus estudiantes de bachillerato en San Marcos. Pero algunos padres se oponen y no todos tienen datos suficientes. Acompáñala a diseñar un modelo de micro-learning equitativo y efectivo.',
    start: 'cs9_n1',
    nodes: {

      'cs9_n1': {
        type: 'scenario',
        text: 'Carmen es docente de Matemáticas en el Instituto de Bachillerato por Madurez de San Marcos. Sus 25 estudiantes son adultos jóvenes (18-28 años) que trabajan de día y estudian de noche. Muchos olvidan los conceptos entre una clase y otra porque pasan 3-4 días sin practicar. Carmen quiere enviar micro-cápsulas de aprendizaje por WhatsApp: un audio de 2 minutos, una imagen explicativa o un ejercicio rápido, entre lunes y viernes por la tarde.',
        context: 'San Marcos está en el altiplano occidental. La conexión a internet es variable: algunos estudiantes tienen datos móviles, otros dependen del wifi del trabajo o de familiares. Además, Carmen ya tiene un grupo de WhatsApp de padres de familia del instituto — pero algunos padres han expresado preocupación por el uso de WhatsApp con fines escolares.',
        choices: [
          { text: 'Comenzar a enviar cápsulas sin consultar a nadie — los estudiantes son adultos y pueden decidir solos.', next: 'cs9_n2a', points: 3 },
          { text: 'Hacer un diagnóstico primero: consultar a los estudiantes sobre acceso a datos, horarios disponibles y preferencia de formato antes de diseñar las cápsulas.', next: 'cs9_n2b', points: 10 },
          { text: 'Esperar a que la institución tenga una política clara sobre el uso de WhatsApp educativo antes de empezar.', next: 'cs9_n2c', points: 2 }
        ]
      },

      'cs9_n2a': {
        type: 'feedback_incorrect',
        text: 'Comenzar sin diagnóstico genera problemas predecibles: dos semanas después, Carmen descubre que 6 estudiantes no tienen datos en su celular personal y dependen del wifi del trabajo — que no está disponible por las tardes cuando ella envía las cápsulas. Otros 3 estudiantes no ven el grupo de WhatsApp porque trabajan en lugares sin señal. Las cápsulas están llegando al 60% del grupo.',
        feedback: 'El micro-learning por WhatsApp en contextos rurales o de baja conectividad requiere diagnóstico previo. Asumir que todos tienen acceso perpetúa la desigualdad digital. El diagnóstico es el primer paso del diseño, no un trámite opcional.',
        choices: [
          { text: 'Hacer el diagnóstico ahora, aunque sea tarde: encuesta rápida en clase sobre acceso y horarios disponibles.', next: 'cs9_n3a', points: 8 },
          { text: 'Continuar enviando y asumir que los que no reciben se pondrán al día en clase.', next: 'cs9_n3b', points: 2 }
        ]
      },

      'cs9_n2b': {
        type: 'feedback_correct',
        text: 'El diagnóstico revela información valiosa: 19 de 25 estudiantes tienen datos móviles propios, pero solo en la noche (después de las 7 pm) porque durante el día trabajan en zonas sin señal o no pueden revisar el celular. 6 estudiantes dependen del wifi del hogar, disponible solo en la tarde-noche. Todos prefieren audios cortos (máximos 2 minutos) sobre imágenes con texto, porque las escuchan mientras hacen otras cosas. Nadie quiere ejercicios que requieran responder de vuelta — están muy ocupados.',
        feedback: 'El diagnóstico de Carmen revela tres cosas clave: el mejor horario de envío (después de las 7 pm), el formato preferido (audio, no texto), y el nivel de interactividad esperado (bajo — escuchar, no responder). Con estos datos, puede diseñar cápsulas que realmente lleguen y sean usadas.',
        choices: [
          { text: 'Diseñar las cápsulas según el diagnóstico: audios de máximo 2 minutos, enviados después de las 7 pm, con un ejercicio opcional (no obligatorio) al final.', next: 'cs9_n3c', points: 10 },
          { text: 'Diseñar las cápsulas con lo que Carmen considera pedagógicamente ideal, aunque no coincida completamente con las preferencias del diagnóstico.', next: 'cs9_n3a', points: 5 }
        ]
      },

      'cs9_n2c': {
        type: 'feedback_incorrect',
        text: 'Esperar una política institucional en un instituto de bachillerato por madurez de San Marcos puede significar esperar meses o años. Mientras tanto, el problema real — los estudiantes olvidan los conceptos entre clases — sigue sin solución. La autonomía docente incluye la capacidad de experimentar con herramientas nuevas sin esperar permiso institucional para todo, especialmente cuando la herramienta (WhatsApp) ya es de uso cotidiano para todos.',
        feedback: 'La innovación pedagógica responsable no espera aprobación institucional para cada herramienta. Lo que requiere es criterio pedagógico, diagnóstico de contexto y disposición a ajustar. La política institucional puede venir después de que haya evidencia de que la práctica funciona.',
        choices: [
          { text: 'Comenzar con un piloto pequeño: enviar cápsulas por dos semanas, documentar los resultados y presentarlos a la dirección.', next: 'cs9_n3a', points: 7 },
          { text: 'Continuar esperando la política institucional.', next: 'cs9_n3b', points: 0 }
        ]
      },

      'cs9_n3a': {
        type: 'scenario',
        text: 'Carmen empieza a enviar cápsulas. Los estudiantes responden bien en general — pero a las dos semanas, recibe un mensaje en el grupo de WhatsApp de padres: "Profe Carmen, con todo respeto, ¿por qué está mandando cosas por WhatsApp? Eso es para chatear, no para estudiar. Además mi hijo ya pasa mucho tiempo en el celular." El mensaje genera que otros dos padres expresen preocupación similar.',
        context: 'Los estudiantes son adultos, pero algunos viven con sus padres que son también parte del contexto institucional. La resistencia de los padres puede generar tensión en casa y desincentivar a los estudiantes de participar.',
        choices: [
          { text: 'Responder en el grupo con una explicación clara del propósito pedagógico y datos concretos: "En las últimas dos semanas, el 80% de los estudiantes que escucharon las cápsulas sacaron mejor nota en el quiz."', next: 'cs9_n4a', points: 10 },
          { text: 'Suspender las cápsulas hasta hablar personalmente con cada padre que protestó.', next: 'cs9_n4b', points: 5 },
          { text: 'Ignorar el mensaje — los estudiantes son adultos y la opinión de los padres no debería afectar las decisiones pedagógicas.', next: 'cs9_n4c', points: 2 }
        ]
      },

      'cs9_n3b': {
        type: 'scenario',
        text: 'Sin estructura clara, las cápsulas llegan irregularmente — a veces todos los días, a veces no hay nada por una semana. Los estudiantes no saben cuándo esperarlas ni cómo usarlas. Al final del mes, Carmen nota que solo 8 de 25 estudiantes están viendo las cápsulas regularmente. Los demás las ignoran o no las están recibiendo.',
        context: 'El micro-learning requiere consistencia y predictibilidad para crear el hábito de aprendizaje en pequeños momentos. Sin horario y frecuencia establecidos, las cápsulas son ruido digital, no herramienta de aprendizaje.',
        choices: [
          { text: 'Establecer un calendario fijo: lunes, miércoles y viernes a las 7:30 pm — y avisarlo al grupo para que los estudiantes lo esperen.', next: 'cs9_n4a', points: 9 },
          { text: 'Continuar enviando cuando Carmen tenga tiempo y esperar que los estudiantes se adapten.', next: 'cs9_n4d', points: 1 }
        ]
      },

      'cs9_n3c': {
        type: 'scenario',
        text: 'El modelo funciona bien desde el inicio. Los audios de 2 minutos llegan a las 7:30 pm los lunes, miércoles y viernes. Los estudiantes los escuchan durante la cena, en el camino al instituto, o mientras se preparan para clase. Pero después de tres semanas, Carmen se pregunta: ¿cómo sabe si los estudiantes están aprendiendo? No quiere hacer un examen de las cápsulas — eso destruiría su carácter informal. Pero tampoco quiere que sean solo entretenimiento.',
        context: 'Medir el aprendizaje en el micro-learning es uno de los retos más difíciles del modelo. Los métodos de evaluación tradicionales no son compatibles con la informalidad y brevedad que hace al micro-learning efectivo.',
        choices: [
          { text: 'Usar la clase presencial como momento de evaluación informal: al inicio de cada clase, hacer una pregunta oral sobre el tema de la cápsula de la semana — no como examen, sino como conversación.', next: 'cs9_n4e', points: 10 },
          { text: 'Pedir a los estudiantes que respondan una pregunta por WhatsApp después de cada cápsula para confirmar que la entendieron.', next: 'cs9_n4a', points: 6 }
        ]
      },

      'cs9_n4a': {
        type: 'scenario',
        text: 'La estrategia de Carmen funciona y el modelo de cápsulas se estabiliza. Pero después de seis semanas, nota un problema diferente: no todos los mensajes están llegando. En el grupo de WhatsApp, algunos estudiantes tienen el grupo silenciado o han cambiado de número sin avisar. Carmen envía una cápsula importante sobre ecuaciones cuadráticas y al día siguiente descubre que 7 estudiantes no la recibieron o no la vieron.',
        context: 'La dependencia de un solo canal de comunicación es una vulnerabilidad del modelo. WhatsApp es conveniente pero no garantiza que el mensaje llegue ni que se vea.',
        choices: [
          { text: 'Diversificar el canal: además de WhatsApp, compartir las cápsulas como archivo en un grupo de Telegram (como respaldo) y mencionar el tema al inicio de cada clase para que quienes no vieron la cápsula sepan de qué se trató.', next: 'cs9_n5a', points: 10 },
          { text: 'Pedir a los estudiantes que confirmen con un emoji cuando reciben cada cápsula para saber quién la está viendo.', next: 'cs9_n5b', points: 6 }
        ]
      },

      'cs9_n4b': {
        type: 'scenario',
        text: 'Carmen suspende las cápsulas por una semana para hablar con los padres. Cuando regresa con el modelo, nota que la semana de pausa rompió el hábito de algunos estudiantes — tres que participaban activamente ya no ven las cápsulas con regularidad. La consistencia del micro-learning es más frágil de lo que parecía.',
        context: 'El hábito de consumir micro-contenido educativo es delicado: se construye con semanas de consistencia y se rompe con días de ausencia.',
        choices: [
          { text: 'Reiniciar el modelo con una comunicación explícita a los estudiantes: "Retomamos las cápsulas — lunes, miércoles y viernes a las 7:30 pm. Esta semana empezamos con los temas que más preguntas generaron."', next: 'cs9_n5a', points: 8 },
          { text: 'Continuar enviando cápsulas sin mencionar la pausa — como si nada hubiera cambiado.', next: 'cs9_n5b', points: 3 }
        ]
      },

      'cs9_n4c': {
        type: 'scenario',
        text: 'Ignorar la preocupación de los padres tiene consecuencias: uno de ellos habla directamente con el director del instituto, quien llama a Carmen para preguntarle sobre el uso de WhatsApp con fines educativos. La conversación es incómoda porque Carmen no tiene documentación de los resultados del modelo ni una explicación pedagógica preparada.',
        context: 'La innovación pedagógica necesita ser comunicable y documentable. Un docente que no puede explicar por qué hace lo que hace pierde la oportunidad de convertir su práctica en argumento.',
        choices: [
          { text: 'Preparar una presentación breve para el director: objetivo del modelo, resultados observados, plan de ajuste ante las preocupaciones de los padres.', next: 'cs9_n5a', points: 8 },
          { text: 'Comprometerse con el director a suspender las cápsulas de forma permanente para evitar más conflictos.', next: 'cs9_n5d', points: 0 }
        ]
      },

      'cs9_n4d': {
        type: 'scenario',
        text: 'El modelo irregular colapsa: después de un mes, Carmen ha enviado apenas 8 cápsulas en lugar de las 12 planificadas. Los estudiantes dejaron de esperar las cápsulas porque no llegaban con consistencia. En clase, los estudiantes siguen llegando con los mismos olvidos de siempre entre una sesión y otra. El problema original no se resolvió.',
        context: 'El micro-learning irregular es peor que no tener micro-learning: genera expectativa sin cumplirla, lo que puede generar desconfianza en el modelo.',
        choices: [
          { text: 'Reconocer el error y reiniciar con un compromiso de consistencia: establecer un horario fijo y preparar las cápsulas con una semana de anticipación para garantizar la regularidad.', next: 'cs9_n5a', points: 7 },
          { text: 'Abandonar el modelo — si no hay tiempo para hacerlo bien, mejor no hacerlo.', next: 'cs9_n5d', points: 1 }
        ]
      },

      'cs9_n4e': {
        type: 'scenario',
        text: 'La pregunta oral al inicio de clase funciona mejor de lo esperado. No solo permite a Carmen saber quiénes vieron la cápsula — permite que los estudiantes que la vieron enseñen a los que no. Un estudiante que escuchó la cápsula sobre factorización en el camino al trabajo la explica con sus propias palabras al inicio de clase, y la explicación es más clara que la de la cápsula misma. Carmen se da cuenta de que el micro-learning puede ser el detonador de la clase, no solo un suplemento.',
        context: 'Las cápsulas de Carmen están cumpliendo una función que no anticipó: crear un lenguaje común y un punto de partida para las clases presenciales.',
        choices: [
          { text: 'Diseñar explícitamente la conexión entre cápsula y clase: cada cápsula termina con "mañana en clase vamos a usar esto para..." de modo que los estudiantes lleguen con la conexión ya hecha.', next: 'cs9_n5a', points: 10 },
          { text: 'Mantener las cápsulas como suplemento independiente — la conexión con la clase puede hacerse intuitivamente sin diseñarla.', next: 'cs9_n5b', points: 5 }
        ]
      },

      'cs9_n5a': {
        type: 'scenario',
        text: 'El modelo de Carmen ha madurado: cápsulas de audio de 2 minutos, lunes-miércoles-viernes a las 7:30 pm, con conexión explícita a la clase siguiente, y evaluación informal al inicio de cada sesión presencial. Los resultados en las pruebas bimensuales muestran una mejora notable: los estudiantes que escuchan las cápsulas regularmente tienen un 23% más de retención en los temas cubiertos. Carmen quiere documentar el modelo para compartirlo con sus colegas del instituto.',
        context: 'Carmen tiene práctica pedagógica valiosa que puede beneficiar a otros docentes. La documentación es el paso que transforma la experiencia individual en conocimiento compartido.',
        choices: [
          { text: 'Crear una "guía de micro-learning para docentes de San Marcos": un documento de una página con los principios básicos, el horario recomendado, los formatos que funcionan, y los errores que evitar.', next: 'cs9_nFIN_a', points: 10 },
          { text: 'Compartir el modelo verbalmente con sus colegas en la próxima reunión pedagógica — sin documento formal.', next: 'cs9_nFIN_b', points: 6 }
        ]
      },

      'cs9_n5b': {
        type: 'scenario',
        text: 'El modelo funciona para la mayoría pero sigue teniendo puntos ciegos: los estudiantes sin datos consistentes siguen quedando fuera de algunas cápsulas, y no hay mecanismo para saber exactamente quién está aprendiendo y quién no. Al final del bimestre, Carmen tiene la sensación de que el modelo podría ser más equitativo y más medible.',
        context: 'El micro-learning bien diseñado incluye mecanismos de seguimiento y alternativas para quienes tienen menor acceso.',
        choices: [
          { text: 'Agregar dos mejoras: compartir un resumen escrito de cada cápsula en clase (para quienes no la recibieron) y añadir una pregunta de salida al final de clase sobre el tema de las cápsulas de la semana.', next: 'cs9_nFIN_b', points: 7 },
          { text: 'Mantener el modelo actual — funciona para la mayoría y mejorar más requeriría demasiado tiempo extra.', next: 'cs9_nFIN_b', points: 4 }
        ]
      },

      'cs9_n5c': {
        type: 'scenario',
        text: 'Las cápsulas de Carmen se estabilizaron pero sin la consistencia necesaria para crear hábito. Algunos estudiantes las esperan; otros las ignoran. Al final del bimestre, es difícil saber si el modelo tuvo impacto porque no hay datos comparables.',
        context: 'Sin consistencia y sin medición, es imposible saber si el micro-learning está funcionando o simplemente existiendo.',
        choices: [
          { text: 'Reiniciar con consistencia y con una medición simple: comparar las notas del próximo bimestre con las de este.', next: 'cs9_nFIN_b', points: 6 },
          { text: 'Aceptar que el micro-learning es difícil de medir y continuar sin datos claros.', next: 'cs9_nFIN_c', points: 2 }
        ]
      },

      'cs9_n5d': {
        type: 'scenario',
        text: 'Carmen abandona el modelo de micro-learning. Los estudiantes siguen llegando a clase con los mismos olvidos de siempre. Nada cambió — excepto que ahora Carmen sabe que intentó algo y no funcionó, pero no sabe bien por qué.',
        context: 'Sin diagnóstico del fracaso, la experiencia no produce aprendizaje transferible.',
        choices: [
          { text: 'Hacer una retrospectiva honesta: ¿qué funcionó en las primeras semanas?, ¿qué rompió el modelo?, ¿qué haría diferente?', next: 'cs9_nFIN_c', points: 5 },
          { text: 'Aceptar que el micro-learning no es para este contexto y buscar otra estrategia.', next: 'cs9_nFIN_c', points: 2 }
        ]
      },

      'cs9_nFIN_a': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Carmen: Las cápsulas que transformaron el hábito de aprender',
        text: 'Carmen demostró que el micro-learning en WhatsApp puede funcionar en San Marcos, en el altiplano occidental de Guatemala, con estudiantes que trabajan de día, tienen datos limitados y aprenden de noche. No fue fácil: hubo resistencia de padres, problemas de conectividad, semanas donde nada llegó a tiempo. Pero Carmen documentó lo que aprendió y lo compartió. El próximo año, tres colegas del instituto adoptaron el modelo. Lo que empezó como un experimento personal se convirtió en práctica institucional.',
        badge: 'Docente Micro-learning',
        xpReward: 50
      },

      'cs9_nFIN_b': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 70,
        title: 'Carmen: La cápsula que llegó a la mitad',
        text: 'El modelo de Carmen funcionó para muchos de sus estudiantes, pero quedaron puntos sin resolver: la equidad de acceso, la medición del impacto, la consistencia en momentos de presión. Sin embargo, algo cambió: sus estudiantes adultos de bachillerato por madurez en San Marcos tuvieron, por primera vez, un contacto con el aprendizaje entre una clase y otra. Eso, en un modelo de educación acelerada donde el tiempo entre sesiones puede hacer olvidar semanas de contenido, es más valioso de lo que los números pueden mostrar.',
        badge: 'Docente Micro en Proceso',
        xpReward: 25
      },

      'cs9_nFIN_c': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 40,
        title: 'Carmen: El experimento que necesita un segundo intento',
        text: 'El micro-learning de Carmen no tuvo el impacto que esperaba. Pero la experiencia contiene información pedagógica valiosa: reveló las condiciones de conectividad reales de sus estudiantes, la resistencia institucional a las herramientas informales, y la dificultad de crear hábitos de aprendizaje en adultos con vidas muy ocupadas. Si Carmen puede convertir esas revelaciones en principios de diseño para el próximo intento, el fracaso se habrá convertido en el paso más importante del camino.',
        badge: 'Docente ante el Umbral del Micro',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 10: "El profesor y el asistente invisible" — Docente y la IA
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs10',
    title: 'El profesor y el asistente invisible',
    course: 'Docente y la IA',
    color: '#10B981',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><circle cx="12" cy="12" r="1.8"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/></svg>',
    duration: '15-20 min',
    description: 'Diego, docente rural, descubre el chat de IA de la plataforma la noche antes de un examen. Acompáñalo a decidir cómo usar esta herramienta nueva sin perder su criterio profesional.',
    start: 'cs10_n1',
    nodes: {

      'cs10_n1': {
        type: 'scenario',
        text: 'Son las 9 de la noche. Diego enseña quinto grado en una escuela rural de Sololá y mañana debe entregar un examen de Ciencias Naturales que aún no ha preparado. Está exhausto — hoy tuvo reunión de padres, corrigió 30 cuadernos y todavía debe cocinar la cena. La semana pasada, un colega le mostró el chat de IA integrado en esta misma plataforma de formación docente.',
        context: 'Diego nunca ha usado IA para preparar material de clase. Tiene el chat abierto en su teléfono, y el cursor parpadeando, esperando su primera instrucción.',
        choices: [
          {
            text: 'Pedirle a la IA un banco de 15 preguntas sobre el tema, con la intención de revisar cada una antes de usarlas.',
            next: 'cs10_n2a',
            isCorrect: true
          },
          {
            text: 'Pedirle a la IA el examen completo y usarlo tal cual, sin revisarlo — ya es tarde y necesita dormir.',
            next: 'cs10_n2b',
            isCorrect: false
          },
          {
            text: 'Cerrar el chat por desconfianza y quedarse escribiendo el examen a mano hasta la medianoche.',
            next: 'cs10_n2c',
            isCorrect: false
          }
        ]
      },

      'cs10_n2a': {
        type: 'feedback_correct',
        text: 'Buena decisión inicial. Diego trata a la IA como lo que es: un asistente que redacta un primer borrador rápido, no como una autoridad que decide por él. Pedir un banco de preguntas —en vez del examen "terminado"— deja espacio natural para la revisión que viene después.',
        tip: 'Principio clave de esta ruta: la IA acelera el borrador, el docente conserva el criterio final. Diego está a punto de comprobar por qué ese criterio importa.',
        next: 'cs10_n3a',
        xp: 10
      },
      'cs10_n2b': {
        type: 'feedback_wrong',
        text: 'Usar el examen completo sin ninguna revisión es el riesgo más grande de este curso: la IA puede "alucinar" — inventar datos falsos con total seguridad — y nada en el proceso de Diego detectaría ese error antes de que llegue a sus 30 estudiantes.',
        tip: 'Recuerda: fluidez no es lo mismo que exactitud. Un texto bien escrito puede estar objetivamente equivocado.',
        next: 'cs10_n3b',
        xp: 0
      },
      'cs10_n2c': {
        type: 'feedback_wrong',
        text: 'Descartar la IA por completo no es "más seguro" — es simplemente no aprovechar una herramienta que, usada con criterio, le habría devuelto horas de sueño a Diego. Además, quedarse hasta la medianoche tiene un costo real: llegará a clase agotado.',
        tip: 'El miedo y la sobreconfianza son los dos extremos que más perjudican el buen uso de la IA. Ninguno de los dos protege realmente al docente ni a sus estudiantes.',
        next: 'cs10_n3c',
        xp: 0
      },

      // ── Rama A: revisó el banco de preguntas ──
      'cs10_n3a': {
        type: 'scenario',
        text: 'Diego revisa las 15 preguntas generadas. La mayoría están bien, pero una dice: "El Volcán de Fuego, en Guatemala, es un volcán inactivo desde 1970." Diego sabe que eso es falso — el Volcán de Fuego es uno de los más activos de Centroamérica y ha tenido erupciones recientes.',
        context: 'Son las 9:40pm. Diego está cansado y tentado a dejarlo pasar — es "solo una pregunta" de 15.',
        choices: [
          {
            text: 'Corregir el dato antes de imprimir, y terminar de revisar las 14 preguntas restantes con el mismo cuidado.',
            next: 'cs10_outcome_success',
            isCorrect: true
          },
          {
            text: 'Dejarlo así — es solo una pregunta, probablemente nadie lo note.',
            next: 'cs10_outcome_partial',
            isCorrect: false
          },
          {
            text: 'Perder la confianza en todo el banco de preguntas y reescribir el examen completo desde cero, perdiendo el tiempo que había ganado.',
            next: 'cs10_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      // ── Rama B: usó el examen sin revisar ──
      'cs10_n3b': {
        type: 'scenario',
        text: 'Al día siguiente, en plena clase, una estudiante levanta la mano: "Profe, esta pregunta tiene dos respuestas correctas — no sé cuál marcar." Diego revisa en el momento y se da cuenta, frente a todo el grupo, de que nunca revisó el examen antes de imprimirlo.',
        context: 'Veintinueve estudiantes más están esperando cómo responde su docente en este momento incómodo.',
        choices: [
          {
            text: 'Reconocer el error con calma, anular esa pregunta para todos, y seguir adelante con el examen.',
            next: 'cs10_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Ponerse a la defensiva y decirle a la estudiante que está equivocada, aunque Diego mismo no esté seguro.',
            next: 'cs10_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Ignorar el comentario y decirle que responda "lo que le parezca mejor", sin aclarar nada al resto del grupo.',
            next: 'cs10_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      // ── Rama C: rechazó la IA, se quedó hasta tarde ──
      'cs10_n3c': {
        type: 'scenario',
        text: 'Diego llega a clase agotado tras dormir menos de cuatro horas. A media explicación sobre el ciclo del agua, confunde "evaporación" con "condensación" dos veces seguidas. Un estudiante, confundido, pregunta: "Profe, ¿cuál es cuál?"',
        context: 'Diego siente el cansancio pesándole detrás de los ojos. Sabe que no está explicando con su claridad habitual.',
        choices: [
          {
            text: 'Reconocer en voz alta que está muy cansado hoy, tomar un respiro, y retomar el concepto con calma usando un ejemplo simple.',
            next: 'cs10_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Seguir adelante fingiendo que todo está bien, aunque sabe que está cometiendo errores.',
            next: 'cs10_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Cancelar el resto de la clase de Ciencias y pasar a otra materia, evitando el tema por completo.',
            next: 'cs10_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      // ── OUTCOMES ─────────────────────────────────────────────────────────

      'cs10_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Diego: El criterio que hace la diferencia',
        text: 'Diego usó la IA exactamente como esta ruta lo propone: como un asistente que acelera el primer borrador, nunca como un sustituto de su propio juicio profesional. Detectar y corregir el dato falso sobre el Volcán de Fuego —en vez de dejarlo pasar por cansancio— es la diferencia entre un docente que delega su criterio y uno que lo conserva mientras aprovecha la velocidad de la herramienta. Sus estudiantes presentaron un examen correcto, y Diego durmió más esa noche que si hubiera escrito todo a mano.',
        badge: 'Docente y la IA con Criterio',
        xpReward: 50
      },
      'cs10_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 65,
        title: 'Diego: El aprendizaje llegó tarde, pero llegó',
        text: 'Diego cometió un error real en el camino, pero lo importante fue cómo respondió: con honestidad frente a sus estudiantes en vez de defensividad. Esa reacción —reconocer el error, corregirlo con calma, seguir adelante— es en sí misma una lección socioemocional valiosa que sus estudiantes observaron de cerca. La próxima vez, Diego sabe que la revisión no es un paso opcional: es la parte del proceso que sostiene la confianza de su aula.',
        badge: 'Docente en Aprendizaje con IA',
        xpReward: 25
      },
      'cs10_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 30,
        title: 'Diego: La lección más cara',
        text: 'Ya sea por confiar demasiado en la IA sin revisar, por rechazarla por completo y agotarse, o por no reconocer un error frente a su clase, Diego terminó esta experiencia con una lección incómoda pero valiosa: la herramienta no es el problema ni la solución por sí sola — es cómo se usa, con cuánto criterio, y con cuánta honestidad se enfrenta lo que sale mal. Ese aprendizaje, aunque doloroso, es exactamente el punto de partida que necesita para la próxima vez.',
        badge: 'Docente ante el Umbral de la IA',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 11: "La clase de Kevin" — Clima y Convivencia Escolar
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs11',
    title: 'La clase de Kevin',
    course: 'Clima y Convivencia Escolar',
    color: '#0891B2',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    duration: '20-25 min',
    description: 'Kevin, un estudiante de sexto grado, explota en plena clase y empuja a un compañero. Acompaña a la maestra Julia a decidir cómo responder en el momento, y qué hacer después del incidente.',
    start: 'cs11_n1',
    nodes: {

      'cs11_n1': {
        type: 'scenario',
        text: 'Julia enseña sexto grado en una escuela urbana de Escuintla. Kevin, uno de sus estudiantes, lleva toda la mañana tenso: llegó tarde, no trajo materiales, y ahora un compañero se burla de él por eso. De pronto, Kevin se levanta, grita "¡ya cállate!" y empuja al compañero, tirando su silla al piso. Toda el aula se queda en silencio, mirando a Julia.',
        context: 'Julia sabe, por conversaciones anteriores, que la mamá de Kevin viajó a trabajar a otro departamento hace tres semanas y él quedó al cuidado de su abuela.',
        choices: [
          {
            text: 'Respirar, bajar el tono de voz, y acercarse con calma a Kevin antes de decir nada.',
            next: 'cs11_n2a',
            isCorrect: true
          },
          {
            text: 'Levantar la voz de inmediato: "¡Kevin, eso no se hace! ¡Discúlpate ahora mismo frente a todos!"',
            next: 'cs11_n2b',
            isCorrect: false
          },
          {
            text: 'Ignorar el incidente y seguir la clase como si nada, para no "darle más atención" a la conducta.',
            next: 'cs11_n2c',
            isCorrect: false
          }
        ]
      },

      'cs11_n2a': {
        type: 'feedback_correct',
        text: 'Excelente primer movimiento. Cuando un estudiante escala, el sistema nervioso del adulto también se activa — el impulso es responder con más volumen y tensión. Pero dos personas alteradas se alimentan mutuamente. Al regular su propia respuesta primero, Julia se convierte en la calma que Kevin necesita para empezar a bajar de intensidad: esto se llama co-regulación.',
        tip: 'La primera herramienta de manejo de conducta nunca es sobre el estudiante — es la capacidad del docente de responder en vez de reaccionar.',
        next: 'cs11_n3a',
        xp: 10
      },
      'cs11_n2b': {
        type: 'feedback_wrong',
        text: 'Responder con el mismo tono elevado que Kevin —y exigir una disculpa pública inmediata— casi siempre escala la situación en vez de calmarla. Un estudiante ya desregulado no puede "razonar" en ese momento, y exigirle una disculpa frente a toda la clase agrega vergüenza pública a una situación que ya está fuera de control.',
        tip: 'El espectáculo público activa la necesidad de "salvar la cara" — lo que era manejable se puede convertir en una batalla de orgullo frente a testigos.',
        next: 'cs11_n3b',
        xp: 0
      },
      'cs11_n2c': {
        type: 'feedback_wrong',
        text: 'Ignorar una conducta que involucró empujar a otro estudiante no es lo mismo que "no darle atención" — es dejar sin respuesta una agresión física real, lo cual deja al compañero afectado sin protección visible, y no le enseña a Kevin ningún límite claro sobre lo que acaba de suceder.',
        tip: 'Ignorar (extinción) funciona para conductas menores que buscan atención — no para conductas que ponen en riesgo la seguridad de alguien más.',
        next: 'cs11_n3c',
        xp: 0
      },

      // ── Rama A: co-regulación correcta ──
      'cs11_n3a': {
        type: 'scenario',
        text: 'Julia se acerca a Kevin en voz baja: "Estoy aquí, no hay prisa, cuando estés listo hablamos." Kevin, todavía tenso, cruza los brazos y no responde. El compañero empujado está en el piso, algo asustado, y el resto de la clase sigue observando en silencio.',
        context: 'Julia tiene unos segundos para decidir el siguiente paso, con Kevin aún alterado y la clase esperando alguna dirección.',
        choices: [
          {
            text: 'Ofrecer a Kevin dos opciones: sentarse un momento en el rincón de calma, o quedarse en su lugar respirando — su elección, dentro de ese límite.',
            next: 'cs11_outcome_success',
            isCorrect: true
          },
          {
            text: 'Exigir que Kevin se siente inmediatamente sin darle ninguna opción, para "no perder autoridad" frente al grupo.',
            next: 'cs11_outcome_partial',
            isCorrect: false
          },
          {
            text: 'Dejar a Kevin de pie sin ninguna indicación mientras Julia atiende al otro estudiante, sin volver a él en varios minutos.',
            next: 'cs11_outcome_partial',
            isCorrect: false
          }
        ]
      },

      // ── Rama B: subió el tono ──
      'cs11_n3b': {
        type: 'scenario',
        text: 'Ante la exigencia de disculpa pública, Kevin grita "¡no fue mi culpa, él empezó!" y golpea su propio pupitre. La situación, en vez de calmarse, escaló. Julia tiene que decidir cómo continuar frente a una clase ahora visiblemente nerviosa.',
        context: 'El compañero empujado sigue en el piso. Algunos estudiantes ya sacaron su teléfono, posiblemente para grabar.',
        choices: [
          {
            text: 'Bajar el tono de inmediato, reconociendo que subir la voz no ayudó, y ofrecer a Kevin un momento para calmarse antes de seguir hablando.',
            next: 'cs11_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Insistir en el mismo tono, repitiendo la exigencia de disculpa hasta que Kevin obedezca.',
            next: 'cs11_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Enviar a Kevin a dirección de inmediato sin ninguna conversación previa, como forma de terminar la confrontación rápido.',
            next: 'cs11_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      // ── Rama C: ignoró el incidente ──
      'cs11_n3c': {
        type: 'scenario',
        text: 'Diez minutos después, el compañero empujado le dice en voz baja a Julia que le duele el brazo por la caída. Julia se da cuenta de que ignorar el incidente dejó una situación sin resolver — y ahora hay, además, una posible lesión que nadie atendió a tiempo.',
        context: 'Los padres del estudiante empujado probablemente preguntarán qué pasó cuando su hijo llegue a casa.',
        choices: [
          {
            text: 'Atender de inmediato al estudiante golpeado, y por separado, buscar un momento con Kevin para entender qué pasó antes de que Julia lo viera.',
            next: 'cs11_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Restar importancia al dolor del estudiante, diciendo que seguramente no es nada grave.',
            next: 'cs11_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Culpar públicamente a Kevin por el dolor del compañero sin haber verificado la situación con ninguno de los dos primero.',
            next: 'cs11_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      // ── OUTCOMES ─────────────────────────────────────────────────────────

      'cs11_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Julia: El límite que sostiene y no humilla',
        text: 'Julia aplicó, en secuencia, tres herramientas centrales del manejo de conducta: reguló su propia calma antes de responder, ofreció opciones limitadas en vez de una orden absoluta, y evitó el espectáculo público. Kevin eligió el rincón de calma, se sentó unos minutos, y más tarde —ya tranquilo— pudo contarle a Julia, en privado, que había tenido una mañana muy difícil en casa. Esa conversación abrió la puerta a entender la causa real detrás de la conducta, no solo su síntoma visible.',
        badge: 'Gestión de Aula con Calma y Límites',
        xpReward: 50
      },
      'cs11_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 60,
        title: 'Julia: La corrección a mitad de camino',
        text: 'El primer movimiento de Julia no fue el ideal, pero supo corregir el rumbo antes de que la situación empeorara más — bajando el tono, atendiendo lo que se había dejado sin resolver, o buscando una conversación privada con Kevin después del hecho. Ese ajuste, aunque tardío, evitó que un mal comienzo se convirtiera en un conflicto mayor, y es una habilidad tan real como acertar desde el primer momento.',
        badge: 'Gestión de Aula en Ajuste',
        xpReward: 25
      },
      'cs11_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 25,
        title: 'Julia: La conversación pendiente',
        text: 'Ya sea por escalar el tono, por dejar sin atención una lesión real, o por culpar sin verificar los hechos primero, esta situación con Kevin terminó sin resolverse bien — ni para él, ni para su compañero, ni para el clima general del aula. La buena noticia es que el manejo de conducta es una habilidad que se practica: la próxima vez que ocurra algo similar, Julia tiene ahora un mapa más claro de qué evitar y por dónde empezar.',
        badge: 'Gestión de Aula en Camino',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 12: "El aula de los tres niveles" — IA e Inclusión Educativa
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs12',
    title: 'El aula de los tres niveles',
    course: 'IA e Inclusión Educativa',
    color: '#06B6D4',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 7h14M4 12l3-4 3 4M14 12l3-4 3 4"/></svg>',
    duration: '15-20 min',
    description: 'Rosa tiene 32 estudiantes con niveles de lectura muy distintos en la misma aula. Acompáñala a decidir cómo usar IA para diferenciar una actividad sin perder tiempo que no tiene.',
    start: 'cs12_n1',
    nodes: {

      'cs12_n1': {
        type: 'scenario',
        text: 'Rosa enseña cuarto grado en un instituto de Cobán con 32 estudiantes. En su aula hay de todo: Andrea lee con fluidez tres grados por encima de su nivel; Manuel apenas descifra palabras simples; la mayoría está en un punto intermedio. Rosa quiere que los 32 trabajen el mismo texto sobre el ciclo del agua, pero sabe que un solo nivel de dificultad dejará a unos aburridos y a otros perdidos.',
        context: 'Rosa tiene 20 minutos antes de que empiece la clase. Recuerda el curso de IA e Inclusión que tomó hace poco.',
        choices: [
          {
            text: 'Pedirle a la IA tres versiones del mismo texto —apoyo, estándar y reto— a partir de un solo texto base, y revisarlas antes de imprimir.',
            next: 'cs12_n2a',
            isCorrect: true
          },
          {
            text: 'Usar un único texto de nivel medio para todos, como siempre, porque diferenciar toma demasiado tiempo.',
            next: 'cs12_n2b',
            isCorrect: false
          },
          {
            text: 'Pedirle a la IA una sola versión "fácil" para todo el grupo, para asegurarse de que nadie se quede atrás.',
            next: 'cs12_n2c',
            isCorrect: false
          }
        ]
      },

      'cs12_n2a': {
        type: 'feedback_correct',
        text: 'Excelente decisión. Rosa está usando la IA exactamente para lo que más rinde en un aula diversa: generar en minutos algo que a mano le habría tomado toda la tarde. Al partir de UN texto base y pedir tres niveles, mantiene el mismo tema y objetivo de aprendizaje para todo el grupo — solo cambia el nivel de acceso.',
        tip: 'Diferenciar no significa enseñar cosas distintas: significa ofrecer distintos caminos hacia el mismo destino de aprendizaje.',
        next: 'cs12_n3a',
        xp: 10
      },
      'cs12_n2b': {
        type: 'feedback_wrong',
        text: 'Usar un solo nivel para los 32 estudiantes es la opción "más rápida" en el momento, pero tiene un costo real: Manuel probablemente no entenderá el texto, y Andrea probablemente terminará en cinco minutos y se aburrirá el resto de la clase. La diferenciación no es un lujo pedagógico — es lo que hace que el aprendizaje llegue a todos.',
        tip: 'Antes del curso de IA e Inclusión, diferenciar exigía horas de trabajo manual. Ahora, generar tres versiones toma minutos — la barrera de tiempo ya no es una excusa válida.',
        next: 'cs12_n3b',
        xp: 0
      },
      'cs12_n2c': {
        type: 'feedback_wrong',
        text: 'Simplificar el texto para todos protege a Manuel, pero deja a Andrea y a buena parte del grupo intermedio sin ningún reto real. La inclusión no significa nivelar hacia abajo — significa que cada estudiante reciba el nivel de desafío que le corresponde, no el más bajo del salón.',
        tip: 'Diferenciar hacia arriba es tan importante como diferenciar hacia abajo. Un aula "seguritariamente fácil" para todos no es inclusiva, solo es uniforme.',
        next: 'cs12_n3c',
        xp: 0
      },

      'cs12_n3a': {
        type: 'scenario',
        text: 'Rosa revisa las tres versiones. La de "apoyo" para Manuel está bien, pero todavía tiene una palabra técnica —"evaporación"— sin explicar, algo que sabe que él no reconocerá.',
        context: 'Quedan diez minutos antes de que toque el timbre.',
        choices: [
          {
            text: 'Volver a pedirle a la IA que simplifique esa palabra específica con una explicación de una línea, y luego imprimir las tres versiones.',
            next: 'cs12_outcome_success',
            isCorrect: true
          },
          {
            text: 'Imprimir la versión tal cual está — probablemente Manuel pueda deducir la palabra por contexto.',
            next: 'cs12_outcome_partial',
            isCorrect: false
          },
          {
            text: 'Descartar la versión de apoyo por completo y darle a Manuel la misma versión estándar que a los demás, sin ningún ajuste.',
            next: 'cs12_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs12_n3b': {
        type: 'scenario',
        text: 'A mitad de la clase, Manuel levanta la mano por tercera vez sin entender una frase, y Andrea ya terminó el texto y está dibujando en su cuaderno, desconectada de la actividad.',
        context: 'Rosa ve, en tiempo real, exactamente el problema que temía.',
        choices: [
          {
            text: 'Reconocer en el momento que necesita ajustar, y usar los últimos minutos de la clase para al menos darle a Manuel una versión oral simplificada del texto.',
            next: 'cs12_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Seguir adelante con la clase igual, asumiendo que "ya se pondrán al día".',
            next: 'cs12_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Regañar a Andrea por no prestar atención sin ofrecerle ningún reto adicional.',
            next: 'cs12_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs12_n3c': {
        type: 'scenario',
        text: 'Durante la actividad, un estudiante de nivel avanzado le pregunta a Rosa, algo decepcionado: "Profe, ¿esto es todo? Ya lo sabía." Rosa se da cuenta de que simplificar para todos dejó a varios estudiantes sin ningún crecimiento real ese día.',
        context: 'La clase termina sin que Rosa haya podido reaccionar a tiempo.',
        choices: [
          {
            text: 'Anotar la lección para la próxima clase: pedir a la IA una versión de reto adicional, y ofrecerla como opción desde el inicio la próxima vez.',
            next: 'cs12_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Decidir que la diferenciación "no vale la pena" y seguir usando un único nivel de ahora en adelante.',
            next: 'cs12_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Ignorar el comentario del estudiante y continuar sin ningún cambio.',
            next: 'cs12_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs12_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Rosa: Los 32 caminos hacia el mismo destino',
        text: 'Rosa demostró en tiempo récord lo que este curso propone: la IA como asistente de diferenciación, no como reemplazo del criterio docente. Detectar y corregir la palabra técnica antes de imprimir —en vez de asumir que "probablemente se entienda"— es la diferencia entre una adaptación real y una adaptación de apariencia. Manuel entendió el texto completo por primera vez en semanas, y Andrea tuvo un reto genuino que la mantuvo interesada.',
        badge: 'Inclusión con Criterio y IA',
        xpReward: 50
      },
      'cs12_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 60,
        title: 'Rosa: La corrección sobre la marcha',
        text: 'El plan de Rosa no salió perfecto, pero supo reaccionar cuando vio la brecha en tiempo real, en vez de ignorarla. Esa capacidad de ajustar en el momento —aunque no sea ideal— es lo que separa a un docente que aprende de su práctica de uno que repite el mismo error. La próxima vez, Rosa sabe que revisar ANTES de imprimir le habría ahorrado ese ajuste de último minuto.',
        badge: 'Diferenciación en Proceso',
        xpReward: 25
      },
      'cs12_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 25,
        title: 'Rosa: La lección sobre la uniformidad',
        text: 'Ya sea por no diferenciar, por simplificar para todos, o por no reaccionar ante lo que vio en el aula, esta clase no llegó a todos los 32 estudiantes por igual. La buena noticia: Rosa ahora tiene evidencia concreta de por qué la diferenciación importa, y una herramienta —la IA usada con criterio— que puede convertir esa lección en una práctica distinta la próxima semana.',
        badge: 'Inclusión ante el Umbral',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 13: "La tarea que se parecía demasiado" — Ciudadanía Digital con IA
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs13',
    title: 'La tarea que se parecía demasiado',
    course: 'Ciudadanía Digital con IA para tus Estudiantes',
    color: '#EC4899',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>',
    duration: '15-20 min',
    description: 'Marco, docente de secundaria, sospecha que un estudiante entregó un ensayo generado por IA sin decirlo. Acompáñalo a decidir cómo abordar la integridad académica sin convertirlo en una cacería.',
    start: 'cs13_n1',
    nodes: {

      'cs13_n1': {
        type: 'scenario',
        text: 'Marco enseña Estudios Sociales en un colegio de la capital. Al revisar el ensayo de Estefanía sobre la Reforma Liberal de 1871, algo le llama la atención: el vocabulario es notablemente más sofisticado que su trabajo habitual, la estructura es impecablemente ordenada, y el tono no suena como ella. Marco sospecha que usó IA generativa sin decirlo — algo que el colegio no prohíbe explícitamente, pero que tampoco fue declarado.',
        context: 'Marco no tiene una prueba definitiva, solo una fuerte sospecha basada en el cambio de estilo.',
        choices: [
          {
            text: 'Hablar con Estefanía en privado, con curiosidad genuina: pedirle que le explique con sus propias palabras dos ideas centrales del ensayo.',
            next: 'cs13_n2a',
            isCorrect: true
          },
          {
            text: 'Confrontarla frente a la clase, acusándola directamente de haber usado IA para copiar.',
            next: 'cs13_n2b',
            isCorrect: false
          },
          {
            text: 'Ignorar la sospecha y calificar el ensayo tal cual, para evitar un conflicto incómodo.',
            next: 'cs13_n2c',
            isCorrect: false
          }
        ]
      },

      'cs13_n2a': {
        type: 'feedback_correct',
        text: 'Buen primer paso. En vez de asumir y acusar, Marco eligió verificar con una conversación directa y no punitiva. Pedirle a Estefanía que explique el contenido con sus propias palabras es una forma justa de distinguir entre "usó IA como apoyo y realmente entendió el tema" y "entregó algo que ni siquiera comprende".',
        tip: 'La integridad académica no se resuelve solo con sospecha o con un detector automático — se resuelve verificando comprensión real, que es, después de todo, el objetivo de cualquier tarea.',
        next: 'cs13_n3a',
        xp: 10
      },
      'cs13_n2b': {
        type: 'feedback_wrong',
        text: 'Acusar públicamente sin prueba definitiva, frente a sus compañeros, es injusto incluso si la sospecha resulta cierta — y devastador para Estefanía si resulta ser una falsa alarma (el vocabulario "sofisticado" también puede venir de mucho estudio genuino). Además, la vergüenza pública rara vez genera una conversación honesta después.',
        tip: 'Ninguna conversación sobre integridad académica debería empezar como un juicio público. La conversación siempre es primero privada, con la mente abierta a estar equivocado.',
        next: 'cs13_n3b',
        xp: 0
      },
      'cs13_n2c': {
        type: 'feedback_wrong',
        text: 'Ignorar la sospecha evita el conflicto hoy, pero no le enseña nada a Estefanía sobre uso responsable de IA, y deja sin abordar un patrón que probablemente se repita —con ella y con otros estudiantes que noten que "no pasa nada". El silencio no es neutral: también es una decisión con consecuencias.',
        tip: 'Evitar la conversación incómoda de hoy casi siempre genera un problema más grande después, cuando el patrón ya está establecido en todo el grupo.',
        next: 'cs13_n3c',
        xp: 0
      },

      'cs13_n3a': {
        type: 'scenario',
        text: 'En la conversación privada, Estefanía admite, algo nerviosa, que usó un chat de IA para "ordenar sus ideas" porque no sabía cómo empezar, y luego copió gran parte de la respuesta sin cambiarla mucho. Cuando Marco le pide que explique el impacto de la Reforma Liberal en sus propias palabras, ella logra explicar solo una parte, con dificultad.',
        context: 'Estefanía parece más aliviada que a la defensiva — agradece que la conversación no fue pública.',
        choices: [
          {
            text: 'Explicarle la diferencia entre usar IA como apoyo para organizar ideas propias y entregar su output sin procesar, y darle la oportunidad de rehacer el ensayo con sus propias palabras, citando que usó IA como ayuda inicial.',
            next: 'cs13_outcome_success',
            isCorrect: true
          },
          {
            text: 'Ponerle automáticamente la nota mínima sin ninguna oportunidad de reescribir ni ninguna conversación sobre cómo usar la herramienta correctamente.',
            next: 'cs13_outcome_partial',
            isCorrect: false
          },
          {
            text: 'Dejarlo pasar ahora que ella lo admitió, sin ninguna consecuencia académica ni conversación sobre cómo hacerlo distinto la próxima vez.',
            next: 'cs13_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs13_n3b': {
        type: 'scenario',
        text: 'Tras la confrontación pública, Estefanía se pone a llorar y niega todo, visiblemente humillada frente a sus compañeros. El resto de la clase queda en silencio incómodo, y Marco se da cuenta de que, prueba o no, manejó mal el momento.',
        context: 'Los padres de Estefanía probablemente se enterarán de lo ocurrido esa misma tarde.',
        choices: [
          {
            text: 'Buscarla después de clase, disculparse por la forma en que lo manejó frente al grupo, y proponer retomar la conversación en privado.',
            next: 'cs13_outcome_partial',
            isCorrect: true
          },
          {
            text: 'No decir nada más, asumiendo que ya se le pasará.',
            next: 'cs13_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Reportar el incidente a dirección sin haber hablado nunca en privado con Estefanía sobre lo ocurrido.',
            next: 'cs13_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs13_n3c': {
        type: 'scenario',
        text: 'Semanas después, Marco nota que varios ensayos del grupo tienen el mismo patrón sospechoso: vocabulario uniformemente sofisticado, estructuras casi idénticas entre estudiantes que normalmente escriben muy distinto entre sí.',
        context: 'Lo que empezó como una sospecha aislada con Estefanía ahora parece ser una práctica extendida en el grupo.',
        choices: [
          {
            text: 'Reconocer que ignorar el primer caso permitió que el patrón se extendiera, y ahora sí abrir una conversación honesta con todo el grupo sobre uso responsable de IA en las tareas.',
            next: 'cs13_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Seguir sin decir nada, esperando que el problema se resuelva solo.',
            next: 'cs13_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Prohibir sin ninguna explicación pedagógica el uso de cualquier dispositivo para las tareas de ahora en adelante.',
            next: 'cs13_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs13_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Marco: La integridad académica como conversación, no como cacería',
        text: 'Marco manejó esta situación exactamente como propone este curso: verificó con curiosidad en vez de acusar, distinguió entre uso de apoyo y entrega sin procesar, y ofreció una segunda oportunidad con expectativas claras en vez de solo castigar. Estefanía reescribió su ensayo —esta vez con sus propias palabras, citando que usó IA para organizar sus ideas iniciales— y entendió, quizás por primera vez, la diferencia entre apoyarse en una herramienta y delegarle el pensamiento completo.',
        badge: 'Integridad Académica con Empatía',
        xpReward: 50
      },
      'cs13_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 55,
        title: 'Marco: La conversación que llegó, aunque tarde',
        text: 'El camino de Marco tuvo tropiezos —una confrontación pública que tuvo que reparar después, o una consecuencia aplicada sin suficiente conversación pedagógica— pero en algún punto logró abrir el diálogo que realmente importaba: qué significa usar IA con honestidad académica. Esa conversación, aunque llegó con algo de fricción, deja una lección más duradera que el silencio o el castigo solo.',
        badge: 'Integridad Académica en Proceso',
        xpReward: 25
      },
      'cs13_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 20,
        title: 'Marco: La oportunidad que se dejó pasar',
        text: 'Ya sea por evitar la conversación necesaria o por manejarla de forma punitiva sin diálogo real, esta situación con Estefanía —y potencialmente con el resto del grupo— no se convirtió en el momento de aprendizaje que pudo haber sido. La integridad académica en la era de la IA no se enseña con silencio ni con prohibiciones sin explicación: se enseña con conversaciones honestas y consistentes.',
        badge: 'Integridad Académica ante el Umbral',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 14: "El círculo que nadie quería" — Aprendizaje Socioemocional (SEL)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs14',
    title: 'El círculo que nadie quería',
    course: 'Aprendizaje Socioemocional (SEL) para Docentes',
    color: '#DB2777',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>',
    duration: '15-20 min',
    description: 'Andrea quiere introducir un círculo semanal de check-in emocional en su aula de sexto grado, pero el grupo lo recibe con burlas e incomodidad. Acompáñala a decidir cómo sostener la práctica.',
    start: 'cs14_n1',
    nodes: {

      'cs14_n1': {
        type: 'scenario',
        text: 'Andrea, docente de sexto grado en Huehuetenango, decide introducir un círculo semanal donde cada estudiante comparte brevemente cómo llega esa semana. En el primer intento, varios estudiantes se ríen nerviosamente, dos dicen "paso" de forma burlona, y uno murmura "esto es cosa de niños chiquitos".',
        context: 'Andrea siente que el primer intento no salió como esperaba, y tiene que decidir si continúa la práctica la próxima semana.',
        choices: [
          {
            text: 'Mantener el círculo la próxima semana, pero empezar modelando ella misma primero, compartiendo algo genuino y breve antes de pedirle al grupo.',
            next: 'cs14_n2a',
            isCorrect: true
          },
          {
            text: 'Cancelar la práctica por completo — "si no funcionó la primera vez, no vale la pena insistir".',
            next: 'cs14_n2b',
            isCorrect: false
          },
          {
            text: 'Hacer el círculo obligatorio con calificación, para que "se lo tomen en serio".',
            next: 'cs14_n2c',
            isCorrect: false
          }
        ]
      },

      'cs14_n2a': {
        type: 'feedback_correct',
        text: 'Buena decisión. La resistencia inicial a compartir emociones en voz alta es completamente normal, especialmente en sexto grado donde la vulnerabilidad frente a compañeros se siente arriesgada. Modelar primero —mostrando que el adulto también comparte algo real, no solo pide a los estudiantes que lo hagan— construye la seguridad necesaria antes de esperar apertura genuina.',
        tip: 'Los estudiantes calibran qué tan seguro es un espacio observando primero al adulto. Si Andrea comparte algo genuino sin exagerar ni minimizar, les está enseñando cómo se ve la práctica.',
        next: 'cs14_n3a',
        xp: 10
      },
      'cs14_n2b': {
        type: 'feedback_wrong',
        text: 'Cancelar tras el primer intento incómodo es entendible, pero pierde de vista algo importante: casi ninguna práctica de SEL nueva funciona bien la primera vez, precisamente porque requiere que el grupo construya confianza gradualmente. Abandonar al primer signo de resistencia le enseña al grupo que la incomodidad siempre gana.',
        tip: 'La resistencia inicial no es evidencia de que la práctica esté mal diseñada — es la señal más común de que se está pidiendo algo nuevo y vulnerable.',
        next: 'cs14_n3b',
        xp: 0
      },
      'cs14_n2c': {
        type: 'feedback_wrong',
        text: 'Calificar el círculo introduce exactamente la presión equivocada: convierte un espacio que debería sentirse seguro en una obligación evaluada, lo cual generalmente produce respuestas performativas ("estoy bien, todo bien") en vez de honestidad genuina — lo opuesto al objetivo del ejercicio.',
        tip: 'El SEL genuino no se puede forzar con calificación. La participación auténtica requiere sentirse segura, no obligatoria.',
        next: 'cs14_n3c',
        xp: 0
      },

      'cs14_n3a': {
        type: 'scenario',
        text: 'La segunda semana, Andrea comparte primero: "Esta semana llegué un poco cansada porque dormí mal, pero contenta porque es viernes." El grupo se queda en silencio un momento, y luego uno de los estudiantes que antes se burló dice, en voz baja: "Yo llegué enojado porque perdí mi lápiz favorito." Es un comienzo pequeño pero real.',
        context: 'No todos participan todavía, pero el tono del grupo cambió notablemente.',
        choices: [
          {
            text: 'Agradecer genuinamente la participación de ese estudiante sin forzar a los demás, y seguir sosteniendo la práctica de forma consistente cada semana.',
            next: 'cs14_outcome_success',
            isCorrect: true
          },
          {
            text: 'Presionar a los estudiantes que no han hablado todavía a que compartan "porque ya casi todos lo hicieron".',
            next: 'cs14_outcome_partial',
            isCorrect: false
          },
          {
            text: 'Suspender la práctica de nuevo, pensando que el progreso fue "muy poco" para valer la pena continuar.',
            next: 'cs14_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs14_n3b': {
        type: 'scenario',
        text: 'Un mes después, sin la práctica del círculo, Andrea nota que dos estudiantes tienen un conflicto no resuelto que ha estado creciendo en silencio, y se pregunta si el círculo —de haber continuado— podría haber ofrecido un espacio para procesarlo antes de que escalara.',
        context: 'Andrea reconsidera si canceló la práctica demasiado rápido.',
        choices: [
          {
            text: 'Retomar el círculo, esta vez con más paciencia, empezando de nuevo con Andrea modelando primero.',
            next: 'cs14_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Decidir definitivamente que "el SEL no funciona con este grupo" y no volver a intentarlo.',
            next: 'cs14_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Esperar a que surja otro conflicto antes de decidir si retoma la práctica.',
            next: 'cs14_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs14_n3c': {
        type: 'scenario',
        text: 'Con el círculo calificado, Andrea nota que las respuestas se volvieron uniformes y superficiales: casi todos dicen "bien" sin importar cómo llegaron realmente. Una estudiante que suele confiarle cosas personales a Andrea en otros momentos, en el círculo calificado solo dice lo mínimo necesario para la nota.',
        context: 'La calificación logró que todos "participaran", pero perdió la honestidad que el ejercicio buscaba.',
        choices: [
          {
            text: 'Quitar la calificación y volver a presentar el círculo como un espacio seguro y voluntario, aunque signifique menos participación inicial.',
            next: 'cs14_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Mantener la calificación porque "al menos así todos participan".',
            next: 'cs14_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Aumentar el peso de la calificación para "motivar más honestidad".',
            next: 'cs14_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs14_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Andrea: La confianza que se construye semana a semana',
        text: 'Andrea sostuvo la práctica con paciencia, modeló la vulnerabilidad que pedía de sus estudiantes, y respetó el ritmo de cada uno sin forzar la participación. Meses después, el círculo se convirtió en uno de los momentos más esperados de la semana — un espacio donde varios conflictos pequeños se resolvieron antes de crecer, simplemente porque el grupo tenía un lugar seguro y regular para nombrar lo que sentía.',
        badge: 'SEL Sostenido con Paciencia',
        xpReward: 50
      },
      'cs14_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 55,
        title: 'Andrea: El segundo intento, con más criterio',
        text: 'El primer camino de Andrea no fue el ideal —ya sea por presionar demasiado, cancelar muy pronto, o calificar el proceso— pero en algún punto ajustó el rumbo con lo aprendido. Retomar una práctica de SEL después de un tropiezo, con más paciencia que la primera vez, es en sí mismo un ejercicio de la misma autorregulación que el curso enseña.',
        badge: 'SEL en Ajuste',
        xpReward: 25
      },
      'cs14_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 20,
        title: 'Andrea: La práctica que no llegó a arraigar',
        text: 'Ya sea por abandonar la práctica muy pronto, por forzarla con calificación, o por no retomarla tras un primer tropiezo, el círculo de Andrea no llegó a convertirse en el espacio de confianza que podría haber sido. La lección que queda es valiosa: el SEL genuino necesita consistencia y paciencia — no se construye ni se abandona en una sola sesión.',
        badge: 'SEL ante el Umbral',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 15: "Las estrellas que dejaron de brillar" — Disciplina Positiva
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs15',
    title: 'Las estrellas que dejaron de brillar',
    course: 'Disciplina Positiva y Motivación Intrínseca',
    color: '#EA580C',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>',
    duration: '15-20 min',
    description: 'El sistema de estrellas de Pablo funcionó de maravilla en septiembre. En marzo, ya no motiva a nadie. Acompáñalo a decidir cómo replantear la motivación de su grupo.',
    start: 'cs15_n1',
    nodes: {

      'cs15_n1': {
        type: 'scenario',
        text: 'Pablo enseña tercer grado en Quetzaltenango. En septiembre, introdujo un sistema de estrellas por buena conducta y tareas completas, y funcionó muy bien las primeras semanas. Ahora, en marzo, los estudiantes apenas miran el cartel de estrellas, y la conducta que antes motivaba ya no genera ningún entusiasmo.',
        context: 'Pablo se pregunta si necesita premios más grandes, o si algo más profundo dejó de funcionar.',
        choices: [
          {
            text: 'Empezar a rediseñar actividades dando más autonomía real (elegir cómo presentar un trabajo) y reconociendo el esfuerzo y progreso en voz alta, en vez de subir el valor de los premios.',
            next: 'cs15_n2a',
            isCorrect: true
          },
          {
            text: 'Aumentar el premio: ahora una estrella completa vale un dulce, para recuperar el entusiasmo inicial.',
            next: 'cs15_n2b',
            isCorrect: false
          },
          {
            text: 'Eliminar el sistema de estrellas de golpe sin ningún reemplazo, asumiendo que "ya no sirve para nada".',
            next: 'cs15_n2c',
            isCorrect: false
          }
        ]
      },

      'cs15_n2a': {
        type: 'feedback_correct',
        text: 'Buena decisión. Pablo identificó correctamente que el problema no es la "cantidad" de premio, sino el tipo de motivación que está cultivando. Dar autonomía real y reconocer el proceso —no solo el resultado— empieza a construir los pilares de motivación intrínseca (autonomía, competencia, conexión) que sostienen el interés genuino, algo que ningún premio externo logra por sí solo.',
        tip: 'Aumentar el premio solo pospone el mismo problema: tarde o temprano, cualquier recompensa externa pierde su efecto si es la única razón para actuar.',
        next: 'cs15_n3a',
        xp: 10
      },
      'cs15_n2b': {
        type: 'feedback_wrong',
        text: 'Subir el valor del premio puede generar un repunte temporal de entusiasmo, pero es exactamente el patrón que llevó al problema actual: cada vez se necesita un premio más grande para el mismo efecto. Este camino no tiene un final sostenible — eventualmente ningún premio será "suficiente".',
        tip: 'Este es el efecto clásico de la motivación extrínseca: escala hacia arriba indefinidamente y nunca construye interés genuino por la actividad misma.',
        next: 'cs15_n3b',
        xp: 0
      },
      'cs15_n2c': {
        type: 'feedback_wrong',
        text: 'Eliminar el sistema sin ningún reemplazo deja un vacío real: los estudiantes se acostumbraron a algún tipo de reconocimiento por su esfuerzo, y quitarlo de golpe sin construir motivación intrínseca en su lugar probablemente resulte en una caída aún mayor del interés por participar.',
        tip: 'La transición de motivación extrínseca a intrínseca funciona mejor de forma gradual, construyendo los nuevos pilares antes de retirar por completo los antiguos.',
        next: 'cs15_n3c',
        xp: 0
      },

      'cs15_n3a': {
        type: 'scenario',
        text: 'Dos semanas después, Pablo nota que varios estudiantes eligieron voluntariamente presentar su proyecto de ciencias de una forma más elaborada de lo pedido —uno hizo un modelo 3D sin que se lo exigieran—, y sin ninguna estrella de por medio.',
        context: 'El cambio es gradual, no dramático, pero es genuino.',
        choices: [
          {
            text: 'Reconocer específicamente el esfuerzo y la iniciativa de esos estudiantes en voz alta frente al grupo, nombrando exactamente qué hicieron bien.',
            next: 'cs15_outcome_success',
            isCorrect: true
          },
          {
            text: 'Darles una estrella extra por la iniciativa, volviendo al sistema de premios que Pablo intentaba dejar atrás.',
            next: 'cs15_outcome_partial',
            isCorrect: false
          },
          {
            text: 'No decir nada al respecto, para "no hacerlo sentir como que se espera siempre ese nivel de esfuerzo".',
            next: 'cs15_outcome_partial',
            isCorrect: false
          }
        ]
      },

      'cs15_n3b': {
        type: 'scenario',
        text: 'Un mes después del cambio a dulces, Pablo nota que ahora varios estudiantes preguntan "¿esto también da dulce?" antes de cualquier actividad, incluso las que antes disfrutaban genuinamente sin pedir nada a cambio.',
        context: 'El interés genuino que antes existía en algunas actividades parece estar desapareciendo también.',
        choices: [
          {
            text: 'Reconocer el patrón y empezar a retirar gradualmente los premios materiales, reemplazándolos con reconocimiento genuino del progreso.',
            next: 'cs15_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Seguir subiendo el valor de los premios para mantener el interés.',
            next: 'cs15_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Culpar a los estudiantes por "solo importarles el premio", sin reconocer el rol del propio sistema en crear ese patrón.',
            next: 'cs15_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs15_n3c': {
        type: 'scenario',
        text: 'Sin el sistema de estrellas ni ningún reemplazo, la participación general del grupo baja notablemente en las siguientes dos semanas. Varios estudiantes preguntan "¿ya no hay estrellas? ¿entonces para qué hacemos las cosas bien?"',
        context: 'Pablo se da cuenta de que quitar el sistema sin nada que lo sustituya dejó un vacío real.',
        choices: [
          {
            text: 'Introducir gradualmente reconocimiento genuino del esfuerzo y mayor autonomía en las actividades, explicando el cambio al grupo.',
            next: 'cs15_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Reinstalar el sistema de estrellas exactamente como estaba antes, sin ningún cambio.',
            next: 'cs15_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Decidir que el grupo "simplemente necesita premios" y no intentar ningún otro enfoque.',
            next: 'cs15_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      'cs15_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Pablo: De las estrellas al interés genuino',
        text: 'Pablo hizo la transición que este curso propone: de un sistema que dependía enteramente de premios externos, a uno que construye autonomía, reconocimiento de proceso y conexión genuina con el grupo. Reconocer en voz alta el esfuerzo específico de sus estudiantes —sin convertirlo de nuevo en una transacción de premios— reforzó exactamente el tipo de motivación que sostiene el interés incluso cuando nadie está calificando ni premiando.',
        badge: 'Disciplina Positiva Sostenida',
        xpReward: 50
      },
      'cs15_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 55,
        title: 'Pablo: La transición en marcha',
        text: 'El camino de Pablo tuvo tropiezos —ya sea reforzando el mismo patrón de premios, o retirándolos sin suficiente reemplazo— pero en algún punto identificó lo que realmente necesitaba cambiar: no la cantidad de premio, sino el tipo de motivación que estaba cultivando. Esa transición, aunque gradual y con ajustes en el camino, va en la dirección correcta.',
        badge: 'Motivación en Transición',
        xpReward: 25
      },
      'cs15_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 20,
        title: 'Pablo: El ciclo de premios sin salida',
        text: 'Ya sea escalando premios indefinidamente, eliminándolos sin ningún reemplazo, o volviendo al mismo sistema que dejó de funcionar, Pablo no logró todavía romper el ciclo de dependencia en la motivación externa. La buena noticia: identificar este patrón es el primer paso — la próxima vez, construir autonomía y reconocimiento de proceso desde el inicio, no como reacción tardía, será la diferencia.',
        badge: 'Motivación ante el Umbral',
        xpReward: 10
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CASO 16: "El semáforo de Andrés" — Educación Inclusiva
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cs16',
    title: 'El semáforo de Andrés',
    course: 'Educación Inclusiva',
    color: '#8B5CF6',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
    duration: '20-25 min',
    description: 'Suena una alarma de simulacro sin previo aviso y Andrés, un estudiante con TEA, entra en sobrecarga sensorial. Acompaña a la maestra Marta a decidir cómo sostener la seguridad del protocolo sin ignorar lo que Andrés está viviendo.',
    start: 'cs16_n1',
    nodes: {

      'cs16_n1': {
        type: 'scenario',
        text: 'Marta enseña tercer grado en una escuela de Quetzaltenango. Andrés, uno de sus estudiantes, tiene TEA y suele regularse bien con las rutinas conocidas del aula. Hoy, sin ningún aviso previo, suena la alarma de un simulacro de incendio. Andrés se cubre los oídos de inmediato, empieza a mecerse cada vez más rápido, y su respiración se acelera visiblemente. El resto de la clase ya está formándose en fila para salir, siguiendo el protocolo.',
        context: 'El protocolo de evacuación exige que todos los estudiantes salgan del edificio en los próximos minutos, sin excepción — es un procedimiento de seguridad real, no algo que se pueda posponer.',
        choices: [
          {
            text: 'Acercarse a Andrés con voz baja y calmada, ofrecerle cubrirse los oídos o tomarle la mano, y guiarlo hacia la salida usando pocas palabras, sin dejar de cumplir el protocolo de evacuación.',
            next: 'cs16_n2a',
            isCorrect: true
          },
          {
            text: 'Tomarlo firmemente del brazo y llevarlo a la fila, insistiendo en que "tiene que seguir las reglas igual que todos".',
            next: 'cs16_n2b',
            isCorrect: false
          },
          {
            text: 'Dejarlo en su lugar mientras el resto de la clase evacúa, decidiendo que "es muy complicado" resolverlo en ese momento.',
            next: 'cs16_n2c',
            isCorrect: false
          }
        ]
      },

      'cs16_n2a': {
        type: 'feedback_correct',
        text: 'Buena decisión. La seguridad durante una evacuación no es negociable, pero cómo la acompañas sí puede ajustarse: reducir tu propio volumen de voz, usar pocas palabras, y ofrecer un apoyo sensorial simple (cubrirse los oídos, tomarse de la mano) permite cumplir el protocolo sin ignorar la sobrecarga sensorial real que Andrés está viviendo. Seguridad y sensibilidad sensorial no son opuestas.',
        tip: 'En una emergencia real, el objetivo es salir de forma segura — el apoyo sensorial se ofrece EN MOVIMIENTO hacia la salida, no deteniendo la evacuación por completo.',
        next: 'cs16_n3a',
        xp: 10
      },
      'cs16_n2b': {
        type: 'feedback_wrong',
        text: 'Tomarlo firmemente del brazo sin ninguna advertencia ni acompañamiento verbal calmado, en medio de una sobrecarga sensorial ya en curso, muy probablemente intensifica la respuesta de Andrés en vez de ayudarlo a moverse con más calma — el contacto físico brusco añade otro estímulo más a un sistema ya sobrecargado.',
        tip: 'El movimiento físico sigue siendo necesario en una evacuación real, pero SIEMPRE acompañado de calma y aviso, nunca como una fuerza repentina sin explicación.',
        next: 'cs16_n3b',
        xp: 0
      },
      'cs16_n2c': {
        type: 'feedback_wrong',
        text: 'Dejar a un estudiante atrás durante una evacuación real, sin importar cuánto cueste acompañarlo, es un riesgo de seguridad que nunca es aceptable — la sobrecarga sensorial de Andrés no cambia la obligación de sacarlo del edificio junto con el resto de la clase.',
        tip: 'La complejidad de una situación nunca justifica dejar a un estudiante en riesgo — busca ayuda de otro adulto si necesitas apoyo extra en el momento, pero nunca lo dejes solo.',
        next: 'cs16_n3c',
        xp: 0
      },

      // ── Rama A: acompañamiento correcto desde el inicio ──
      'cs16_n3a': {
        type: 'scenario',
        text: 'Ya afuera del edificio, con la evacuación cumplida, Andrés entra en una crisis más intensa (meltdown): se mece con fuerza, se tapa los oídos, y empieza a llorar sin responder a las preguntas de Marta. El resto de la clase observa a cierta distancia.',
        context: 'La alarma ya se apagó y el simulacro terminó — el reto ahora es acompañar a Andrés a recuperarse, no continuar dando instrucciones.',
        choices: [
          {
            text: 'Darle espacio físico, bajar su propio nivel de habla al mínimo indispensable, y quedarse cerca en silencio sin exigirle que explique qué le pasa.',
            next: 'cs16_outcome_success',
            isCorrect: true
          },
          {
            text: 'Preguntarle repetidamente "¿qué te pasa? cuéntame qué sientes" esperando una respuesta verbal inmediata.',
            next: 'cs16_outcome_partial',
            isCorrect: false
          },
          {
            text: 'Decirle que "ya pasó, fue solo un simulacro, no tiene nada de qué preocuparse".',
            next: 'cs16_outcome_partial',
            isCorrect: false
          }
        ]
      },

      // ── Rama B: contacto físico brusco al inicio ──
      'cs16_n3b': {
        type: 'scenario',
        text: 'Afuera del edificio, la crisis de Andrés es más intensa que si hubiera sido acompañado con calma desde el inicio — se resistió al ser jalado, y ahora llora con fuerza, evitando cualquier contacto. Marta se da cuenta de que el momento inicial pudo manejarse distinto.',
        context: 'El simulacro ya terminó, pero Andrés sigue visiblemente alterado y algunos compañeros lo están mirando.',
        choices: [
          {
            text: 'Reconocer en silencio que el primer acercamiento no ayudó, bajar el tono, dar espacio, y esperar sin exigir nada hasta que Andrés se calme por su cuenta.',
            next: 'cs16_outcome_partial',
            isCorrect: true
          },
          {
            text: 'Insistir en que se calme "ya" porque el simulacro terminó y no hay ninguna razón para seguir alterado.',
            next: 'cs16_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Pedirle a otro adulto que se lo lleve a otro lugar de inmediato, sin que Marta misma intente acompañarlo primero.',
            next: 'cs16_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      // ── Rama C: lo dejó atrás ──
      'cs16_n3c': {
        type: 'scenario',
        text: 'Un compañero le avisa a Marta que Andrés se quedó adentro. Marta regresa de inmediato y lo encuentra solo, muy alterado, sin haber salido del aula durante todo el simulacro — una situación de riesgo real que además intensificó su angustia al quedarse solo.',
        context: 'El resto de la clase ya está afuera; hay que decidir cómo proceder ahora con Andrés, y qué hacer de cara al protocolo de seguridad de la escuela.',
        choices: [
          {
            text: 'Acompañarlo de inmediato hacia afuera con calma, y reportar el incidente a dirección para ajustar el plan de evacuación de Andrés hacia el futuro.',
            next: 'cs16_outcome_partial',
            isCorrect: true
          },
          {
            text: 'No reportar lo ocurrido, asumiendo que "la próxima vez será distinto" sin ningún ajuste al plan.',
            next: 'cs16_outcome_struggle',
            isCorrect: false
          },
          {
            text: 'Regañarlo por "no haber salido con los demás" sin explicar que la responsabilidad de acompañarlo era de Marta, no de él.',
            next: 'cs16_outcome_struggle',
            isCorrect: false
          }
        ]
      },

      // ── OUTCOMES ─────────────────────────────────────────────────────────

      'cs16_outcome_success': {
        type: 'outcome',
        outcome: 'success',
        end: true,
        score: 100,
        title: 'Marta: Seguridad con sensibilidad sensorial',
        text: 'Marta logró sostener dos cosas a la vez que a veces parecen contradictorias: cumplir el protocolo de seguridad sin excepción, y acompañar la sobrecarga sensorial real de Andrés con calma, pocas palabras y apoyo físico simple. Después de la crisis, le dio espacio para recuperarse sin exigirle una explicación inmediata — reconociendo que procesar verbalmente lo ocurrido, en ese momento, no era algo que Andrés pudiera hacer todavía. Esta experiencia también es una señal clara para que la escuela prepare, junto con la familia, un plan de evacuación con aviso anticipado para Andrés de cara a futuros simulacros.',
        badge: 'Acompañamiento Sensorial con Seguridad',
        xpReward: 50
      },
      'cs16_outcome_partial': {
        type: 'outcome',
        outcome: 'partial',
        end: true,
        score: 60,
        title: 'Marta: La corrección a mitad de camino',
        text: 'El primer movimiento de Marta no fue el ideal —ya sea por el contacto físico brusco inicial, por exigir una explicación verbal inmediata durante la crisis, o por no reconocer a tiempo que Andrés se había quedado atrás—, pero logró corregir el rumbo antes de que la situación se agravara más. Ese ajuste, aunque no perfecto desde el inicio, evitó que la situación empeorara, y es una habilidad tan real como acertar desde el primer momento — sobre todo si Marta usa lo aprendido para preparar mejor la próxima evacuación.',
        badge: 'Acompañamiento Sensorial en Ajuste',
        xpReward: 25
      },
      'cs16_outcome_struggle': {
        type: 'outcome',
        outcome: 'struggle',
        end: true,
        score: 25,
        title: 'Marta: La conversación pendiente',
        text: 'Ya sea por dejar a Andrés atrás sin reportarlo, por exigir que "se calmara ya" sin reconocer la sobrecarga real, o por regañarlo por algo que no era su responsabilidad, esta situación no se resolvió de la mejor manera para Andrés. La buena noticia es que el acompañamiento a estudiantes con TEA en situaciones de crisis es una habilidad que se practica y se mejora — la próxima vez, con un plan de evacuación preparado de antemano junto con la familia y el equipo de apoyo, Marta tiene ahora un mapa mucho más claro de por dónde empezar.',
        badge: 'Acompañamiento Sensorial en Camino',
        xpReward: 10
      }
    }
  }

];

// Export for module environments; also available as global for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CASE_STUDIES };
}
