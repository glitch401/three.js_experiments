var orbitcam, clock;
var ball, thefloor;
var theta, planetheta;
var gsintheta;
var theheight;
var vel, acc, m, x, y, mtheta;
var thetime, font, a, panel, text;
var orig;

//does what it says
function initialiseScene(){

    orbitcam=new THREE.OrbitControls(PIEcamera);
    clock=new THREE.Clock();
    orbitcam.enabled=false;
    orbitcam.maxPolarAngle = Math.PI * 0.4;
    orbitcam.minPolarAngle = 0.8;

    theta = Math.PI/6;
    theheight = 5;
    vel=0;
    a=0;
    gsintheta=10*Math.sin(theta);
    mtheta = Math.tan(theta);
    acc=-gsintheta;

    PIEscene.background=new THREE.Color( 0xbfd1e5 );
    PIEscene.add(new THREE.AmbientLight(0x606060));
}

function loadExperimentElements(){
    var loader, tex, material, geometry, shape;

    PIEsetExperimentTitle("Measuring speed of a ball");
    PIEsetDeveloperName("Archit Mathur");
    PIEhideControlElement();

    initialiseHelp();
    initialiseInfo();

    initialiseScene();
    PIEsetAreaOfInterest(-5, 5, 5, -5);

    PIEcreateTable("Observations", 6, 4, true);
    var headers = ["No.", "Distance", "Time", "Speed"];
    PIEupdateTableRow(0, headers);
    
    for(var i = 1; i<=5; i++){
        PIEsetRowInput(i, 10, "-");
        PIEupdateTableCell(i, 0, i);
    }

    loader = new THREE.FontLoader();
    loader.load("optimer.json", function(response){
        
        font = response;
        
        var i;
        for(i=1; i<=15; i++){
            geometry = new THREE.TextGeometry(i, {
                font : font,
                size : 0.75,
                height : 0.05,
            });
            var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x111111}));
            mesh.position.set(-i*2, 0, 3);
            mesh.rotation.x=-Math.PI/2;
            mesh.translation=geometry.center();
            PIEaddElement(mesh);
            geometry = new THREE.BoxGeometry(0.075, 0.05, 4);
            mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x111111}));
            mesh.position.set(-i*2, 0, 0);
            PIEaddElement(mesh);
        }

        for(i=1; i<=150; i++){
            var a = i%5==0? 3.5 : 3;
            geometry = new THREE.BoxGeometry(0.05, 0.05, a);
            var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x111133}));
            mesh.position.set(-i*0.2, 0, 0);
            PIEaddElement(mesh);
        }

        geometry = new THREE.TextGeometry("0.00 s", {
            font : font,
            size : 0.5,
            height : 1.5,
            curveSegments : 3
        });
 
        thetime=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        thetime.translation = geometry.center();
        PIEaddElement(thetime);
        thetime.castShadow=false;
        thetime.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-1.35, 0.4*PIEcamera.position.z);
        thetime.lookAt(PIEcamera.position);

        geometry = new THREE.TextGeometry("TIME", {
            font : font,
            size : 0.5,
            height : 1.5
        });

        text=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0x03a9ff}));
        text.translation = geometry.center();
        PIEaddElement(text);
        text.castShadow=false;
        text.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-0.7, 0.4*PIEcamera.position.z);
        text.lookAt(PIEcamera.position);

        material = new THREE.MeshPhongMaterial({color:0x0f0f1f})
        geometry = new THREE.BoxGeometry(4, 2, 0.1);
        panel = new THREE.Mesh(geometry, material);
        panel.material.transparent=true;
        panel.material.opacity=0.85;
        PIEaddElement(panel);
        panel.translation=geometry.center();
        panel.castShadow=false;
        
        panel.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-1, 0.4*PIEcamera.position.z);
        panel.lookAt(PIEcamera.position);
        
        PIErender();
    });

    loader=new THREE.TextureLoader();
    loader.load("grid.png", function( texture ) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 80, 40 );

        material=new THREE.MeshPhongMaterial({map:texture});
        geometry=new THREE.PlaneGeometry(80, 30, 1, 1);
        thefloor=new THREE.Mesh(geometry, material);
        thefloor.rotation.x=-Math.PI/2;
        thefloor.position.y=-0.05;
        thefloor.position.x=-5;
        PIEaddElement(thefloor);
        thefloor.castShadow=false;
        PIErender();
    });

    geometry = new THREE.SphereGeometry(0.50, 32, 32);
    material = new THREE.MeshPhongMaterial();
    ball = new THREE.Mesh(geometry, material);
    ball.vx=0, ball.vy=0;
    PIEaddElement(ball);
    ball.position.set(orig=theheight/Math.tan(theta), theheight+0.50, 0);
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
    planetheta.position.x=0.2;

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
    if(vel<0){
        acc=0;
        vel=0;
        PIEstopAnimation();
        return;
    }

    if(ball.position.x < 0){
        PIEscene.remove(thetime);
        a+=(dt/1000);
        geometry = new THREE.TextGeometry(a.toFixed(3)+" s", {
            font : font,
            size : 0.5,
            height : 1.5,
            curveSegments : 3
        });

        thetime=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        thetime.translation = geometry.center();
        
        PIEaddElement(thetime);
        thetime.castShadow=false;

        acc = -2.5;
        vel = vel + (acc*dt*0.001);
        
        x = ball.position.x - vel*dt*0.001;
        y=0.50;
        PIEchangeDisplayText("Distance (units)", -(0.5*x).toFixed(3));
    }
    else{
        acc = gsintheta-0.1;
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
        PIEchangeDisplayText("Distance (units)", 0.00);     
    }
    thetime.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-1.35, 0.4*PIEcamera.position.z);
    thetime.lookAt(PIEcamera.position);
    text.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-0.7, 0.4*PIEcamera.position.z);
    text.lookAt(PIEcamera.position);
    panel.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-1, 0.4*PIEcamera.position.z);
    panel.lookAt(PIEcamera.position);
    
    ball.position.set(x, y, ball.position.z);
    
    PIEchangeDisplayText("Speed (unit/s)", vel.toFixed(3));
}

