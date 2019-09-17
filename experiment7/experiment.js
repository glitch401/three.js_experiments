var orbitcam, clock;
var nos;
var font, a, headings, text, text1='69.34', text0='69.34', once;
var intersects, firstLetter, INTERSECTED;
var nos, mesh1, mesh2, mesh, e, yep, d1, d2;
var mx, id, cond=false;
var res, panels, v=1, boxes, outline, system1, system2, system, scene2;
var theobj1, theobj2;
var thedot;
var f, same;

//does what it says
function initialiseScene(){

    PIEscene.background=new THREE.Color( 0xbfd1e5 );
    PIEscene.add(new THREE.AmbientLight(0x606060));
    
    document.addEventListener('mousedown', ondocmousedown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('keypress', onDocumentKeyPress, false );
	document.addEventListener('keydown', onDocumentKeyDown, false );
	
    nos=[], headings=[], mesh1=[], mesh2=[], mesh=[];
    obj=1, once=yep=false;
    yep=true;
    e=0, a1=[], a2=[];
    text='';
    firstLetter=true;
    panels=[], boxes=[], outline=[];
	scene2=new THREE.Scene();
	same=false;
}

function onDocumentMouseMove( event ) {

    if(!PIElastUpdateTime){
        PIErender();
        return;
    }

    event.preventDefault();
    PIEshowDisplayPanel();

    PIEraycaster.setFromCamera( PIEmouseP, PIEcamera );

    intersects = PIEraycaster.intersectObjects(nos);

    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {

            if(INTERSECTED )
                INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            INTERSECTED.material.color.setHex( 0x161616 );
        }
    } 
    else {
        if (INTERSECTED)
            INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        
        INTERSECTED = null;
    }

    if(PIElastUpdateTime && (PIEanimationPaused || !PIEanimationON))
        PIErender();
}

function ondocmousedown(event){
    
    if(!PIElastUpdateTime)
        return;

    event.preventDefault();

    PIEraycaster.setFromCamera(PIEmouseP, PIEcamera);
    intersects = PIEraycaster.intersectObjects([nos[0], nos[1], headings[4], headings[5], boxes[2], boxes[3], outline[0], outline[1]]);

    if(intersects.length>0){
	    if(intersects[0].object.myid==0 || intersects[0].object.myid==1){
	    	text='';
	    	mx=0;
	    	once=yep=false;
	        obj=intersects[0].object.myid;
	    }
	    else if(intersects[0].object.myid=='lol1' || intersects[0].object.myid=='lol2'){
	    	if(intersects[0].object.myid=='lol1'){
	    		if(parseFloat(text1)>parseFloat(text0)){
	    			headings[6].visible=true;
	    			headings[7].visible=false;
	    			
	    			PIEchangeDisplayText("Correct", parseInt(PIEgetDisplayText("Correct"))+1);
	    			shower(true);
	    		}
	    		else{
	    			headings[7].visible=true;
	    			headings[6].visible=false;
	    			
    				PIEchangeDisplayText("Wrong", parseInt(PIEgetDisplayText("Wrong"))+1);
    				shower(false);
	    		}

	    	}
	    	else if(intersects[0].object.myid=='lol2'){
	    		if(parseFloat(text0)>parseFloat(text1)){
	    			headings[6].visible=true;
	    			headings[7].visible=false;
	    			
	    			PIEchangeDisplayText("Correct", parseInt(PIEgetDisplayText("Correct"))+1);
	    			shower(true);
	    		}
	    		else{
	    			headings[7].visible=true;
	    			headings[6].visible=false;
	    			
    				PIEchangeDisplayText("Wrong", parseInt(PIEgetDisplayText("Wrong"))+1);
    				shower(false);
	    		}
	    	}
	    }
    }
}

