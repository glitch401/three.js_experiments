
var thehammer;
var orbitcam, clock;
var theball, ballradius, ballmass, ballvelocity;
var thefloor, pole;
var theboundary;
var fric;
var velpanel, font, thevel, heading;
var hitonce, counter;
var x, y, z, theta, x1, z1;

//does what it says
function initialiseScene(){
    hitonce=false;
    counter=0;
    ballmass=1, ballradius=0.1;

    fric=-0.9;
    theboundary=[];
    theta=0, x1=ballradius+0.25, z1=0;

	orbitcam=new THREE.OrbitControls(PIEcamera);
	clock=new THREE.Clock();
    orbitcam.enabled=false;
    orbitcam.enableZoom=false;
    orbitcam.maxPolarAngle = Math.PI * 0.45;
    orbitcam.minPolarAngle = 0.8;

    PIEscene.add(new THREE.AmbientLight(0x606060));
   
    PIEcamera.position.set(-0.05527074424515538, 2.9731239686405893, 6.0079166151350645);
    PIEcamera.rotation.set(-0.459533369319057, -0.008245089377707907, -0.0040801596752513564);
}
function loadExperimentElements(){
    var loader, tex, material, geometry;

    PIEsetExperimentTitle("Inertia & Mass");
    PIEsetDeveloperName("Archit Mathur");
    PIEhideControlElement();

    initialiseHelp();
    initialiseInfo();

    initialiseScene();

    PIEsetAreaOfInterest(-3, 3, 3, -3);
    PIEscene.background=new THREE.Color( 0xbfd1e5 );
    
    //0.1=1KG, 0.3=5KG
    geometry=new THREE.SphereGeometry(ballradius, 32, 32);
    material=new THREE.MeshPhongMaterial({color:0xffffff});
    theball=new THREE.Mesh(geometry, material);
    theball.position.set(0, 0+ballradius, 0);
	theball.xvel=theball.zvel=0;
	PIEaddElement(theball);
    
    //the hammer
    loader=new THREE.JSONLoader();
    loader.load("./assets/hammer1.json", function(geometry, materials) {
        thehammer = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
        thehammer.scale.y = 0.09;
        thehammer.scale.z=thehammer.scale.x = 0.05;
        thehammer.translation = geometry.center();
        thehammer.castShadow=thehammer.receiveShadow=true;
        thehammer.position.set(ballradius+0.25, ballradius+0.3, 0);
        PIEaddElement(thehammer);
        for(var i=0; i<3; i++){
            thehammer.material.materials[i].opacity=1;
            thehammer.material.materials[i].transparent=true;
        }
        thehammer.rotation.set(-Math.PI/2, Math.PI/2, 0);
        thehammer.mass=2, thehammer.velocity=5;
        PIEdragElement(thehammer);
    	PIEsetDrag(thehammer, hamdrag);
        PIErender();
    });
    
    tex=new THREE.TextureLoader();
    tex.load("./assets/woodred.jpg", function(texture){
        geometry=new THREE.BoxGeometry(0.05, 0.35, 3.1);
        material=new THREE.MeshPhongMaterial({map:texture});
        for(var i=0; i<2; i++){
            theboundary[i]=new THREE.Mesh(geometry, material);
            PIEaddElement(theboundary[i]);
        }
        theboundary[0].position.set(-2, 0.2, 0);
        theboundary[1].position.set(2, 0.2, 0);

        geometry=new THREE.BoxGeometry(0.05, 0.35, 4);
        for(var i=2; i<4; i++){
            theboundary[i]=new THREE.Mesh(geometry, material);
            PIEaddElement(theboundary[i]);
            theboundary[i].rotation.y=Math.PI/2;
        }
        theboundary[2].position.set(0, 0.2, -1.5);
        theboundary[3].position.set(0, 0.2, 1.5);

        geometry=new THREE.BoxGeometry(4, 0.05, 3.1);
        theboundary[4]=new THREE.Mesh(geometry, material);
        PIEaddElement(theboundary[4]);

        PIErender();
    });

    loader=new THREE.TextureLoader();
    loader.load("./assets/grid.png", function( texture ) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 40, 40 );

        material=new THREE.MeshPhongMaterial({map:texture});
        geometry=new THREE.PlaneGeometry(10, 10, 1, 1);
        thefloor=new THREE.Mesh(geometry, material);
        thefloor.rotation.x=-Math.PI/2;
        PIEaddElement(thefloor);
        thefloor.castShadow=false;
        PIErender();
    });

    material = new THREE.MeshPhongMaterial({color:0x1f1f1f})
    geometry = new THREE.BoxGeometry(1, 0.5, 0.1);
    velpanel = new THREE.Mesh(geometry, material);
    velpanel.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y, 0.4*PIEcamera.position.z);
    velpanel.lookAt(PIEcamera.position);
    velpanel.material.transparent=true;
    velpanel.material.opacity=0.7;
    PIEaddElement(velpanel);
    velpanel.castShadow=false;
    velpanel.visible=false;

    loader = new THREE.FontLoader();
    loader.load("./assets/optimer.json", function(response){
        font = response;

        geometry = new THREE.TextGeometry("0.00 m/s", {
            font : font,
            size : 0.125,
            height : 0.3,
            curveSegments : 3
        });
 
        thevel=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        thevel.translation = geometry.center();
        
        PIEaddElement(thevel);
        thevel.castShadow=false;
        thevel.visible=false;

        geometry = new THREE.TextGeometry("Ball's Velocity", {
        	font : font,
            size : 0.075,
            height : 0.3,
        });
        heading=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        heading.translation = geometry.center();
        PIEaddElement(heading);
        heading.castShadow=false;
        heading.visible=false;

        thevel.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-0.075, 0.4*PIEcamera.position.z); 
   		thevel.lookAt(PIEcamera.position);
   		heading.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y+0.075, 0.4*PIEcamera.position.z); 
    	heading.lookAt(PIEcamera.position);
    });

    initialiseControls();
    resetExperiment();
}

