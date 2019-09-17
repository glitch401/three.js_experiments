var earth, clouds;
var orbitcam, clock;
var intersects, highlight;
var scene2, cam2, stars;
var latlongpanel, gvalpanel, latlong, gval, font;
var directionalLight, ambientLight;
var a=0;

//does what it says
function initialiseScene(){

    PIEsetAreaOfInterest(-2.5, 2.5, 2.5, -2.5);
    PIErenderer.autoClear=false;

    scene2 = new THREE.Scene();
    scene2.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
    cam2 = new THREE.PerspectiveCamera(50, PIEcanvasAspect, 0.1, 1000);
    cam2.position.z=10;

    orbitcam=new THREE.OrbitControls(PIEcamera);
    clock=new THREE.Clock();
    orbitcam.enabled=false;
    orbitcam.enableZoom=false;
       
    document.addEventListener( 'mousemove', ondocmousemove, false );
    document.addEventListener('mousedown', ondocmousedown, false);
    
    
    if(document.getElementsByTagName('div')[0].clientHeight-PIErenderer.domElement.height<0)
        a=40;
}

function loadExperimentElements(){
    var loader, tex, material, geometry;

    PIEsetExperimentTitle("Acceleration due to gravity");
    PIEsetDeveloperName("Archit Mathur");
    PIEhideControlElement();

    initialiseHelp();
    initialiseInfo();

    initialiseScene();

    material = new THREE.MeshPhongMaterial({color:0x040408})
    geometry = new THREE.BoxGeometry(3, 1.5, 0.5);
    latlongpanel = new THREE.Mesh(geometry, material);
    latlongpanel.position.set(-6.5, 0, 0);
    latlongpanel.lookAt(PIEcamera);
    scene2.add(latlongpanel);
    latlongpanel.rotation.y=0.5;

    gvalpanel = new THREE.Mesh(geometry, material);
    gvalpanel.position.set(6.5, 0, 0);
    gvalpanel.lookAt(PIEcamera);
    scene2.add(gvalpanel);
    gvalpanel.rotation.y=-0.5;
    
    loader = new THREE.TextureLoader();
    loader.load("./assets/earthmap4k.jpg", function(texture){
        geometry = new THREE.SphereGeometry(2, 60, 60);
        material = new THREE.MeshPhongMaterial({map:texture});
        material.color.r=material.color.g=0.8;
        earth = new THREE.Mesh(geometry, material);
        earth.scale.x=earth.scale.z=1.0033;
        PIEaddElement(earth); 
        PIErender();
    });

    loader.load("./assets/earth_clouds_1024.png", function(texture){
        geometry = new THREE.SphereGeometry(2.0375, 20, 20);
        material = new THREE.MeshPhongMaterial({map : texture});
        material.transparent=true;
        clouds = new THREE.Mesh(geometry, material);
        PIEaddElement(clouds);
    });

    loader = new THREE.FontLoader();
    loader.load("./assets/optimer.json", function(response){
        font = response;
        geometry = new THREE.TextGeometry("9.81 m/s2", {
            font : font,
            size : 0.25,
            height : 0.75,
        });
 
        gval=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        gval.translation = geometry.center();
        gval.position.set(6.5, 0, 0);
        gval.rotation.y=-0.5;
        scene2.add(gval);
        gval.scale.y=1.25;

        geometry = new THREE.TextGeometry("g = G*M/R*R =", {
            font : font,
            size : 0.25,
            height : 0.75,
        });

        latlong=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        latlong.translation = geometry.center();
        scene2.add(latlong);
        latlong.castShadow=false;
        latlong.position.set(-6.5, 0, 0);
        latlong.rotation.y=0.5;
        latlong.scale.y=1.25;
    });

    loader=new THREE.TextureLoader();
    loader.load("./assets/space.jpg", function(tex){
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set( 5, 5 );
        tex.anisotropy = 16;
        material = new THREE.MeshBasicMaterial({map:tex});
        geometry = new THREE.PlaneGeometry(50, 50, 10, 10);
        stars = new THREE.Mesh(geometry, material);
        stars.position.z=-10;
        stars.material.color.setHex(0x666666);
        scene2.add(stars);
    });

    geometry = new THREE.SphereGeometry(0.05, 10, 10);
    material = new THREE.MeshPhongMaterial();
    highlight = new THREE.Mesh(geometry, material);
    PIEaddElement(highlight);
    highlight.castShadow=false;

    initialiseControls();
    resetExperiment();
}

