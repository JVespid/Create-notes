const server = require('./server/index')

module.exports = {
  exportPathMap: async function(
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/server': { page: '/server' }
    }
  },
  server: server
}
