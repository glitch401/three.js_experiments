//cars, their times, and timepanels
var cars=[];
var time=[], timepanel=[];
var thedist=[];
var correct, wrong;
var timeoutcalls=[];

//floor
var road;
var finishline;
var ground, light;
var skysphere,x;
var system1, system2, system, scene2;

//orbit control handlers
var orbitcam, clock;

//clicking and hovering detector
var raycaster;
var INTERSECTED, intersects;

//banner
var totaldistance;
var displayTime=0;

//aesthetics
var font, matfront, matside, fontmat;
var heading1=[], heading2=[];
var distgeo, textureCube, ambient, pointLight;

//extras
var scene2;
var racedone, thegroup;
var id;

//does what it says
function initialiseScene(){
    
    //addition of all the dts (argument in the update function)
    displayTime=0;
	
    PIEsetAreaOfInterest(-25, 10, 25, -10);
    PIEadjustCamera(30.220077630714485, 3.871295006010919, 8.329268270908972);
    PIEcamera.rotation.x=-0.2453925706644209;
    PIEcamera.rotation.y=1.033994164185291;
    PIEcamera.rotation.z=0.21198171295611237;

    textureCube = new THREE.CubeTextureLoader()
    .load([ 
        './assets/px.jpg',
        './assets/nx.jpg', 
        './assets/py.jpg', 
        './assets/ny.jpg',
        './assets/pz.jpg', 
        './assets/nz.jpg' 
    ] );

    PIEscene.background=textureCube;

    ambient = new THREE.AmbientLight( 0x666666 );
    PIEscene.add( ambient );

    pointLight = new THREE.PointLight( 0xaaaa00, 1.5 );
    pointLight.position.set( -25000, 12000, 20000 );
    PIEscene.add( pointLight );

    geometry=new THREE.BoxGeometry(300, 300, 300);
    material=new THREE.MeshBasicMaterial({color: 0x2194ce});
    skysphere=new THREE.Mesh(geometry, material);
    PIEaddElement(skysphere);
    skysphere.castShadow=false;
    skysphere.position.set(-32, 0, 0);

    orbitcam = new THREE.OrbitControls( PIEcamera );
    clock = new THREE.Clock();
    orbitcam.maxPolarAngle = Math.PI * 0.5;
    orbitcam.maxDistance = 100;
    orbitcam.enabled=false;

    scene2=new THREE.Scene();

    raycaster = new THREE.Raycaster();
    document.addEventListener('mousedown', ondocmousedown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false );

    PIEstartButton.addEventListener('click', function(){
        changeRenderContext();
    });
    PIEresumeButton.addEventListener('click', function(){
        changeRenderContext();
    });
    PIEstopButton.addEventListener('click', function(){
       changeRenderContext();
    });
    PIEresetButton.addEventListener('click', function(){
        changeRenderContext();
    });

    racedone=false;
}

function changeRenderContext(){
    timeteller.material.materials[0].color.setHex(0xffffff);
    wrong.visible=false;
    correct.visible=false;
    cancelAnimationFrame(id);
      
    PIErenderer.autoClear=true;
    PIErender();
    if(!orbitcam.enabled){
        PIEadjustCamera(30.220077630714485, 3.871295006010919, 8.329268270908972);
        PIEcamera.rotation.x=-0.2453925706644209;
        PIEcamera.rotation.y=1.033994164185291;
        PIEcamera.rotation.z=0.21198171295611237;
    }
}