function shower(right){
	cancelAnimationFrame(id);
    system1.visible=false;
    system2.visible=false;            
    PIEpauseAnimation();
    PIErenderer.autoClear=false;

    if(right){
        system1.visible=true;
        system=system1;
    }
    else{
        system2.visible=true;
        system=system2;
    }

    function render(){
        var a = system.geometry.vertices;
        a.forEach(function (v) {
            v.y-=v.velocityY;
            v.x-=v.velocityX;
            if(v.y<-10)
                v.y=10;
            if(v.x<-20 || v.x>20)
                v.velocityX*=-1;
        });
        if(headings[6].scale.x>=1.5 || headings[7].scale.x>=1.5){
        	headings[6].scale.set(1,1,1);
        	headings[7].scale.set(1,1,1);
		    system1.visible=false;
		    system2.visible=false;
		    cancelAnimationFrame(id);
	    	system1.visible=false;
	    	system2.visible=false;  
	    	PIErenderer.autoClear=true;
	    	headings[6].visible=false;
	    	headings[7].visible=false;
	    	PIEresumeAnimation(); 
	    	oi.f3();
		    return;	    
        }
        if(headings[6].visible){
        	headings[6].scale.x+=0.005;
        	headings[6].scale.y+=0.005;
        	headings[6].scale.z+=0.005;
        }
        if(headings[7].visible){
        	headings[7].scale.x+=0.005;
        	headings[7].scale.y+=0.005;
        	headings[7].scale.z+=0.005;
        }
        system.geometry.verticesNeedUpdate = true;
        PIErenderer.clear();
        PIErender();
        PIErenderer.clearDepth();
        PIErenderer.render(scene2, PIEcamera);
        id=requestAnimationFrame(render);
    }
    render();
}

function onDocumentKeyDown( event ) {

	if ( firstLetter ) {
		firstLetter = false;
		text = "";
		once=yep=false;
	}

	var keyCode = event.keyCode;

	// backspace
	if ( keyCode == 8 ) {
		event.preventDefault();
		text = text.substring( 0, text.length - 1 );
		if(text.indexOf('.')==-1)
			once=false;
		refreshText();
		return false;
	}
}

function onDocumentKeyPress( event ) {

	var keyCode = event.which;

	// backspace
	if ( keyCode == 8 )
		event.preventDefault();

	else {

		if(text.length==0)
			once=yep=false;

		var ch = String.fromCharCode( keyCode );
		if(text.length<6 && (isFinite(ch) || ch=='.')){
			if(ch=='.' && once){
				text=text;
			}
			else{
				text+=ch;
				once = once || ch=='.';
			}
			
		}
		refreshText();
	}
}

function refreshText(){

	if(!PIElastUpdateTime){
		text='';
		once=yep=false;
		return;
	}

	PIEscene.remove(nos[obj]);
	if(obj)
		text1=text;
	else
		text0=text;
	

	var geometry = new THREE.TextGeometry(text, {
		font : font,
		size : 0.65,
		height : 0.5
	});

	nos[obj]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    nos[obj].translation = geometry.center();
    PIEaddElement(nos[obj]);
    nos[obj].castShadow=false;
    nos[obj].lookAt(PIEcamera.position);
    nos[obj].myid=obj;

	nos[1].position.y=1.5;
	nos[1].position.x=-6;
	nos[1].lookAt(PIEcamera.position);

	nos[0].position.y=1.5;
	nos[0].position.x=6;
	nos[0].lookAt(PIEcamera.position);
	yep=false, e=0;
    PIErender();
}

