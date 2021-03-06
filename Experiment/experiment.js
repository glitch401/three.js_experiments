var lens1,lens2,norandom=75,noscatter=30;
var randRays,parallelRays1,parallelRays2,convergingRays,scatteredRays,drawC;
var MAX_POINT_random=53,MAX_parallel=99;
var particles;
var screen,spot;
var container,water,watermaterial1,water2,watermaterial2;

var mySceneTLX;
var mySceneTLY;
var mySceneBRX;
var mySceneBRY;
var mySceneW;
var mySceneH;
var myCenterX;
var myCenterY;

function loadExperimentElements()
{
    mySceneTLX = -12.0;
    mySceneTLY = 12.0;
    mySceneBRX = 12.0;
    mySceneBRY = -12.0;

    if(window.outerHeight*1.5>window.innerWidth)
    {
        mySceneTLX = -30.0;
        mySceneTLY = 30.0;
        mySceneBRX = 22.0;
        mySceneBRY = -22.0;
    }
    else
    {
        mySceneTLX = -12.0;
        mySceneTLY = 12.0;
        mySceneBRX = 12.0;
        mySceneBRY = -12.0;
    }

    mySceneW   = (mySceneBRX - mySceneTLX);
    mySceneH   = (mySceneTLY - mySceneBRY);
    myCenterX  = (mySceneTLX + mySceneBRX) / 2.0;
    myCenterY  = (mySceneTLY + mySceneBRY) / 2.0;

    console.log(window.outerHeight+" "+window.outerWidth);

    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
    document.title="Scattering of blue light";
    PIEsetExperimentTitle("Scattering of blue light");
    PIEsetDeveloperName("Indranil Biswas");
    PIEscene.background=new THREE.Color(0x1BCCC0);
    var groundMaterial = new THREE.MeshLambertMaterial( { color: 0x72DA14} );
    var mesh233 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), groundMaterial );
    mesh233.position.y = - 25;
    mesh233.rotation.x = - Math.PI / 2;
    PIEaddElement( mesh233 );


    initializeScene();
    PIErenderer.shadowMapEnabled = false;
    PIEaddInputCheckbox("Sodium ThioSulphate",false,soduimthiosulphateHandle);
    PIEaddInputCheckbox("Dil. Sulphuric Acid",false,h2so4Handle);
    PIErender();
}
var sodiumthiosulphate=false;
var h2so4=false;
var state=0;
function soduimthiosulphateHandle()
{
    if(sodiumthiosulphate)
    {
        sodiumthiosulphate=false;
        if(state==1)
            state=0.5;
        else
            state=0;
        PIEchangeInputCheckbox("Sodium ThioSulphate",false);
    }
    else
    {
        sodiumthiosulphate=true;
        if(state==0.5)
            state=1;
        else
            state=0.5;
        PIEchangeInputCheckbox("Sodium ThioSulphate",true);
    }
    console.log(state);
    if(state==1)
    {
        for (var i=0;i<norandom;i++)
        {
            parallelRays2[i].material.color.setHex(0xFF7000);
            convergingRays[i].material.color.setHex(0xFF7000);
        }
        water.material.color.setHex(0x0000FF);
        spot.material.color.setHex(0xFF7000);
    }
}
function h2so4Handle()
{
    if(h2so4)
    {
        h2so4=false;
        if(state==1)
            state=0.5;
        else
            state=0;
        PIEchangeInputCheckbox("Dil. Sulphuric Acid",false)
    }
    else
    {
        h2so4=true;
        if(state==0.5)
            state=1;
        else
            state=0.5;
        PIEchangeInputCheckbox("Dil. Sulphuric Acid",true);
    }
    console.log(state);
    if(state==1)
    {
        for (var i=0;i<norandom;i++)
        {
            parallelRays2[i].material.color.setHex(0xFF7000);
            convergingRays[i].material.color.setHex(0xFF7000);
        }
    }
}
function initializeScene()
{
    initializeVar()

    initializeinfo();
    initialiseHelp();

    lens1=new THREE.Mesh(new THREE.SphereGeometry( 0.5, 32, 32 ),new THREE.MeshPhongMaterial({color:0x2DABFA,transparent:true,opacity:0.89}))
    PIEaddElement(lens1);
    lens1.scale.x=5;
    lens1.scale.y=5;
    lens1.position.x=-15;
    lens1.rotation.y=Math.PI/2
    PIEaddElement(lens1);

    lens2=new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32 ),new THREE.MeshPhongMaterial({color:0x2DABFA,transparent:true,opacity:0.89}))
    PIEaddElement(lens2);
    lens2.scale.x=5;
    lens2.scale.y=5;
    lens2.position.x=15;
    lens2.rotation.y=Math.PI/2
    PIEaddElement(lens2);


    var mat=new THREE.MeshBasicMaterial({color:0x7FB3D5 , transparent:true ,opacity:0.5})

    var container=new THREE.Mesh(new THREE.BoxGeometry(10,5,0.1),mat);
    PIEaddElement(container);

    var plane1=new THREE.Mesh(new THREE.BoxGeometry(10,5,0.1),mat);
    container.add(plane1);
    plane1.rotation.x=Math.PI/2;
    plane1.position.z=2.5;
    plane1.position.y=2.5;

    var plane2=new THREE.Mesh(new THREE.BoxGeometry(10,5,0.1),mat);
    container.add(plane2);
    plane2.rotation.x=Math.PI/2;
    plane2.position.z=2.5;
    plane2.position.y=-2.5;

    var plane3=new THREE.Mesh(new THREE.BoxGeometry(5,5,0.1),mat);
    container.add(plane3);
    plane3.rotation.y=Math.PI/2;
    plane3.position.z=2.5;
    plane3.position.x=-5;

    var plane4=new THREE.Mesh(new THREE.BoxGeometry(5,5,0.1),mat);
    container.add(plane4);
    plane4.rotation.y=Math.PI/2;
    plane4.position.z=2.5;
    plane4.position.x=5;

    //plane3.position.y=-2.5;

    container.rotation.x=-Math.PI/2

    watermaterial1=new THREE.MeshBasicMaterial({color:0xCCFAF5 ,transparent:true,opacity:0.4})
    water=new THREE.Mesh(new THREE.BoxGeometry(9.99,4.99,4.1),watermaterial1);
    container.add(water)
    water.position.z=2;

    /*particles=new Array(800);
    var x=0.1,y=0.1,z=0.1;
    for(var i=0;i<800;i++)
    {
        particles[i]=new THREE.Mesh(new THREE.SphereGeometry(0.03,10,10),new THREE.MeshBasicMaterial({color:0x0000FF,transparent:true,opacity:0.9}));
        PIEaddElement(particles[i])
    }

    var c=0;
    for(var i=-5;i<5;i++)
    {
        for(var j=-4;j<4;j++)
            for(var k=-5;k<5;k++)
                particles[c++].position.set(k/2,j/2,i/2);
    }*/

    /*var x=0.1,y=0.1,z=0.1,c=0;
    if(particles)
    for(var i=0;i<10;i++)
    {
        for(var j=0;j<10;j++)
        {
            for (var k=0;k<10;k++)
            {

                particles[c].position.set(x,y,z);
                c++;
                particles[c].position.set(x*(-1),y*(-1),z*(-1));
                c++;
                x+=0.1;
            }
            y+=0.1;
            x=0.1;
        }
        z+=0.1;
        y=0.1;
        x=0.1;
    }*/
    /*for (var i=0;i<c;i++)
    {
        PIEaddElement(particles[i]);
    }*/
    watermaterial2=new THREE.MeshBasicMaterial({color:0xFF0000 ,transparent:true,opacity:0.5})
    /*water2=new THREE.Mesh(new THREE.BoxGeometry(9.99,4.99,3.5),watermaterial2);
    container.add(water2)
    water2.visible=false;
    water2.position.z=1.7;*/

    container.position.y=-2.1;
    PIEaddElement(container);

    spot=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.1,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.8}));
    spot.rotation.z=Math.PI/2
    screen=new THREE.Mesh(new THREE.BoxGeometry(10,10,0.1),new THREE.MeshBasicMaterial({color:0xE3F273}))
    screen.rotation.y=Math.PI/2;
    var plate=new THREE.Mesh(new THREE.BoxGeometry(10,10,0.01),new THREE.MeshBasicMaterial({color:0x180502}))
    screen.add(plate)
    plate.position.z=0.1;
    PIEaddElement(screen);
    loadpointlight();
    screen.position.x=point.position.x*(-1)+0.1;

    PIEaddElement(spot);
    spot.position.x=screen.position.x-0.01;
    PIErender();
    loadRays();
    startOrbitalControls();
}
var point;
function loadpointlight()
{
    point=new THREE.Mesh(new THREE.SphereGeometry(0.1,32,32),new THREE.MeshPhongMaterial({color:0xFFFFFF}));
    PIEaddElement(point);
    point.position.x=-20;
    var light = new THREE.PointLight( 0xFFFFFF );
    light.position.x=point.position.x;
    PIEaddElement(light);
}


