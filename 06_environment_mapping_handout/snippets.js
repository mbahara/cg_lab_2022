//TASK 3.1: transform camera ray direction to world space (assign result to v_cameraRayVec)
v_cameraRayVec = u_invView * eyePosition.xyz;

//TASK 3.2: compute reflected camera ray (assign to texCoords)
texCoords  = reflect(cameraRayVec, normalVec);
  		

//TASK 3.3: do texture lookup in cube map using the textureCube function
gl_FragColor = textureCube(u_texCube, texCoords);
  
  
