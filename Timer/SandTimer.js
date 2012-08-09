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
    _createSand: function(){
        this.sand = [];
        var area = ( this.width * 0.5 * this.height ) - 16 ;
        var item_area = area / this.total;
        var radius = Math.sqrt( item_area / 3.14159 ) * 0.75;
        
        var x = 2 - radius;
        var y = ( 0.5 * this.height ) - 2 - radius;
        for ( var i=0;i<this.total; i++ ) {
            x += ( 2 * radius ) ;
            if ( x > ( this.width - 2 ) ) { 
                x = radius + 2; 
                y -= ( 2 * radius ); 
            }
            
            var particle = Ext.create( 'Ext.draw.Sprite', {
                type: 'circle',
                x: x,
                y: y,
                radius: radius,
                fill: '#5c9acb'
            });
            this.sand.unshift( particle );
        }
    },
    reset: function() {
        var me = this;
        this.counter.animate ({ to: { text: "  " }, duration: 1 });
        Ext.Array.each( this.sand, function( particle, index ) {
             var distance_from_border = particle.y;
            var new_y = ( 0.5 * me.height )  - distance_from_border - 2;               
            particle.animate( { 
                to: { 
                    fill: '#5c9acb',
                    y: new_y
                }, 
                duration: 5
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
            
                particle.animate( { 
                    to: { 
                        fill: '#b5d8eb',
                        y: new_y
                    }, 
                    duration: 600
                } );
            }
        });
    }
    
});
