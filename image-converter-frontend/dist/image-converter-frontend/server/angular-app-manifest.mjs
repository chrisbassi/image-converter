
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
    'index.csr.html': {size: 6690, hash: '2e0e44e82be441f31f9fcdf919b3364bdfa9b827669842a682ce3ff20cc7e2e5', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 4160, hash: '7f79b69b831d0ffd22fcdef58229e0a76f2c910460349ecbe1b1cc70f4ece32e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 54478, hash: '17d0e5e16a7e8917399bfe7fe2476cb1768e6c06019e476013e32270ad75ee40', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-N5M4DX6B.css': {size: 2980, hash: 'F7KVp8noUtc', text: () => import('./assets-chunks/styles-N5M4DX6B_css.mjs').then(m => m.default)}
  },
};