function hamdrag(object, newpos) {
	var x=newpos.x, z=newpos.z;
	if(x*x+z*z!=(ballradius+0.275)*(ballradius+0.275)){
		if(x*x<=(ballradius+0.275)*(ballradius+0.275))
			z=Math.sqrt((ballradius+0.275)*(ballradius+0.275)-x*x);
		else
			x=Math.sqrt((ballradius+0.275)*(ballradius+0.275)-z*z);
	}
	
	if(newpos.x<0 && x>0)
		x=-x;
	if(newpos.z<0 && z>0)
		z=-z;

	object.position.set(x, ballradius+0.3, z);
    x1 = x, z1= z;    
    theta=Math.atan(z1/x1);
}

function updateExperimentElements(t, dt){
    if(orbitcam.enabled)
        orbitcam.update( clock.getDelta() );

    if(thehammer.position.x*thehammer.position.x + thehammer.position.z*thehammer.position.z > (ballradius+ 0.15)*(ballradius + 0.15)){
        //thehammer.rotation.y-=0.075;
        ballvelocity=(thehammer.velocity*thehammer.mass)/ballmass;
        theball.xvel=Math.cos(theta)*ballvelocity;
        theball.zvel=Math.sin(theta)*ballvelocity;
        x=thehammer.position.x, z=thehammer.position.z;
        thehammer.position.x-=0.1*x*thehammer.velocity/4;
        thehammer.position.z-=0.1*z*thehammer.velocity/4;
        heading.visible=true;
        thevel.visible=true;
        velpanel.visible=true;
    }
    else{
        for(var i=0; i<3; i++){
            if(thehammer.material.materials[i].opacity<0){
                thehammer.visible=false;
                thehammer.rotation.set(-Math.PI/2, Math.PI/2, 0);
                break;   
            }
            thehammer.material.materials[i].opacity-=0.075;
        }
        
        if(counter<15){
            PIEscene.remove(thevel);
            var a=(Math.random()*100);
            a=a>=10?a.toPrecision(4):a.toPrecision(3);
            geometry = new THREE.TextGeometry(a+" m/s", {
                font : font,
                size : 0.125,
                height : 0.5,
                curveSegments : 3
            });
        
            thevel=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
            thevel.translation = geometry.center();
            
            PIEaddElement(thevel);
            thevel.castShadow=false;

            counter++;
            if(counter==15)
                hitonce=true;
        }
        if(hitonce){
            hitonce=false;
            PIEscene.remove(thevel);
            var a=ballvelocity;
            a = a>=10? a.toPrecision(4) : a.toPrecision(3);
            geometry = new THREE.TextGeometry(a+" m/s", {
                font : font,
                size : 0.125,
                height : 0.5,
                curveSegments : 3
            });
        
            thevel=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
            thevel.translation = geometry.center();
            
            PIEaddElement(thevel);
            thevel.castShadow=false;
        }
        
        if((x1>=0 && z1<0) || (x1>=0 && z1>=0)){
            theball.position.x=theball.position.x-theball.xvel*dt/1000; 
            theball.position.z=theball.position.z-theball.zvel*dt/1000;
        }
        else{
            theball.position.x=theball.position.x+theball.xvel*dt/1000; 
            theball.position.z=theball.position.z+theball.zvel*dt/1000;
        }

        if(theball.position.x-ballradius<-2){
            theball.position.x=-2+ballradius;       
            theball.xvel*=fric;
        }
        if(theball.position.x+ballradius>2){
            theball.position.x=2-ballradius;
            theball.xvel*=fric;
        }
        if(theball.position.z-ballradius<-1.5){
            theball.position.z=-1.5+ballradius;       
            theball.zvel*=fric;
        }
        if(theball.position.z+ballradius>1.5){
            theball.position.z=1.5-ballradius;
            theball.zvel*=fric;
        }

        if(theball.xvel>0.005 || theball.xvel<-0.005 || theball.zvel>0.005 || theball.zvel<-0.005){
            if(theball.xvel>0.005 || theball.xvel<-0.005)
                theball.xvel*=0.99;
            if(theball.zvel>0.005 || theball.zvel<-0.005)
                theball.zvel*=0.99;
        }
        else{
            for(var i=0; i<3; i++)
                thehammer.material.materials[i].opacity=1;
            thehammer.visible=true;
            resetExperiment();
            PIEstopAnimation();
        }
    }
    velpanel.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y, 0.4*PIEcamera.position.z); 
    velpanel.lookAt(PIEcamera.position);
    thevel.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-0.075, 0.4*PIEcamera.position.z); 
    thevel.lookAt(PIEcamera.position);
    heading.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y+0.075, 0.4*PIEcamera.position.z); 
    heading.lookAt(PIEcamera.position);
}

