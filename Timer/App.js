/*global console, Ext */

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    layout: { type: 'vbox' },
    flex: 1,
    items: [ {
        xtype: 'container',
        itemId: 'settings',
        cls: 'blue_box',
        height: 30,
        width: 350,
        layout: { type: 'hbox' },
        items: [{
            xtype: 'rallybutton',
            text: 'Go',
            width: 50,
            margin: 2,
            handler: function() {
                var me = this.ownerCt.ownerCt;
                if ( me.task ) { 
                    Ext.TaskManager.start(me.task);
                } else {
                    me.task = Ext.TaskManager.start({ run: me._burnTime, interval: 1000, scope: me } );
                }
            }
        },
        {
            xtype: 'rallybutton',
            text: 'Pause',
            width: 55,
            margin: 2,
            handler: function() {
                var me = this.ownerCt.ownerCt;
                if ( me.task ) {
                    Ext.TaskManager.stop(me.task);
                }
            }
        },
        {
            xtype: 'rallybutton',
            text: 'Reset',
            width: 55,
            margin: 2,
            handler: function() {
                this.ownerCt.ownerCt._resetGlasses();
            }
        },
        {
            xtype: 'rallycombobox',
            margin: 2,
            width: 45,
            itemId: 'hours_combo',
            value: 0,
            store:  [ 0, 1, 2, 3, 4, 5]
        },
        {
            xtype: 'component',
            flex: 1,
            margin: 2,
            padding: 3,
            html: ':'
        },
        {
            xtype: 'rallycombobox',
            margin: 2,
            width: 45,
            itemId: 'minutes_combo',
            value: 15,
            store:  [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ]
        },
        {
            xtype: 'component',
            flex: 1,
            margin: 2,
            padding: 3,
            html: ':'
        },
        {
            xtype: 'rallycombobox',
            margin: 2,
            width: 45,
            itemId: 'seconds_combo',
            value: 0,
            store:  [ 0, 15, 30, 45 ]
        }]
    },
    {
        xtype: 'container',
        cls: 'blue_box',
        itemId: 'outer_boxes',
        layout: { type: 'hbox' },
        items: [ {
            xtype: 'container',
            cls: 'blue_box',
            itemId: 'hours_box',
            padding: 2
        },
        {
            xtype: 'container',
            cls: 'blue_box',
            itemId: 'minutes_box',
            padding: 2
        },
        {
            xtype: 'container',
            cls: 'blue_box',
            itemId: 'seconds_box',
            padding: 2
        }]
    }],
    launch: function() {
        var me = this;
        this.body_width = Ext.getBody().getViewSize().width - 12; 
        this.body_height = Ext.getBody().getViewSize().height - 50;
        Ext.Array.each( [ "hours", "minutes", "seconds" ], function( type ) {
            me.down('#' + type + '_box').width = me.body_width / 3;
            me.down('#' + type + '_box').height = me.body_height;
        });
        
        this._initializeGlasses();
    },
    _getTargetTime: function() {
        var seconds = parseInt( this.down('#seconds_combo').getRawValue(), 10 );
        var minutes = parseInt( this.down('#minutes_combo').getRawValue(), 10 );
        var hours = parseInt( this.down('#hours_combo').getRawValue(), 10 );
        
        return seconds + 60*minutes + 3600*hours;
    },
    _initializeGlasses: function() {
        var me  = this;
        
        this.time_target = this._getTargetTime();
        this.time_remaining = this.time_target;

        var seconds = 60;
        var minutes = 0;
        var hours = 0;
        
        console.log( this.time_target );
        if ( this.time_target < 60 ) { 
            seconds = this.time_target; 
        } else if ( this.time_target < 3600 ) {
            minutes = Math.floor( this.time_target / 60 );
        } else {
            minutes = 60;
            hours = Math.floor( this.time_target / 3600 );
        }
        
        if ( this.second_sand ) { this.second_sand.destroy(); } 
        this.second_sand = Ext.create('SandTimer',{
            width: me.body_width/3,
            height: me.body_height,
            target: me.down('#seconds_box'),
            total: seconds
        });
        if ( this.minute_sand ) { this.minute_sand.destroy(); } 
        this.minute_sand = Ext.create('SandTimer',{
            width: me.body_width/3,
            height: me.body_height,
            target: me.down('#minutes_box'),
            total: minutes
        });
        if ( this.hour_sand ) { this.hour_sand.destroy(); } 
        this.hour_sand = Ext.create('SandTimer',{
            width: me.body_width/3,
            height: me.body_height,
            target: me.down('#hours_box'),
            total: hours
        });
        
    },
    _resetGlasses: function() {
        if ( this.task ) {
            Ext.TaskManager.stop(this.task);
        }
        this.second_sand.reset( );
        this.minute_sand.reset( );
        
        if  ( this._getTargetTime() !== this.time_target ) {
            console.log( "Reset with new values" );
            this._initializeGlasses();
        } else {
            this.time_remaining = this.time_target;
        }

    },
    _burnTime: function() {
        this.time_remaining -= 1;
        if ( this.time_remaining <= 0 && this.task ) {
            Ext.TaskManager.stop(this.task);
            this.hour_sand.updateToRemaining( 0 );
            this.minute_sand.updateToRemaining( 0 );
            this.second_sand.updateToRemaining( 0 );
        } else {
            var seconds_remaining = 60;
            var minutes_remaining = 0;
            var hours_remaining = 0;
            if ( this.time_remaining <= 60 ) {
                seconds_remaining = this.time_remaining;
            } else if ( this.time_remaining <= 3600 )  {
                seconds_remaining = this.time_remaining % 60;
                minutes_remaining = Math.floor( this.time_remaining / 60 );
            } else {
                hours_remaining = Math.floor( this.time_remaining/3600 );
                var left_overs = this.time_remaining % 3600;
                minutes_remaining = Math.floor( left_overs / 60 );
                seconds_remaining = left_overs % 60;
            }
        
            console.log( hours_remaining, ":", minutes_remaining, ":", seconds_remaining );
            if ( seconds_remaining === 0 || seconds_remaining === 60 ) { 
                this.second_sand.reset();
            } else {
                this.second_sand.updateToRemaining( seconds_remaining );
            }
            if ( minutes_remaining === 60 ) {
                this.minute_sand.reset();
            } else {
                this.minute_sand.updateToRemaining( minutes_remaining );
            }
            this.hour_sand.updateToRemaining( hours_remaining );    
        }
        
    }
});