function loadRays()
{
    var mat=new THREE.LineBasicMaterial({color: 0xFFFFFF, linewidth: 2});
    var mat2=new THREE.LineBasicMaterial({color: 0xFFFFFF, linewidth: 2});
    var randRayPos=new Array(norandom);
    var randRaysGeo=new Array(norandom);

    var parallelRays1Pos=new Array(norandom);
    var parallelRays1Geo=new Array(norandom);

    var parallelRays2Pos=new Array(norandom);
    var parallelRays2Geo=new Array(norandom);

    var convergingPos=new Array(norandom);
    var convergingGeo=new Array(norandom);

    var scatteredPos=new Array(noscatter);
    var scatteredGeo=new Array(noscatter);

    for(var i=0;i<norandom;i++)
    {
        randRayPos[i]=new Float32Array(MAX_POINT_random*3);
        randRaysGeo[i]=new THREE.BufferGeometry();
        randRaysGeo[i].addAttribute('position', new THREE.BufferAttribute(randRayPos[i], 3));
        drawC = 1;
        randRaysGeo[i].setDrawRange(0, drawC);
        randRays[i] = new THREE.Line(randRaysGeo[i], mat);
        PIEaddElement(randRays[i]);


        parallelRays1Pos[i]=new Float32Array(MAX_parallel*3);
        parallelRays1Geo[i]=new THREE.BufferGeometry();
        parallelRays1Geo[i].addAttribute('position', new THREE.BufferAttribute(parallelRays1Pos[i], 3));
        drawC = 1;
        parallelRays1Geo[i].setDrawRange(0, drawC);
        parallelRays1[i] = new THREE.Line(parallelRays1Geo[i], mat);
        PIEaddElement(parallelRays1[i]);

        parallelRays2Pos[i]=new Float32Array(MAX_parallel*3);
        parallelRays2Geo[i]=new THREE.BufferGeometry();
        parallelRays2Geo[i].addAttribute('position', new THREE.BufferAttribute(parallelRays2Pos[i], 3));
        drawC = 1;
        parallelRays2Geo[i].setDrawRange(0, drawC);
        parallelRays2[i] = new THREE.Line(parallelRays2Geo[i], mat2);
        PIEaddElement(parallelRays2[i]);

        convergingPos[i]=new Float32Array(MAX_POINT_random*3);
        convergingGeo[i]=new THREE.BufferGeometry();
        convergingGeo[i].addAttribute('position', new THREE.BufferAttribute(convergingPos[i], 3));
        drawC = 1;
        convergingGeo[i].setDrawRange(0, drawC);
        convergingRays[i] = new THREE.Line(convergingGeo[i], mat2);
        PIEaddElement(convergingRays[i]);



    }
    for (var i=0;i<noscatter;i++)
    {
        scatteredPos[i]=new Float32Array(MAX_POINT_random*3);
        scatteredGeo[i]=new THREE.BufferGeometry();
        scatteredGeo[i].addAttribute('position', new THREE.BufferAttribute(scatteredPos[i], 3));
        drawC = 1;
        scatteredGeo[i].setDrawRange(0, drawC);
        scatteredRays[i] = new THREE.Line(scatteredGeo[i], new THREE.LineBasicMaterial({color:0x0000FF}));
        PIEaddElement(scatteredRays[i]);
    }

    PIErender();

    var s=0.036,sdx=-0.0001,sdy=0.001,sdz=0.1,px=0,py=0,pz=0;
    for(var i=0;i<norandom;i++)
    {
        updateIncidentRays1(randRays[i],0.1,s,point.position.x,point.position.y,MAX_POINT_random,i);
        updateIncidentRays1(parallelRays1[i],0.1,0,pos1x[i],pos1y[i],MAX_parallel,i);
        updateIncidentRays1(parallelRays2[i],0.1,0,pos1x[i]+9.8,pos1y[i],MAX_parallel,i);
        updateIncidentRays1(convergingRays[i],0.1,s*(-1),pos1x[i],pos1y[i],MAX_POINT_random,i);
        s-=0.001;
    }
    updateIncidentRays1(scatteredRays[0],0,0.1,0,0,MAX_POINT_random,0);
    // for(var i=0;i<noscatter;i++)
    // {
    //     updateScatteredRays1(scatteredRays[i++],0,0.001,0.1,px++,py--,5,MAX_POINT_random);
    //     updateScatteredRays1(scatteredRays[i++],0,0.001,-0.1,px++,py--,-5,MAX_POINT_random);
    // }
    //updateScatteredRays1(scatteredRays[0],0.1,0.001,0.1,0,0,0,MAX_POINT_random);

    PIErender();

}
var pos1x=new Array(norandom);
var pos1y=new Array(norandom);

