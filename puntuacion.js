/* ============================================================
 * PUNTUACIÓN MONSTRITOS — definiciones y reglas de calificación
 * ------------------------------------------------------------
 * ESTE MISMO ARCHIVO se usa en dos lugares (deben ser idénticos):
 *   1) GitHub:      puntuacion.js  (lo cargan index.html y aplicar.html)
 *   2) Apps Script: archivo "Puntuacion.gs" (pegar el mismo contenido)
 *
 * Fuentes:
 *   - SDQ:  Anexo 7 (cuestionario) + Anexo 17 (hoja de puntuación/análisis)
 *   - ERI:  Anexo 8 (Cuestionario Inicial Primaria) + Anexo 18 (DHARTE,
 *           hojas "Puntuacion", "Analisis riesgo" y "Noborrar")
 * ============================================================ */
var MONS = (function () {

  /* ------------------------- SDQ ------------------------- */
  var SDQ_OPCIONES = [
    { v: '0', t: 'No es verdad' },
    { v: '1', t: 'Es verdad a medias' },
    { v: '2', t: 'Verdaderamente sí' },
    { v: 'NR', t: 'No respondió' }
  ];
  // inv = ítem de puntaje invertido (7, 11, 14, 21, 25), igual que el Anexo 17
  var SDQ_ITEMS = [
    { n: 1, t: 'Procuro ser agradable con los demás. Tengo en cuenta los sentimientos de las otras personas', esc: 'PRO' },
    { n: 2, t: 'Soy inquieto/a, hiperactivo/a, no puedo permanecer quieto/a por mucho tiempo', esc: 'HIP' },
    { n: 3, t: 'Suelo tener muchos dolores de cabeza, estómago o náuseas', esc: 'EMO' },
    { n: 4, t: 'Normalmente comparto con otros mis juguetes, chucherías, lápices, etc.', esc: 'PRO' },
    { n: 5, t: 'Cuando me enfado, me enfado mucho y pierdo el control', esc: 'CON' },
    { n: 6, t: 'Prefiero estar solo/a que con gente de mi edad', esc: 'COM' },
    { n: 7, t: 'Por lo general soy obediente', esc: 'CON', inv: true },
    { n: 8, t: 'A menudo estoy preocupado/a', esc: 'EMO' },
    { n: 9, t: 'Ayudo si alguien está enfermo, disgustado o herido', esc: 'PRO' },
    { n: 10, t: 'Estoy todo el tiempo moviéndome, me muevo demasiado', esc: 'HIP' },
    { n: 11, t: 'Tengo un/a buen/a amigo/a por lo menos', esc: 'COM', inv: true },
    { n: 12, t: 'Peleo con frecuencia con otros, manipulo a los demás', esc: 'CON' },
    { n: 13, t: 'Me siento a menudo triste, desanimado o con ganas de llorar', esc: 'EMO' },
    { n: 14, t: 'Por lo general caigo bien a la otra gente de mi edad', esc: 'COM', inv: true },
    { n: 15, t: 'Me distraigo con facilidad, me cuesta concentrarme', esc: 'HIP' },
    { n: 16, t: 'Me pongo nervioso/a con las situaciones nuevas, fácilmente pierdo la confianza en mí mismo/a', esc: 'EMO' },
    { n: 17, t: 'Trato bien a los niños/as más pequeños/as', esc: 'PRO' },
    { n: 18, t: 'A menudo me acusan de mentir o de hacer trampas', esc: 'CON' },
    { n: 19, t: 'Otra gente de mi edad se mete conmigo o se burla de mí', esc: 'COM' },
    { n: 20, t: 'A menudo me ofrezco para ayudar (a padres, maestros, niños)', esc: 'PRO' },
    { n: 21, t: 'Pienso las cosas antes de hacerlas', esc: 'HIP', inv: true },
    { n: 22, t: 'Cojo cosas que no son mías de casa, la escuela o de otros sitios', esc: 'CON' },
    { n: 23, t: 'Me llevo mejor con adultos que con otros de mi edad', esc: 'COM' },
    { n: 24, t: 'Tengo muchos miedos, me asusto fácilmente', esc: 'EMO' },
    { n: 25, t: 'Termino lo que empiezo, tengo buena concentración', esc: 'HIP', inv: true }
  ];
  // Rangos Normal / Límite / Anormal — tal cual la hoja "Analisis" del Anexo 17
  var SDQ_ESCALAS = [
    { clave: 'EMO', nombre: 'Síntomas emocionales', max: 10, normal: [0, 5], limite: [6, 6], anormal: [7, 10] },
    { clave: 'CON', nombre: 'Problemas de conducta', max: 10, normal: [0, 3], limite: [4, 4], anormal: [5, 10] },
    { clave: 'HIP', nombre: 'Hiperactividad', max: 10, normal: [0, 5], limite: [6, 6], anormal: [7, 10] },
    { clave: 'COM', nombre: 'Problemas con compañeros', max: 10, normal: [0, 3], limite: [4, 5], anormal: [6, 10] },
    { clave: 'PRO', nombre: 'Conducta prosocial (capacidades)', max: 10, normal: [6, 10], limite: [5, 5], anormal: [0, 4], positiva: true }
  ];
  var SDQ_DIFICULTADES = { clave: 'DIF', nombre: 'Total de dificultades', max: 40, normal: [0, 15], limite: [16, 19], anormal: [20, 40] };

  function banda(escala, valor) {
    if (valor === null || valor === undefined || valor === '') return '';
    if (valor >= escala.normal[0] && valor <= escala.normal[1]) return 'Normal';
    if (valor >= escala.limite[0] && valor <= escala.limite[1]) return 'Límite';
    return 'Anormal';
  }

  function puntajeItemSDQ(item, resp) {
    if (resp === '0' || resp === '1' || resp === '2' || resp === 0 || resp === 1 || resp === 2) {
      var v = Number(resp);
      return item.inv ? 2 - v : v;
    }
    return null; // no respondió / vacío
  }

  // respuestas: { "1": "0|1|2|NR", ... }
  // Sub-escala con 1-2 ítems sin respuesta se prorratea (regla oficial SDQ);
  // con 3 o más sin respuesta queda "incompleta" (null).
  function calificarSDQ(respuestas) {
    respuestas = respuestas || {};
    var items = {}, escalas = {}, bandas = {}, faltantes = [];
    SDQ_ITEMS.forEach(function (it) {
      var p = puntajeItemSDQ(it, respuestas[String(it.n)]);
      items[it.n] = p;
      if (p === null) faltantes.push(it.n);
    });
    SDQ_ESCALAS.forEach(function (e) {
      var suma = 0, cont = 0;
      SDQ_ITEMS.forEach(function (it) {
        if (it.esc === e.clave && items[it.n] !== null) { suma += items[it.n]; cont++; }
      });
      var val = cont >= 3 ? Math.round(suma * 5 / cont) : null;
      escalas[e.clave] = val;
      bandas[e.clave] = banda(e, val);
    });
    var dif = null;
    if (['EMO', 'CON', 'HIP', 'COM'].every(function (k) { return escalas[k] !== null; })) {
      dif = escalas.EMO + escalas.CON + escalas.HIP + escalas.COM;
    }
    escalas.DIF = dif;
    bandas.DIF = banda(SDQ_DIFICULTADES, dif);
    return { items: items, escalas: escalas, bandas: bandas, faltantes: faltantes };
  }

  /* ------------------------- ERI ------------------------- */
  // p = puntaje por opción (Anexo 18, hoja "Puntuacion"); '' = no se puntúa
  // w = peso en el total (x2 según la fórmula de la columna TOTAL)
  // tipo: R = factor de riesgo, P = factor de protección
  // cat / factor = hoja "Analisis riesgo"
  var ERI_SECCIONES = [
    { desde: 1, texto: 'Para las primeras 15 preguntas, tus respuestas deben ser de los últimos 6 meses.' },
    { desde: 16, texto: 'En esta sección (preguntas 16 a 23), tus respuestas deben ser de toda tu vida.' },
    { desde: 24, texto: 'Para las últimas preguntas, contesta de acuerdo a tu experiencia o forma de pensar.' }
  ];
  var ERI_ITEMS = [
    { n: 1, t: 'En los últimos 6 meses, tengo un grupo de amigos(as) con los que me junto todos los días', w: 1, tipo: 'R', cat: 'CTX', factor: 'Rechazo de compañeros',
      op: [['a', 'Sí, es un grupo de más de 3 personas', 0], ['b', 'Sí, es un grupo de 1 o 2 personas', 1], ['c', 'No', 2]] },
    { n: 2, t: 'En los últimos 6 meses, formo parte de un grupo u organización que ayudan o mejoran mi comunidad', w: 1, tipo: 'P', cat: 'PRO', factor: 'Participación prosocial',
      op: [['a', 'Sí', 0], ['b', 'No', 1]] },
    { n: 3, t: 'En los últimos 6 meses, cuando tengo un problema cuento con amigos(as) que me escuchan y me pueden apoyar', w: 1, tipo: 'P', cat: 'PRO', factor: 'Apego y relaciones sólidas',
      op: [['a', 'Sí', 0], ['b', 'No', 1]] },
    { n: 4, t: 'En los últimos 6 meses, me siento cómodo(a) al hablar de mis problemas con mi familia o amigos', w: 2, tipo: 'R', cat: 'CTX', factor: 'Carencia de apoyo personal/social', signif: true,
      op: [['a', 'Siempre', 0], ['b', 'A veces', 1], ['c', 'Nunca', 2]] },
    { n: 5, t: 'En los últimos 6 meses, mis padres o tutores me apoyan, motivan o alientan para hacer lo que me gusta', w: 2, tipo: 'R', cat: 'CTX', factor: 'Gestión deficiente por parte de los padres', signif: true,
      op: [['a', 'Siempre', 0], ['b', 'A veces', 1], ['c', 'Nunca', 2]] },
    { n: 6, t: 'En los últimos 6 meses, mis padres o tutores saben dónde paso mi tiempo libre', w: 1, tipo: 'R', cat: 'CTX', factor: 'Gestión deficiente por parte de los padres',
      op: [['a', 'Siempre', 0], ['b', 'A veces', 1], ['c', 'Nunca', 2]] },
    { n: 7, t: 'En los últimos 6 meses, me siento rechazado(a) o excluido(a) por los amigos o familia', w: 1, tipo: 'R', cat: 'CTX', factor: 'Rechazo de compañeros',
      op: [['a', 'Siempre', 2], ['b', 'La mayor parte del tiempo', 1], ['c', 'A veces, pero se me pasa rápido', 1], ['d', 'Nunca', 0]] },
    { n: 8, t: 'En los últimos 6 meses, cuando le hacen una broma pesada a un compañero(a), yo:', w: 1, tipo: 'R', cat: 'IND', factor: 'Poca empatía/remordimiento',
      op: [['a', 'Me río y me da gusto', 2], ['b', 'Me pongo triste', 1], ['c', 'Detengo la broma', 0], ['d', 'Lo ignoro', 1], ['e', 'Sigo con la broma', 2]] },
    { n: 9, t: 'En los últimos 6 meses, cuando tengo un desacuerdo con un compañero(a) lo arreglo de la siguiente forma:', w: 1, tipo: 'R', cat: 'IND', factor: 'Actitudes negativas',
      op: [['a', 'Con golpes', 2], ['b', 'Hablando', 0], ['c', 'Ignorando la situación', 1], ['d', 'Insultando', 2]] },
    { n: 10, t: 'En los últimos 6 meses, me he quedado con objetos (dinero, comida, ropa, joyas, útiles escolares etc.) que no son míos', w: 1, tipo: 'R', cat: 'HIS', factor: 'Historial de ofensas no violentas',
      op: [['a', 'Sí, más de 5 veces', 2], ['b', 'Sí, menos de 5 veces', 1], ['c', 'No', 0]] },
    { n: 11, t: 'En los últimos 6 meses, mis amigos(as) dañan o destruyen propiedades ajenas (bancos, baños, paredes, ventanas, camiones)', w: 1, tipo: 'R', cat: 'CTX', factor: 'Delincuencia de compañeros',
      op: [['a', 'Siempre', 2], ['b', 'A veces', 1], ['c', 'Nunca', 0]] },
    { n: 12, t: 'En los últimos 6 meses, me he peleado a golpes', w: 2, tipo: 'R', cat: 'HIS', factor: 'Historial de violencia', signif: true,
      op: [['a', 'Sí, 1 o 2 veces', 1], ['b', 'Sí, más de 3 veces', 2], ['c', 'No', 0]] },
    { n: 13, t: 'En los últimos 6 meses, he utilizado un objeto (como una piedra, navaja, pistola, palo, lápiz etc.) para agredir o amenazar a alguien', w: 2, tipo: 'R', cat: 'HIS', factor: 'Historial de violencia', signif: true,
      op: [['a', 'Sí, 1 o 2 veces', 1], ['b', 'Sí, 3 o más veces', 2], ['c', 'No', 0]] },
    { n: 14, t: 'En los últimos 6 meses, en mi familia comúnmente se gritan, insultan o golpean', w: 2, tipo: 'R', cat: 'HIS', factor: 'Exposición a violencia en el hogar', signif: true,
      op: [['a', 'Sí, varias veces', 2], ['b', 'Sí, rara vez', 1], ['c', 'No', 0]] },
    { n: 15, t: 'En los últimos 6 meses, en la escuela me siento inseguro(a). No puedo opinar o decir lo que pienso, por miedo a que se burlen de mí o que me agredan verbal o físicamente', w: 1, tipo: 'R', cat: 'CTX', factor: 'Delincuencia de compañeros',
      op: [['a', 'No', 0], ['b', 'Sí, por mis compañeros(as)', 1], ['c', 'Sí, por mis maestros(as)', 1], ['d', 'Sí, por mis maestros(as) y compañeros(as)', 2]] },
    { n: 16, t: 'He fumado cigarros o tomado alcohol', w: 2, tipo: 'R', cat: 'IND', factor: 'Problemas con el uso de sustancias', signif: true,
      op: [['a', 'Sí, actualmente', 2], ['b', 'Sí, hace más de 6 meses', 1], ['c', 'No fumo ni tomo', 0]] },
    { n: 17, t: 'He usado más de una vez tiner/thinner, marihuana/mota, tolueno u otra sustancia', w: 2, tipo: 'R', cat: 'IND', factor: 'Problemas con el uso de sustancias', critico: true,
      op: [['a', 'Sí, actualmente', 2], ['b', 'Sí, hace más de 6 meses', 1], ['c', 'No, nunca', 0]] },
    { n: 18, t: 'He tenido un problema con mi familia, amigos, escuela o trabajo por haber tomado bebidas alcohólicas o haber fumado cigarrillos', w: 2, tipo: 'R', cat: 'IND', factor: 'Problemas con el uso de sustancias', critico: true,
      op: [['a', 'Sí, actualmente', 2], ['b', 'Sí, hace más de 6 meses', 1], ['c', 'No, nunca', 0]] },
    { n: 19, t: 'Mi primera relación sexual fue:', w: 2, tipo: 'R', cat: 'IND', factor: 'Historial de ofensas no violentas', critico: true,
      op: [['a', 'No he tenido relaciones sexuales', 0], ['b', 'Antes de los 13 años', 2]] },
    { n: 20, t: 'Generalmente, cuando tengo relaciones sexuales utilizo el método de protección sexual (puedes seleccionar más de una respuesta):', w: 2, tipo: 'R', cat: 'IND', factor: 'Toma de riesgo/impulsividad', critico: true, multiple: true,
      op: [['a', 'No he tenido relaciones sexuales', 0], ['b', 'Condón', 1], ['c', 'Pastillas anticonceptivas', 1], ['d', 'Pastillas de emergencia o del día siguiente', 1], ['e', 'No utilizo ningún método', 2], ['f', 'Otro', '']],
      abiertas: [{ clave: '20_cual', t: '¿Cuál otro método?', si: ['f'] }] },
    { n: 21, t: 'En algún momento de mi vida, he pensado en hacerme daño', w: 2, tipo: 'R', cat: 'HIS', factor: 'Historial de auto-daño o intento de suicidio', critico: true, alerta: true,
      op: [['a', 'Sí, y lo intenté', 2], ['b', 'Sí, pero no lo intenté', 1], ['c', 'No, nunca', 0]],
      abiertas: [{ clave: '21_veces', t: '¿Cuántas veces?', si: ['a', 'b'] }, { clave: '21_cuando', t: '¿Cuándo?', si: ['a', 'b'] }] },
    { n: 22, t: 'En algún momento de mi vida, he pensado en un plan para morir', w: 2, tipo: 'R', cat: 'HIS', factor: 'Historial de auto-daño o intento de suicidio', critico: true, alerta: true,
      op: [['a', 'Sí, y lo intenté', 2], ['b', 'Sí, pero no lo intenté', 1], ['c', 'No, nunca', 0]],
      abiertas: [{ clave: '22_veces', t: '¿Cuántas veces?', si: ['a', 'b'] }, { clave: '22_cuando', t: '¿Cuándo?', si: ['a', 'b'] }] },
    { n: 23, t: 'Tengo algún familiar que ha estado en la cárcel', w: 1, tipo: 'R', cat: 'HIS', factor: 'Criminalidad de padres o tutores',
      op: [['a', 'Sí, más de uno', 2], ['b', 'Sí, sólo uno', 1], ['c', 'No', 0]] },
    { n: 24, t: 'Es importante para mí terminar la escuela y seguir estudiando', w: 1, tipo: 'P', cat: 'PRO', factor: 'Compromiso fuerte con la escuela',
      op: [['a', 'Sí', 0], ['b', 'No', 1]] },
    { n: 25, t: 'Si me mudara a otro estado, ¿cómo sería mi reacción?', w: 1, tipo: 'P', cat: 'PRO', factor: 'Rasgos de personalidad flexible (resiliencia)',
      op: [['a', 'Me sería difícil de superar', 1], ['b', 'Me sería difícil al principio pero me adaptaría', 0], ['c', 'No me importaría', 0]] },
    { n: 26, t: 'En el último año, ¿cuál fue la causa de la lesión más seria que sufrí?', w: 1, tipo: 'R', cat: 'IND', factor: 'Toma de riesgo/impulsividad',
      op: [['a', 'No sufrí ninguna lesión seria', 0], ['b', 'Un accidente por ir a alta velocidad (más de 70 km/hr) en coche, moto o bicicleta', 1], ['c', 'Una pelea a golpes con alguien', 1], ['d', 'Una caída', 1], ['e', 'Me quemé con juegos artificiales (cohetes)', 2], ['f', 'Algo distinto causó mi lesión', '']],
      abiertas: [{ clave: '26_que', t: '¿Qué fue?', si: ['f'] }] }
  ];
  var ERI_CATEGORIAS = [
    { clave: 'HIS', nombre: 'Factores históricos' },
    { clave: 'CTX', nombre: 'Factores contextuales' },
    { clave: 'IND', nombre: 'Factores de riesgo individuales / clínicos' },
    { clave: 'PRO', nombre: 'Factores de protección' }
  ];
  // Rangos de la puntuación total (hoja "Analisis riesgo", fila PUNTUACIÓN TOTAL)
  var ERI_RANGOS_TOTAL = { bajo: [0, 14], medio: [15, 38], alto: [39, 999] };

  function puntajeItemERI(item, resp) {
    if (resp === undefined || resp === null || resp === '' || resp === 'NR') return null;
    var letras = String(resp).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var mejor = null;
    letras.forEach(function (l) {
      item.op.forEach(function (o) {
        if (o[0] === l && o[2] !== '') { mejor = (mejor === null) ? o[2] : Math.max(mejor, o[2]); }
      });
    });
    return mejor;
  }

  function bandaTotalERI(total) {
    if (total === null) return '';
    if (total <= ERI_RANGOS_TOTAL.bajo[1]) return 'BAJO';
    if (total <= ERI_RANGOS_TOTAL.medio[1]) return 'MEDIO';
    return 'ALTO';
  }

  // respuestas: { "1": "a", ..., "20": "b,c", "21_veces": "...", ... }
  function calificarERI(respuestas) {
    respuestas = respuestas || {};
    var items = {}, total = 0, signif = 0, critMedio = 0, critAlto = 0, faltantes = [];
    var alertas = [];
    ERI_ITEMS.forEach(function (it) {
      var p = puntajeItemERI(it, respuestas[String(it.n)]);
      items[it.n] = p;
      var r = respuestas[String(it.n)];
      if (r === undefined || r === null || r === '' || r === 'NR') faltantes.push(it.n);
      if (p !== null) {
        total += p * it.w;
        if (it.signif && p > 0) signif++;
        if (it.critico && p === 1) critMedio++;
        if (it.critico && p === 2) critAlto++;
        if (it.alerta && p > 0) alertas.push(it.n);
      }
    });
    // Riesgo global (columna "NIVEL DE RIESGO" del Anexo 18):
    //   ALTO  = total >= 39  o  algún factor crítico en 2
    //   MEDIO = total 15-38  o  algún factor crítico en 1
    //   BAJO  = total <= 14 y ningún factor crítico
    // (La fórmula original deja vacíos dos casos intermedios; aquí se
    //  resuelven hacia el nivel más alto que indica cualquiera de los dos criterios.)
    var global;
    if (total >= ERI_RANGOS_TOTAL.alto[0] || critAlto > 0) global = 'ALTO';
    else if (total >= ERI_RANGOS_TOTAL.medio[0] || critMedio > 0) global = 'MEDIO';
    else global = 'BAJO';
    return {
      items: items, total: total, bandaTotal: bandaTotalERI(total),
      significativos: signif, criticosMedio: critMedio, criticosAlto: critAlto,
      riesgoGlobal: global, alertaItems: alertas, faltantes: faltantes
    };
  }

  function maxTotalERI() {
    return ERI_ITEMS.reduce(function (s, it) {
      var m = 0; it.op.forEach(function (o) { if (o[2] !== '' && o[2] > m) m = o[2]; });
      return s + m * it.w;
    }, 0);
  }

  return {
    SDQ_OPCIONES: SDQ_OPCIONES, SDQ_ITEMS: SDQ_ITEMS, SDQ_ESCALAS: SDQ_ESCALAS, SDQ_DIFICULTADES: SDQ_DIFICULTADES,
    calificarSDQ: calificarSDQ, bandaSDQ: banda,
    ERI_ITEMS: ERI_ITEMS, ERI_SECCIONES: ERI_SECCIONES, ERI_CATEGORIAS: ERI_CATEGORIAS, ERI_RANGOS_TOTAL: ERI_RANGOS_TOTAL,
    calificarERI: calificarERI, puntajeItemERI: puntajeItemERI, maxTotalERI: maxTotalERI,
    MOMENTOS: ['Base', 'Final'],
    SEXOS: ['Mujer', 'Hombre']
  };
})();

if (typeof module !== 'undefined') module.exports = MONS;
