module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    less: {
      development: {
        files: {
          // target.css file: source.less file
          "build/<%= pkg.name %>.css": [
            "less/app.less"
          ]
        }
      },
      production: {
        options: {
          compress: true,
          cleancss: true,
        },
        files: {
          // target.css file: source.less file
          "dist/<%= pkg.name %>.css": [
            "less/app.less"
          ]
        }
      }
    },


    react: {
      components: {
        files: {
          'build/tmp/react-components.js': [
            'jsx/components/*.jsx',
          ]
        }
      },
      index: {
        files: { 'build/tmp/index.js': 'jsx/index.jsx' }
      },
    },

    concat: {
      options: {
        separator: "\n", //add a new line after each file
        banner: "", //added before everything
        footer: "" //added after everything
      },
      js: {
        // the files to concatenate
        src: [
          'bower_components/react/react-with-addons.js',
          'bower_components/js-signals/dist/signals.js',
          'bower_components/zeroclipboard/dist/ZeroClipboard.js',
          'lib/themoviedb.js',
          //'build/react-mixins.js',
          'build/tmp/react-components.js',
          'build/tmp/index.js',
        ],
        // the location of the resulting JS file
        dest: 'build/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: ""
      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    watch: {
      styles: {
        // Which files to watch (all .less files recursively in the less directory)
        files: ['less/**/*.less'],
        tasks: ['less'],
      },
      react: {
        files: ['jsx/**/*.jsx'],
        tasks: ['react']
      },
      scripts: {
        files: ['build/**/*.js'],
        tasks: ['concat']
      },
      livereload: {
        // Here we watch the files the less task will compile to
        // These files are sent to the live reload server after less compiles to them
        options: { livereload: true },
        files: ['dist/**/*'],
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['less', 'react', 'concat', 'uglify']);
};