function loadExperimentElements(){
    var loader, tex, material, geometry;

    PIEsetExperimentTitle("Which is faster?(same distance test)");
    PIEsetDeveloperName("Archit Mathur");
    PIEhideControlElement();

    initialiseHelp();
    initialiseInfo();

    initialiseScene();

    //road
    loader=new THREE.TextureLoader();
    loader.load("./assets/road5.png", function(tex){
        material = new THREE.MeshPhongMaterial({ map:tex});
        geometry = new THREE.BoxGeometry( 13, 55, 0.1);
        road=new THREE.Mesh(geometry, material);
        road.receiveShadow=true;
        road.rotation.x=road.rotation.z=-Math.PI/2;
        road.position.set(-8.5, -0.65, -2);
        PIEaddElement(road);
        PIErender();
    });
    //finishline
    loader.load("./assets/checkerboard.jpg", function(tex){
        tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
        tex.repeat.set(3, 15);
        material=new THREE.MeshBasicMaterial({map:tex});
        geometry=new THREE.PlaneGeometry(2, 13, 1, 1);
        finishline = new THREE.Mesh(geometry, material);
        finishline.position.set(18.5, -0.58, -2);
        finishline.rotation.x=-Math.PI/2;
        finishline.receiveShadow=true;
        PIEaddElement(finishline);
        PIErender();
    });
    
    loader.load( 'assets/grasslight-big.jpg', function(tex){
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set( 2000, 2000 );
        tex.anisotropy = 16;
    
        material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: tex } );
    
        ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), material );
        ground.position.y = -0.7;
        ground.rotation.x = - Math.PI / 2;
        ground.receiveShadow = true;
        PIEaddElement(ground);
        PIErender(); 
    });

    loader.load("assets/ButtonSmiley.png", function(texture){
        geometry=new THREE.Geometry();
        material=new THREE.ParticleBasicMaterial({
            size:0.75,
            transparent:true,
            opacity:true,
            map:texture,
            blending:THREE.AdditiveBlending,
            sizeAttenuation:true,
            color:0x00ff00
        });
        var range=40;
        for(var i = 0; i<3000; i++){
            var particle = new THREE.Vector3(
                Math.random()*range-range/2,
                Math.random()*range*1.5,
                Math.random()*range-range/2  
            );
            particle.velocityY = 0.025+Math.random()/5;
            particle.velocityX=(Math.random()-0.5)/3;
            geometry.vertices.push(particle);
        }

        system1 = new THREE.ParticleSystem(geometry, material);
        system1.sortParticles=true;
        system1.dynamic=true;
        PIEscene.add(system1);
        scene2.add(system1);
        system1.visible=false;
    });

    loader.load("assets/ButtonSadSmiley.png", function(texture){
        geometry=new THREE.Geometry();
        material=new THREE.ParticleBasicMaterial({
            size:0.75,
            transparent:true,
            opacity:true,
            map:texture,
            blending:THREE.AdditiveBlending,
            sizeAttenuation:true,
            color:0xff0000
        });
        var range=40;
        for(var i = 0; i<3000; i++){
            var particle = new THREE.Vector3(
                Math.random()*range-range/2,
                Math.random()*range*1.5,
                Math.random()*range-range/2  
            );
            particle.velocityY = 0.025+Math.random()/5;
            particle.velocityX=(Math.random()-0.5)/3;
            geometry.vertices.push(particle);
        }

        system2 = new THREE.ParticleSystem(geometry, material);
        system2.sortParticles=true;
        system2.dynamic=true;
        PIEscene.add(system2);
        scene2.add(system2);
        system2.visible=false;
    });


    //cars
    loader = new THREE.JSONLoader();
    for(var cnt=1; cnt<=4; cnt++)
        loader.load("./assets/car"+cnt+".json", whysoasynchronous(cnt));
    
    //the big parallelopiped on top (i hope its called parallelopiped)
    loader.load("./assets/totaldistance.json", function(geometry, materials) {
        totaldistance = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
        totaldistance.scale.y = 1.35;
        totaldistance.scale.x = totaldistance.scale.z = 1.5;
        totaldistance.translation = geometry.center();
        totaldistance.castShadow=totaldistance.receiveShadow=true;
        totaldistance.position.set(0, 6, -2);
        
        PIEaddElement(totaldistance);
        PIErender();
    });

    //sets up all the 3d text
    loader = new THREE.FontLoader();
    loader.load( "./assets/optimer.json", function(response){
        font = response;
        matfront = new THREE.MeshBasicMaterial({color:0x333333});
        matside = new THREE.MeshBasicMaterial({color:0x111111});
        fontmat = new THREE.MultiMaterial([matfront, matside]);

        for(var i=1; i<=4; i++){
            geometry = new THREE.TextGeometry("DISTANCE", {
                font : font,
                size : 0.3,
                height : 0.25,
                curveSegments : 3
            });
     
            heading1[i]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x03a9f4}));
            heading1[i].translation = geometry.center();
            heading1[i].castShadow=false;
            
            PIEaddElement(heading1[i]);

            geometry = new THREE.TextGeometry("meters", {
                font : font,
                size : 0.225,
                height : 0.25,
                curveSegments : 3
            });
     
            heading2[i]=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x455a64}));
            heading2[i].translation = geometry.center();
            
            PIEaddElement(heading1[i]);
            PIEaddElement(heading2[i]);

            heading2[i].castShadow=false;
            heading1[i].castShadow=false;     

            setdist(i, 50);

            geometry = new THREE.TextGeometry("CORRECT!", {
                font : font,
                size : 0.3,
                height : 0.25,
                curveSegments : 3
            });

            correct=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x00ff00}));
            correct.translation = geometry.center();
            PIEaddElement(correct);

            geometry = new THREE.TextGeometry("WRONG!", {
                font : font,
                size : 0.3,
                height : 0.25,
                curveSegments : 3
            });

            wrong=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xff0000}));
            wrong.translation = geometry.center();
            PIEaddElement(wrong);

            wrong.visible=false;
            correct.visible=false;
        }

        setdistprops();
        setheadings();
        PIErender();
    });
    
    initialiseControls();
    PIEsetAreaOfInterest(-25, 10, 25, -10);
    resetExperiment();

}

