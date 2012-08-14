/*global console, Ext */
Ext.define( 'SandTimer', {
    extend: 'Ext.container.Container',
    padding: 5,  
    total: 60,
    constructor: function( cfg ) {
        this.callParent(arguments);
        this.initConfig(cfg);
    },
    initComponent: function() {
        this.callParent(arguments);
        this._createSand();
        
        this.counter = Ext.create( 'Ext.draw.Sprite', {
            type: 'text',
            text: '  ',
            x: this.width * 0.5,
            y: this.width * 0.5, 
            fill: '#000',
            font: this._getFont()
        } );
        this.canvas = Ext.create( 'Ext.draw.Component', {
            viewBox: false,
            width: this.width,
            height: this.height,
            items: Ext.Array.merge( this.sand, [ this.counter ] )
        });
        this.container = Ext.create( 'Ext.container.Container', { 
            width: this.width,
            height: this.height,
            items: [this.canvas] 
        });
        this.target.add( this.container );
    },
    destroy: function() {
        this.container.destroy();
        this.canvas.destroy();
        this.callParent();
    },
    _getFont: function() {
        var font_size = 25;
        if ( this.width < this.height ) {
            font_size = 0.4 * this.width;
        } else {
            font_size = 0.4 * this.height;
        }
        var font_string = font_size + "px Arial";
        return font_string;
    },
    _findPackRadius: function( start_radius, count ) {
        /* hooray for brute force */
        var radius = Math.floor(start_radius);
        if ( radius > this.height / 2) {
            radius = this.height / 2;
        }
        if ( radius > this.width/2 ) {
            radius = this.width/2;
        }
        
        var overrun_flag = false;
        var x = radius + 2;
        var y = radius + 2;
        for ( var i=0; i<=count; i++ ) {
            x = x + 2*radius;
            if ( x > this.width - 4 - ( 2*radius ) ) {
                x = radius + 2;
                y = y + 2*radius;
            }
            if ( y > (this.height/2) - 4 - radius ) { overrun_flag = true; }
        }
        if ( overrun_flag ) {
            radius = this._findPackRadius( radius - 5, count );
        }
        return radius;
    },
    _createSand: function(){
        this.sand = [];        
        var radius = this._findPackRadius(this.width,this.total);
        var ratio = radius / 50;
        
        var x = 4 - radius;
        var y = ( 0.5 * this.height ) - 2 - radius;
        for ( var i=0;i<this.total; i++ ) {
            x += ( 2 * radius ) ;
            if ( x > ( this.width - ( 2*radius ) - 2 ) ) { 
                x = radius + 2; 
                y -= ( 2 * radius ); 
            }

            var particle = Ext.create( 'Ext.draw.Sprite', {
                type: 'path',
                radius: radius,
                orig_y: y,
                scale: {
                    x: ratio,
                    y: ratio
                },
                stroke: "#EF3F35",
                "stroke-width": 4,
                x: x,
                y: y,
                opacity: 1,
                path: 'm 0,0 a 50,50 0 1,0 0,-100 a 50,50 0 1,0 0,100  a 30,30 0 1,0 0,-60 a 30,30 0 1,0 0,60 a 15,15 0 1,0 0,-30 a 15,15 0 1,0 0,30'
            });
            particle.setAttributes( { translate: { x: x, y: y } } );
            this.sand.unshift( particle );
        }
    },
    reset: function() {
        var me = this;
        this.counter.animate ({ to: { text: "  " }, duration: 1 });
        Ext.Array.each( this.sand, function( particle, index ) {
             var distance_from_border = particle.y;
            var new_y = particle.orig_y;   
            var new_x = particle.x;

            particle.animate( { 
                to: { 
                    stroke: '#EF3F35',
                    translate: { y: new_y, x: new_x },
                    path: 'm 0,0 a 50,50 0 1,0 0,-100 a 50,50 0 1,0 0,100  a 30,30 0 1,0 0,-60 a 30,30 0 1,0 0,60 a 15,15 0 1,0 0,-30 a 15,15 0 1,0 0,30'
                }, 
                duration: 400
            } );
        });
    },
    updateToRemaining: function( remaining ) {
        var me = this;
        var new_text = " " + remaining;
        this.counter.setAttributes({ text: new_text } , true);
        //this.counter.animate ({ to: { text: new_text }, duration: 01 });
        
        Ext.Array.each( this.sand, function(particle, index) {
            if ( index >= remaining ) {
                var distance_from_border = particle.y;
                var new_y = ( 0.5 * me.height )  + distance_from_border - 2;
                var new_x = particle.x;
                var old_x = particle.x;
                var old_y = particle.y;
                
                particle.animate( { 
                    to: { 
                        stroke: '#196C89',
                        translate: { y: new_y, x: new_x },
                        path: 'm3.1,0.5l-0.6,-35.92105l14.2,-1.57895l7.8,2.76316l4,5.72369l-1,7.10526l-7.2,4.14474l-13.2,-0.59211l19.2,17.17105l-22.4,-19.34211l-0.8,20.52632z'
                    },
                    duration: 600
                } );
            }
        });
    }
    
});
