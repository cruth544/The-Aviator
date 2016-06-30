var Colors = {
  red:0xf25346,
  white:0xd8d0d1,
  brown:0x59332e,
  pink:0xF5986E,
  brownDark:0x23190f,
  blue:0x68c3c0,
};

window.addEventListener('load', init, false);
function init() {
  /*/
   *  set up the scene, the camera and the renderer
  /*/
  createScene();

  /*/
   *  add the lights
  /*/
  createLights();

  /*/
   *  add the objects
  /*/
  createPlane();
  createSea();
  createSky();

  /*/
   *  Listen to the screen: if the user resizes it
   *  we have to update the camera and the renderer size
  /*/
  window.addEventListener('resize', handleWindowResize, false);

  /*/
   *  Add Mouse Listener
  /*/
  document.addEventListener('mousemove', handleMouseMove, false);

  /*/
   *  start a loop that will update the objects' positions
   *  and render the scene on each frame
  /*/
  loop();

};

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH   = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

var mousePos = {x: 0, y: 0};
/*/
 *  Now Handle the mousemove event
/*/

function handleMouseMove(event) {
  /*/
   *  Here we are converting the mouse position value received
   *  to a normalized value varying between -1 and 1.
   *  This is the formula for the horizontal axis
  /*/

  var tx = -1 + (event.clientX / WIDTH) * 2;

  /*/
   *  For the vertical axis, we need to inverse the formula
   *  because the 2D y-axis goes the opposite direction of the 3D y-axis
  /*/

  var ty = 1 - (event.clientY / HEIGHT) * 2;
  mousePos = {x: tx, y: ty};
}

 var scene;
 var camera, fieldOfView, aspectRation, nearPlane, farPlane;
 var HEIGHT, WIDTH;
 var renderer, container;

 function createScene() {
  /*/
   *  Get the width and the height of the screen,
   *  use them to set up the aspect ratio of the camera
   *  and the size of the renderer.
  /*/
  HEIGHT = window.innerHeight;
  WIDTH  = window.innerWidth;

  // Create the scene
  scene = new THREE.Scene();

  /*/
   *  Add a fog effect to the scene; same color as the
   *  background color used in the style sheet
  /*/
  //                        color     near, far
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  /*/
   *  Create the camera
   *
   *  http://threejs.org/docs/index.html#Reference/Cameras/PerspectiveCamera
  /*/

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane   = 1; //(plane being dimension)
  farPlane    = 10000; //(plane being dimension)

  camera = new THREE.PerspectiveCamera(
    fieldOfView, // frustum vertical field of view
    aspectRatio, // aspect ratio
    nearPlane, // near plane (plane being dimension)
    farPlane // far plane (plane being dimension)
  );

  // Set the position of the camera
  camera.position.x = 0;
  camera.position.y = 100;
  camera.position.z = 200;

  /*/
   *  Create the renderer
   *
   *  http://threejs.org/docs/index.html#Reference/Renderers/WebGLRenderer
  /*/
  renderer = new THREE.WebGLRenderer({
    /*/
     *  Allow transparency to show the gradient background
     *  we defined in the CSS
    /*/
    alpha: true,

    /*/
     *  Activate the anti-aliasing; this is less performant,
     *  but, as our project is low-poly based, it sould be fine =)
    /*/
    antialias: true
  });
  /*/
   *  Define the size of the renderer; in this case,
   *  it will fill the entire screen
  /*/
  renderer.setSize(WIDTH, HEIGHT);

  // Enable shadow rendering
  renderer.shadowMap.enabled = true;

  /*/
   *  Add the DOM element of the renderer to the
   *  container we created in the HTML
  /*/
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

 };

var hemisphereLight, shadowLight;

