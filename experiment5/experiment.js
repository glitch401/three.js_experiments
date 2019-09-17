var orbitcam, clock;
var ball, thefloor;
var theta, planetheta;
var phi, planephi;
var gsintheta, gsinphi;
var theheight;
var vel, acc, m, x, y, mphi, mtheta;
var follow;

//does what it says
function initialiseScene(){
   
    orbitcam=new THREE.OrbitControls(PIEcamera);
    clock=new THREE.Clock();
    orbitcam.enabled=false;
    orbitcam.maxPolarAngle = Math.PI * 0.45;

    theta = Math.PI/6;
    phi= Math.PI/6;
    theheight = 5;
    vel=0;
    a=1;
    angle=theta;
    gsinphi=10*Math.sin(phi);
    gsintheta=10*Math.sin(theta);
    mphi = Math.tan(phi);
    mtheta = Math.tan(theta);
    acc=-gsintheta;

    follow=false;

    PIEscene.background=new THREE.Color( 0xbfd1e5 );
    PIEscene.add(new THREE.AmbientLight(0x606060));
}

function loadExperimentElements(){
    var loader, tex, material, geometry, shape;

    PIEsetExperimentTitle("Galileo's inclined plane experiment");
    PIEsetDeveloperName("Archit Mathur");
    PIEhideControlElement();

    initialiseHelp();
    initialiseInfo();

    initialiseScene();
    PIEsetAreaOfInterest(-5, 5, 5, -5);

    loader=new THREE.TextureLoader();
    loader.load("grid.png", function( texture ) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4000, 40 );

        material=new THREE.MeshPhongMaterial({map:texture});
        geometry=new THREE.PlaneGeometry(3000, 30, 1, 1);
        thefloor=new THREE.Mesh(geometry, material);
        thefloor.rotation.x=-Math.PI/2;
        thefloor.position.y=-0.05;
        PIEaddElement(thefloor);
        thefloor.castShadow=false;
        PIErender();
    });

    geometry = new THREE.SphereGeometry(0.50, 32, 32);
    material = new THREE.MeshPhongMaterial();
    ball = new THREE.Mesh(geometry, material);
    ball.vx=0, ball.vy=0;
    PIEaddElement(ball);
    ball.position.set(theheight/Math.tan(theta), theheight+0.50, 0);
    PIEdragElement(ball);
    PIEsetDrag(ball, balldrag);

    shape = new THREE.Shape();
    shape.moveTo(6/Math.tan(theta), 0);
    shape.lineTo(6/Math.tan(theta), 6);
    shape.lineTo(0, 0);
    shape.lineTo(6/Math.tan(theta), 0);
    geometry = new THREE.ExtrudeGeometry(shape, { amount: 4, bevelEnabled: false});
    planetheta = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x691a99}));
    planetheta.position.z=-2;
    PIEaddElement(planetheta);

    shape = new THREE.Shape();
    shape.moveTo(-6/Math.tan(phi)+0, 0);
    shape.lineTo(-6/Math.tan(phi)+0, 6);
    shape.lineTo(+0, 0);
    shape.lineTo(-6/Math.tan(phi)+0, 0);
    geometry = new THREE.ExtrudeGeometry(shape, { amount: 4, bevelEnabled: false});
    planephi = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x691a99}));
    planephi.position.z=-2;
    planephi.position.x=-0.2;
    PIEaddElement(planephi);

    initialiseControls();
    resetExperiment();
}

function updateExperimentElements(t, dt){

    if(ball.position.x<=-1400)
        PIEstopAnimation();

    if(ball.position.y<0.5){
        ball.position.y=0.5;
    }

    if(ball.position.y>theheight+0.5){
        ball.position.y=theheight+0.5;
        vel=0;
    }

    if(ball.position.x < 0){

        acc = gsinphi;
        if(ball.vx >= 0){
            vel = vel + (acc*dt*0.001);
            //ball.vy = -Math.sin(phi) * vel;
            ball.vx = Math.cos(phi) * vel;
        }
        else{
            vel = vel - (acc*dt*0.001);
            //ball.vy = Math.sin(phi) * vel;
            ball.vx = -Math.cos(phi) * vel;
        }

        m = mphi;
        x = ball.position.x + ball.vx*dt*0.001;
        if(x<-theheight/mphi){
            vel=0;
            x=-theheight/mphi;
        }
        y = -x*m+0.50;
    }
    else{
        acc = gsintheta;
        if(ball.vx > 0){
            vel = vel - (acc * dt*0.001);
            //ball.vy = vel * Math.sin(theta);
            ball.vx = vel * Math.cos(theta);
        }
        else{
            vel = vel + (acc * dt*0.001);
            //ball.vy = -vel * Math.sin(theta);
            ball.vx = -vel * Math.cos(theta);
        }

        m = mtheta;
        x = ball.position.x + ball.vx*dt*0.001;
        if(x>theheight/mtheta){
            x=theheight/mtheta;
            vel=0;
        }
        y = x*m+0.50;        
    }

    ball.position.set(x, y, ball.position.z);
    if(follow){
        PIEcamera.position.x+=(0.98*ball.vx*dt/1000);
    }
}

