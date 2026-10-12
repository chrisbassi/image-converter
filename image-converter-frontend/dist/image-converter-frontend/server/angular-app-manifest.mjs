
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
    'index.csr.html': {size: 6690, hash: '23b1a2e64eeecb4e9ae9ee77aa074a5a43a193a3e604cce169e7e610bb042fbf', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 4160, hash: '0f129407b03ea74f9bad0ccc663624032839470c512449d23db76768dc724d97', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 54867, hash: 'b8799bec57ebca88b05d2ea1397e74d122ff8903c53e994758959da02a4038a5', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-N5M4DX6B.css': {size: 2980, hash: 'F7KVp8noUtc', text: () => import('./assets-chunks/styles-N5M4DX6B_css.mjs').then(m => m.default)}
  },
};
