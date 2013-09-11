# nonsensejs

`nonsensejs` is little script that helps web sites comply with [eu bureaucratic nonsense about web cookies](http://www.theeucookielaw.com/).

## Usage

Put reference to script nonsense.js to head of your site:

  <link rel="css" href="nonsense.css" />
  <script type="text/javascript" src="nonsense.js" />

Inside body create tag with id `nonsense_root`:

    <div id="nonsense_root"
         data-annoyer-enabled="yes">
       <div>
         This site wants to use cookies to improve user experience. Do you agree?     
         <button data-action='agree' class="nonsense-btn nonsense-yes">
           OK, no prob</button>
         <button data-action='refuse'class="nonsense-btn nonsense-no">
           No way!</button>
      </div>
    </div>

## Parameters

Optional parameters are passed via `data-` html5 attributes on `nonsense_root` element.

Recognised optional parameters are:

| Parameter | Default | Comment|
|---------- | ------- |--------|
| `data-cookie-name` | "nonsense" | Name of cookie to set. Cookie  will get value `agreed` or `disagree` according to users action.|
| `data-cookie-duration` | 356 * 30 | Validity period of cookie. Default is 30 years |
| `data-annoyer-enabled` | "yes" | If `yes`, annoyer will be launched every `data-annoyer-delay` miliseconds. |
| `data-annoyer-delay` | 15000 | Time among annoyer bursts in miliseconds. Default is every 15s |
| `data-on-previous-agree`| null | Global function that will be called if user agreed on terms. Typically one puts tracking initialisation code here. |
| `data-z-index`| 100 | z-index of nonsense_root element. Set higher if
necessary. |



## Minification

The source code is annotated with additional type information to help google closure compiler with
optimization.

To install google closure compiler, use `bower install`:

    bower install

And finally minify with google closure compiler:

    java -jar /bower_components/closure-compiler/compiler.jar \
           --output_wrapper "(function() {%output%})();" \
           --compilation_level=ADVANCED_OPTIMIZATIONS \
           --use_types_for_optimization js/nonsense.js \
           --js_output_file js/nonsense.min.js

To spare typing, there is a helper script named `minify.sh` which executes
all the necessary minification steps.
