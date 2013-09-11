# nonsensejs

`nonsensejs` is little script that helps web sites comply with [eu bureaucratic nonsense about web cookies](http://www.theeucookielaw.com/).

## Usage

Put reference to script nonsense.js to head of your site:

  <link rel="css" href="nonsense.css" />
  <script type="text/javascript" src="nonsense.js" />

Inside body create tag with id `nonsense_root`:

    <div id="nonsense_root">
       <div>
         This site wants to use cookies to improve user experience. Do you agree?     
         <button data-action='agree' class="nonsense-btn nonsense-yes">
           OK, no prob</button>
         <button data-action='refuse'class="nonsense-btn nonsense-no">
           No way!</button>
      </div>
    </div>
 
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
