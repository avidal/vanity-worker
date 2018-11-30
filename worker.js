// This worker is running live on https://code.heyviddy.com, ex: https://code.heyviddy.com/import-test-repo
// When using `go get`, the code will be fetched from github
// When using your browser, you'll be redirected to godoc.org

addEventListener('fetch', e => {
  e.respondWith(handle(e.request));
});

async function handle(request) {
  const url = new URL(request.url);

  if(url.hostname.startsWith("code.")) {
    return handleCode(request, url);
  }

  return fetch(request);
}

async function handleCode(request, url) {
  const pkg = url.pathname.substring(1);

  // head is the package root, tail is the rest of it
  const [head, ...rest] = pkg.split("/");
  const tail = rest.join("/");

  return new Response(`
      <html><head>
      <meta name="go-import" content="code.heyviddy.com/${head} git https://github.com/avidal/${head}">
      <meta name="go-source" content="code.heyviddy.com/${head} https://github.com/avidal/${head} https://github.com/avidal/${head}/tree/master{/dir} https://github.com/avidal/${head}/blob/master{/dir}/{file}#L{line}">
      <meta http-equiv="refresh" content="0; url=https://godoc.org/code.heyviddy.com/${pkg}">
      </head><body>
      Docs: <a href="https://godoc.org/code.heyviddy.com/${pkg}">here</a><br/>
      Code: <a href="https://github.com/avidal/${head}">here</a><br/><br/>
      Powered by <a href="https://cloudflareworkers.com">Cloudflare Workers</a>. Source: <a href="https://github.com/avidal/vanity-worker">here</a>.
      </body></html>
  `, { headers: { 'content-type': 'text/html' }});
}
