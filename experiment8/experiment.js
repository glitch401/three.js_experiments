var orbitcam, clock;
var font;
var id, once=false;
var system1, system2, system, scene2;
var line1, circle;
var group, oi, ruler; 
var d1, d2, d3, d4;
var headings=[], outline=[], boxes=[];
var check, cond=true;
var text1='0.0', text0='0.0';
var nos=[];

function onDocumentMouseMove(event) {
    event.preventDefault();
    if(!PIEshowDisplay)
        PIEshowDisplayPanel();
    if(!once)
        PIEscene.remove(PIEspotLight), once=true;
}

//does what it says
function initialiseScene(){
    PIEscene.background=new THREE.Color( 0xbfd1e5 );

    PIEscene.add(new THREE.AmbientLight(0xffffff));
    scene2=new THREE.Scene();  
    
    PIEsetAreaOfInterest(5, 5, 10, 5);
    PIEcamera.position.z=10;
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    d9=document.createElement('div');
    d9.style.position="absolute";
    d9.style.display = "inline";
    d9.style.fontSize="3vw";
    //d1.style.width='27vw';
    d9.style.right="19%";
    d9.style.top="78%";
    d9.style.marginLeft='-13.5vw';
    d9.innerHTML="<b>CHOOSE</b>";
    PIEscreenElem.appendChild(d9);
    d9.style.backgroundColor="#BBDEFB";

    d5=document.createElement('div');
    d5.style.position="absolute";
    d5.style.display = "inline";
    d5.style.fontSize="2.8vw";
    //d1.style.width='27vw';
    d5.style.right="20%";
    d5.style.top="38%";
    d5.style.marginLeft='-13.5vw';
    d5.innerHTML="<b>CHECK</b>";
    d5.style.backgroundColor="#BBDEFB";
    PIEscreenElem.appendChild(d5);
    d5.onclick = function(){
        oi.f1();
    };

    d6=document.createElement('div');
    d6.style.position="absolute";
    d6.style.display = "inline";
    d6.style.fontSize="2vw";
    //d1.style.width='27vw';
    d6.style.right="20%";
    d6.style.top="62%";
    d6.style.marginLeft='-13.5vw';
    d6.innerHTML="<b>AB > CD</b>";
    d6.style.fontFamily="Roboto, sans-serif";
    d6.onclick= function(){
        var ab, cd;
        ab = line1.scale.x;
        cd = line2.scale.x;

        if(ab>cd){
            PIEchangeDisplayText("Correct", parseInt(PIEgetDisplayText("Correct"))+1);
            shower(true);
            headings[0].visible=true;
        }
        else{
            PIEchangeDisplayText("Wrong", parseInt(PIEgetDisplayText("Wrong"))+1);
            shower(false);
            headings[1].visible=true;
        }
    };
    //d6.style.backgroundColor="#BBDEFB";
    PIEscreenElem.appendChild(d6);

    d7=document.createElement('div');
    d7.style.position="absolute";
    d7.style.display = "inline";
    d7.style.fontSize="2vw";
    //d1.style.width='27vw';
    d7.style.right="20%";
    d7.style.top="67%";
    d7.style.marginLeft='-13.5vw';
    d7.innerHTML="<b>AB < CD</b>";
    d7.style.fontFamily="Roboto, sans-serif";
    d7.onclick= function(){
        var ab, cd;
        ab = line1.scale.x;
        cd = line2.scale.x;

        if(ab<cd){
            PIEchangeDisplayText("Correct", parseInt(PIEgetDisplayText("Correct"))+1);
            shower(true);
            headings[0].visible=true;
        }
        else{
            PIEchangeDisplayText("Wrong", parseInt(PIEgetDisplayText("Wrong"))+1);
            shower(false);
            headings[1].visible=true;
        }
    };
    //d6.style.backgroundColor="#BBDEFB";
    PIEscreenElem.appendChild(d7);

    d8=document.createElement('div');
    d8.style.position="absolute";
    d8.style.display = "inline";
    d8.style.fontSize="2vw";
    //d1.style.width='27vw';
    d8.style.right="20%";
    d8.style.top="72%";
    d8.style.marginLeft='-13.5vw';
    d8.innerHTML="<b>AB = CD</b>";
    d8.style.fontFamily="Roboto, sans-serif";
    //d6.style.backgroundColor="#BBDEFB";
    PIEscreenElem.appendChild(d8);
    d8.onclick=function(){
        if(line1.scale.x==line2.scale.x){
            PIEchangeDisplayText("Correct", parseInt(PIEgetDisplayText("Correct"))+1);
            shower(true);
        }
        else{
            PIEchangeDisplayText("Wrong", parseInt(PIEgetDisplayText("Wrong"))+1);
            shower(false);
        }
    };

    d3=document.createElement('div');
    d3.style.position="absolute";
    d3.style.display = "block";
    d3.style.fontSize="2vw";
    d3.style.width='5.25vw';
    d3.style.right="14%";
    d3.contentEditable=true;
    d3.style.top="27%";
    d3.style.marginLeft='-13.5vw';
    d3.innerHTML="<b>0.0";
    d3.style.overflow="hidden";
    d3.style.fontFamily="Roboto, sans-serif";
    d3.style.height='2.3vw';
    d3.onkeypress=function(event){
        return isNumber(event);
    };
    PIEscreenElem.appendChild(d3);

    d4=document.createElement('div');
    d4.style.position="absolute";
    d4.style.display = "block";
    d4.style.fontSize="2vw";
    d4.style.width='5.25vw';
    d4.style.right="14%";
    d4.contentEditable=true;
    d4.style.top="32%";
    d4.style.marginLeft='-13.5vw';
    d4.innerHTML="<b>0.0";
    d4.style.overflow="hidden";
    d4.contentEditable=true;
    d4.style.fontFamily="Roboto, sans-serif";
    d4.style.height='2.3vw';
    d4.onkeypress=function(event){
        return isNumber(event);
    };
    PIEscreenElem.appendChild(d4);
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
        headings[0].visible=true;
        headings[1].visible=false;
    }
    else{
        system2.visible=true;
        system=system2;
        headings[1].visible=true;
        headings[0].visible=false;
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
        if(headings[0].scale.x>=1.75 || headings[1].scale.x>=1.75){
            headings[0].scale.set(1,1,1);
            headings[1].scale.set(1,1,1);
            system1.visible=false;
            system2.visible=false;
            cancelAnimationFrame(id);
            system1.visible=false;
            system2.visible=false;  
            PIErenderer.autoClear=true;
            headings[0].visible=false;
            headings[1].visible=false;
            PIEresumeAnimation(); 
            return;     
        }
        if(headings[0].visible){
            headings[0].scale.x+=0.005;
            headings[0].scale.y+=0.005;
            headings[0].scale.z+=0.005;
        }
        if(headings[1].visible){
            headings[1].scale.x+=0.005;
            headings[1].scale.y+=0.005;
            headings[1].scale.z+=0.005;
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

function isNumber(evt)
{
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode != 46 && charCode > 31 
    && (charCode < 48 || charCode > 57))
     return false;

  return true;
}

function loadExperimentElements(){
    var loader, tex, material, geometry;

    PIEsetExperimentTitle("Measuring Lines");
    PIEsetDeveloperName("Archit Mathur");
    PIEhideControlElement();

    initialiseHelp();
    initialiseInfo();

    initialiseScene();
    
    loader=new THREE.TextureLoader();
    loader.load("assets/ButtonSmiley.png", function(texture){
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
                Math.random()*range-range/2+7.5,
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
    });

    loader.load("assets/ButtonSadSmiley.png", function(texture){
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
                Math.random()*range-range/2+7.5,
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
    });

    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshPhongMaterial({color:0x111111});
    line1 = new THREE.Mesh(geometry, material);
    PIEaddElement(line1);
    line1.position.set(2.5-1.5, 5, -11);
    line1.lookAt(PIEcamera.position);

    var z;
    z=(Math.random()*10).toFixed(2)%3;
    // y=(Math.random()*10)%3.14;
    line1.scale.set((Math.random()*100)%8+1.5, 0.075, 0.075);
    line1.castShadow=false;
    line1.receiveShadow=false;
    line1.rotation.z=z;

    material = new THREE.MeshPhongMaterial({color:0x212121});
    line2 = new THREE.Mesh(geometry, material);
    PIEaddElement(line2);
    line2.position.set(4+1.5, 5, -11);
    line2.lookAt(PIEcamera.position);

    z=(Math.random()*10).toFixed(2)%3;
    line2.scale.set((Math.random()*100)%8+1.5, 0.075, 0.075);
    line2.castShadow=false;
    line2.receiveShadow=false;
    line2.rotation.z=z;

    loader = new THREE.JSONLoader();
    loader.load("./assets/ruler.json", function(geometry, materials){
        loader = new THREE.TextureLoader();
        loader.load("./assets/ruler_wooden_diffuse.jpg", function(tex){
            for(i in materials){
                materials[i].map=tex;
                materials[i].color.setHex(0xffffff);
            }
            
            ruler = new THREE.Mesh(geometry, new THREE.MultiMaterial(materials));
            ruler.translation = geometry.center();
            ruler.position.set(7.5-4.5, 1, -10);
            PIEaddElement(ruler);
            ruler.scale.x=ruler.scale.y=ruler.scale.z=0.4;
            ruler.rotation.x=1.57;
            ruler.rotation.y=1.57;

            PIEdragElement(ruler);
            PIEsetDrag(ruler, rulerdrag);
            
            PIErender();
            PIEstartAnimation();
        });
    });

    geometry = new THREE.BoxGeometry(20, 20, 1);
    material = new THREE.MeshPhongMaterial({color:0xBBDEFB});
    check = new THREE.Mesh(geometry, material);
    PIEaddElement(check);
    check.position.set(0.85, 5, -20);

    var oum=new THREE.MeshBasicMaterial({color:0x3e50b4, side: THREE.BackSide});
    outline[0]= new THREE.Mesh(geometry, oum); 
    outline[0].position.copy(check.position);
    outline[0].scale.multiplyScalar(1.01);
    PIEaddElement(outline[0]);
    outline[0].castShadow=false;
    outline[0].myid=1;

    geometry = new THREE.BoxGeometry(2.4, 1, 1);
    material = new THREE.MeshPhongMaterial({color:0xBBDEFB});
    a = new THREE.Mesh(geometry, material);
    PIEaddElement(a);
    a.position.set(10.4, 6, 0);
    a.lookAt(PIEcamera.position);

    var oum=new THREE.MeshBasicMaterial({color:0x3e50b4, side: THREE.BackSide});
    outline[1]= new THREE.Mesh(geometry, oum); 
    outline[1].position.copy(a.position);
    outline[1].scale.multiplyScalar(1.05);
    PIEaddElement(outline[1]);
    outline[1].lookAt(PIEcamera.position);
    outline[1].castShadow=false;
    outline[1].myid=2;

    geometry = new THREE.BoxGeometry(2, 1.25, 1);
    material = new THREE.MeshPhongMaterial({color:0xBBDEFB});
    a = new THREE.Mesh(geometry, material);
    PIEaddElement(a);
    a.position.set(10.5, 4, 0);
    a.lookAt(PIEcamera.position);

    var oum=new THREE.MeshBasicMaterial({color:0x3e50b4, side: THREE.BackSide});
    outline[2]= new THREE.Mesh(geometry, oum); 
    outline[2].position.copy(a.position);
    outline[2].scale.multiplyScalar(1.05);
    PIEaddElement(outline[2]);
    outline[2].lookAt(PIEcamera.position);
    outline[2].castShadow=false;
    outline[2].myid=2;

    loader = new THREE.FontLoader();
    loader.load("./assets/optimer.json", function(response){
        font = response;
        geometry = new THREE.TextGeometry('CORRECT!', {
            font : font,
            size : 0.7,
            height : 0.2
        });
        headings[0]=new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x00ff00}));
        headings[0].translation = geometry.center();
        PIEaddElement(headings[0]);
        headings[0].visible=false;
        headings[0].position.set(5.5, 5, 0);
        headings[0].lookAt(PIEcamera.position);

        geometry = new THREE.TextGeometry('WRONG!', {
            font : font,
            size : 0.7,
            height : 0.2
        });
        headings[1]=new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x111111}));
        headings[1].translation = geometry.center();
        PIEaddElement(headings[1]);
        headings[1].castShadow=false;
        headings[1].visible=false;
        headings[1].position.set(5.5, 5, 0);
        headings[1].lookAt(PIEcamera.position);

        geometry = new THREE.TextGeometry('AB', {
            font : font,
            size : 0.3,
            height : 0.15
        });
        headings[2]=new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x4A148C}));
        headings[2].translation = geometry.center();
        PIEaddElement(headings[2]);
        headings[2].castShadow=false;
        headings[2].visible=true;
        headings[2].position.set(2.5-1.5, 5, -10.75);
        headings[2].lookAt(PIEcamera.position);

        geometry = new THREE.BoxGeometry(0.75, 0.5, 1);
        material = new THREE.MeshPhongMaterial({color:0x020202});
        a = new THREE.Mesh(geometry, material);
        PIEaddElement(a);
        a.translation=geometry.center();
        a.position.set(2.4-1.5, 5, -11.2);
        a.lookAt(PIEcamera.position);

        geometry = new THREE.TextGeometry('CD', {
            font : font,
            size : 0.3,
            height : 0.15
        });
        headings[3]=new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x4A148C}));
        headings[3].translation = geometry.center();
        PIEaddElement(headings[3]);
        headings[3].castShadow=false;
        headings[3].visible=true;
        headings[3].position.set(5.5, 5, -10.75);

        geometry = new THREE.BoxGeometry(0.75, 0.5, 1);
        material = new THREE.MeshPhongMaterial({color:0x020202});
        a = new THREE.Mesh(geometry, material);
        PIEaddElement(a);
        a.translation=geometry.center();
        a.position.set(3.95+1.5, 5, -11.2);
        a.lookAt(PIEcamera.position);
        headings[3].lookAt(PIEcamera.position);

        geometry = new THREE.TextGeometry('AB\'s length =', {
            font : font,
            size : 0.15,
            height : 0.05
        });
        headings[4]=new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x000000}));
        headings[4].translation = geometry.center();
        PIEaddElement(headings[4]);
        headings[4].castShadow=false;
        headings[4].visible=true;
        headings[4].position.set(9.8, 5.98, 1);

        geometry = new THREE.TextGeometry('CD\'s length =', {
            font : font,
            size : 0.15,
            height : 0.05
        });
        headings[5]=new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x000000}));
        headings[5].translation = geometry.center();
        PIEaddElement(headings[5]);
        headings[5].castShadow=false;
        headings[5].visible=true;
        headings[5].position.set(9.8, 5.75, 1);

    });

    initialiseControls();
    resetExperiment();
}

