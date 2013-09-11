#!/bin/sh

bower install
java -jar bower_components/closure-compiler/compiler.jar \
       --output_wrapper "(function() {%output%})();" \
       --compilation_level=ADVANCED_OPTIMIZATIONS \
       --use_types_for_optimization js/nonsense.js \
       --js_output_file js/nonsense.min.js