function loadExperimentElements(){
    var loader, tex, material, geometry;

    PIEsetExperimentTitle("Compare Decimal Numbers");
    PIEsetDeveloperName("Archit Mathur");
    PIEhideControlElement();

    initialiseHelp();
    initialiseInfo();

    initialiseScene();
    PIEsetAreaOfInterest(-5, 5, 5, -5);

    loader=new THREE.TextureLoader();
    tex=loader.load("assets/ButtonSmiley.png", function(texture){
        geometry=new THREE.Geometry();
        material=new THREE.ParticleBasicMaterial({
            size:1.2,
            transparent:true,
            opacity:true,
            map:texture,
            blending:THREE.AdditiveBlending,
            sizeAttenuation:true,
            color:0x00ff00
        });
        var range=10;
        for(var i = 0; i<1000; i++){
            var particle = new THREE.Vector3(
                Math.random()*range-range/2,
                Math.random()*range*1.5,
                0  
            );
            particle.velocityY = 0.025+Math.random()/10;
            particle.velocityX=(Math.random()-0.5)/20;
            geometry.vertices.push(particle);
        }

        system1 = new THREE.ParticleSystem(geometry, material);
        system1.sortParticles=true;
        system1.dynamic=true;
        PIEscene.add(system1);
        scene2.add(system1);
        system1.visible=false;
        oi.f1();
        oi.f2();
    });

    tex=loader.load("assets/ButtonSadSmiley.png", function(texture){
        geometry=new THREE.Geometry();
        material=new THREE.ParticleBasicMaterial({
            size:1.2,
            transparent:true,
            opacity:true,
            map:texture,
            blending:THREE.AdditiveBlending,
            sizeAttenuation:true,
            color:0xff0000
        });
        var range=10;
        for(var i = 0; i<1000; i++){
            var particle = new THREE.Vector3(
                Math.random()*range-range/2,
                Math.random()*range*1.5,
                0  
            );
            particle.velocityY = 0.025+Math.random()/6;
            particle.velocityX=(Math.random()-0.5)/20;
            geometry.vertices.push(particle);
        }

        system2 = new THREE.ParticleSystem(geometry, material);
        system2.sortParticles=true;
        system2.dynamic=true;
        PIEscene.add(system2);
        scene2.add(system2);
        system2.visible=false;
        oi.f1();
        oi.f2();
    });

    oi=new Object();
    oi.f2=function () {
    	
    	cancelAnimationFrame(id);
    	system1.visible=false;
    	system2.visible=false;  
    	PIErenderer.autoClear=true;
    	PIEresumeAnimation();
    	for(var i in mesh1)
    		PIEscene.remove(mesh1[i]);
    	
    	for(var i in mesh2)
    		PIEscene.remove(mesh2[i]);
    	
    	PIEscene.remove(res);
    	
    	mx=Math.max(
    		text1.indexOf('.')==-1? text1.length :text1.indexOf('.'), 
    		text0.indexOf('.')==-1? text0.length :text0.indexOf('.')
    	);
    	
    	var dot = text0.indexOf('.');
    	if(dot==-1)
    		dot=text0.length;
    	for(var i=0; i<mx-dot; i++)
    		text0='0'+text0;
    	dot = text0.indexOf('.');
    	if(dot==-1)
    		dot=text0.length;

    	thedot = a1 = dot;
    	var bleh = text0;
    	for(var i=dot-1; i>=0; i--){
			var geometry = new THREE.TextGeometry(bleh[i], {
				font : font,
				size : 0.65,
				height : 0.5
			});
			mesh1[dot-1-i]=new THREE.Mesh(
				geometry, new THREE.MeshBasicMaterial({color:0xffffff})
			);
			mesh1[dot-1-i].translation = geometry.center();
			PIEaddElement(mesh1[dot-1-i]);
			mesh1[dot-1-i].castShadow=false;
			mesh1[dot-1-i].position.x=-(dot-i);
			mesh1[dot-1-i].position.y=-3;
			mesh1[dot-1-i].lookAt(PIEcamera.position);
			mesh1[dot-1-i].material.transparent=true;
			mesh1[dot-1-i].material.opacity=0;
		}

		for(var i=dot; i<bleh.length; i++){
			var geometry = new THREE.TextGeometry(bleh[i], {
				font : font,
				size : 0.65,
				height : 0.5
			});
			mesh1[i]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
			mesh1[i].translation = geometry.center();
			PIEaddElement(mesh1[i]);
			mesh1[i].castShadow=false;
			mesh1[i].position.x=-(dot-i);
			mesh1[i].position.y=-3;
			mesh1[i].lookAt(PIEcamera.position);
			mesh1[i].material.transparent=true;
			mesh1[i].material.opacity=0;
		}

		dot = text1.indexOf('.');
		if(dot==-1)
    		dot=text1.length;
    	for(var i=0; i<mx-dot; i++)
    		text1='0'+text1;
    	dot = text1.indexOf('.');
		if(dot==-1)
    		dot=text1.length;

		bleh=text1;
		for(var i=dot-1; i>=0; i--){
			var geometry = new THREE.TextGeometry(bleh[i], {
				font : font,
				size : 0.65,
				height : 0.5
			});
			mesh2[dot-1-i]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
			mesh2[dot-1-i].translation = geometry.center();
			PIEaddElement(mesh2[dot-1-i]);
			mesh2[dot-1-i].castShadow=false;
			mesh2[dot-1-i].position.x=-(dot-i);
			mesh2[dot-1-i].position.y=-4;
			mesh2[dot-1-i].lookAt(PIEcamera.position);
			mesh2[dot-1-i].material.transparent=true;
			mesh2[dot-1-i].material.opacity=0;
		}

		for(var i=dot; i<bleh.length; i++){
			var geometry = new THREE.TextGeometry(bleh[i], {
				font : font,
				size : 0.65,
				height : 0.5
			});
			mesh2[i]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
			mesh2[i].translation = geometry.center();
			PIEaddElement(mesh2[i]);
			mesh2[i].castShadow=false;
			mesh2[i].position.x=-(dot-i);
			mesh2[i].position.y=-4;
			mesh2[i].lookAt(PIEcamera.position);
			mesh2[i].material.transparent=true;
			mesh2[i].material.opacity=0;
		}

		yep=true, e=0;

		var a = text0.indexOf('.');
		a = a==-1? a=text0.length : a;

		if(text0.indexOf('.')==-1 && text1.indexOf('.')==-1){
			var y = parseInt(text0)>parseInt(text1)?'<' :'>';
			if(parseInt(text0)==parseInt(text1)){
				y='==';
				same=true;
			}
			geometry = new THREE.TextGeometry(y, {
				font : font,
				size : 2.4,
				height : 0.1
			});

			res=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x111155}));
			res.translation = geometry.center();
			PIEaddElement(res); 
			res.material.transparent=true; 
			res.material.opacity=0; 
			res.visible=false;
			res.castShadow=false;
			res.position.y=1.5;
			res.lookAt(PIEcamera.position);

			i=0, j=0;
			var b=false;
			while(text0[i]==text1[i] && i<text0.length)
				i++;
			
			var a=parseInt(text0[i]), b=parseInt(text1[i]);
			if(a>b){
				theobj1=mesh1[i];
				theobj2=mesh2[i];
				f=i;
			}
			else{
				theobj1=mesh2[i];
				theobj2=mesh1[i];
				f=i;
			}
			

		}
		else if(dot>a){
			geometry = new THREE.TextGeometry('>', {
				font : font,
				size : 2.4,
				height : 0.1
			});
			res=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x111155}));
			res.translation = geometry.center();
			PIEaddElement(res); res.material.transparent=true; res.material.opacity=0; res.visible=false;
			res.castShadow=false;
			res.position.y=1.5;
			res.lookAt(PIEcamera.position);
			theobj1=mesh2[dot-1];
			theobj2=mesh1[dot-1];
			f=dot-1;
		}
		else if(dot==a){
			
			var i = 0, j=0;
			if(text0!=text1){
				
				i=dot-1;
				var b=true;
				while(text0[j]==text1[j]){
					j++;
					if(b)
						i--;
					else
						i++
					if(text0[j]=='.')	j++, b=false, i=dot+1;
				}

				var a=parseInt(text0[j]), b=parseInt(text1[j]);
			
				var c, x;
				if(a>b){
					c = a + ' > '+b;
					x='<';
					theobj1=mesh1[i];
					theobj2=mesh2[i];
				}
				else{
					c=a+' < '+b, x='>';
					theobj1=mesh2[i];
					theobj2=mesh1[i];
				}
				f=i;
			
				geometry = new THREE.TextGeometry(x, {
					font : font,
					size : 2.4,
					height : 0.1
				});
				res=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x111155}));
				res.translation = geometry.center();
				PIEaddElement(res); res.material.transparent=true; res.material.opacity=0; res.visible=false;
				res.castShadow=false;
				res.position.y=1.5;
				res.lookAt(PIEcamera.position);
		
			}
			else{
				var i =0;
				same=true;
				geometry = new THREE.TextGeometry('==', {
					font : font,
					size : 2.4,
					height : 0.1
				});
				res=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x111155}));
				res.translation = geometry.center();
				PIEaddElement(res); res.material.transparent=true; res.material.opacity=0; res.visible=false;
				res.castShadow=false;
				res.position.y=1.5;
				res.lookAt(PIEcamera.position);
			}
		}
		else{
			
			geometry = new THREE.TextGeometry('<', {
				font : font,
				size : 2.4,
				height : 0.1
			});
			res=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x111155}));
			res.translation = geometry.center();
			PIEaddElement(res); res.material.transparent=true; res.material.opacity=0; res.visible=false;
			res.castShadow=false;
			res.position.y=1.5;
			res.lookAt(PIEcamera.position);
			theobj1=mesh1[a-1];
			theobj2=mesh2[a-1];
			f=a-1;
		}
		for(i=3; i<=7; i++)
			headings[i].visible=false;
		boxes[2].visible=false;
		boxes[3].visible=false;

		PIErender();
    };

    oi.f1=function(){
    	cancelAnimationFrame(id);
    	PIErenderer.autoClear=true;
    	system1.visible=false;
    	system2.visible=false;
    	PIEresumeAnimation();
    	
    	cond=false;
    	same=false;

    	text0=''+(Math.random()*1000).toFixed(2);
    	text1=''+(Math.random()*1000).toFixed(2);

    	PIEscene.remove(nos[0]);
    	PIEscene.remove(nos[1]);

    	var geometry = [];
        geometry[0] = new THREE.TextGeometry(text0, {
            font : font,
            size : 0.65	,
            height : 0.5,
            curveSegments : 3
        });
		
        geometry[1] = new THREE.TextGeometry(text1, {
            font : font,
            size : 0.65	,
            height : 0.5,
            curveSegments : 3
        });
		
		var i;
        for(i = 0; i<2; i++){
        	nos[i]=new THREE.Mesh(geometry[i], new THREE.MeshBasicMaterial({color:0xffffff}));
	        nos[i].translation = geometry[i].center();
	        PIEaddElement(nos[i]);
	        nos[i].castShadow=false;
	        nos[i].lookAt(PIEcamera.position);
	        nos[i].myid=i;
        }

        nos[1].position.y=1.5;
		nos[1].position.x=-6;
		nos[1].lookAt(PIEcamera.position);

		nos[0].position.y=1.5;
		nos[0].position.x=6;
		nos[0].lookAt(PIEcamera.position);

		boxes[2].visible=false;
		boxes[3].visible=false;

		for(i=3; i<=7; i++)
			headings[i].visible=false;

    };

    oi.f4=function(){
    	oi.f1();
    	oi.f2();
    };


    oi.f3=function(){
    	cancelAnimationFrame(id);
    	system1.visible=false;
    	system2.visible=false;
    	PIErenderer.autoClear=true;
    	PIEresumeAnimation();
    	for(i=0; i<3; i++){
    		//panels[i].visible=false;
    	}

    	for(var i in mesh1)
    		PIEscene.remove(mesh1[i]);
    	for(var i in mesh2)
    		PIEscene.remove(mesh2[i]);
    	PIEscene.remove(res);
    	headings[2].visible=false;

    	oi.f1();
    	headings[3].visible=true;
    	headings[4].visible=true;
    	headings[5].visible=true;
    	boxes[2].visible=true;
    	boxes[3].visible=true;

    };

    a=new THREE.BoxGeometry(4.5,1.5,0.5);
	m=new THREE.MeshPhongMaterial({color:0x050516});
	boxes[0]=new THREE.Mesh(a, m);
	PIEaddElement(boxes[0]);
	boxes[0].myid=0;
	boxes[0].position.set(-6.2,1.5,-0.5);
	boxes[0].lookAt(PIEcamera.position);

	var oum=new THREE.MeshBasicMaterial({color:0xfffff0, side: THREE.BackSide});
	outline[0]= new THREE.Mesh(a, oum); 
	outline[0].position.copy(boxes[0].position);
	outline[0].scale.multiplyScalar(1.05);
	outline[0].lookAt(PIEcamera.position);
	PIEaddElement(outline[0]);
	outline[0].castShadow=false;
	outline[0].myid=1;

	boxes[1]=new THREE.Mesh(a, m);
	PIEaddElement(boxes[1]);
	boxes[1].position.set(6.2,1.5,-0.5);
	boxes[1].lookAt(PIEcamera.position);
	boxes[1].myid=1;

	outline[1]= new THREE.Mesh(a, oum); 
	outline[1].position.copy(boxes[1].position);
	outline[1].scale.multiplyScalar(1.05);
	outline[1].lookAt(PIEcamera.position);
	PIEaddElement(outline[1]);
	outline[1].myid=0;
	outline[1].castShadow=false;

    loader = new THREE.FontLoader();
    loader.load("assets/optimer.json", function(response){
        
        font = response;
        geometry = new THREE.TextGeometry(69.34, {
            font : font,
            size : 0.65	,
            height : 0.5,
            curveSegments : 3
        });
		
		var i;
        for(i = 0; i<2; i++){
        	nos[i]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
	        nos[i].translation = geometry.center();
	        PIEaddElement(nos[i]);
	        nos[i].castShadow=false;
	        nos[i].lookAt(PIEcamera.position);
	        nos[i].myid=i;
        }

    	for(i=1; i<=2; i++){
    		geometry = new THREE.TextGeometry("Number "+i, {
	            font : font,
	            size : 0.2,
	            height : 0.5,
	            curveSegments : 3
	        });

    		headings[i-1]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x222222}));
    		headings[i-1].translation = geometry.center();
    		PIEaddElement(headings[i-1]);	    

    		headings[i-1].castShadow=false;    
    	}

    	geometry = new THREE.TextGeometry("Digits", {
	        font : font,
            size : 0.2,
            height : 0.5,
            curveSegments : 3
        });
		
		headings[2]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x222222}));
		headings[2].translation = geometry.center();
		PIEaddElement(headings[2]);
		headings[2].castShadow=false;
		headings[2].position.y=-2;
		headings[2].lookAt(PIEcamera.position);

    	nos[1].position.y=1.5;
		nos[1].position.x=-6;
		headings[1].position.y=0.55;
		headings[1].position.x=6;
		nos[1].lookAt(PIEcamera.position);
		headings[1].lookAt(PIEcamera.position);

		headings[0].position.y=0.55;
		headings[0].position.x=-6;
		nos[0].position.y=1.5;
		nos[0].position.x=6;
		nos[0].lookAt(PIEcamera.position);
		headings[0].lookAt(PIEcamera.position);

		geometry = new THREE.TextGeometry('Click on the correct statement!', {
			font : font,
			size : 0.4,
			height : 0.2
		});
		headings[3]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x111155}));
		headings[3].translation = geometry.center();
		PIEaddElement(headings[3]);
		headings[3].position.y=3;
		headings[3].visible=false;
		headings[3].lookAt(PIEcamera.position);

		geometry = new THREE.TextGeometry('Number 1 > Number 2', {
			font : font,
			size : 0.35,
			height : 0.2
		});
		headings[4]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x651FFF}));
		headings[4].translation = geometry.center();
		PIEaddElement(headings[4]);
		headings[4].castShadow=false;
		headings[4].myid='lol1';
		headings[4].position.set(-6,-2,0);
		headings[4].visible=false;
		headings[4].lookAt(PIEcamera.position);

		a=new THREE.BoxGeometry(5.5,1,0.5);
		m=new THREE.MeshPhongMaterial({color:0x888888});
		boxes[2]=new THREE.Mesh(a, m);
		PIEaddElement(boxes[2]);
		boxes[2].position.set(-6,-2,-0.25);
		boxes[2].lookAt(PIEcamera.position);
		boxes[2].visible=false;
		boxes[2].myid='lol1';

		geometry = new THREE.TextGeometry('Number 2 > Number 1', {
			font : font,
			size : 0.35,
			height : 0.2
		});
		headings[5]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x651FFF}));
		headings[5].translation = geometry.center();
		PIEaddElement(headings[5]);
		headings[5].castShadow=false;
		headings[5].myid='lol2';
		headings[5].position.set(6,-2,0);
		headings[5].visible=false;
		headings[5].lookAt(PIEcamera.position);

		boxes[3]=new THREE.Mesh(a, m);
		PIEaddElement(boxes[3]);
		boxes[3].position.set(6,-2,-0.25);
		boxes[3].lookAt(PIEcamera.position);
		boxes[3].visible=false;
		boxes[3].myid='lol2';

		geometry = new THREE.TextGeometry('CORRECT!', {
			font : font,
			size : 0.7,
			height : 0.2
		});
		headings[6]=new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x00ff00}));
		headings[6].translation = geometry.center();
		PIEaddElement(headings[6]);
		headings[6].visible=false;
		headings[6].lookAt(PIEcamera.position);

		geometry = new THREE.TextGeometry('WRONG!', {
			font : font,
			size : 0.7,
			height : 0.2
		});
		headings[7]=new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x000000}));
		headings[7].translation = geometry.center();
		PIEaddElement(headings[7]);
		headings[7].castShadow=false;
		headings[7].visible=false;
		headings[7].lookAt(PIEcamera.position);
		
		oi.f1();
		oi.f2();
        PIEstartAnimation();
    });

    initialiseControls();
    resetExperiment();

}