function rulerdrag(obj, newpos){
    var x, y;
    x=newpos.x, y=newpos.y;
    
    if(x<-2)    x=-2;
    if(x>17)    x=17;
    if(y<-4)    y=-4;
    if(y>15)    y=15;

    ruler.position.set(x, y, -10);
}


function updateExperimentElements(t, dt){
    return;
}


function initialiseControls(){
    oi = new Object();
    // oi.f1=4;
    oi.f2=90;
    oi.f1=function(){
        headings[1].visible=false;
        headings[0].visible=false;
        cancelAnimationFrame(id);
        var p, q, ab, cd;
        p = parseFloat(d3.innerText);
        q = parseFloat(d4.innerText);
        ab = line1.scale.x*2.4;
        cd = line2.scale.x*2.4;

        if(((p-ab<0.5 && p>=ab) || (p-ab>-0.5 && ab>p)) && ((q-cd<0.5 && q>=cd) || (q-cd>-0.5 && cd>q))){
            PIEchangeDisplayText("Correct", parseInt(PIEgetDisplayText("Correct"))+1);
            shower(true);
            headings[0].visible=true;
        }
        else{
            PIEchangeDisplayText("Wrong", parseInt(PIEgetDisplayText("Wrong"))+1);
            shower(false);
            headings[1].visible=true;
        }
    };

    PIEdisplayGUI.add(oi, "f2", 0, 360).name("Rotate Ruler").step(0.1).onChange(function(){
        ruler.rotation.y=oi.f2*Math.PI/180;
    });

    oi.f3=function(){

        cancelAnimationFrame(id);

        PIEscene.remove(line1);
        PIEscene.remove(line2);

        geometry = new THREE.BoxGeometry(1, 1, 1);
        material = new THREE.MeshPhongMaterial({color:0x111111});
        line1 = new THREE.Mesh(geometry, material);
        PIEaddElement(line1);
        line1.position.set(1, 5, -11);
        line1.lookAt(PIEcamera.position);

        var z;
        z=(Math.random()*10).toFixed(2)%3;
        // y=(Math.random()*10)%3.14;
        line1.scale.set((Math.random()*100)%8+1.5, 0.075, 0.075);
        line1.castShadow=false;
        line1.receiveShadow=false;
        line1.rotation.z=z;
        //headings[2].rotation.z=line1.rotation.z
        material = new THREE.MeshPhongMaterial({color:0x212121});
        line2 = new THREE.Mesh(geometry, material);
        PIEaddElement(line2);
        line2.position.set(5.5, 5, -11);

        line2.lookAt(PIEcamera.position);

        z=(Math.random()*10).toFixed(2)%3;
        line2.scale.set((Math.random()*100)%8+1.5, 0.075, 0.075);
        line2.castShadow=false;
        line2.receiveShadow=false;
        line2.rotation.z=z;

        ruler.position.set(7.5-4.5, 1, -10);
        ruler.rotation.x=1.57;
        ruler.rotation.y=1.57;
    };
    
    PIEdisplayGUI.add(oi, "f3").name("Next");
    PIEaddDisplayText("Correct", 0);
    PIEaddDisplayText("Wrong", 0);
}


