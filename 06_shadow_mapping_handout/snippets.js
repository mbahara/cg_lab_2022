//TASK 1.1: setup camera to look at the scene from the light's perspective
let lookAtMatrix = mat4.lookAt(mat4.create(), worldLightPos, worldLightLookAtPos, upVector);
//let lookAtMatrix = mat4.lookAt(mat4.create(), [0,1,-10], [0,0,0], [0,1,0]); //replace me for TASK 1.1


//TASK 2.1: compute eye-to-light matrix by multiplying this.lightViewProjectionMatrix and context.invViewMatrix
//Hint: Look at the computation of lightViewProjectionMatrix to see how to multiply two matrices and for the correct order of the matrices!
var eyeToLightMatrix = mat4.multiply(mat4.create(),this.lightViewProjectionMatrix,context.invViewMatrix);
    

//TASK 2.2: calculate vertex position in light clip space coordinates using u_eyeToLightMatrix (assign result to v_shadowMapTexCoord)
v_shadowMapTexCoord = u_eyeToLightMatrix*eyePosition;

//TASK 2.3: apply perspective division to v_shadowMapTexCoord and save to shadowMapTexCoord3D
vec3 shadowMapTexCoord3D = v_shadowMapTexCoord.xyz/v_shadowMapTexCoord.w; //do perspective division

//do texture space transformation (-1 to 1 -> 0 to 1)
shadowMapTexCoord3D = vec3(0.5,0.5,0.5) + shadowMapTexCoord3D*0.5;


//TASK 2.4: look up depth in u_depthMap and set shadow coefficient (shadowCoeff) to 0 based on depth comparison
float zShadowMap = texture2D(u_depthMap, shadowMapTexCoord3D.xy).r;
if(shadowMapTexCoord3D.z > zShadowMap)
	shadowCoeff = 0.0;

//TASK 2.5: apply shadow coefficient to diffuse and specular part
return c_amb + shadowCoeff * (c_diff + c_spec) + c_em;

//EXTRA TASK: Improve shadow quality by sampling multiple shadow coefficients (a.k.a. PCF)
float sumShadowCoeff = 0.0;
for(float dx=-1.0; dx <= 1.0; dx++)
{
    for(float dy=-1.0; dy <= 1.0; dy++)
    {
        float subShadowCoeff = 1.0; //set to 1 if no shadow!
        float zShadowMap = texture2D(u_depthMap, shadowMapTexCoord3D.xy+vec2(dx/u_shadowMapWidth,dy/u_shadowMapHeight)).r;
        if(shadowMapTexCoord3D.z > zShadowMap)
            subShadowCoeff = 0.0;

        sumShadowCoeff += subShadowCoeff;
    }
}
shadowCoeff = sumShadowCoeff/9.0;
