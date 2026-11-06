import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.2:0',
  releaseNotes: {
    en_US:
      'Updated Stratum V2 Pool to 0.9.2. Job declarations now retry transactions lost from the node’s mempool, with a three-round limit to reduce delays under load, and log each outcome. Update the Stratum V2 service to 0.9.2 before or together with this pool to avoid unnecessary job-declaration fallback. Requires StartOS 0.4.1 or later. Full notes: https://github.com/stratum-mining/sv2-apps/compare/v0.9.0...v0.9.2',
    es_ES:
      'Stratum V2 Pool actualizado a 0.9.2. Las declaraciones de trabajos vuelven a solicitar las transacciones que desaparecen del mempool del nodo, con un límite de tres rondas para reducir las demoras bajo carga, y registran cada resultado. Actualiza el servicio Stratum V2 a 0.9.2 antes o junto con este pool para evitar cambios innecesarios al modo de respaldo en la declaración de trabajos. Requiere StartOS 0.4.1 o posterior. Notas completas: https://github.com/stratum-mining/sv2-apps/compare/v0.9.0...v0.9.2',
    de_DE:
      'Stratum V2 Pool auf 0.9.2 aktualisiert. Job-Deklarationen fordern aus dem Mempool des Nodes verschwundene Transaktionen erneut an, begrenzen dies auf drei Runden für weniger Verzögerungen unter Last und protokollieren jedes Ergebnis. Den Dienst Stratum V2 vor oder zusammen mit diesem Pool auf 0.9.2 aktualisieren, um unnötige Fallbacks bei der Job-Deklaration zu vermeiden. Erfordert StartOS 0.4.1 oder neuer. Vollständige Hinweise: https://github.com/stratum-mining/sv2-apps/compare/v0.9.0...v0.9.2',
    pl_PL:
      'Zaktualizowano Stratum V2 Pool do 0.9.2. Deklaracje zadań ponownie żądają transakcji, które zniknęły z mempoola węzła, z limitem trzech rund ograniczającym opóźnienia pod obciążeniem, i rejestrują każdy wynik. Zaktualizuj usługę Stratum V2 do 0.9.2 przed aktualizacją tej puli lub razem z nią, aby uniknąć niepotrzebnego przechodzenia w tryb awaryjny deklarowania zadań. Wymaga StartOS 0.4.1 lub nowszego. Pełne informacje: https://github.com/stratum-mining/sv2-apps/compare/v0.9.0...v0.9.2',
    fr_FR:
      'Stratum V2 Pool passe à 0.9.2. Les déclarations de travaux redemandent les transactions disparues du mempool du nœud, dans une limite de trois tours pour réduire les délais sous charge, et journalisent chaque résultat. Mettez le service Stratum V2 à jour vers 0.9.2 avant ou en même temps que ce pool pour éviter les basculements inutiles lors de la déclaration des travaux. Nécessite StartOS 0.4.1 ou ultérieur. Notes complètes : https://github.com/stratum-mining/sv2-apps/compare/v0.9.0...v0.9.2',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
