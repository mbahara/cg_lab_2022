/**
 * the OpenGL context
 * @type {WebGLRenderingContext}
 */
var gl = null;
var shaderProgram = null;
var buffer, colorBuffer;

/**
 * initializes OpenGL context, compile shader, and load buffers
 */
function init(resources) {
  //create a GL context
  gl = createContext(400 /*width*/, 400 /*height*/);

  //TODO initialize shader program and buffers...
  shaderProgram = createProgram(gl, resources.vs, resources.fs);
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const arr = new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
   -1.0,  1.0,
   -1.0,  1.0,
    1.0, -1.0,
    1.0, 1.0 ]);
  gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);

  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  const colors = new Float32Array([
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 1, 0, 1,
    0, 0, 0, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
}

/**
 * render one frame
 */
function render() {
  //specify the clear color
  gl.clearColor(0.9, 0.9, 0.9, 1.0 /* 0 = fully transparent */);
  //clear the buffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  //TODO render scene
  gl.useProgram(shaderProgram);
  var userColor = {r: 0.6, g: 0.2, b: 0.8};
  gl.uniform3f(gl.getUniformLocation(shaderProgram, 'u_usercolor'), userColor.r, userColor.g, userColor.b);
  // connect GPU and CPU
  const positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const colorLocation = gl.getAttribLocation(shaderProgram, 'a_color');
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
  
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  //request another call as soon as possible
  //requestAnimationFrame(render);
}

loadResources({
  //list of all resources that should be loaded as key: path
  vs: 'shader/simple.vs.glsl',
  fs: 'shader/simple.fs.glsl'
}).then(function (resources /*loaded resources*/) {
  init(resources);
  //render one frame
  render();
});