//orbit control config
function camnotify(){
    if(orbitcam.enabled){
        PIEchangeDisplayCheckbox("Camera Control", false);
        orbitcam.enabled=false;
    }
    else{
        orbitcam.enabled=true;
        PIEchangeDisplayCheckbox("Camera Control", true);
    }
}

function bmassnotify(){
    //0.1 = 1kg, 0.2 = 5kg
    //y=mx+c
    //m=4/0.1=40
    //c=1-40*0.1=-3
    //x=(y-c)/m
	ballmass=PIEgetInputSlider("Ball's Mass");
    ballradius=(ballmass+3)/40.0;

    PIEscene.remove(theball);
    geometry=new THREE.SphereGeometry(ballradius, 32, 32);
    material=new THREE.MeshPhongMaterial({color:0xffffff});
    theball=new THREE.Mesh(geometry, material);
    theball.position.set(0, 0.0+ballradius, 0);
    PIEaddElement(theball);

    thehammer.position.set(ballradius+0.25, ballradius+0.3, 0);
    for(var i=0; i<3; i++)
        thehammer.material.materials[i].opacity=1;
    
    counter=0;

    PIEcamera.position.set(-0.05527074424515538, 2.9731239686405893, 6.0079166151350645);
    PIEcamera.rotation.set(-0.459533369319057, -0.008245089377707907, -0.0040801596752513564);

    PIErender();
}