//position and rotation of "DISTANCE" and "meters" texts on the PARALLELOPIPED
function setheadings(){
    heading1[1].position.set(0, 6.6, -0.7)
    heading1[1].rotation.set(0.29, 0, 0);

    heading1[2].position.set(1.35, 6.6, -2)
    heading1[2].rotation.set(Math.PI/2, Math.PI/2 - 0.27, 3*Math.PI/2);

    heading1[3].position.set(0, 6.6, -3.3);
    heading1[3].rotation.set(-0.29, Math.PI,0);

    heading1[4].position.set(-1.35 ,6.6 , -2)
    heading1[4].rotation.set(Math.PI/2, -Math.PI/2 + 0.27, Math.PI/2);  

    heading2[1].position.set(0, 5.6, -1.05);
    heading2[1].rotation.set(0.29, 0, 0);

    heading2[2].position.set(1, 5.6, -2);
    heading2[2].rotation.set(Math.PI/2, Math.PI/2 - 0.27, 3*Math.PI/2);

    heading2[3].position.set(0, 5.6, -2.95);
    heading2[3].rotation.set(-0.29, Math.PI,0);

    heading2[4].position.set(-1, 5.6, -2);
    heading2[4].rotation.set(Math.PI/2, -Math.PI/2 + 0.27, Math.PI/2);  
}

function blink(color){
    totaldistance.material.materials[0].color.setHex(color);
    orbitcam.update(clock.getDelta());
    var l, m, n;
    l=PIEcamera.position.x;
    m=PIEcamera.position.y;
    n=PIEcamera.position.z;

    if(color==0xff0000){
        wrong.visible=true;
        correct.visible=false;
        wrong.position.set(0.8*l, 0.8*m, 0.8*n);
        wrong.lookAt(PIEcamera.position);
    }
    else{
        wrong.visible=false;
        correct.visible=true;
        correct.position.set(0.8*l, 0.8*m, 0.8*n);
        correct.lookAt(PIEcamera.position);
    }
    PIErender();
}

//a closure
function whysoasynchronous(cnt){
    return function(geometry, materials) {
        cars[cnt] = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
        cars[cnt].scale.x =  cars[cnt].scale.y = 0.5;
        cars[cnt].scale.z = 0.6;
        cars[cnt].translation = geometry.center();
        cars[cnt].castShadow=true;
        cars[cnt].finished=false;
        cars[cnt].speed = Math.floor(Math.random()*10000);
        cars[cnt].speed = Math.floor(cars[cnt].speed/100)%9 + Math.floor(cars[cnt].speed%100)/100 + 2;
        var zpos = cnt==1?-7:cnt==2?-4:cnt==3?0:3;
        cars[cnt].position.set(-32, -0.02, zpos);

        cars[cnt].callback= function(){
         cancelAnimationFrame(id);
            system1.visible=false;
            system2.visible=false;            

            PIErenderer.autoClear=false;
            PIEpauseAnimation();

            orbitcam.update(clock.getDelta());
            var mx=-1;
            for(var j=1; j<=4; j++)
                mx=Math.max(cars[j].speed, mx);

            var col;
            if(this.speed==mx){
                col=0x00ff00, system1.visible=true;
                system=system1;
            }
            else{
                col=0xff0000, system2.visible=true;
                system=system2;
            }

            
            function render(){
                var a = system.geometry.vertices;
                a.forEach(function (v) {
                    v.y-=v.velocityY;
                    v.x-=v.velocityX;
                    if(v.y<-2)
                        v.y=10;
                });
                system.geometry.verticesNeedUpdate = true;
                PIErenderer.clear();
                PIErender();
                PIErenderer.clearDepth();
                PIErenderer.render(scene2, PIEcamera);
                id=requestAnimationFrame(render);
            }

            blink(col);
            render();            
        }
        var hex = cars[cnt].material.materials[1].color.getHex();
        var mate = new THREE.MeshPhongMaterial({color:hex})
        var geo = new THREE.BoxGeometry(1, 0.5, 0.1);
        timepanel[cnt] = new THREE.Mesh(geo, mate);
        timepanel[cnt].position.set(cars[cnt].position.x-0.4, 0.85, cars[cnt].position.z);
        timepanel[cnt].lookAt(PIEcamera.position);
        timepanel[cnt].material.transparent=true;
        timepanel[cnt].material.opacity=0.7;
        timepanel[cnt].material.emissive.setHex(hex);

        PIEaddElement(cars[cnt]);
        PIEaddElement(timepanel[cnt]);
        timepanel[cnt].receiveShadow=false;
        PIErender();
    }
}