function createLights() {
  /*/
   *  A hemisphere light is a gradient colored light;
   *  the first parameter is the sky color,
   *  the second parameter is the ground color,
   *  the third parameter is the intensity of the light
   *
   *  http://threejs.org/docs/index.html#Reference/Lights/HemisphereLight
  /*/
  //                                         skyColor, ground, intensity
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  /*/
   *  A directional light shines from a specific direction,
   *  It acts like the sun,
   *  that means that all the rays produced are parallel
   *
   *  http://threejs.org/docs/index.html#Reference/Lights/DirectionalLight
  /*/
  //                                       color,   intensity
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

  /*/
   *  Set the direction of the light
  /*/
  //                         x,   y,   z
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // Define the visible area of the projected shadow
  shadowLight.shadow.camera.left    = -400;
  shadowLight.shadow.camera.right   = 400;
  shadowLight.shadow.camera.top     = 400;
  shadowLight.shadow.camera.bottom  = -400;
  shadowLight.shadow.camera.near    = 1;
  shadowLight.shadow.camera.far     = 1000;

  /*/
   *  Define the resolution of the shadow;
   *  the higher the better,
   *  but also the more expensive and less perfomant
  /*/
  shadowLight.shadow.mapSize.width  = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // to activate the lights, just add them to the scene
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

var Sea = function () {
  /*/
   *  Create the geometry (shape) of the cylinder;
   *  the parameters are:
   *  radius top,
   *  radius bottom,
   *  height,
   *  number of segments on the radius,
   *  number of segments
   *
   *  http://threejs.org/docs/index.html#Reference/Extras.Geometries/CylinderGeometry
  /*/
  var geom = new THREE.CylinderGeometry(
    600,  // Radius of Top
    600,  // Radius of Bottom
    800,  // Height
    40,   // Radius Segments (# of segmented faces around circumference)
    10    // Height Segments (# of rows of faces along height of cylinder)
  );

  /*/
   *  rotate the geometry on the x-axis
   *
   *  http://threejs.org/docs/index.html#Reference/Math/Matrix4
  /*/
  //                                                  theta
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  /*/
   *  Create the material
   *
   *  http://threejs.org/docs/index.html#Reference/Materials/MeshPhongMaterial
  /*/

  var mat = new THREE.MeshPhongMaterial({
    color: Colors.blue, // Geometry color in hexadecimal
    transparent: true, // Transparent Objs render after non, WebGLRenderer behavior
    opacity: 0.6, // 0 - 1 opacity
    shading: THREE.FlatShading // Material constant
    // http://threejs.org/docs/index.html#Reference/Constants/Materials
  });

  /*/
   *  To create an object in Three.js,
   *  we have to create a mesh
   *  which is a combination of a
   *  geometry and some material
  /*/
  //                        shape, material
  this.mesh = new THREE.Mesh(geom, mat);

  /*/
   *  Allow the sea to receive shadows
  /*/
  this.mesh.receiveShadow = true;
}

/*/
 *  Instantiate the sea and add it to the scene
/*/
var sea;
function createSea() {
  sea = new Sea();
  /*/
   *  Push it a little bit at the bottom of the scene
  /*/
  sea.mesh.position.y = -600;

  /*/
   *  Add the mesh of the sea to the scene
  /*/
  scene.add(sea.mesh);
}

var Cloud = function () {
  /*/
   *  Create an amepty container that will hold the different
   *  parts of the cloud
   *
   *  http://threejs.org/docs/index.html#Reference/Core/Object3D
  /*/
  this.mesh = new THREE.Object3D();

  /*/
   *  Create a cube geometry
   *  This shape will be duplicated to create the cloud
   *
   *  http://threejs.org/docs/index.html#Reference/Extras.Geometries/BoxGeometry
  /*/
  //                                w,  h,  depth
  var geom = new THREE.BoxGeometry(20, 20, 20);

  /*/
   *  Create a material
   *  A simple white material will do the trick
   *
   *  http://threejs.org/docs/index.html#Reference/Materials/MeshPhongMaterial
  /*/

  var mat = new THREE.MeshPhongMaterial({
    color: Colors.white
  });

  /*/
   *  Duplicate the geometry a random number of times
  /*/
  var nBlocs = 3 + Math.floor(Math.random() * 3);
  for (var i = 0; i < nBlocs; i++) {
    /*/
     *  Create the mesh by cloning the geometry
    /*/
    var m = new THREE.Mesh(geom, mat);

    /*/
     *  Set the position and the rotation of each cube randomly
    /*/
    m.position.x = i * 15;
    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 10;

    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;

    /*/
     *  Set the size of the cube randomly
    /*/
    var s = 0.1 + Math.random() * 0.9;
    //          x, y, z
    m.scale.set(s, s, s);

    /*/
     *  Allow each cube to cast and to receive shadows
    /*/
    m.castShadow = true;
    m.receiveShadow = true;

    /*/
     *  Add the cube to the container we first created
    /*/
    this.mesh.add(m);
  }
}

var Sky = function () {
  /*/
   *  Create an empty container
  /*/
  this.mesh = new THREE.Object3D();

  /*/
   *  Choose a number of clouds to be scattered in the sky
  /*/
  this.nClouds = 20;

  /*/
   *  To distribute the clouds consistently,
   *  we need to place them according to a uniform angle
  /*/
  var stepAngle = Math.PI * 2 / this.nClouds;

  /*/
   *  Create the clouds
  /*/
  for (var i = 0; i < this.nClouds; i++) {
    var c = new Cloud();

    /*/
     *  Set the rotation and the position of each cloud
     *  for that, we use a bit of trigonometry
    /*/
    var a = stepAngle * i; // This is the final angle of the cloud
    var h = 750 + Math.random() * 200; // This is the distance between the center of the axis and the cloud itself

    /*/
     *  Trigonometry
     *  We are simply converting polar coordinates (angle, distance)
     *  into Cartesian coordinates(x, y)
    /*/
    c.mesh.position.y = Math.sin(a) * h;
    c.mesh.position.x = Math.cos(a) * h;

    /*/
     *  Rotate the cloud according to its position
    /*/
    c.mesh.rotation.z = a + Math.PI / 2;

    /*/
     *  For a better result, we position the clouds
     *  at random depths inside of the scene
    /*/
    c.mesh.position.z = -400 - Math.random() * 400;

    /*/
     *  We also set a random scale for each cloud
    /*/
    var s = 1 + Math.random() * 2;
    c.mesh.scale.set(s, s, s);

    /*/
     *  Do not forget to add the mesh of each cloud in the scene
    /*/
    this.mesh.add(c.mesh)
  }
}

/*/
 *  Now we instantiate the sky and push its center a bit
 *  towards the bottom of the screen
/*/
var sky;

function createSky() {
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

var AirPlane = function () {
  this.mesh = new THREE.Object3D();

  /*/
   *  Create the Cabin
   *
   *  http://threejs.org/docs/index.html#Reference/Extras.Geometries/BoxGeometry
   *
   *  http://threejs.org/docs/index.html#Reference/Materials/MeshPhongMaterial
   *
   *  http://threejs.org/docs/index.html#Reference/Objects/Mesh
  /*/
  var geomCockpit = new THREE.BoxGeometry(
    60, // Width
    50, // Height
    50, // Depth
    1,  // Width Segments (Number of segmented faces along width)
    1,  // Height Segments (Number of segmented faces along width)
    1   // Depth Segments (Number of segmented faces along width)
  );
  /*/
   *  We can access a specific vertex of a shape through
   *  the vertices array,
   *  and then move its x, y, and z properties
   *
   *  http://threejs.org/docs/index.html#Reference/Core/Geometry.vertices
  /*/
  geomCockpit.vertices[4].y -= 10;
  geomCockpit.vertices[4].z += 20;
  geomCockpit.vertices[5].y -= 10;
  geomCockpit.vertices[5].z -= 20;
  geomCockpit.vertices[6].y += 30;
  geomCockpit.vertices[6].z += 20;
  geomCockpit.vertices[7].y += 30;
  geomCockpit.vertices[7].z -= 20;

  var matCockpit = new THREE.MeshPhongMaterial({
    color: Colors.red,
    shading: THREE.FlatShading // http://threejs.org/docs/index.html#Reference/Constants/Materials
  });
  var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);

  /*/
   *  Create the Engine
  /*/
  //                                      x,  y,  z
  var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
  var matEngine  = new THREE.MeshPhongMaterial({
    color: Colors.white,
    shading: THREE.FlatShading
  });
  var engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);

  /*/
   *  Create the Tail
  /*/
  //                                        x,   y, z
  var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
  var matTailPlane  = new THREE.MeshPhongMaterial({
    color: Colors.red,
    shading: THREE.FlatShading
  });
  var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
  this.mesh.add(tailPlane);

  /*/
   *  Create the wing
  /*/
  //                                        x, y,   z
  var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
  var matSideWing  = new THREE.MeshPhongMaterial({
    color: Colors.red,
    shading: THREE.FlatShading
  });
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
  this.mesh.add(sideWing);

  /*/
   *  Create Propeller
  /*/
  //                                        x,   y,  z
  var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
  var matPropeller  = new THREE.MeshPhongMaterial({
    color: Colors.brown,
    shading: THREE.FlatShading
  });
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  /*/
   *  Create Blades
  /*/
  //                                    x,   y,  z
  var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
  var matBlade  = new THREE.MeshPhongMaterial({
    color: Colors.brownDark,
    shading: THREE.FlatShading
  });
  var blade = new THREE.Mesh(geomBlade, matBlade);
  blade.position.set(8, 0, 0);
  blade.castShadow = true;
  blade.receiveShadow = true;
  this.propeller.add(blade);// x, y, z
  this.propeller.position.set(50, 0, 0);
  this.mesh.add(this.propeller);
}


