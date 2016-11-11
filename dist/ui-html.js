// ui-html.ts
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (document, pathPrefix) => `

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${document.info.title}</title>
    <link rel="icon" type="image/png" href="${pathPrefix}images/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="${pathPrefix}images/favicon-16x16.png" sizes="16x16" />
    <link href='${pathPrefix}css/typography.css' media='screen' rel='stylesheet' type='text/css'/>
    <link href='${pathPrefix}css/reset.css' media='screen' rel='stylesheet' type='text/css'/>
    <link href='${pathPrefix}css/screen.css' media='screen' rel='stylesheet' type='text/css'/>
    <link href='${pathPrefix}css/reset.css' media='print' rel='stylesheet' type='text/css'/>
    <link href='${pathPrefix}css/print.css' media='print' rel='stylesheet' type='text/css'/>

    <script src='${pathPrefix}lib/object-assign-pollyfill.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/jquery-1.8.0.min.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/jquery.slideto.min.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/jquery.wiggle.min.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/jquery.ba-bbq.min.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/handlebars-4.0.5.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/lodash.min.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/backbone-min.js' type='text/javascript'></script>
    <script src='${pathPrefix}swagger-ui.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/highlight.9.1.0.pack.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/highlight.9.1.0.pack_extended.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/jsoneditor.min.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/marked.js' type='text/javascript'></script>
    <script src='${pathPrefix}lib/swagger-oauth.js' type='text/javascript'></script>

    <!-- Some basic translations -->
    <!-- <script src='${pathPrefix}lang/translator.js' type='text/javascript'></script> -->
    <!-- <script src='${pathPrefix}lang/ru.js' type='text/javascript'></script> -->
    <!-- <script src='${pathPrefix}lang/en.js' type='text/javascript'></script> -->

    <script type="text/javascript">
      $(function () {
        var url = '${pathPrefix}api-docs';

        hljs.configure({
          highlightSizeThreshold: 5000
        });

        // Pre load translate...
        if(window.SwaggerTranslator) {
          window.SwaggerTranslator.translate();
        }
        window.swaggerUi = new SwaggerUi({
          url: url,
          dom_id: "swagger-ui-container",
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
          onComplete: function(swaggerApi, swaggerUi){
            if(typeof initOAuth == "function") {
              initOAuth({
                clientId: "your-client-id",
                clientSecret: "your-client-secret-if-required",
                realm: "your-realms",
                appName: "your-app-name",
                scopeSeparator: " ",
                additionalQueryStringParams: {}
              });
            }

            if(window.SwaggerTranslator) {
              window.SwaggerTranslator.translate();
            }
          },
          onFailure: function(data) {
            log("Unable to Load SwaggerUI");
          },
          docExpansion: "none",
          jsonEditor: false,
          defaultModelRendering: 'schema',
          showRequestHeaders: false
        });

        window.swaggerUi.load();

        function log() {
          if ('console' in window) {
            console.log.apply(console, arguments);
          }
        }
    });
    </script>
  </head>

  <body class="swagger-section">
    <div id="message-bar" class="swagger-ui-wrap" data-sw-translate>&nbsp;</div>
    <div id="swagger-ui-container" class="swagger-ui-wrap"></div>
  </body>
</html>

`;
//# sourceMappingURL=ui-html.js.map