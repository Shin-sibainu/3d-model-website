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
    camera.position.set(-0.5, -0.2, 1);

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

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load("./models/shiba.gltf", (gltf) => {
      model = gltf.scene;
      model.scale.set(0.64, 0.64, 0.64);
      model.rotation.y = -Math.PI / 3;
      scene.add(model);
    });

    //アニメーション
    let previousTime: number = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      const elpasedTime = clock.getElapsedTime();
      const deltaTime = elpasedTime - previousTime;
      if (model) {
        model.rotation.set(elpasedTime * 0, -elpasedTime * 0.2, 0);
      }
      renderer.render(scene, camera);

      window.requestAnimationFrame(tick);
    };

    tick();

    // ライト
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.7);
    pointLight.position.set(1, 1, 1);
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
        <span>3DModel Website</span>
      </div>
    </>
  );
}

export default App;