function balldrag(obj, pos){
    a=0;
    if(ball.position.x>0){
        if(pos.x>theheight/Math.tan(theta))
            pos.x=theheight/Math.tan(theta);

        if(pos.z<-1.0)
            pos.z=-1.0;    
        if(pos.z>1)
            pos.z=1;

        obj.position.set(orig=pos.x, pos.x*Math.tan(theta)+0.50, pos.z);
    }
    else{
        obj.position.set(pos.x, 0.5, 0);
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
    theta = newval*Math.PI/180;
    PIEscene.remove(planetheta);
    shape = new THREE.Shape();
    shape.moveTo(6/Math.tan(theta), 0);
    shape.lineTo(6/Math.tan(theta), 6);
    shape.lineTo(0, 0);
    shape.lineTo(6/Math.tan(theta), 0);

    geometry = new THREE.ExtrudeGeometry(shape, { amount: 4, bevelEnabled: false});
    planetheta = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x691a99}));
    planetheta.position.z=-2;
    PIEaddElement(planetheta);
    planetheta.position.x=0.2;

    gsintheta=10*Math.sin(theta);
    mtheta = Math.tan(theta);

    ball.vx=ball.vy=vel=0;
    ball.position.set(theheight/Math.tan(theta), theheight+0.50, 0);

    PIEcamera.position.set(-20.42875766012398,14.848893923358006,34.815801982020986);
    PIEcamera.rotation.set(-0.37763201708074584,-0.4139995724383938,-0.15823590476379537)
    a=0;
    PIErender();
}


function initialiseControls(){
    PIEaddInputCheckbox("Camera Control", false, camnotify);
    PIEaddInputSlider("Incline's Angle", 30, anglenotify, 20, 60, 1);
    PIEaddDisplayText("Distance (units)", 0.00);
    PIEaddDisplayText("Speed (unit/s)", 0.00);
    PIEdisplayGUI.__controllers[1].__precision=3;
    PIEdisplayGUI.__controllers[0].__precision=3;
}

function initialiseOtherVariables(){

    theta = Math.PI/6;
    theheight = 5;
    vel=0;
    a=0;
    gsintheta=10*Math.sin(theta);
    mtheta = Math.tan(theta);
    acc=-gsintheta;

    PIEscene.remove(planetheta);
    shape = new THREE.Shape();
    shape.moveTo(6/Math.tan(theta), 0);
    shape.lineTo(6/Math.tan(theta), 6);
    shape.lineTo(0, 0);
    shape.lineTo(6/Math.tan(theta), 0);

    geometry = new THREE.ExtrudeGeometry(shape, { amount: 4, bevelEnabled: false});
    planetheta = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x691a99}));
    planetheta.position.z=-2;
    PIEaddElement(planetheta);
    planetheta.position.x=0.2;

    ball.vx=ball.vy=vel=0;
    ball.position.set(theheight/Math.tan(theta), theheight+0.50, 0);
    
    for(var i = 1; i<=5; i++){
        PIEsetRowInput(i, 10, "-");
        PIEupdateTableCell(i, 0, i);
    }

    PIEscene.remove(thetime);
    geometry = new THREE.TextGeometry("0.00 s", {
        font : font,
        size : 0.5,
        height : 1.5,
        curveSegments : 3
    });

    thetime=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
    thetime.translation = geometry.center();
    PIEaddElement(thetime);
    thetime.castShadow=false;
    thetime.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-1.35, 0.4*PIEcamera.position.z);
    thetime.lookAt(PIEcamera.position);
    text.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-0.7, 0.4*PIEcamera.position.z);
    text.lookAt(PIEcamera.position);
    panel.position.set(0.4*PIEcamera.position.x, 0.2*PIEcamera.position.y-1, 0.4*PIEcamera.position.z);
    panel.lookAt(PIEcamera.position);
}

function resetExperiment(){
    PIEcamera.position.set(-20.42875766012398,14.848893923358006,34.815801982020986);
    PIEcamera.rotation.set(-0.37763201708074584,-0.4139995724383938,-0.15823590476379537)    
    PIEchangeInputSlider("Incline's Angle", 30);
    a=0;
    if(PIElastUpdateTime){
        initialiseOtherVariables();
    }
}

var helpContent;
function initialiseHelp(){
    helpContent="";
    helpContent = helpContent + "<h2>Measuring speed of a ball</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows a ball's movement.</p>";
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
    helpContent = helpContent + "<p>Incline's Angle allows you to set the angle of inclined plane</p>";
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
    infoContent = infoContent + "<p>The experiment shows a ball's movement.</p>";
    infoContent = infoContent + "<h3>Speed</h3>";
    infoContent = infoContent + "<p>Speed is the rate of change of distance with respect to time.</p>";
    infoContent = infoContent + "<p>Speed is sometimes also used synonymously with average speed, whose formula is - </p>";
    infoContent = infoContent + "<ul><li> Speed = Total distance covered / Total time taken </li></ul>";
    infoContent = infoContent + "<p>The ball will have different speed at different points of time since real world surfaces have friction which makes the ball slow down and eventually stop.</p>";
    infoContent = infoContent + "<p>Use the table provided to tabulate your observations.</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}