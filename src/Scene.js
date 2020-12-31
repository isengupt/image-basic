import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { vertex } from "./shaders/vertex";
import { fragment } from "./shaders/fragment";
import img1 from "./img/img2.jpg";
import img2 from "./img/img2.jpg";
import img3 from "./img/img3.jpg";
import disp from "./img/disp3.jpg";
import text from "./img/text.png";

class Font extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }
  componentDidMount() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.progress = 0.5;
    this.container = document.getElementById("scene");
    this.raycaster = new THREE.Raycaster();
    this.mount.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.001,
      1000
    );

    this.camera.position.set(0, 0, 1);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;
    this.setupResize();
    this.addObjects();
    this.animate();

    this.resize();

    this.mouseEvents();
  }

  mouseEvents() {
    let that = this;
    this.mouse = new THREE.Vector2();

    function onMouseMove(event) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components

      that.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      that.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


      that.raycaster.setFromCamera( that.mouse, that.camera );

      
      const intersects = that.raycaster.intersectObjects( that.scene.children );
    
      if (intersects.length > 0) {
that.material.uniforms.mouse.value =   intersects[0].point
      }
  
      /* 
      for ( let i = 0; i < intersects.length; i ++ ) {
    
        intersects[ i ].object.material.color.set( 0xff0000 );
    
      } */
    }

   

    window.addEventListener("mousemove", onMouseMove, false);
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        progress: { type: "f", value: 0 },
        mouse: {type: 'v3', value: new THREE.Vector3()},
        image: { type: "t", value: new THREE.TextureLoader().load(img1) },
        text: { type: "t", value: new THREE.TextureLoader().load(text) },
        displacement: {
          type: "t",
          value: new THREE.TextureLoader().load(disp),
        },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.plane);
  }

  setupResize = () => {
    window.addEventListener("resize", this.resize);
  };

  resize = () => {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    console.log("resize");

    this.imageAspect = 853 / 1280;
    /* 
    let a1;
    let a2;

    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    const dist = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2* (180/Math.PI) * Math.atan(height/(2*dist));

    if (this.width / this.height > 1) {
      this.plane.scale.x = this.camera.aspect;
    } else {
      this.plane.scale.y = 1 / this.camera.aspect;
    }  */

    this.camera.updateProjectionMatrix();
    console.log(this.camera);
  };

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.progress.value = this.progress;

    this.frameId = requestAnimationFrame(this.animate);

    this.renderScene();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div
        id="scene"
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Font;