function initialiseOtherVariables(){
    return;
}


function resetExperiment(){  
    PIErenderer.autoClear=true;
    cancelAnimationFrame(id);

    PIEscene.remove(PIEspotLight);

    if(PIElastUpdateTime){
        headings[1].visible=false;
        headings[0].visible=false;

        oi.f3();
        //headings[3].rotation.z=line2.rotation.z
        ruler.position.set(7.5-4.5, 1, -10);
        ruler.rotation.x=1.57;
        ruler.rotation.y=1.57;

        d3.innerHTML="<b>0.0";
        d4.innerHTML="<b>0.0";

        PIEchangeDisplayText("Wrong", 0);
        PIEchangeDisplayText("Correct", 0);
    }
    PIEstartAnimation();
}

var helpContent;
function initialiseHelp(){
    helpContent="";
    helpContent = helpContent + "<h2>Measuring Lines</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<h3>Animation control</h3>";
    helpContent = helpContent + "<p>Rotate ruler changes the orientation of the ruler.</p>";
    helpContent = helpContent + "<p>Next gives you a new set a lines to measure.</p>";
    helpContent = helpContent + "<p>Correct and Wrong keep track of your answers' correctness.</p>";
    helpContent = helpContent + "<p>Check computes whether the lengths you entered were correct.</p>";
    helpContent = helpContent + "<p>Clicking on statements from the Choose block checks whether the statement clicked is correct.</p>";
    helpContent = helpContent + "<p>You can pause and resume the animation by using the pause/play button on the top line</p>";
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
    infoContent = infoContent + "<p>To measure the length of a line, line segment to be precise, we move the ruler to one end of the line."; 
    infoContent = infoContent + "Then we align the ruler with respect to the line and note down the difference between the starting and ending point of the line alongsides the ruler.</p>";
    infoContent = infoContent + "<h2>Happy Experimenting</h2>";
    PIEupdateInfo(infoContent);
}

// This was legit torture - 2.0