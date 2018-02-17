precision highp float;
uniform sampler2D u_ambient;
uniform sampler2D u_diffuse;
uniform vec4 u_emission;
uniform vec4 u_specular;
uniform float u_shininess;
uniform float u_transparency;
uniform vec3 u_light0Color;
uniform vec3 u_light1Color;
uniform vec3 u_light1Attenuation;
uniform vec3 u_light2Color;
uniform vec3 u_light2Attenuation;
varying vec3 v_position;
varying vec3 v_normal;
varying vec2 v_texcoord0;
varying vec3 v_light1Position;
varying vec3 v_light2Position;
void main(void) {
    vec3 normal = normalize(v_normal);
    vec4 diffuse = texture2D(u_diffuse, v_texcoord0);
    vec3 diffuseLight = vec3(0.0, 0.0, 0.0);
    vec3 specular = u_specular.rgb;
    vec3 specularLight = vec3(0.0, 0.0, 0.0);
    vec3 emission = u_emission.rgb;
    vec3 ambient = texture2D(u_ambient, v_texcoord0).rgb;
    vec3 viewDir = -normalize(v_position);
    vec3 ambientLight = vec3(0.0, 0.0, 0.0);
    {
        ambientLight += u_light0Color;
    }
    {
    vec3 VP = v_light1Position - v_position;
    vec3 l = normalize(VP);
    float range = length(VP);
    float attenuation = 1.0 / (u_light1Attenuation.x + (u_light1Attenuation.y * range) + (u_light1Attenuation.z * range * range));
    diffuseLight += u_light1Color * max(dot(normal, l), 0.) * attenuation;
    vec3 h = normalize(l + viewDir);
    float specularIntensity = max(0., pow(max(dot(normal, h), 0.), u_shininess)) * attenuation;
    specularLight += u_light1Color * specularIntensity;
    }
    {
    vec3 VP = v_light2Position - v_position;
    vec3 l = normalize(VP);
    float range = length(VP);
    float attenuation = 1.0 / (u_light2Attenuation.x + (u_light2Attenuation.y * range) + (u_light2Attenuation.z * range * range));
    diffuseLight += u_light2Color * max(dot(normal, l), 0.) * attenuation;
    vec3 h = normalize(l + viewDir);
    float specularIntensity = max(0., pow(max(dot(normal, h), 0.), u_shininess)) * attenuation;
    specularLight += u_light2Color * specularIntensity;
    }
    vec3 color = vec3(0.0, 0.0, 0.0);
    color += diffuse.rgb * diffuseLight;
    color += specular * specularLight;
    color += emission;
    color += ambient * ambientLight;
    gl_FragColor = vec4(color * diffuse.a * u_transparency, diffuse.a * u_transparency);
}