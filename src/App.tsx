import { useEffect, useState } from "react";
import "./App.css";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* https://github.com/WorldHacksInc/world-hacks-inc-hp/blob/main/src/components/TopPage/Main/Main.tsx */

function App() {
  let canvas: HTMLCanvasElement;
  let model: THREE.Group;

  useEffect(() => {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const sizes = {
      width: innerWidth,
      height: innerHeight,
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(-7.8, 3, 17);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    //OrbitControls
    // const controls = new OrbitControls(camera, renderer.domElement);
    // console.log(controls);
    // //滑らかにカメラコントローラーを制御する
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.2;
    // controls.target.set(0, 0, 0);

    //GLTGLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    console.log(dracoLoader);

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let mixer: THREE.AnimationMixer;
    gltfLoader.load("./models/dog.gltf", (gltf) => {
      model = gltf.scene;
      model.scale.set(0.14, 0.14, 0.14);
      model.rotation.y = -Math.PI / 4;
      model.rotation.x = Math.PI / 6;
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;
      clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.play();
      });
    });

    //アニメーション
    let previousTime: number = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const elpasedTime = clock.getElapsedTime();
      const deltaTime = elpasedTime - previousTime;
      previousTime = elpasedTime;
      if (model) {
        // model.rotation.set(elpasedTime * 0, -elpasedTime * 0.2, 0);
      }

      if (mixer) {
        mixer.update(deltaTime * 0.8);
      }

      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();

    // ライト
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(-9, 6, 6);
    scene.add(pointLight);

    // ブラウザのリサイズ処理
    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      THREE.Cache.clear(); //不明
    });
  }, []);

  return (
    <>
      <canvas id="canvas" className="canvas"></canvas>
      <div className="mainContent">
        <h3>Shin Code</h3>
        <p>WebDeveloper</p>
      </div>
    </>
  );
}

export default App;
