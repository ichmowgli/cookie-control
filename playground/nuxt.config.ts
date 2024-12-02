export default defineNuxtConfig({
  app: {
    head: {
      title: 'Playground',
    },
  },
  compatibilityDate: '2024-04-03',
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@dargmuesli/nuxt-cookie-control'],
  typescript: {
    includeWorkspace: true,
  },

  // module options
  cookieControl: {
    colors: {
      barBackground: '#017275',
      barTitleColor: '#ddd',
      checkboxActiveBackground: '#C6C6CD',
      checkboxInactiveBackground: '#ede1e1',
      checkboxActiveCircleBackground: '#05989B',
      checkboxInactiveCircleBackground: '#f44336',
      checkboxDisabledBackground: '#ddd',
      checkboxDisabledCircleBackground: '#fff',
    },
    closeModalOnClickOutside: true,
    cookies: {
      necessary: [
        {
          id: 'ncc_f',
          name: {
            sk: 'Funkčné',
            en: 'Functional',
          },
          description: {
            sk: 'Technické uloženie alebo prístup sú nevyhnutne potrebné na legitímny účel umožnenia použitia konkrétnej služby, ktorú si účastník alebo používateľ výslovne vyžiadal, alebo na jediný účel vykonania prenosu komunikácie cez elektronickú komunikačnú sieť.',
            en: 'Technical storage or access is strictly necessary for the legitimate purpose of enabling the use of a specific service that the subscriber or user has expressly requested, or for the sole purpose of transmitting a communication over an electronic communications network.',
          },
        },
      ],
      optional: [
        {
          id: 'stat',
          name: {
            sk: 'Štatistické',
            en: 'Statistics',
          },
          description: {
            sk: 'Technické úložisko alebo prístup, ktorý sa používa výlučne na štatistické účely.',
            en: 'Technical repository or access used exclusively for statistical purposes.',
          },
          links: {
            '/': 'Local Privacy Policy',
            'https://example.com': '3rd Party Privacy Policy',
            'https://example.cop': null,
          },
          targetCookieIds: ['_o', '_p', '_t'],
        },
        {
          id: 'marketing',
          name: 'Marketingové',
          description: {
            sk: 'Technické úložisko alebo prístup, ktorý sa používa výlučne na marketingové účely.',
            en: 'Technical repository or access used exclusively for marketing purposes.',
          },
          links: {
            '/': 'Local Privacy Policy',
            'https://example.com': '3rd Party Privacy Policy',
            'https://example.cop': null,
          },
          targetCookieIds: ['_a', '_b', '_c'],
        },
      ],
    },
    isDashInDescriptionEnabled: false,
    isCookieIdVisible: true,
    isIframeBlocked: true,
    locales: ['en', 'sk'],
  },
})
