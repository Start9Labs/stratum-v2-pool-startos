import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.2:1',
  releaseNotes: {
    en_US:
      "Requires StartOS 0.4.1 or later. Miners and JD clients can now connect to the pool and Job Declaration Server over the server's IPv6 addresses.",
    es_ES:
      'Requiere StartOS 0.4.1 o posterior. Los mineros y clientes JD ahora pueden conectarse al pool y al Job Declaration Server a través de las direcciones IPv6 del servidor.',
    de_DE:
      'Erfordert StartOS 0.4.1 oder neuer. Miner und JD-Clients können sich jetzt über die IPv6-Adressen des Servers mit dem Pool und dem Job Declaration Server verbinden.',
    pl_PL:
      'Wymaga StartOS 0.4.1 lub nowszego. Koparki i klienci JD mogą teraz łączyć się z pulą i serwerem Job Declaration przez adresy IPv6 serwera.',
    fr_FR:
      'Nécessite StartOS 0.4.1 ou une version ultérieure. Les mineurs et les clients JD peuvent désormais se connecter au pool et au Job Declaration Server via les adresses IPv6 du serveur.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