function updateIncidentRays1(obj,dx,dy,ix,iy,mp,n)
{
    var positions=obj.geometry.attributes.position.array;
    var x=ix,y=iy,z=0,index=0;
    for ( var i = 0, l = mp; i < l; i ++ ) {

        positions[ index ++ ] = x;
        positions[ index ++ ] = y;
        positions[ index ++ ] = z;

        x += dx;
        y+=dy;
    }
    pos1x[n]=x;
    pos1y[n]=y;
    /*if(obj==incidentRays[0])
    {
        prevposx[0] = x;
        prevposy[0] = y;
        console.log(1);
    }
    if(obj==incidentRays[1])
    {
        prevposx[1] = x;
        prevposy[1] = y;
        console.log(2);
    }
    if(obj==incidentRays[2])
    {
        prevposx[2] = x;
        prevposy[2] = y;
        console.log(3);
    }*/

}


function updateScatteredRays1(obj,dx,dy,dz,ix,iy,iz,mp)
{
    var positions=obj.geometry.attributes.position.array;
    var x=ix,y=iy,z=iz,index=0;
    for ( var i = 0, l = mp; i < l; i ++ ) {

        positions[ index ++ ] = x;
        positions[ index ++ ] = y;
        positions[ index ++ ] = z;

        x += dx;
        y+=dy;
        z+=dz;
    }

}
function initializeVar()
{
    randRays=new Array(norandom);
    parallelRays1=new Array(norandom);
    parallelRays2=new Array(norandom);
    convergingRays=new Array(norandom);
    scatteredRays=new Array(noscatter);
    particles=new Array(800);
}
function updateExperimentElements(t,dt)
{
    drawC+=(dt/20);

    if(drawC<MAX_POINT_random)
    {
        for(var i=0;i<norandom;i++)
        {
            randRays[i].geometry.setDrawRange(0, drawC);
            randRays[i].geometry.attributes.position.needsUpdate = true;
        }
    }
    else if(drawC<MAX_POINT_random+MAX_parallel)
    {
        for(var i=0;i<norandom;i++)
        {
            parallelRays1[i].geometry.setDrawRange(0, drawC-MAX_POINT_random);
            parallelRays1[i].geometry.attributes.position.needsUpdate = true;
        }
    }
    else if(drawC<MAX_POINT_random*2+MAX_parallel)
    {
        if(state==1)
            water.material.color.setHex(0x0000FF);

        for(var i=0;i<noscatter;i++)
        {
            scatteredRays[i].geometry.setDrawRange(0, drawC-(MAX_POINT_random*2+MAX_parallel));
            scatteredRays[i].geometry.attributes.position.needsUpdate = true;
        }
    }
    else if(drawC<MAX_POINT_random*2+MAX_parallel*2)
    {
        for(var i=0;i<norandom;i++)
        {
            parallelRays2[i].geometry.setDrawRange(0, drawC-(MAX_POINT_random*2+MAX_parallel));
            parallelRays2[i].geometry.attributes.position.needsUpdate = true;
        }
    }
    else if(drawC<MAX_POINT_random*3+MAX_parallel*2)
    {
        for(var i=0;i<norandom;i++)
        {
            convergingRays[i].geometry.setDrawRange(0, drawC-(MAX_POINT_random*2+MAX_parallel*2));
            convergingRays[i].geometry.attributes.position.needsUpdate = true;
        }
    }
    else if(drawC>(MAX_POINT_random*3+MAX_parallel*3))
    {
        resetExperiment();
    }

    // water.material.color.setHex(0xff0000);
    PIErender();
}

