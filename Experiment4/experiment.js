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
    PIEaddInputCheckbox("Sodium ThioSulp",false,soduimthiosulphateHandle);
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
        PIEchangeInputCheckbox("Sodium ThioSulp",false);
    }
    else
    {
        sodiumthiosulphate=true;
        if(state==0.5)
            state=1;
        else
            state=0.5;
        PIEchangeInputCheckbox("Sodium ThioSulp",true);
        //for(var i=0;i<100;i++)

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
            for(var i=0;i<100;i++)
                particles[i].material.opacity=0.7;
        }
    }
}
var particles;
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

   for(var i=0;i<100;i++)
    {
        particles[i]=new THREE.Mesh(new THREE.SphereGeometry(0.1,32,5),new THREE.MeshBasicMaterial({color:0x0000FF,transparent:true,opacity:0.01}));
        PIEaddElement(particles[i]);
        PIErender();
    }
    setparticlepos();

    container.position.y=-2.1;
    PIEaddElement(container);

    spot=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.1,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1}));
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
    //startOrbitalControls();
}
function setparticlepos()
{
    particles[0].position.x=-4.5;
    particles[1].position.x=-4;
    particles[2].position.x=-3.5;
    particles[3].position.x=-3;
    particles[4].position.x=-2.5;
    particles[5].position.x=-2;
    particles[6].position.x=-1.5;
    particles[7].position.x=-1;
    particles[8].position.x=-0.5;
    particles[9].position.x=0;

    particles[10].position.x=4.5;
    particles[11].position.x=4;
    particles[12].position.x=3.5;
    particles[13].position.x=3;
    particles[14].position.x=2.5;
    particles[15].position.x=2;
    particles[16].position.x=1.5;
    particles[17].position.x=1;
    particles[18].position.x=0.5;


    //
    particles[20].position.x=-4.5;
    particles[21].position.x=-4;
    particles[22].position.x=-3.5;
    particles[23].position.x=-3;
    particles[24].position.x=-2.5;
    particles[25].position.x=-2;
    particles[26].position.x=-1.5;
    particles[27].position.x=-1;
    particles[28].position.x=-0.5;
    particles[29].position.x=0;


    particles[20].position.y=-1;
    particles[21].position.y=-1;
    particles[22].position.y=-1;
    particles[23].position.y=-1;
    particles[24].position.y=-1;
    particles[25].position.y=-1;
    particles[26].position.y=-1;
    particles[27].position.y=-1;
    particles[28].position.y=-1;
    particles[29].position.y=-1;

    particles[30].position.x=4.5;
    particles[31].position.x=4;
    particles[32].position.x=3.5;
    particles[33].position.x=3;
    particles[34].position.x=2.5;
    particles[35].position.x=2;
    particles[36].position.x=1.5;
    particles[37].position.x=1;
    particles[38].position.x=0.5;

    particles[30].position.y=-1;
    particles[31].position.y=-1;
    particles[32].position.y=-1;
    particles[33].position.y=-1;
    particles[34].position.y=-1;
    particles[35].position.y=-1;
    particles[36].position.y=-1;
    particles[37].position.y=-1;
    particles[38].position.y=-1;

    //

    particles[40].position.x=-4.5;
    particles[41].position.x=-4;
    particles[42].position.x=-3.5;
    particles[43].position.x=-3;
    particles[44].position.x=-2.5;
    particles[45].position.x=-2;
    particles[46].position.x=-1.5;
    particles[47].position.x=-1;
    particles[48].position.x=-0.5;
    particles[49].position.x=0;


    particles[40].position.y=-2;
    particles[41].position.y=-2;
    particles[42].position.y=-2;
    particles[43].position.y=-2;
    particles[44].position.y=-2;
    particles[45].position.y=-2;
    particles[46].position.y=-2;
    particles[47].position.y=-2;
    particles[48].position.y=-2;
    particles[49].position.y=-2;

    particles[50].position.x=4.5;
    particles[51].position.x=4;
    particles[52].position.x=3.5;
    particles[53].position.x=3;
    particles[54].position.x=2.5;
    particles[55].position.x=2;
    particles[56].position.x=1.5;
    particles[57].position.x=1;
    particles[58].position.x=0.5;

    particles[50].position.y=-2;
    particles[51].position.y=-2;
    particles[52].position.y=-2;
    particles[53].position.y=-2;
    particles[54].position.y=-2;
    particles[55].position.y=-2;
    particles[56].position.y=-2;
    particles[57].position.y=-2;
    particles[58].position.y=-2;

//
    particles[60].position.x=-4.5;
    particles[61].position.x=-4;
    particles[62].position.x=-3.5;
    particles[63].position.x=-3;
    particles[64].position.x=-2.5;
    particles[65].position.x=-2;
    particles[66].position.x=-1.5;
    particles[67].position.x=-1;
    particles[68].position.x=-0.5;
    particles[69].position.x=0;


    particles[60].position.y=1;
    particles[61].position.y=1;
    particles[62].position.y=1;
    particles[63].position.y=1;
    particles[64].position.y=1;
    particles[65].position.y=1;
    particles[66].position.y=1;
    particles[67].position.y=1;
    particles[68].position.y=1;
    particles[69].position.y=1;

    particles[70].position.x=4.5;
    particles[71].position.x=4;
    particles[72].position.x=3.5;
    particles[73].position.x=3;
    particles[74].position.x=2.5;
    particles[75].position.x=2;
    particles[76].position.x=1.5;
    particles[77].position.x=1;
    particles[78].position.x=0.5;

    particles[70].position.y=1;
    particles[71].position.y=1;
    particles[72].position.y=1;
    particles[73].position.y=1;
    particles[74].position.y=1;
    particles[75].position.y=1;
    particles[76].position.y=1;
    particles[77].position.y=1;
    particles[78].position.y=1;

    //

    particles[80].position.x=-4.5;
    particles[81].position.x=-4;
    particles[82].position.x=-3.5;
    particles[83].position.x=-3;
    particles[84].position.x=-2.5;
    particles[85].position.x=-2;
    particles[86].position.x=-1.5;
    particles[87].position.x=-1;
    particles[88].position.x=-0.5;
    particles[89].position.x=0;


    particles[80].position.y=1.8;
    particles[81].position.y=1.8;
    particles[82].position.y=1.8;
    particles[83].position.y=1.8;
    particles[84].position.y=1.8;
    particles[85].position.y=1.8;
    particles[86].position.y=1.8;
    particles[87].position.y=1.8;
    particles[88].position.y=1.8;
    particles[89].position.y=1.8;

    particles[90].position.x=4.5;
    particles[91].position.x=4;
    particles[92].position.x=3.5;
    particles[93].position.x=3;
    particles[94].position.x=2.5;
    particles[95].position.x=2;
    particles[96].position.x=1.5;
    particles[97].position.x=1;
    particles[98].position.x=0.5;

    particles[90].position.y=1.8;
    particles[91].position.y=1.8;
    particles[92].position.y=1.8;
    particles[93].position.y=1.8;
    particles[94].position.y=1.8;
    particles[95].position.y=1.8;
    particles[96].position.y=1.8;
    particles[97].position.y=1.8;
    particles[98].position.y=1.8;


    /*//setting z=1;
    particles[100].position.x=-4.5;
    particles[101].position.x=-4;
    particles[102].position.x=-3.5;
    particles[103].position.x=-3;
    particles[104].position.x=-2.5;
    particles[105].position.x=-2;
    particles[106].position.x=-1.5;
    particles[107].position.x=-1;
    particles[108].position.x=-0.5;
    particles[109].position.x=0;

    particles[110].position.x=4.5;
    particles[111].position.x=4;
    particles[112].position.x=3.5;
    particles[113].position.x=3;
    particles[114].position.x=2.5;
    particles[115].position.x=2;
    particles[116].position.x=1.5;
    particles[117].position.x=1;
    particles[118].position.x=0.5;


    //
    particles[120].position.x=-4.5;
    particles[121].position.x=-4;
    particles[122].position.x=-3.5;
    particles[123].position.x=-3;
    particles[124].position.x=-2.5;
    particles[125].position.x=-2;
    particles[126].position.x=-1.5;
    particles[127].position.x=-1;
    particles[128].position.x=-0.5;
    particles[129].position.x=0;


    particles[120].position.y=-1;
    particles[121].position.y=-1;
    particles[122].position.y=-1;
    particles[123].position.y=-1;
    particles[124].position.y=-1;
    particles[125].position.y=-1;
    particles[126].position.y=-1;
    particles[127].position.y=-1;
    particles[128].position.y=-1;
    particles[129].position.y=-1;

    particles[130].position.x=4.5;
    particles[131].position.x=4;
    particles[132].position.x=3.5;
    particles[133].position.x=3;
    particles[134].position.x=2.5;
    particles[135].position.x=2;
    particles[136].position.x=1.5;
    particles[137].position.x=1;
    particles[138].position.x=0.5;

    particles[130].position.y=-1;
    particles[131].position.y=-1;
    particles[132].position.y=-1;
    particles[133].position.y=-1;
    particles[134].position.y=-1;
    particles[135].position.y=-1;
    particles[136].position.y=-1;
    particles[137].position.y=-1;
    particles[138].position.y=-1;

    //

    particles[140].position.x=-4.5;
    particles[141].position.x=-4;
    particles[142].position.x=-3.5;
    particles[143].position.x=-3;
    particles[144].position.x=-2.5;
    particles[145].position.x=-2;
    particles[146].position.x=-1.5;
    particles[147].position.x=-1;
    particles[148].position.x=-0.5;
    particles[149].position.x=0;


    for(var i=140;i<=149;i++)
        particles[i].position.y=-2;

    particles[150].position.x=4.5;
    particles[151].position.x=4;
    particles[152].position.x=3.5;
    particles[153].position.x=3;
    particles[154].position.x=2.5;
    particles[155].position.x=2;
    particles[156].position.x=1.5;
    particles[157].position.x=1;
    particles[158].position.x=0.5;

    for(var i=150;i<=158;i++)
        particles[i].position.y=-2;

//
    particles[160].position.x=-4.5;
    particles[161].position.x=-4;
    particles[162].position.x=-3.5;
    particles[163].position.x=-3;
    particles[164].position.x=-2.5;
    particles[165].position.x=-2;
    particles[166].position.x=-1.5;
    particles[167].position.x=-1;
    particles[168].position.x=-0.5;
    particles[169].position.x=0;

    for(var i=160;i<=169;i++)
        particles[i].position.y=1;

    particles[170].position.x=4.5;
    particles[171].position.x=4;
    particles[172].position.x=3.5;
    particles[173].position.x=3;
    particles[174].position.x=2.5;
    particles[175].position.x=2;
    particles[176].position.x=1.5;
    particles[177].position.x=1;
    particles[178].position.x=0.5;

    for(var i=170;i<=178;i++)
        particles[i].position.y=1;

    //

    particles[180].position.x=-4.5;
    particles[181].position.x=-4;
    particles[182].position.x=-3.5;
    particles[183].position.x=-3;
    particles[184].position.x=-2.5;
    particles[185].position.x=-2;
    particles[186].position.x=-1.5;
    particles[187].position.x=-1;
    particles[188].position.x=-0.5;
    particles[189].position.x=0;

    for(var i=180;i<=189;i++)
        particles[i].position.y=1.8;

    particles[190].position.x=4.5;
    particles[191].position.x=4;
    particles[192].position.x=3.5;
    particles[193].position.x=3;
    particles[194].position.x=2.5;
    particles[195].position.x=2;
    particles[196].position.x=1.5;
    particles[197].position.x=1;
    particles[198].position.x=0.5;

    for(var i=190;i<=198;i++)
        particles[i].position.y=1.8;

    for(var i=100;i<198;i++)
    {
        particles[i].position.z=1;
    }


    //setting z=-1.8;
    particles[300].position.x=-4.5;
    particles[301].position.x=-4;
    particles[302].position.x=-3.5;
    particles[303].position.x=-3;
    particles[304].position.x=-2.5;
    particles[305].position.x=-2;
    particles[306].position.x=-1.5;
    particles[307].position.x=-1;
    particles[308].position.x=-0.5;
    particles[309].position.x=0;

    particles[310].position.x=4.5;
    particles[311].position.x=4;
    particles[312].position.x=3.5;
    particles[313].position.x=3;
    particles[314].position.x=2.5;
    particles[315].position.x=2;
    particles[316].position.x=1.5;
    particles[317].position.x=1;
    particles[318].position.x=0.5;


    //
    particles[320].position.x=-4.5;
    particles[321].position.x=-4;
    particles[322].position.x=-3.5;
    particles[323].position.x=-3;
    particles[324].position.x=-2.5;
    particles[325].position.x=-2;
    particles[326].position.x=-1.5;
    particles[327].position.x=-1;
    particles[328].position.x=-0.5;
    particles[329].position.x=0;

    particles[320].position.y=-1;
    particles[321].position.y=-1;
    particles[322].position.y=-1;
    particles[323].position.y=-1;
    particles[324].position.y=-1;
    particles[325].position.y=-1;
    particles[326].position.y=-1;
    particles[327].position.y=-1;
    particles[328].position.y=-1;
    particles[329].position.y=-1;

    particles[330].position.x=4.5;
    particles[331].position.x=4;
    particles[332].position.x=3.5;
    particles[333].position.x=3;
    particles[334].position.x=2.5;
    particles[335].position.x=2;
    particles[336].position.x=1.5;
    particles[337].position.x=1;
    particles[338].position.x=0.5;

    particles[330].position.y=-1;
    particles[331].position.y=-1;
    particles[332].position.y=-1;
    particles[333].position.y=-1;
    particles[334].position.y=-1;
    particles[335].position.y=-1;
    particles[336].position.y=-1;
    particles[337].position.y=-1;
    particles[338].position.y=-1;

    //

    particles[340].position.x=-4.5;
    particles[341].position.x=-4;
    particles[342].position.x=-3.5;
    particles[343].position.x=-3;
    particles[344].position.x=-2.5;
    particles[345].position.x=-2;
    particles[346].position.x=-1.5;
    particles[347].position.x=-1;
    particles[348].position.x=-0.5;
    particles[349].position.x=0;

    for(var i=340;i<=349;i++)
        particles[i].position.y=-2;

    particles[350].position.x=4.5;
    particles[351].position.x=4;
    particles[352].position.x=3.5;
    particles[353].position.x=3;
    particles[354].position.x=2.5;
    particles[355].position.x=2;
    particles[356].position.x=1.5;
    particles[357].position.x=1;
    particles[358].position.x=0.5;

    for(var i=350;i<=358;i++)
        particles[i].position.y=-2;

//
    particles[360].position.x=-4.5;
    particles[361].position.x=-4;
    particles[362].position.x=-3.5;
    particles[363].position.x=-3;
    particles[364].position.x=-2.5;
    particles[365].position.x=-2;
    particles[366].position.x=-1.5;
    particles[367].position.x=-1;
    particles[368].position.x=-0.5;
    particles[369].position.x=0;

    for(var i=360;i<=369;i++)
        particles[i].position.y=1;

    particles[370].position.x=4.5;
    particles[371].position.x=4;
    particles[372].position.x=3.5;
    particles[373].position.x=3;
    particles[374].position.x=2.5;
    particles[375].position.x=2;
    particles[376].position.x=1.5;
    particles[377].position.x=1;
    particles[378].position.x=0.5;

    for(var i=370;i<=378;i++)
        particles[i].position.y=1;

    //

    particles[380].position.x=-4.5;
    particles[381].position.x=-4;
    particles[382].position.x=-3.5;
    particles[383].position.x=-3;
    particles[384].position.x=-2.5;
    particles[385].position.x=-2;
    particles[386].position.x=-1.5;
    particles[387].position.x=-1;
    particles[388].position.x=-0.5;
    particles[389].position.x=0;
    for(var i=380;i<=389;i++)
        particles[i].position.y=1.8;

    particles[390].position.x=4.5;
    particles[391].position.x=4;
    particles[392].position.x=3.5;
    particles[393].position.x=3;
    particles[394].position.x=2.5;
    particles[395].position.x=2;
    particles[396].position.x=1.5;
    particles[397].position.x=1;
    particles[398].position.x=0.5;

    for(var i=390;i<=398;i++)
        particles[i].position.y=1.8;

    for(var i=300;i<398;i++)
    {
        particles[i].position.z=-1.8;
    }

    PIErender();


    //setting z=-1;
    particles[200].position.x=-4.5;
    particles[201].position.x=-4;
    particles[202].position.x=-3.5;
    particles[203].position.x=-3;
    particles[204].position.x=-2.5;
    particles[205].position.x=-2;
    particles[206].position.x=-1.5;
    particles[207].position.x=-1;
    particles[208].position.x=-0.5;
    particles[209].position.x=0;

    particles[210].position.x=4.5;
    particles[211].position.x=4;
    particles[212].position.x=3.5;
    particles[213].position.x=3;
    particles[214].position.x=2.5;
    particles[215].position.x=2;
    particles[216].position.x=1.5;
    particles[217].position.x=1;
    particles[218].position.x=0.5;


    //
    particles[220].position.x=-4.5;
    particles[221].position.x=-4;
    particles[222].position.x=-3.5;
    particles[223].position.x=-3;
    particles[224].position.x=-2.5;
    particles[225].position.x=-2;
    particles[226].position.x=-1.5;
    particles[227].position.x=-1;
    particles[228].position.x=-0.5;
    particles[229].position.x=0;


    particles[220].position.y=-1;
    particles[221].position.y=-1;
    particles[222].position.y=-1;
    particles[223].position.y=-1;
    particles[224].position.y=-1;
    particles[225].position.y=-1;
    particles[226].position.y=-1;
    particles[227].position.y=-1;
    particles[228].position.y=-1;
    particles[229].position.y=-1;

    particles[230].position.x=4.5;
    particles[231].position.x=4;
    particles[232].position.x=3.5;
    particles[233].position.x=3;
    particles[234].position.x=2.5;
    particles[235].position.x=2;
    particles[236].position.x=1.5;
    particles[237].position.x=1;
    particles[238].position.x=0.5;

    particles[230].position.y=-1;
    particles[231].position.y=-1;
    particles[232].position.y=-1;
    particles[233].position.y=-1;
    particles[234].position.y=-1;
    particles[235].position.y=-1;
    particles[236].position.y=-1;
    particles[237].position.y=-1;
    particles[238].position.y=-1;

    //

    particles[240].position.x=-4.5;
    particles[241].position.x=-4;
    particles[242].position.x=-3.5;
    particles[243].position.x=-3;
    particles[244].position.x=-2.5;
    particles[245].position.x=-2;
    particles[246].position.x=-1.5;
    particles[247].position.x=-1;
    particles[248].position.x=-0.5;
    particles[249].position.x=0;


    for(var i=240;i<=249;i++)
        particles[i].position.y=-2;

    particles[250].position.x=4.5;
    particles[251].position.x=4;
    particles[252].position.x=3.5;
    particles[253].position.x=3;
    particles[254].position.x=2.5;
    particles[255].position.x=2;
    particles[256].position.x=1.5;
    particles[257].position.x=1;
    particles[258].position.x=0.5;

    for(var i=250;i<=258;i++)
        particles[i].position.y=-2;

//
    particles[260].position.x=-4.5;
    particles[261].position.x=-4;
    particles[262].position.x=-3.5;
    particles[263].position.x=-3;
    particles[264].position.x=-2.5;
    particles[265].position.x=-2;
    particles[266].position.x=-1.5;
    particles[267].position.x=-1;
    particles[268].position.x=-0.5;
    particles[269].position.x=0;

    for(var i=260;i<=269;i++)
        particles[i].position.y=1;

    particles[270].position.x=4.5;
    particles[271].position.x=4;
    particles[272].position.x=3.5;
    particles[273].position.x=3;
    particles[274].position.x=2.5;
    particles[275].position.x=2;
    particles[276].position.x=1.5;
    particles[277].position.x=1;
    particles[278].position.x=0.5;

    for(var i=270;i<=278;i++)
        particles[i].position.y=1;

    //

    particles[280].position.x=-4.5;
    particles[281].position.x=-4;
    particles[282].position.x=-3.5;
    particles[283].position.x=-3;
    particles[284].position.x=-2.5;
    particles[285].position.x=-2;
    particles[286].position.x=-1.5;
    particles[287].position.x=-1;
    particles[288].position.x=-0.5;
    particles[289].position.x=0;

    for(var i=280;i<=289;i++)
        particles[i].position.y=1.8;

    particles[290].position.x=4.5;
    particles[291].position.x=4;
    particles[292].position.x=3.5;
    particles[293].position.x=3;
    particles[294].position.x=2.5;
    particles[295].position.x=2;
    particles[296].position.x=1.5;
    particles[297].position.x=1;
    particles[298].position.x=0.5;

    for(var i=290;i<=298;i++)
        particles[i].position.y=1.8;

    for(var i=200;i<298;i++)
    {
        particles[i].position.z=-1;
    }
    //setting z=1.8;
    particles[400].position.x=-4.5;
    particles[401].position.x=-4;
    particles[402].position.x=-3.5;
    particles[403].position.x=-3;
    particles[404].position.x=-2.5;
    particles[405].position.x=-2;
    particles[406].position.x=-1.5;
    particles[407].position.x=-1;
    particles[408].position.x=-0.5;
    particles[409].position.x=0;

    particles[410].position.x=4.5;
    particles[411].position.x=4;
    particles[412].position.x=3.5;
    particles[413].position.x=3;
    particles[414].position.x=2.5;
    particles[415].position.x=2;
    particles[416].position.x=1.5;
    particles[417].position.x=1;
    particles[418].position.x=0.5;

    //
    particles[420].position.x=-4.5;
    particles[421].position.x=-4;
    particles[422].position.x=-3.5;
    particles[423].position.x=-3;
    particles[424].position.x=-2.5;
    particles[425].position.x=-2;
    particles[426].position.x=-1.5;
    particles[427].position.x=-1;
    particles[428].position.x=-0.5;
    particles[429].position.x=0;


    particles[420].position.y=-1;
    particles[421].position.y=-1;
    particles[422].position.y=-1;
    particles[423].position.y=-1;
    particles[424].position.y=-1;
    particles[425].position.y=-1;
    particles[426].position.y=-1;
    particles[427].position.y=-1;
    particles[428].position.y=-1;
    particles[429].position.y=-1;

    particles[430].position.x=4.5;
    particles[431].position.x=4;
    particles[432].position.x=3.5;
    particles[433].position.x=3;
    particles[434].position.x=2.5;
    particles[435].position.x=2;
    particles[436].position.x=1.5;
    particles[437].position.x=1;
    particles[438].position.x=0.5;

    particles[430].position.y=-1;
    particles[431].position.y=-1;
    particles[432].position.y=-1;
    particles[433].position.y=-1;
    particles[434].position.y=-1;
    particles[435].position.y=-1;
    particles[436].position.y=-1;
    particles[437].position.y=-1;
    particles[438].position.y=-1;

    //

    particles[440].position.x=-4.5;
    particles[441].position.x=-4;
    particles[442].position.x=-3.5;
    particles[443].position.x=-3;
    particles[444].position.x=-2.5;
    particles[445].position.x=-2;
    particles[446].position.x=-1.5;
    particles[447].position.x=-1;
    particles[448].position.x=-0.5;
    particles[449].position.x=0;


    for(var i=440;i<=449;i++)
        particles[i].position.y=-2;

    particles[450].position.x=4.5;
    particles[451].position.x=4;
    particles[452].position.x=3.5;
    particles[453].position.x=3;
    particles[454].position.x=2.5;
    particles[455].position.x=2;
    particles[456].position.x=1.5;
    particles[457].position.x=1;
    particles[458].position.x=0.5;
    for(var i=450;i<=458;i++)
        particles[i].position.y=-2;

//
    particles[460].position.x=-4.5;
    particles[461].position.x=-4;
    particles[462].position.x=-3.5;
    particles[463].position.x=-3;
    particles[464].position.x=-2.5;
    particles[465].position.x=-2;
    particles[466].position.x=-1.5;
    particles[467].position.x=-1;
    particles[468].position.x=-0.5;
    particles[469].position.x=0;

    for(var i=460;i<=469;i++)
        particles[i].position.y=1;

    particles[470].position.x=4.5;
    particles[471].position.x=4;
    particles[472].position.x=3.5;
    particles[473].position.x=3;
    particles[474].position.x=2.5;
    particles[475].position.x=2;
    particles[476].position.x=1.5;
    particles[477].position.x=1;
    particles[478].position.x=0.5;

    for(var i=470;i<=478;i++)
        particles[i].position.y=1;

    //

    particles[480].position.x=-4.5;
    particles[481].position.x=-4;
    particles[482].position.x=-3.5;
    particles[483].position.x=-3;
    particles[484].position.x=-2.5;
    particles[485].position.x=-2;
    particles[486].position.x=-1.5;
    particles[487].position.x=-1;
    particles[488].position.x=-0.5;
    particles[489].position.x=0;

    for(var i=480;i<=489;i++)
        particles[i].position.y=1.8;

    particles[490].position.x=4.5;
    particles[491].position.x=4;
    particles[492].position.x=3.5;
    particles[493].position.x=3;
    particles[494].position.x=2.5;
    particles[495].position.x=2;
    particles[496].position.x=1.5;
    particles[497].position.x=1;
    particles[498].position.x=0.5;

    for(var i=490;i<=498;i++)
        particles[i].position.y=1.8;
*/
    for(var i=0;i<98;i++)
    {
        particles[i].position.z=-1.8;
    }
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
    particles=new Array(500);
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
        PIEchangeInputCheckbox("Sodium ThioSulp",false);
        PIEchangeInputCheckbox("Dil. Sulphuric Acid",false);
    }
    for(var i=0;i<100;i++)
        particles[i].material.opacity=0.001;
    PIErender();
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
    helpContent = helpContent + "<p>When Sodium ThioSulp and dilute acid(<i>dil. H<sub>2</sub>SO<sub>4</sub></i>)is mixed in water then Colloidal solution is formed.</p>";
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
