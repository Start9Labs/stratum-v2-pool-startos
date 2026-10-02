import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.8.0:0',
  releaseNotes: {
    en_US: `Updated Stratum V2 Pool to 0.8.0.

- Hardens Noise handshakes, protocol validation, and job declaration
- Fixes extranonce allocation exhaustion and improves graceful shutdown
- Adds optional past-job retention tuning in Configure
- Keeps Pool Server readiness pending until Bitcoin supplies the initial template and previous-block hash

[Full release notes](https://github.com/stratum-mining/sv2-apps/releases/tag/v0.8.0)`,
    es_ES: `Se actualizó Stratum V2 Pool a la versión 0.8.0.

- Refuerza los intercambios Noise, la validación del protocolo y la declaración de trabajo
- Corrige el agotamiento de la asignación de extranonce y mejora el apagado ordenado
- Añade un ajuste opcional de retención de trabajos anteriores en Configurar
- El servidor del pool espera la plantilla inicial y el hash del bloque anterior de Bitcoin antes de marcarse como listo

[Notas completas de la versión](https://github.com/stratum-mining/sv2-apps/releases/tag/v0.8.0)`,
    de_DE: `Stratum V2 Pool wurde auf Version 0.8.0 aktualisiert.

- Härtet Noise-Handshakes, Protokollvalidierung und Job Declaration ab
- Behebt die Erschöpfung der Extranonce-Zuweisung und verbessert das geordnete Herunterfahren
- Fügt eine optionale Einstellung für die Aufbewahrung früherer Jobs in Konfigurieren hinzu
- Der Pool-Server meldet sich erst bereit, wenn Bitcoin die erste Vorlage und den Hash des vorherigen Blocks liefert

[Vollständige Versionshinweise](https://github.com/stratum-mining/sv2-apps/releases/tag/v0.8.0)`,
    pl_PL: `Zaktualizowano Stratum V2 Pool do wersji 0.8.0.

- Wzmacnia uzgadnianie Noise, walidację protokołu i deklarowanie zadań
- Naprawia wyczerpywanie przydziałów extranonce i usprawnia kontrolowane zamykanie
- Dodaje opcjonalne ustawienie retencji poprzednich zadań w Konfiguruj
- Serwer puli zgłasza gotowość dopiero po otrzymaniu początkowego szablonu i hasha poprzedniego bloku z Bitcoina

[Pełne informacje o wydaniu](https://github.com/stratum-mining/sv2-apps/releases/tag/v0.8.0)`,
    fr_FR: `Stratum V2 Pool a été mis à jour vers la version 0.8.0.

- Renforce les échanges Noise, la validation du protocole et la déclaration de travail
- Corrige l’épuisement des allocations d’extranonce et améliore l’arrêt ordonné
- Ajoute un réglage facultatif de rétention des anciens travaux dans Configurer
- Le serveur du pool ne se déclare prêt qu’après réception du modèle initial et du hash du bloc précédent de Bitcoin

[Notes de version complètes](https://github.com/stratum-mining/sv2-apps/releases/tag/v0.8.0)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
