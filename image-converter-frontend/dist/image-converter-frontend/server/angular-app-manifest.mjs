
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
    'index.csr.html': {size: 6690, hash: '67522de27e23aa36f3cb9ac99477c744cabab6c78a859c133e4968cca360fd82', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 4160, hash: 'f0069a39b4e9b7d85a60eff06089826ad0f8cbc9438cddcc9bd880de9e4f1d02', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 54924, hash: 'e9e905c49c63f8a6f95c3a35a88cd4743ea4186d033aaf8d393965a3991f092f', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-N5M4DX6B.css': {size: 2980, hash: 'F7KVp8noUtc', text: () => import('./assets-chunks/styles-N5M4DX6B_css.mjs').then(m => m.default)}
  },
};