function updateExperimentElements(t, dt){
	if(!PIElastUpdateTime)
		return;

	if(mesh1.length>0 && mesh2.length>0 &&(e<text0.length || e<text1.length) && yep){
		var a=false, b=false;
		if(e<text0.length){
			if(mesh1[e].material.opacity<1)
				mesh1[e].material.opacity+=0.025;
			a=mesh1[e].material.opacity>=1;
		}
		if(e<text1.length){
			if(mesh2[e].material.opacity<1)
				mesh2[e].material.opacity+=0.025;
			b=mesh2[e].material.opacity>=1;
		}
		if(a || b){
			e++;
		}
		
		else if(a && b && (e<text0.length || e<text1.length))
			e++

		cond=false;
		if(e==Math.max(text1.length, text0.length))
			cond=true;

	}
	if(cond){
		if(f==a1){
			theobj1.material.color.setHex(0x00aa00);
			theobj2.material.color.setHex(0x000000);
			a1=30000;
			cond=false;
		}
		else if(a1<=thedot && a1>=0){
			mesh1[a1].material.color.setHex(0xeeee77);
			mesh2[a1].material.color.setHex(0xeeee77);
			a1--;
		}
		else if(a1<=0 || (a1>thedot && a1<text0.length)){
			if(a1<=0)	a1=thedot+1;
			mesh1[a1].material.color.setHex(0xeeee77);
			mesh2[a1].material.color.setHex(0xeeee77);
			a1++;
		}
		for(i=0; i<80000000; i++)
			i=i;
		
	}
	else if((a1==30000 && !cond) || same){
		if(res && res.material.opacity<1){
			res.visible=true;
			res.material.opacity+=0.025;
		}
	}
}