function updateExperimentElements(t, dt){

    if(orbitcam.enabled)
       orbitcam.update( clock.getDelta() );
   
    if(racedone){
        PIEstopAnimation();
        return;
    }

    //initialise material
    if(!displayTime){
        matfront = new THREE.MeshBasicMaterial({color:0xeceff1});
    }
    
    //displayTime = Math.floor(tottime/1000) + Math.floor((tottime/1000 - Math.floor(tottime/1000))*100)/100;
    displayTime+=dt/1000;
    var flag=cars[1].finished;
    
    for(var i = 1; i<=4; i++){
        flag=flag && cars[i].finished;

        if(!cars[i].finished){
            cars[i].position.x=Math.min(cars[i].position.x+(cars[i].speed*dt)/1000, 18.7);
            PIEscene.remove(time[i]);
            settime(i, (displayTime).toPrecision(4));
        }
        
        if(cars[i].position.x>=18)
            cars[i].finished=true;
        

        timepanel[i].position.x=cars[i].position.x-0.4;
        timepanel[i].lookAt(PIEcamera.position);

    }
    racedone=flag;
}

//changes/adds the time on the parallelopiped
function setdist(index, text){
    geometry = new THREE.TextGeometry(text, {
        font : font,
        size : 0.6,
        height : 0.25,
        curveSegments : 3
    });
 
    thedist[index]=new THREE.Mesh(geometry, fontmat);
    thedist[index].translation = geometry.center();

    PIEaddElement(thedist[index]);  
    thedist[index].castShadow=false;
}

function setdistprops(){
    thedist[1].position.set(0, 6, -0.8)
    thedist[1].rotation.set(0.29, 0, 0);

    thedist[2].position.set(1.2, 6, -2)
    thedist[2].rotation.set(Math.PI/2, Math.PI/2 - 0.27, 3*Math.PI/2);

    thedist[3].position.set(0, 6, -3.2);
    thedist[3].rotation.set(-0.29, Math.PI,0);

    thedist[4].position.set(-1.2 ,6 , -2)
    thedist[4].rotation.set(Math.PI/2, -Math.PI/2 + 0.27, Math.PI/2);    
}


//changes/adds the distance on top of cars
function settime(i, text){
    distgeo = new THREE.TextGeometry(text+' s', {
        font : font,
        size : 0.15,
        height : 0.05,
        curveSegments : 3
    });
    
    time[i]=new THREE.Mesh(distgeo, matfront);
    time[i].translation = distgeo.center();
    time[i].position.set(cars[i].position.x-0.35, 0.85, cars[i].position.z);
    time[i].lookAt(PIEcamera.position);
    PIEaddElement(time[i]);
    time[i].castShadow=false;
}

//orbit control config
function notify(){
    if(orbitcam.enabled){
        PIEchangeDisplayCheckbox("Camera Control", false);
        orbitcam.enabled=false;
    }
    else{
        orbitcam.enabled=true;
        PIEchangeDisplayCheckbox("Camera Control", true);
    }
}

function initialiseControls(){
   
    PIEaddInputCheckbox("Camera Control", false, notify);
}

function initialiseOtherVariables(){

    for(var cnt = 1; cnt<=4; cnt++){
        cars[cnt].speed = Math.floor(Math.random()*10000);
        cars[cnt].speed = Math.floor(cars[cnt].speed/100)%9 + (cars[cnt].speed%100)/100 + 2;
    }             

    time[1].position.set(-32, 0.85, -7);
    time[2].position.set(-32, 0.85, -4);
    time[3].position.set(-32, 0.85, 0);
    time[4].position.set(-32, 0.85, 3);

    timepanel[1].position.set(-32-0.4, 0.85, -7);
    timepanel[2].position.set(-32-0.4, 0.85, -4);
    timepanel[3].position.set(-32-0.4, 0.85, 0);
    timepanel[4].position.set(-32-0.4, 0.85, 3);

    cars[1].position.set(-32, -0.02, -7);
    cars[2].position.set(-32, -0.02, -4);
    cars[3].position.set(-32, -0.02, 0);
    cars[4].position.set(-32, -0.02, 3);

    for(var i=1; i<5; i++)
        cars[i].finished=false;

    road.rotation.x=road.rotation.z=-Math.PI/2;
    road.position.z=-2, road.position.y=-0.65;

    finishline.position.set(18.5, -0.58, -2);
    finishline.rotation.x=-Math.PI/2;

    totaldistance.position.set(0, 6, -2);

}

