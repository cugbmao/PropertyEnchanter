/**
 * @author maowei
 */
//OpenLayers.Projection.addTransform("EPSG:4326", "EPSG:3857", OpenLayers.Layer.SphericalMercator.projectForward);
var geom = {};
geom.map = null; geom.controls = null; geom.panel = null; geom.re = new RegExp("^SRID=\\d+;(.+)", "i"); geom.layers = {}; geom.popup;
geom.modifiable = false;
geom.wkt_f = new OpenLayers.Format.WKT();
geom.is_collection = true;
geom.collection_type = 'Polygon';
geom.is_generic = false;
geom.is_linestring = false;
geom.is_polygon = true;
geom.is_point = false;

geom.get_ewkt = function(feat){
  return 'SRID=900913;' + geom.wkt_f.write(feat);
};
geom.read_wkt = function(wkt){
  // OpenLayers cannot handle EWKT -- we make sure to strip it out.
  // EWKT is only exposed to OL if there's a validation error in the admin.
  var match = geom.re.exec(wkt);
  if (match){wkt = match[1];}
  return geom.wkt_f.read(wkt);
};
geom.write_wkt = function(feat){
  if (geom.is_collection){ geom.num_geom = feat.geometry.components.length;}
  else { geom.num_geom = 1;}
  document.getElementById('id_geom').value = geom.get_ewkt(feat);
};
geom.add_wkt = function(event){
  // This function will sync the contents of the `vector` layer with the
  // WKT in the text field.
  if (geom.is_collection){
    var feat = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon());
    for (var i = 0; i < geom.layers.vector.features.length; i++){
      feat.geometry.addComponents([geom.layers.vector.features[i].geometry]);
    }
    geom.write_wkt(feat);
  } else {
    // Make sure to remove any previously added features.
    if (geom.layers.vector.features.length > 1){
      old_feats = [geom.layers.vector.features[0]];
      geom.layers.vector.removeFeatures(old_feats);
      geom.layers.vector.destroyFeatures(old_feats);
    }
    geom.write_wkt(event.feature);
  }
};
geom.modify_wkt = function(event){
  if (geom.is_collection){
    if (geom.is_point){
      geom.add_wkt(event);
      return;
    } else {
      // When modifying the selected components are added to the
      // vector layer so we only increment to the `num_geom` value.
      var feat = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon());
      for (var i = 0; i < geom.num_geom; i++){
        feat.geometry.addComponents([geom.layers.vector.features[i].geometry]);
      }
      geom.write_wkt(feat);
    }
  } else {
    geom.write_wkt(event.feature);
  }
};
// Function to clear vector features and purge wkt from div
geom.deleteFeatures = function(){
  geom.layers.vector.removeFeatures(geom.layers.vector.features);
  geom.layers.vector.destroyFeatures();
};
geom.clearFeatures = function (){
  geom.deleteFeatures();
  document.getElementById('id_geom').value = '';
  geom.map.setCenter(new OpenLayers.LonLat(0, 0), 4);
  
};
// Add Select control
geom.addSelectControl = function(){
  var select = new OpenLayers.Control.SelectFeature(geom.layers.vector, {'toggle' : true, 'clickout' : true});
  geom.map.addControl(select);
  select.activate();
};
geom.enableDrawing = function(){
  geom.map.getControlsByClass('OpenLayers.Control.DrawFeature')[0].activate();
};
geom.enableEditing = function(){
  geom.map.getControlsByClass('OpenLayers.Control.ModifyFeature')[0].activate();
};
// Create an array of controls based on geometry type
geom.getControls = function(lyr){
  geom.panel = new OpenLayers.Control.Panel({'displayClass': 'olControlEditingToolbar'});
  geom.controls = [new OpenLayers.Control.Navigation()];
  if (!geom.modifiable) return;
  if (geom.is_linestring || geom.is_generic){
    geom.controls.push(new OpenLayers.Control.DrawFeature(lyr, OpenLayers.Handler.Path, {'displayClass': 'olControlDrawFeaturePath'}));
  }
  if (geom.is_polygon || geom.is_generic){
    geom.controls.push(new OpenLayers.Control.DrawFeature(lyr, OpenLayers.Handler.Polygon, {'displayClass': 'olControlDrawFeaturePolygon'}));
  }
  if (geom.is_point || geom.is_generic){
    geom.controls.push(new OpenLayers.Control.DrawFeature(lyr, OpenLayers.Handler.Point, {'displayClass': 'olControlDrawFeaturePoint'}));
  }
  if (geom.modifiable){
    geom.controls.push(new OpenLayers.Control.ModifyFeature(lyr, {'displayClass': 'olControlModifyFeature'}));
  }
};
geom.init = function(){
    // The options hash, w/ zoom, resolution, and projection settings.
    var options = {
      'displayProjection' : new OpenLayers.Projection("EPSG:4326"),
      'projection' : new OpenLayers.Projection("EPSG:900913"),
      'numZoomLevels' : 17,
      'center': new OpenLayers.LonLat(144.940, -37.791).transform('EPSG:4326', 'EPSG:900913')
    };
    // The admin map for this geometry field.
    
    //options.projection = new OpenLayers.Projection('EPSG:3857');
    geom.map = new OpenLayers.Map('map', options);
    // Base Layer
    geom.layers.base = new OpenLayers.Layer.Google("Google Base Layer", {'sphericalMercator': true});
    geom.map.addLayer(geom.layers.base);
    geom.map.zoomTo(13);
    
    geom.layers.vector = new OpenLayers.Layer.Vector(" geom");
    geom.map.addLayer(geom.layers.vector);
    geom.layers.markers = new OpenLayers.Layer.Markers(" markers");
    geom.map.addLayer(geom.layers.markers);
    
    // This allows editing of the geographic fields -- the modified WKT is
    // written back to the content field (as EWKT, so that the ORM will know
    // to transform back to original SRID).
    geom.layers.vector.events.on({"featuremodified" : geom.modify_wkt});
    geom.layers.vector.events.on({"featureadded" : geom.add_wkt});
    
    // Map controls:
    // Add geometry specific panel of toolbar controls
    geom.getControls(geom.layers.vector);
    geom.panel.addControls(geom.controls);
    //geom.map.addControl(geom.panel);
    //geom.addSelectControl();
    // Then add optional visual controls
    geom.map.addControl(new OpenLayers.Control.MousePosition());
    geom.map.addControl(new OpenLayers.Control.Scale());
    //geom.map.addControl(new OpenLayers.Control.LayerSwitcher());
    // Then add optional behavior controls
    
    geom.showPiece = function(data, lonlat){
    	// Read WKT from the text field.
	    var wkt = data.piece.geom;
	    if (wkt){
	      // After reading into geometry, immediately write back to
	      // WKT <textarea> as EWKT (so that SRID is included).
	      var new_geom = geom.read_wkt(wkt);
	      geom.write_wkt(new_geom);
	      geom.layers.vector.removeAllFeatures();
	      if (geom.is_collection){
	        // If geometry collection, add each component individually so they may be
	        // edited individually.
	        for (var i = 0; i < geom.num_geom; i++){
	          geom.layers.vector.addFeatures([new OpenLayers.Feature.Vector(new_geom.geometry.transform('EPSG:4326', 'EPSG:900913').components[i].clone())]);
	        }
	      } else {
	        geom.layers.vector.addFeatures([new_geom]);
	      }
	      // Zooming to the bounds.
	      geom.map.zoomToExtent(new_geom.geometry.getBounds());
	      if (geom.is_point){
	          geom.map.zoomTo(12);
	      }
	      for(var i = 0; i < geom.layers.markers.markers.length; i++){
	      	geom.layers.markers.removeMarker(geom.layers.markers.markers[i]);
	      }
	      var size = new OpenLayers.Size(21,30);
          var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
       	  var icon = new OpenLayers.Icon('/static/world/img/pin.png',size,offset);
       	  lonlat.transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'))
       	  var marker = new OpenLayers.Marker(lonlat, icon)
	      geom.layers.markers.addMarker(marker);
	      geom.map.setCenter(lonlat);
	      if(geom.popup){
	      	geom.map.removePopup(geom.popup);
	      }
//	      var html = '<ul class="list-group"><li class="list-group-item">Male Population: ' + data.population.tot_p_m
//	      			 + '</li><li class="list-group-item">Female Population: ' + data.population.tot_p_f 
//	      			 + '</li><li class="list-group-item">Total Population: ' + data.population.tot_p
//	      			 + '</li><li class="list-group-item">Median age: ' + data.median.median_age 
//	      			 + '</li><li class="list-group-item">Average people per household: ' + data.median.average_household_size
//	      			 + '</li><li class="list-group-item">Median weekly household income: ' + data.median.median_total_household_income
//	      			 + (data.population.tot_p == 0 ? '' : '</li><li class="list-group-item">Average vehicles per dwelling: ' + (data.vehiclesperdwelling.tot_dweling/data.population.tot_p).toFixed(2))
//	      			 + '</li></ul>'
	      var html = '<div class="panel panel-primary" style="margin-bottom: 0px;"><div class="panel-heading text-center">Location Profile</div><table class="table"><tr><td>Male Population:</td><td>' + data.population.tot_p_m + '</td></tr>'
	      			 + '<tr><td>Female Population:</td><td>' + data.population.tot_p_f  + '</td></tr>'
	      			 + '<tr><td>Total Population:</td><td>' + data.population.tot_p + '</td></tr>'
	      			 + '<tr><td>Median age:</td><td>' + data.median.median_age  + '</td></tr>'
	      			 + '<tr><td>Average people per household:</td><td>' + data.median.average_household_size + '</td></tr>'
	      			 + '<tr><td>Median weekly household income:</td><td>' + data.median.median_total_household_income + '</td></tr>'
	      			 + (data.vehiclesperdwelling.tot_dweling == 0 ? '' : ('<tr><td>Average vehicles per dwelling:</td><td>' + ((data.vehiclesperdwelling.num_mvs_1 + data.vehiclesperdwelling.num_mvs_2*2 + data.vehiclesperdwelling.num_mvs_3*3 + data.vehiclesperdwelling.num_mvs_4mo * 4)/data.vehiclesperdwelling.tot_dweling).toFixed(2)) + '</td></tr>')
	      			 + '</table></div></div>'
	      geom.popup = new OpenLayers.Popup("chicken",
                   lonlat,
                   new OpenLayers.Size(80, 60),
                   html,
                   true, this.onPopupClose);
          geom.popup.autoSize = true;
          geom.map.addPopup(geom.popup);
	    } else {
	      //geom.map.setCenter(new OpenLayers.LonLat(0, 0), 4);
	    }
    }
    
    geom.queryWKT = function(lonlat){
		$.ajax({
			dataType: 'json',
			url: '/world/query?lat='+lonlat.lat+'&lon='+lonlat.lon,
			success: function(data, textStatus){
				console.log(data);
				document.getElementById('id_geom').value = data.piece.geom;
				geom.showPiece(data, lonlat);
			}
		});
	}
    
    geom.map.events.register('click', geom.map, function(e){
    	var pixel = new OpenLayers.Pixel(e.xy.x,e.xy.y);
    	var lonlat = geom.map.getLonLatFromPixel(pixel);
    	lonlat.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
    	geom.queryWKT(lonlat)
    });
    
    
//    if (wkt){
//      if (geom.modifiable){
//        geom.enableEditing();
//      }
//    } else {
//      geom.enableDrawing();
//    }
    
    if(navigator.geolocation){
	    navigator.geolocation.getCurrentPosition(
	    	function(position){
		    	var lonlat = new OpenLayers.LonLat(position.coords.longitude,position.coords.latitude);
		    	lonlat.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
		    	geom.queryWKT(lonlat)
		    },
		    function(error){
		    	var errorTypes = {
		    		1: 'Location service is denied',
		    		2: 'Can\'t get location information',
		    		3: 'Access to information timeout'
		    	};
		    	alert(errorTypes[error.code]);
		    }
	    );
    }else{
    	alert('Your browser not support geolocation');
    }
};