var airplane;
function createPlane() {
  airplane = new AirPlane();
  airplane.mesh.scale.set(0.25, 0.25, 0.25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}

function updatePlane() {
  /*/
   *  Let's move the airplane between -100 and 100 on the horizontal axis,
   *  and between 25 and 175 on the vertical axis,
   *  depending on the mouse position which ranges between -1 and 1
   *  on both axes.
   *  To achieve that we use a normalize function (see below)
  /*/

  var targetX = normalize(mousePos.x, -1, 1, -100, 100);
  var targetY = normalize(mousePos.y, -1, 1, 25, 175);

  /*/
   *  Update the airplane's position
  /*/
  airplane.mesh.position.x = targetX;
  airplane.mesh.position.y = targetY;

  /*/
   *  Rotate the propeller
  /*/
  airplane.propeller.rotation.x += 0.3;
}

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);

  return tv;
}

var Pilot = function () {
  this.mesh = new THREE.Object3D();
  this.mesh.name = 'pilot';

  /*/
   *  angleHairs is a property used to animate the hair later
  /*/
  this.angleHairs = 0;

  /*/
   *  Body of the pilot
   *
   *  http://threejs.org/docs/index.html#Reference/Extras.Geometries/BoxGeometry
   *
   *  http://threejs.org/docs/index.html#Reference/Materials/MeshPhongMaterial
   *
   *  http://threejs.org/docs/index.html#Reference/Objects/Mesh
  /*/
  //                                    x,  y,  z
  var bodyGeom = new THREE.BoxGeometry(15, 15, 15);
  var bodyMat  = new THREE.MeshPhongMaterial({
    color: Colors.brown,
    shading: THREE.FlatShading
  });
  var body = THREE.Mesh(bodyGeom, bodyMat);
  body.position.set(2, -12, 0);
  this.mesh.add(body);

  /*/
   *  Face of the pilot
   *
   *  http://threejs.org/docs/index.html#Reference/Extras.Geometries/BoxGeometry
   *
   *  http://threejs.org/docs/index.html#Reference/Materials/MeshPhongMaterial
   *
   *  http://threejs.org/docs/index.html#Reference/Objects/Mesh
  /*/
  //                                    x,  y,  z
  var faceGeom = new THREE.BoxGeometry(10, 10, 10);
  var faceMat  = new THREE.MeshPhongMaterial({
    color: Colors.pink
  });
  var face = new THREE.Mesh(faceGeom, faceMat);
  this.mesh.add(face);

  /*/
   *  Hair element
   *
   *  http://threejs.org/docs/index.html#Reference/Extras.Geometries/BoxGeometry
   *
   *  http://threejs.org/docs/index.html#Reference/Materials/MeshPhongMaterial
   *
   *  http://threejs.org/docs/index.html#Reference/Objects/Mesh
  /*/
  //                                   x, y, z
  var hairGeom = new THREE.BoxGeometry(4, 4, 4);
  var hairMat  = new THREE.MeshPhongMaterial({
    color: Colors.brown
  });
  var hair = new THREE.Mesh(hairGeom, hairMat);

  /*/
   *  Align the shape of the hair to its bottom boundary,
   *  that will make it easier to scale
   *
   *  http://threejs.org/docs/index.html#Reference/Math/Matrix4
  /*/
  //                                                            x, y, z
  hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));

  /*/
   *  Create a container for the hair
   *
   *  http://threejs.org/docs/index.html#Reference/Core/Object3D
  /*/
  var hairs = new THREE.Object3D();

  /*/
   *  Create the hairs at the top of the head
   *  and position them on a 3 x 4 grid
  /*/
  for (var i = 0; i < 12; i++) {
    var h = hair.clone(); //http://threejs.org/docs/index.html#Reference/Objects/Mesh.clone
    var col = i % 3;
    var row = Math.floor(i / 3);
    var startPosZ = -4;
    var startPosX = -4;
    h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
    this.hairsTop.add(h);
  }
  hairs.add(this.hairsTop);

  /*/
   *  Create the hairs at the side of the face
  /*/
  //                                        x, y, z
  var hairSideGeom = new THREE.BoxGeometry(12, 4, 2);

  hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
  var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
  var hairSideL = hairSideR.clone();
}


function loop() {
  /*/
   *  Rotate the sea and the sky
  /*/
  sea.mesh.rotation.z += 0.005;
  sky.mesh.rotation.z += 0.01;

  updatePlane();

  /*/
   *  Render the Scene!
  /*/
  renderer.render(scene, camera);

  /*/
   *  Call the loop function again on next frame
  /*/
  requestAnimationFrame(loop);
}
