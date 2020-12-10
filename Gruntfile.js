'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        dirs: {
            dest: 'dist',
            src: 'src',
            tmp: '.tmp'
        },

        staticinline: {
            dist: {
                options: {
                    basepath: '<%= dirs.tmp %>/'
                },
                files: [{
                    expand: true,
                    cwd: '<%= dirs.dest %>/',
                    src: '**/*.html',
                    dest: '<%= dirs.dest %>/'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    dest: '<%= dirs.dest %>/',
                    src: '*',
                    filter: 'isFile',
                    expand: true,
                    cwd: '<%= dirs.src %>/'
                }]
            }
        },

        concat: {
            css: {
                src: [
                    '<%= dirs.src %>/css/bootstrap.css',
                    '<%= dirs.src %>/css/style.css'
                ],
                dest: '<%= dirs.tmp %>/css/pack.css'
            }
        },

        postcss: {
            options: {
                processors: [
                    require('postcss-combine-duplicated-selectors')(),
                    require('autoprefixer')() // add vendor prefixes
                ]
            },
            dist: {
                src: '<%= concat.css.dest %>'
            }
        },

        purgecss: {
            dist: {
                options: {
                    content: [
                        '<%= dirs.dest %>/**/*.html'
                    ],
                    keyframes: true,
                    variables: true
                },
                files: {
                    '<%= concat.css.dest %>': ['<%= concat.css.dest %>']
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: false,
                    decodeEntities: true,
                    ignoreCustomComments: [/^\s*google(off|on):\s/],
                    minifyCSS: {
                        level: {
                            1: {
                                specialComments: 0,
                                roundingPrecision: 6
                            },
                            2: {
                                all: false,
                                mergeMedia: true,
                                removeDuplicateMediaBlocks: true,
                                removeEmpty: true
                            }
                        }
                    },
                    minifyJS: true,
                    minifyURLs: false,
                    processConditionalComments: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeOptionalAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    removeTagWhitespace: false,
                    sortAttributes: true,
                    sortClassName: true
                },
                expand: true,
                cwd: '<%= dirs.dest %>',
                dest: '<%= dirs.dest %>',
                src: ['**/*.html', '!404.html']
            }
        },

        connect: {
            options: {
                hostname: 'localhost',
                livereload: 35729,
                port: 8001
            },
            livereload: {
                options: {
                    base: '<%= dirs.dest %>/',
                    open: true  // Automatically open the webpage in the default browser
                }
            }
        },

        watch: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            dev: {
                files: ['<%= dirs.src %>/**', 'Gruntfile.js'],
                tasks: 'dev'
            },
            build: {
                files: ['<%= dirs.src %>/**', 'Gruntfile.js'],
                tasks: 'build'
            }
        },

        htmllint: {
            options: {
                ignore: /^CSS:/
            },
            src: '<%= dirs.dest %>/**/*.html'
        },

        clean: {
            dist: [
                '<%= dirs.dest %>/',
                '<%= dirs.tmp %>/'
            ]
        }
    });

    // Load any grunt plugins found in package.json.
    require('load-grunt-tasks')(grunt, { scope: 'dependencies' });
    require('time-grunt')(grunt);

    grunt.registerTask('dev', [
        'clean',
        'copy',
        'concat',
        'postcss',
        'staticinline'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'concat',
        'postcss',
        'purgecss',
        'staticinline',
        'htmlmin'
    ]);

    grunt.registerTask('test', [
        'build',
        'htmllint'
    ]);

    grunt.registerTask('server', [
        'build',
        'connect',
        'watch:build'
    ]);

    grunt.registerTask('default', [
        'dev',
        'connect',
        'watch:dev'
    ]);
};