function initialiseControls(){
    PIEaddInputCheckbox("Camera Control", false, camnotify);
    PIEaddInputSlider("Ball's Mass", 1, bmassnotify, 1, 10, 0.1);
    PIEaddInputSlider("Hammer's Force", 5, function(){ thehammer.velocity=PIEgetInputSlider("Hammer's Force"); }, 1, 10, 0.1);
}

function initialiseOtherVariables(){
    PIEscene.remove(theball);
    geometry=new THREE.SphereGeometry(ballradius, 32, 32);
    material=new THREE.MeshPhongMaterial({color:0xffffff});
    theball=new THREE.Mesh(geometry, material);
    PIEaddElement(theball);
    theball.position.set(0, ballradius, 0);
    
    thehammer.position.set(ballradius+0.25, ballradius+0.3, 0);
    thehammer.rotation.y=Math.PI/2;
    thehammer.rotation.x=-Math.PI/2;
    thehammer.visible=true;
    thehammer.velocity=5;
    thehammer.rotation.set(-Math.PI/2, Math.PI/2, 0);
    for(var i=0; i<3; i++)
        thehammer.material.materials[i].opacity=1;

    heading.visible=false;
    thevel.visible=false;
    velpanel.visible=false;
    velpanel.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y, 0.4*PIEcamera.position.z);
    velpanel.lookAt(PIEcamera.position);
    thevel.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-0.1, 0.4*PIEcamera.position.z);
    thevel.lookAt(PIEcamera.position);
}

function resetExperiment(){
    PIEcamera.position.set(-0.05527074424515538, 2.9731239686405893, 6.0079166151350645);
    PIEcamera.rotation.set(-0.459533369319057, -0.008245089377707907, -0.0040801596752513564);
    hitonce=false;
    counter=0;
    theta=0;
    ballmass=1, ballradius=0.1;

    PIEchangeInputSlider("Hammer's Force", 5);
    PIEchangeInputSlider("Ball's Mass", 1);

    if(PIElastUpdateTime) 
        initialiseOtherVariables();
}

var helpContent;
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>Inertia & Mass</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows a ball being hit by a hammer.</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. There are two states of the experiment.</p>";
    helpContent = helpContent + "<h3>The setup stage</h3>";
    helpContent = helpContent + "<p>The initial state is setup stage. In this stage, you can see a control window at the right. ";
    helpContent = helpContent + "You have access to enabling camera controls, which allows you to do stuff mentioned below.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li>Orbit - left mouse / touch: one finger move";
    helpContent = helpContent + "<li>Pan - right mouse, or arrow keys / touch: three finger swipe";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>The slider allows you to change the mass cum radius of the ball.</p>"
    helpContent = helpContent + "<p>Once you decide on that, you can enter the animation stage by clicking the start button</p>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>The panel in the scene shows the value of the velocity of the ball just as the hammer hit it.</p>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line</p>";
    helpContent = helpContent + "<p>You can slow down and speed up the animation by using the speed control buttons</p>";
    helpContent = helpContent + "<p>The round button is for resetting the animation.</p>";
    helpContent = helpContent + "<h4>The drag and drop</h4>";
    helpContent = helpContent + "<p>You can also position the hammer by dragging and dropping it. You can only do this in the setup stage. This has been prevented in the animation stage.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Experiment Concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>The experiment shows a ball being hit by a hammer.</p>";
    infoContent = infoContent + "<h3>Inertia</h3>";
    infoContent = infoContent + "<p>Inertia is the property of an object which allows it to resist a change in the state of motion.</p>";
    infoContent = infoContent + "<p>If it is moving, it tends to keep moving and if it is at rest, it tends to be at rest.</p>";
    infoContent = infoContent + "<p>The relation between the hammer and the ball is - </p>";
    infoContent = infoContent + "<ul><li> Ball's Velocity = Hammer's Velocity * Hammer's Mass / Ball's Mass</li></ul>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}