function balldrag(obj, pos){

    if(ball.position.x>0){
        if(pos.x>theheight/Math.tan(theta))
            pos.x=theheight/Math.tan(theta);

        if(pos.z<-1.0)
            pos.z=-1.0;    
        if(pos.z>1)
            pos.z=1;

        obj.position.set(pos.x, pos.x*Math.tan(theta)+0.50, pos.z);
    }
    else{
        if(pos.x>theheight/Math.tan(phi))
            pos.x=theheight/Math.tan(phi);
        

        if(pos.z<-1.0)
            pos.z=-1.0;    
        if(pos.z>1)
            pos.z=1;

        obj.position.set(pos.x, -pos.x*Math.tan(phi)+0.50, pos.z);   
    }
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

function anglenotify(newval){
    phi = newval*Math.PI/180;
    PIEscene.remove(planephi);
    shape = new THREE.Shape();
    if(phi){
        shape.moveTo(-6/Math.tan(phi)+0, 0);
        shape.lineTo(-6/Math.tan(phi)+0, 6);
        shape.lineTo(0, 0);
        shape.lineTo(-6/Math.tan(phi)+0, 0);
    }
    else{
        shape.moveTo(-1500, 0);
        shape.lineTo(-1500, 0.05);
        shape.lineTo(0, 0.05);
        shape.lineTo(0, 0);
        shape.lineTo(-1500, 0);
    }

    geometry = new THREE.ExtrudeGeometry(shape, { amount: 4, bevelEnabled: false});
    planephi = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x691a99}));
    planephi.position.z=-2;
    PIEaddElement(planephi);
    planephi.position.x=-0.2;

    gsinphi=10*Math.sin(phi);
    mphi = Math.tan(phi);

    ball.vx=ball.vy=vel=0;
    ball.position.set(theheight/Math.tan(theta), theheight+0.50, 0);

    PIEcamera.position.set(13.938341614045607, 17.95561333647463, 22.40270667014564);
    PIEcamera.rotation.set(-0.6756506488609149, 0.4519651751320877, 0.33670992806069916);
    PIErender();
}


function initialiseControls(){
    PIEaddInputCheckbox("Camera Control", false, camnotify);
    PIEaddInputCheckbox("Follow Ball", false, function(){follow=follow? false: true;});
    PIEaddInputSlider("Incline's Angle", 30, anglenotify, 0, 60, 1);
}

function initialiseOtherVariables(){
    
    ball.vx=ball.vy=vel=0;
    ball.position.set(theheight/Math.tan(theta), theheight+0.50, 0);

    theta = Math.PI/6;
    phi= Math.PI/6;
    theheight = 5;
    vel=0;
    a=1;
    angle=theta;
    gsinphi=10*Math.sin(phi);
    gsintheta=10*Math.sin(theta);
    mphi = Math.tan(phi);
    mtheta = Math.tan(theta);
    acc=-gsintheta;

    PIEscene.remove(planephi);
    shape = new THREE.Shape();
    shape.moveTo(-6/Math.tan(phi)+0, 0);
    shape.lineTo(-6/Math.tan(phi)+0, 6);
    shape.lineTo(0+0, 0);
    shape.lineTo(-6/Math.tan(phi)+0, 0);
    geometry = new THREE.ExtrudeGeometry(shape, { amount: 4, bevelEnabled: false});
    planephi = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x691a99}));
    planephi.position.z=-2;
    planephi.position.x=-0.2;
    PIEaddElement(planephi);
}

function resetExperiment(){
    PIEcamera.position.set(13.938341614045607, 17.95561333647463, 22.40270667014564);
    PIEcamera.rotation.set(-0.6756506488609149, 0.4519651751320877, 0.33670992806069916);
    
    PIEchangeInputSlider("Incline's Angle", 30);

    if(PIElastUpdateTime){
        initialiseOtherVariables();
    }
}

var helpContent;
function initialiseHelp(){
    helpContent="";
    helpContent = helpContent + "<h2>Galileo's Inclined Plane Experiment </h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows a ball's movement on two inclined planes.</p>";
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
    infoContent = infoContent + "<p>The experiment shows a ball's movement on two inclined planes.</p>";
    infoContent = infoContent + "<p>The ball travels the same height on both the frictionless planes, irrespective of their inclinations.</p>";
    infoContent = infoContent + "<p>This experiment allowed Galileo to ascertain the value of acceleration due to gravity.</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}