// element: a jQuery object containing the DOM element to use
// dimensions: the number of cubes per row/column (default 3)
// background: the scene background colour
function Rubik(element, dimensions, background) {

  dimensions = dimensions || 3;
  background = background || 0x303030;

  var width = element.innerWidth(),
      height = element.innerHeight();

  var debug = false;

  /*** three.js boilerplate ***/
  var scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000),
      renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setClearColor(background, 1.0);
  renderer.setSize(width, height);
  renderer.shadowMapEnabled = true;
  element.append(renderer.domElement);

  camera.position = new THREE.Vector3(20, 15, 20);
  camera.lookAt(scene.position);

  /*** Lights ***/
  scene.add(new THREE.AmbientLight(0xffffff));


  /*** Debug aids ***/  
  if(debug) {
    scene.add(new THREE.AxisHelper( 20 ));
  }

  /*** Build 27 cubes ***/
  function build27cubes(scale, offset) {
    var colours = [0xC41E3A, 0x009E60, 0x0051BA, 0xFF5800, 0xFFD500, 0xFFFFFF],
      faceMaterials = colours.map(function (c) {
        return new THREE.MeshLambertMaterial({ color: c, ambient: c });
      }),
      cubeMaterials = new THREE.MeshFaceMaterial(faceMaterials);

    var cubeSize = 3 * scale, spacing = 0.5 * scale;

    var increment = cubeSize + spacing;
    var allCubes = [];

    function newCube(x, y, z) {
      var cubeGeometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
      cube.castShadow = true;

      cube.position = new THREE.Vector3(x + offset.x, y + offset.y, z + offset.z);
      console.log(`cube: (${x}, ${y}, ${z})`);
      cube.rubikPosition = cube.position.clone();

      scene.add(cube);
      allCubes.push(cube);
    }

    var positionOffset = (dimensions - 1) / 2;
    for (var i = 0; i < dimensions; i++) {
      for (var j = 0; j < dimensions; j++) {
        for (var k = 0; k < dimensions; k++) {

          var x = (i - positionOffset) * increment,
            y = (j - positionOffset) * increment,
            z = (k - positionOffset) * increment;

          newCube(x, y, z);
        }
      }
    }
  }

  var offsetDistance = 10/3;
  var o = (offsetDistance + spacing);
  // extrude along x-axis
  build27cubes(1/3.0, {x: 0, y: 0, z: 0});
  build27cubes(1/3.0, {x: o, y: 0, z: 0});
  build27cubes(1/3.0, {x: o*2, y: 0, z: 0});
  // extrude along y-axis
  build27cubes(1/3.0, {x: o*2, y: 0, z: 0});
  build27cubes(1/3.0, {x: o*2, y: o, z: 0});
  build27cubes(1/3.0, {x: o*2, y: o*2, z: 0});
  //// extrude back along x-axis
  build27cubes(1/3.0, {x: o, y: o*2, z: 0});
  build27cubes(1/3.0, {x: 0, y: o*2, z: 0});
  // extrude down along y-axis
  build27cubes(1/3.0, {x: 0, y: o, z: 0});
  // extrude along z-axis
  build27cubes(1/3.0, {x: 0, y: 0, z: o});
  build27cubes(1/3.0, {x: 0, y: 0, z: o*2});
  // extrude along the x-axis
  build27cubes(1/3.0, {x: o, y: 0, z: o*2});
  build27cubes(1/3.0, {x: o*2, y: 0, z: o*2});
  // extrude along z-axis
  build27cubes(1/3.0, {x: o*2, y: 0, z: o});
  // extrude along y-axis
  build27cubes(1/3.0, {x: o*2, y: o, z: o*2});
  build27cubes(1/3.0, {x: o*2, y: o*2, z: o*2});
  // extrude along z-axis
  build27cubes(1/3.0, {x: o*2, y: o*2, z: o});
  // extrude back along the x-axis
  build27cubes(1/3.0, {x: o, y: o*2, z: o*2});
  build27cubes(1/3.0, {x: 0, y: o*2, z: o*2});
  // extrude down along y-axis
  build27cubes(1/3.0, {x: 0, y: o, z: o*2});
  // extrude along z-axis
  build27cubes(1/3.0, {x: 0, y: o*2, z: o});

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  //Go!
  render();

}