function resetExperiment()
{
    PIEstopAnimation();
    for(var i=0;i<norandom;i++)
    {
        PIEremoveElement(randRays[i]);
        PIEremoveElement(convergingRays[i]);
        PIEremoveElement(parallelRays2[i]);
        PIEremoveElement(parallelRays1[i]);
        drawC=0;
        h2so4=sodiumthiosulphate=false;
        state=0;
        water.material.color.setHex(0xCCFAF5)
        PIEchangeInputCheckbox("Sodium ThioSulphate",false);
        PIEchangeInputCheckbox("Dil. Sulphuric Acid",false);
    }
    loadRays();
}

function startOrbitalControls()
{
    var controls = new THREE.OrbitControls(PIEcamera, PIErenderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.55;
    controls.minDistance = 35;
    controls.maxDistance = 75;
    PIErender();
}


function initializeinfo()
{
    var helpContent="";
    helpContent = helpContent + "<h2>Scattering of blue light</h2>";
    helpContent = helpContent + "<h3>About the experiment</h3>";
    helpContent = helpContent + "<p>This experiment id to demonstrate the scattering of Blue light end of the spectrum by Tyndall Effect.</p>";
    helpContent = helpContent + "<p>When sodium thiosulphate and dilute acid(<i>dil. H<sub>2</sub>SO<sub>4</sub></i>)is mixed in water then Colloidal solution is formed.</p>";
    helpContent = helpContent + "<p>Which causes Tyndall Effect.</p>";
    helpContent = helpContent + "<p>As a result the blue light spectrum end of the white light is scattered by the colloidal solution.</p>";
    helpContent = helpContent + "<p>Resulting in the emergence of Orangeish red light.</p>";

    helpContent = helpContent + "<p><br/><br/><b>Please set the check boxes before starting the Experiment</b></p>";


    helpContent = helpContent + "<p><br/><br/><b><i>Orbital controls to the camera is added(Drag and move the camera)</i></b></p>";
    helpContent = helpContent + "<p>Happy Experimenting. :)</p>";
    PIEupdateInfo(helpContent);
}

function initialiseHelp()
{
    var helpContent="";
    helpContent = helpContent + "<h2>Scattering of blue light(<i>Help</i>)</h2>";
    helpContent = helpContent + "<h3>Help with controls of the experiment</h3>";
    helpContent = helpContent + "<p>On the right top rand side :</p>";
    helpContent = helpContent + "<p>There are checkboxes</p>";
    helpContent = helpContent + "<p>By checking the checkboxes you add on the chemical to the water/solution.</p>";

    helpContent = helpContent + "<p>In order to demonstrate the complete experiment , check/add both chemicals listed.</p>";


    helpContent = helpContent + "<p><br/><br/><b>Please set the check boxes before starting the Experiment</b></p>";

    helpContent = helpContent + "<p><br/><br/><b><i>Orbital controls to the camera is added(Drag and move the camera)</i></b></p>";
    helpContent = helpContent + "<p>Happy Experimenting. :)</p>";
    PIEupdateHelp(helpContent);
}