function ondocmousemove(event){
    if(!PIElastUpdateTime)
        return;

    event.preventDefault();
    
    PIEraycaster.setFromCamera(PIEmouseP, PIEcamera);
    intersects = PIEraycaster.intersectObject(earth);
    
    if(intersects.length){
        var pt = intersects[0].point;
        highlight.position.set(pt.x, pt.y, pt.z);
        highlight.material.color.setHex(0xffffff);
    }
}

function ondocmousedown(event){

    if(!PIElastUpdateTime)
        return;

    event.preventDefault();

    PIEraycaster.setFromCamera(PIEmouseP, PIEcamera);
    intersects = PIEraycaster.intersectObject(earth);
    
    if(intersects.length){
        var pt = intersects[0].point;
        
        //m=6367/2
        //c=0
        //y=(6367/2)*x
        
        highlight.position.set(pt.x, pt.y, pt.z);
        highlight.material.color.setHex(0x00aaaa);

        var r = 6367000/2*Math.sqrt(pt.x*pt.x+pt.y*pt.y+pt.z*pt.z);
        var g=(6.67*1e-11)*(5.97219e24)/(r*r);

        scene2.remove(gval);

        geometry = new THREE.TextGeometry(g.toPrecision(4)+" m/s2", {
            font : font,
            size : 0.25,
            height : 0.75,
        });
 
        gval=new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}));
        gval.translation = geometry.center();
        gval.position.set(6.5, 0, 0);
        gval.rotation.y=-0.5;
        scene2.add(gval);
        gval.scale.y=1.25;
    }
}

function updateExperimentElements(t, dt){

    PIErenderer.setSize(window.innerWidth, window.innerHeight-a);
    
    earth.rotation.y+=0.00075;
    clouds.rotation.y+=0.00125;

    PIErenderer.clear();
    PIErenderer.render(scene2, cam2);
    PIErenderer.clearDepth();
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


function initialiseControls(){
    PIEaddInputCheckbox("Camera Control", false, camnotify);
}


function initialiseOtherVariables(){
    earth.rotation.y=0;
    clouds.rotation.y=0;
    highlight.position.set(0, 0, 2);   
}


function resetExperiment(){
    PIEsetAreaOfInterest(-2.5, 2.5, 2.5, -2.5);
    if(PIElastUpdateTime){
        initialiseOtherVariables();
    }
}

var helpContent;
function initialiseHelp()
{
    helpContent="";
    helpContent = helpContent + "<h2>Inertia & Mass</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>The experiment shows our earth.</p>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>The top line has animation controls. There are two states of the experiment.</p>";
    helpContent = helpContent + "<h3>The setup stage</h3>";
    helpContent = helpContent + "<p>The initial state is setup stage. In this stage, you can see a control window at the right. ";
    helpContent = helpContent + "You have access to enabling camera controls, which allows you to do stuff mentioned below.</p>";
    helpContent = helpContent + "<ul>";
    helpContent = helpContent + "<li>Orbit - left mouse / touch: one finger move";
    helpContent = helpContent + "<li>Pan - right mouse, or arrow keys / touch: three finger swipe";
    helpContent = helpContent + "</ul>";
    helpContent = helpContent + "<p>Once you decide on that, you can enter the animation stage by clicking the start button</p>";
    helpContent = helpContent + "<h3>The animation stage</h3>";
    helpContent = helpContent + "<p>The panel in the scene shows the value of acceleration of gravity at the clicked point.</p>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play nutton on the top line</p>";
    helpContent = helpContent + "<p>You can slow down and speed up the animation by using the speed control buttons</p>";
    helpContent = helpContent + "<p>The round button is for resetting the animation.</p>";
    helpContent = helpContent + "<h2>Happy Experimenting</h2>";
    PIEupdateHelp(helpContent);
}

var infoContent;
function initialiseInfo()
{
    infoContent =  "";
    infoContent = infoContent + "<h2>Experiment Concepts</h2>";
    infoContent = infoContent + "<h3>About the experiment</h3>";
    infoContent = infoContent + "<p>The experiment shows our earth.</p>";
    infoContent = infoContent + "<h3>Acceleration due to Gravity</h3>";
    infoContent = infoContent + "<p>The acceleration gained by an object because of gravitational force is called its acceleration due to gravity.</p>";
    infoContent = infoContent + "<p>Its SI unit is m/s2. The acceleration due to gravity at the surface of Earth is represented as g. It has a standard value defined as 9.8 m/s2.</p>";
    infoContent = infoContent + "<p>The relation between g and earth's radius is - </p>";
    infoContent = infoContent + "<ul><li> g = G*M/R*R </li></ul>";
    infoContent = infoContent + "<p>G is the Universal gravitational constant, M is the Mass of earth, and R is the radius of earth at that point</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}