function resetExperiment(){

    PIEadjustCamera(30.220077630714485, 3.871295006010919, 8.329268270908972);
    PIEcamera.rotation.x=-0.2453925706644209;
    PIEcamera.rotation.y=1.033994164185291;
    PIEcamera.rotation.z=0.21198171295611237;

    racedone=false;
    displayTime=0;

    if(PIElastUpdateTime){
        initialiseOtherVariables();
    }
}

//makes the cars look selected when hovered over
//INTERSECTED helps in not
function onDocumentMouseMove( event ) {

    if(!displayTime){
        PIErender();
        return;
    }

    event.preventDefault();

    raycaster.setFromCamera( PIEmouseP, PIEcamera );

    //did not define cars[0]
    intersects = raycaster.intersectObjects([cars[1], cars[2], cars[3], cars[4]]);

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ){
                for(var i=0; i<8; i++)
                    INTERSECTED.material.materials[i].emissive.setHex( INTERSECTED.currentHex[i] );
            }
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex=[];
            for(var i=0; i<8; i++){
                INTERSECTED.currentHex[i] = INTERSECTED.material.materials[i].emissive.getHex();
                INTERSECTED.material.materials[i].emissive.setHex( 0x004444 );
            }
        }

    } else {

        if ( INTERSECTED ){
            for(var i=0; i<8; i++)
                INTERSECTED.material.materials[i].emissive.setHex( INTERSECTED.currentHex[i] );
        }
        INTERSECTED = null;
    }

    if(PIElastUpdateTime && (PIEanimationPaused || !PIEanimationON))
        PIErenderer.render(PIEscene, PIEcamera);
}

//checks whether the answer was correct
function ondocmousedown(event){
    
    if(!displayTime)
        return;

    event.preventDefault();

    raycaster.setFromCamera(PIEmouseP, PIEcamera);

    intersects = raycaster.intersectObjects([cars[1], cars[2], cars[3], cars[4]]);
    if(intersects.length>0){
        /*for(var k=0; k<thegroup.children.length; k++)
            thegroup.remove(thegroup.children[k]);*/
        intersects[0].object.callback();
    }
}

var helpContent;
function initialiseHelp(){
    helpContent="";
    helpContent = helpContent + "<h2>Which is faster? (same distance test)</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows four cars racing on road.</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. There are two states of the experiment.</p>";
    helpContent = helpContent + "<h3>The setup stage</h3>";
    helpContent = helpContent + "<p>The initial state is setup stage. In this stage, you can see a control window at the right. ";
    helpContent = helpContent + "You have access to enabling camera controls, which allows you to do stuff mentioned below.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li>Orbit - left mouse / touch: one finger move";
    helpContent = helpContent + "<li>Zoom - middle mouse, or mousewheel / touch: two finger spread or squish";
    helpContent = helpContent + "<li>Pan - right mouse, or arrow keys / touch: three finger swipe";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>Once you decide on that, you can enter the animation stage by clicking the start button</p>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>In the animation stage, the cars will move obeyng the laws of physics.</p>";
    helpContent = helpContent + "<p>The panels in the scene show the values of the two experiment variables during the animation.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li>Time&nbsp;&nbsp;:&nbsp;Time, in seconds, elapsed since the start of the race</li>";
    helpContent = helpContent + "<li>Distance&nbsp;&nbsp;:&nbsp;Distance, in meters, covered by the cars in the race.</li>";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>All four cars have their respective time elapsed shown above them. Total distance is written at the top.</p>";
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
    infoContent = infoContent + "<p>The experiment shows four cars racing on road.</p>";
    infoContent = infoContent + "<h3>Speed</h3>";
    infoContent = infoContent + "<p>Speed is the rate of change of distance with respect to time.</p>";
    infoContent = infoContent + "<p>Speed is sometimes also used synonymously with average speed, whose formula is - </p>";
    infoContent = infoContent + "<ul><li> Speed = Total distance covered / Total time taken </li></ul>";
    infoContent = infoContent + "<p>When a number of objects in motion, moving on the same track, are stopped at the same time, the object(s) with the fastest speed cover(s) the greatest distance.</p>";
    infoContent = infoContent + "<p>This can be observed by analysing the formula of speed.</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}
