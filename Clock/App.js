/*global console, Ext */
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    flex: 1,
    layout: { type: 'hbox' },
    items: [
            {
                xtype: 'container',
                itemId: 'outer_box',
                cls: 'blue_box', 
                width: 400,
                height: 400
                
            }
    ],
    number_names: [ "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"],
    launch: function() {
        var me = this;
        // resize to fit the window (have to set a fixed size to start or the drawComponent doesn't work)
        var box = me.down('#outer_box');
        box.setWidth( Ext.getBody().getViewSize().width - 5 );
        box.setHeight( Ext.getBody().getViewSize().height - 5 );
        
        this.seconds_array = this._createSeconds();
        this.minutes_array = this._createMinutes();
        this.hours_array = this._createHours();
        
        this.text_array = this._createText();
        
        var times = Ext.Array.merge( 
            this.seconds_array, 
            this.minutes_array, 
            this.hours_array, 
            this.text_array );
        
        var canvas = Ext.create( 'Ext.draw.Component', {
            viewBox: false,
            items: times
        });
        var container = Ext.create( 'Ext.container.Container', { items: [canvas] } );
        this.down('#outer_box').add(container);
        
        Ext.TaskManager.start({ run: this._updateClock, interval: 1000, scope: me } );
    },
    _createText: function() {
        var body_height = Ext.getBody().getViewSize().height - 5; 
        var text_height = ( body_height / 12 ) - 4;
        
        this.hour_text = Ext.create( 'Ext.draw.Sprite', { 
            type: 'text', 
            text: '12', 
            fill: '#fff',
            font: text_height + "px Arial"
        } );
        this.minute_tens_text = Ext.create( 'Ext.draw.Sprite', { 
            type: 'text', 
            text: '5', 
            fill: '#fff',
            font: text_height + "px Arial"
        } );
        this.minute_units_text = Ext.create( 'Ext.draw.Sprite', { 
            type: 'text', 
            text: '9', 
            fill: '#fff',
            font: text_height + "px Arial"
        } );
            
        return [ this.hour_text, this.minute_tens_text, this.minute_units_text ];
    },
    _createSeconds: function() {
        var seconds = [];

        var right = this.down('#outer_box').width;
        var bottom = this.down('#outer_box').height;
        
        var width = 0.1 * right;
        var height = this.down('#outer_box').height / 60;
                
        var color = '#79BB3F';
        for ( var i=0;i<60;i++ ) {
            var second = Ext.create( 'Ext.draw.Sprite', { 
                type: 'rect', 
                width: width - 2, 
                height: height - 2,
                x: right - width + 2, 
                y: bottom - ( height * ( i + 1 ) ), 
                fill: '#79BB3F'});
            seconds.push(second);
        }
        return seconds;
    },
    _createMinutes: function() {
        var minutes = [];

        var far_right = this.down('#outer_box').width;
        var bottom = this.down('#outer_box').height;
        
        var left = 0.4 * far_right;
        var width = 0.5 * far_right;
        var height = this.down('#outer_box').height / 6;
        
        var color = '#79BB3F';
        for ( var i=0;i<6;i++ ) {
            var minute_ten = Ext.create( 'Ext.draw.Sprite', { 
                type: 'rect', 
                width: 0.67 * ( width - 4 ), 
                height: height - 2,
                x: left + 2, 
                y: bottom - ( height * ( i + 1 ) ), 
                fill: '#79BB3F'});
            minutes.push(minute_ten);
        }
        
        height = this.down('#outer_box').height / 10;
        for ( var j=0;j<10;j++ ) {
            var minute_unit = Ext.create( 'Ext.draw.Sprite', { 
                type: 'rect', 
                width: 0.33* ( width - 4 ), 
                height: height - 2,
                x: left + ( 0.67*width) , 
                y: bottom - ( height * ( j + 1 ) ), 
                fill: '#79BB3F'});
            minutes.push(minute_unit);
        }
        return minutes;
    },
    _createHours: function() {
        var hours = [];

        var far_right = this.down('#outer_box').width;
        var bottom = this.down('#outer_box').height;
        
        var right = 0.4 * far_right;
        var width = right - 2;
        var height = this.down('#outer_box').height / 12;
        
        var color = '#79BB3F';
        for ( var i=0;i<12;i++ ) {
            var hour = Ext.create( 'Ext.draw.Sprite', { 
                type: 'rect', 
                width: width - 4, 
                height: height - 2,
                x: 2, 
                y: bottom - ( height * ( i + 1 ) ), 
                fill: '#79BB3F'});
            hours.push(hour);
        }
        return hours;
    },
    _setColors: function(now) {
        if ( now.getHours() <= 11 ) {
            this.current_color = "#196C89";
            this.past_color = "#B5D8EB";
        } else {
            this.current_color = "#3a874f";
            this.past_color = "#b2e3b6";
        }
    },
    _updateClock: function() {
        var now = new Date();
        this._setColors(now);
        
        this._updateSeconds( now.getSeconds() );
        this._updateMinutes( now.getMinutes() );
        this._updateHours( now.getHours() );
    },
    _updateSeconds: function( count ) {
        var me = this;
        Ext.Array.each( this.seconds_array, function( second, index ) {
            if ( index > count ) {
                second.setAttributes( { fill: '#fff' }, true );
            } else {
                second.setAttributes( { fill: me.past_color }, true );
            }
        });
    },
    _updateMinutes: function( count ) {
        //console.log( count );
        var me = this;
        var tens = Math.floor( count/10 );
        var units = count % 10;
        //console.log( units );
        
        Ext.Array.each( this.minutes_array, function( minute, index ) {
            if ( index >= 6 ) {
                //  units
                var sub_index = index - 6;
                if ( sub_index > units ) {
                    minute.setAttributes(  { fill: '#fff' }, true );
                } else if ( sub_index === units ) { 
                    minute.setAttributes( { fill: me.current_color }, true );
                    me.minute_units_text.setAttributes( { 
                            x: minute.x + ( 0.25 * minute.width ), 
                            y: minute.y  + ( minute.height / 2 ),
                            text: units
                    }, true);
                } else {
                    minute.setAttributes(  { fill: me.past_color }, true  );
                }
            } else {
                // tens
                if ( index > tens ) {
                    minute.setAttributes(  { fill: '#fff' }, true);
                } else if ( index === tens ) { 
                    minute.setAttributes(  { fill: me.current_color }, true );
                    me.minute_tens_text.setAttributes( { 
                            x: minute.x + ( 0.75 * minute.width  ), 
                            y: minute.y  + ( minute.height / 2 ),
                            text: tens
                    }, true);
                } else {
                    minute.setAttributes(  { fill: me.past_color }, true );
                }
            }
        });
    },
    _updateHours: function( count ) {

        var me = this;
        if ( count > 12 ) { count = count - 12; }
        
        count = count - 1;
        
        Ext.Array.each( this.hours_array, function( hour, index ) {
            if ( index > count ) {
                hour.setAttributes( { fill: '#fff' }, true);
            } else if ( index === count ) {
                hour.setAttributes(  { fill: me.current_color }, true );
                
                me.hour_text.setAttributes( { 
                        x: hour.x + ( 0.75 * hour.width ), 
                        y: hour.y + ( hour.height / 2 ),
                        text: count + 1
                }, true );
                
            } else {
                hour.setAttributes(  { fill: me.past_color}, true );
            }
        });
    }
});