function initialiseControls(){
	PIEdisplayGUI.add(oi, "f2").name("Compute");
    PIEdisplayGUI.add(oi, "f4").name("Next Example");
    PIEdisplayGUI.add(oi, "f3").name("Quiz Me!");
    PIEaddDisplayText("Correct", 0);
    PIEaddDisplayText("Wrong", 0);
}


function initialiseOtherVariables(){
    return;
}


function resetExperiment(){  

    if(PIElastUpdateTime){
        initialiseOtherVariables();
        for(var i in mesh1)
    		PIEscene.remove(mesh1[i]);
    	for(var i in mesh2)
    		PIEscene.remove(mesh2[i]);
    	for(var i in mesh)
    		PIEscene.remove(mesh[i]);

    	PIEscene.remove(res);
    	PIEscene.remove(nos[1]);
    	PIEscene.remove(nos[0]);

    	boxes[2].visible=false;
		boxes[3].visible=false;
    	headings[2].visible=true;
    	geometry = new THREE.TextGeometry(69.34, {
            font : font,
            size : 0.65	,
            height : 0.5,
            curveSegments : 3
        });
		
		var i;
        for(i = 0; i<2; i++){
        	nos[i]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
	        nos[i].translation = geometry.center();
	        PIEaddElement(nos[i]);
	        nos[i].castShadow=false;
	        nos[i].lookAt(PIEcamera.position);
	        nos[i].myid=i;
        }

        nos[1].position.y=1.5;
		nos[1].position.x=-6;
		nos[1].lookAt(PIEcamera.position);

		nos[0].position.y=1.5;
		nos[0].position.x=6;
		nos[0].lookAt(PIEcamera.position);

		text0=text1="69.34";

		for(i=3; i<=7; i++)
			headings[i].visible=false;

		PIEchangeDisplayText("Wrong", 0);
		PIEchangeDisplayText("Correct", 0);

		cancelAnimationFrame(id);
    	PIErenderer.autoClear=true;
    	system1.visible=false;
    	system2.visible=false;
    
    }
    	
	PIEstartAnimation();

}

var helpContent;
function initialiseHelp(){
    helpContent="";
    helpContent = helpContent + "<h2>Compare Decimal Numbers</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>There are two decimal numbers which will be compared.</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>You can change the decimal numbers by clicking on the boxes and typing.</p>";
    helpContent = helpContent + "Compute allows you to compare the decimal numbers you enter.<br>";
    helpContent = helpContent + "Next Example teaches the concept by taking another example.<br>";
    helpContent = helpContent + "Quiz Me questions your understanding of this concept.</p>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line</p>";
    helpContent = helpContent + "<p>You can slow down and speed up the animation by using the speed control buttons</p>";
    helpContent = helpContent + "<p>The round button is for resetting the animation.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo(){
    infoContent =  "";
    infoContent = infoContent + "<h2>Experiment Concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>To compare two decimal numbers, we first put them side by side with respect to the decimal point."; 
    infoContent = infoContent + "Then we start comparing each digit as we would for a normal integer on both sides of the point. Whichever number is greater in that respect, is the greater decimal.</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}

// This was legit torture