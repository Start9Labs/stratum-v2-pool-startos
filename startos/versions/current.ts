import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.0:0',
  releaseNotes: {
    en_US:
      'Updated Stratum V2 Pool to 0.9.0. Isolates miner payouts per connection, binds job tokens to the requesting miner, and hardens job validation. Miners sharing one connection must use the same payout policy. Update the Stratum V2 service to 0.9.0 alongside this pool. Bitcoin IPC remains on version 31; JDS PushSolution block propagation requires version 32 and is not available in this package. Full notes: https://github.com/stratum-mining/sv2-apps/releases/tag/v0.9.0',
    es_ES:
      'Stratum V2 Pool actualizado a 0.9.0. Aísla los pagos de los mineros por conexión, vincula los tokens de trabajo al minero solicitante y refuerza la validación de trabajos. Los mineros que comparten una conexión deben usar la misma política de pago. Actualiza el servicio Stratum V2 a 0.9.0 junto con este pool. Bitcoin IPC sigue en la versión 31; la propagación de bloques mediante JDS PushSolution requiere la versión 32 y no está disponible en este paquete. Notas completas: https://github.com/stratum-mining/sv2-apps/releases/tag/v0.9.0',
    de_DE:
      'Stratum V2 Pool auf 0.9.0 aktualisiert. Trennt Miner-Auszahlungen pro Verbindung, bindet Job-Token an den anfordernden Miner und verbessert die Job-Validierung. Miner auf derselben Verbindung müssen dieselbe Auszahlungsregel verwenden. Den Dienst Stratum V2 zusammen mit diesem Pool auf 0.9.0 aktualisieren. Bitcoin IPC bleibt auf Version 31; die Blockweiterleitung über JDS PushSolution erfordert Version 32 und ist in diesem Paket nicht verfügbar. Vollständige Hinweise: https://github.com/stratum-mining/sv2-apps/releases/tag/v0.9.0',
    pl_PL:
      'Zaktualizowano Stratum V2 Pool do 0.9.0. Izoluje wypłaty koparek według połączenia, wiąże tokeny zadań z żądającą koparką i wzmacnia walidację zadań. Koparki współdzielące połączenie muszą używać tej samej polityki wypłat. Zaktualizuj usługę Stratum V2 do 0.9.0 razem z tą pulą. Bitcoin IPC pozostaje w wersji 31; propagacja bloków przez JDS PushSolution wymaga wersji 32 i nie jest dostępna w tym pakiecie. Pełne informacje: https://github.com/stratum-mining/sv2-apps/releases/tag/v0.9.0',
    fr_FR:
      'Stratum V2 Pool passe à 0.9.0. Isole les paiements des mineurs par connexion, lie les jetons de travail au mineur demandeur et renforce la validation des travaux. Les mineurs partageant une connexion doivent utiliser la même politique de paiement. Mettez le service Stratum V2 à jour vers 0.9.0 en même temps que ce pool. Bitcoin IPC reste en version 31 ; la propagation des blocs via JDS PushSolution exige la version 32 et reste indisponible dans ce paquet. Notes complètes : https://github.com/stratum-mining/sv2-apps/releases/tag/v0.9.0',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
