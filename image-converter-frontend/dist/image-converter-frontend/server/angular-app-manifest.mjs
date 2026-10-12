
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/image-converter/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/image-converter"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6690, hash: '90a1b2c674ccb99eb254c7f2b62152dcc6ec0fd17fceef7c1a20d2e41812c38e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 4160, hash: '097a7e7863e5d833157f2c7513d363da83a9d6bafdecd6d6615310f156b78836', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 54870, hash: '4c5e7d539011f160588cd13c833f1e6874aaf0990044fdbdcd072385f3abbb54', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-N5M4DX6B.css': {size: 2980, hash: 'F7KVp8noUtc', text: () => import('./assets-chunks/styles-N5M4DX6B_css.mjs').then(m => m.default)}
  },
};
