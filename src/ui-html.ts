// ui-html.ts

/*
 * Customized version of swagger-ui HTML.
 */

import {Document} from 'swagger2';

export default (document: Document, pathRoot: string) => `

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${document.info.title}</title>
    <link rel="icon" type="image/png" href="${pathRoot}images/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="${pathRoot}images/favicon-16x16.png" sizes="16x16" />
    <link href='${pathRoot}css/typography.css' media='screen' rel='stylesheet' type='text/css'/>
    <link href='${pathRoot}css/reset.css' media='screen' rel='stylesheet' type='text/css'/>
    <link href='${pathRoot}css/screen.css' media='screen' rel='stylesheet' type='text/css'/>
    <link href='${pathRoot}css/reset.css' media='print' rel='stylesheet' type='text/css'/>
    <link href='${pathRoot}css/print.css' media='print' rel='stylesheet' type='text/css'/>

    <script src='${pathRoot}lib/object-assign-pollyfill.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/jquery-1.8.0.min.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/jquery.slideto.min.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/jquery.wiggle.min.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/jquery.ba-bbq.min.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/handlebars-4.0.5.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/lodash.min.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/backbone-min.js' type='text/javascript'></script>
    <script src='${pathRoot}swagger-ui.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/highlight.9.1.0.pack.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/highlight.9.1.0.pack_extended.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/jsoneditor.min.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/marked.js' type='text/javascript'></script>
    <script src='${pathRoot}lib/swagger-oauth.js' type='text/javascript'></script>

    <!-- Some basic translations -->
    <!-- <script src='${pathRoot}lang/translator.js' type='text/javascript'></script> -->
    <!-- <script src='${pathRoot}lang/ru.js' type='text/javascript'></script> -->
    <!-- <script src='${pathRoot}lang/en.js' type='text/javascript'></script> -->

    <script type="text/javascript">
      $(function () {
        var url = '${pathRoot}api-docs';

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
