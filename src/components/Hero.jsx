import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';


const Hero = () => {
  const canvasRef = useRef(null);
  const [activity, setActivity] = useState([
    { type: 'O+', dist: '1.2km', city: 'Bengaluru', time: '2 min ago' },
    { type: 'AB−', dist: '3.8km', city: 'Mumbai', time: '4 min ago' },
    { type: 'B+', dist: '0.8km', city: 'Delhi', time: '7 min ago' },
    { type: 'A−', dist: '2.4km', city: 'Chennai', time: '11 min ago' }
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xFBFAF9, 0.08);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    window.addEventListener('resize', resize);

    // --- CENTRAL BALL (COLOR MATCHED TO BUTTON) ---
    const clusterCount = 2000;
    const clusterGeo = new THREE.BufferGeometry();
    const cPos = new Float32Array(clusterCount * 3);
    const cCol = new Float32Array(clusterCount * 3);
    const cSize = new Float32Array(clusterCount);

    for (let i = 0; i < clusterCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.max(0.1, 0.8 + (Math.random() - 0.5) * 0.4); 
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      cPos[i*3] = x; cPos[i*3+1] = y; cPos[i*3+2] = z;
      
      // Color palette matching the "Request blood" button (Vermillion #E63946 to Vermillion-Bright #FF4D5A)
      const dist = Math.sqrt(x*x + y*y + z*z);
      const t = Math.min(dist / 1.2, 1);
      cCol[i*3]     = 0.90 + t * 0.10;   // R: 0.90 to 1.0
      cCol[i*3+1]   = 0.22 + t * 0.08;   // G: 0.22 to 0.30
      cCol[i*3+2]   = 0.27 + t * 0.08;   // B: 0.27 to 0.35
      cSize[i] = Math.random() * 2.0 + 0.5;
    }

    clusterGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
    clusterGeo.setAttribute('aColor', new THREE.BufferAttribute(cCol, 3));
    clusterGeo.setAttribute('aSize', new THREE.BufferAttribute(cSize, 1));

    const clusterMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPulse: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() } },
      vertexShader: `
        attribute vec3 aColor; attribute float aSize;
        uniform float uTime; uniform float uPulse; uniform float uPixelRatio;
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vColor = aColor; vec3 pos = position;
          float wave = sin(uTime * 0.5 + length(position) * 3.0) * 0.04;
          pos *= 1.0 + wave;
          pos *= 1.0 + uPulse * 0.25; 
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * uPixelRatio * (240.0 / max(0.1, -mvPos.z));
          gl_Position = projectionMatrix * mvPos;
          vAlpha = 1.0 - smoothstep(0.7, 1.2, length(pos));
        }
      `,
      fragmentShader: `
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          a = pow(a, 1.5);
          gl_FragColor = vec4(vColor, a * vAlpha * 1.2);
        }
      `,
      transparent: true, depthWrite: false, blending: THREE.NormalBlending
    });
    const cluster = new THREE.Points(clusterGeo, clusterMat);
    scene.add(cluster);

    // --- TINY DONOR NODES ---
    const donorCount = 36;
    const donorGroup = new THREE.Group();
    const donors = [];
    const donorColors = [new THREE.Color(0xE63946), new THREE.Color(0xF4A261), new THREE.Color(0xC1121F)];

    for (let i = 0; i < donorCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / donorCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = Math.max(0.1, 2.0 + Math.random() * 0.6); 
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      const isActive = Math.random() > 0.4;
      const color = isActive ? donorColors[0] : (Math.random() > 0.5 ? donorColors[1] : donorColors[2]);
      const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: isActive ? 0.9 : 0.5 });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(x, y, z);
      node.userData = { isActive, basePos: new THREE.Vector3(x, y, z), phase: Math.random() * Math.PI * 2 };
      donorGroup.add(node);
      donors.push(node);
      if (isActive) {
        const glowGeo = new THREE.SphereGeometry(0.18, 16, 16); 
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xE63946, transparent: true, opacity: 0.15, blending: THREE.NormalBlending, depthWrite: false });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.copy(node.position);
        node.userData.glow = glow;
        donorGroup.add(glow);
      }
    }
    scene.add(donorGroup);

    // --- CONNECTIONS ---
    const activeDonors = donors.filter(d => d.userData.isActive);
    const linePos = [], lineCol = [];
    activeDonors.forEach(d => {
      linePos.push(d.position.x, d.position.y, d.position.z, 0, 0, 0);
      lineCol.push(0.9, 0.22, 0.27, 0.9, 0.22, 0.27); // Matched to vermillion
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineCol, 3));
    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.3, blending: THREE.NormalBlending, depthWrite: false });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // --- FLOW PARTICLES ---
    const flowCount = activeDonors.length * 4;
    const flowGeo = new THREE.BufferGeometry();
    const flowPos = new Float32Array(flowCount * 3);
    const flowData = [];
    for (let i = 0; i < flowCount; i++) {
      flowData.push({ donor: activeDonors[i % activeDonors.length], progress: Math.random(), speed: 0.003 + Math.random() * 0.005 });
    }
    flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
    const flowMat = new THREE.PointsMaterial({ color: 0xFF4D5A, size: 0.08, transparent: true, opacity: 0.9, blending: THREE.NormalBlending, depthWrite: false, sizeAttenuation: true });
    const flowParticles = new THREE.Points(flowGeo, flowMat);
    scene.add(flowParticles);

    // --- BACKGROUND DUST ---
    const dustCount = 400;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i*3] = (Math.random() - 0.5) * 28;
      dustPos[i*3 + 1] = (Math.random() - 0.5) * 28;
      dustPos[i*3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xD1C7C0, size: 0.03, transparent: true, opacity: 0.5, blending: THREE.NormalBlending, depthWrite: false });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();
    let animFrameId;

    const animate = () => {
      const t = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      const beatCycle = (t * 1.2) % 1;
      let heartbeat = 0;
      if (beatCycle < 0.08) heartbeat = Math.sin(beatCycle * Math.PI / 0.08);
      else if (beatCycle > 0.15 && beatCycle < 0.22) heartbeat = Math.sin((beatCycle - 0.15) * Math.PI / 0.07) * 0.6;

      clusterMat.uniforms.uTime.value = t;
      clusterMat.uniforms.uPulse.value = heartbeat;
      cluster.rotation.y = t * 0.08;
      cluster.rotation.x = mouse.y * 0.15;
      cluster.rotation.z = mouse.x * 0.05;

      donorGroup.rotation.y = t * 0.04 + mouse.x * 0.25;
      donorGroup.rotation.x = -mouse.y * 0.18;

      donors.forEach(d => {
        const offset = Math.sin(t * 0.7 + d.userData.phase) * 0.06;
        const dir = d.userData.basePos.clone().normalize();
        d.position.copy(d.userData.basePos).add(dir.multiplyScalar(offset));
        if (d.userData.glow) {
          d.userData.glow.position.copy(d.position);
          d.userData.glow.scale.setScalar(1 + Math.sin(t * 1.5 + d.userData.phase) * 0.2 + heartbeat * 0.3);
        }
      });

      const lp = lineGeo.attributes.position.array;
      activeDonors.forEach((d, i) => {
        lp[i*6] = d.position.x; lp[i*6 + 1] = d.position.y; lp[i*6 + 2] = d.position.z;
      });
      lineGeo.attributes.position.needsUpdate = true;
      lineMat.opacity = 0.2 + heartbeat * 0.4;

      const fp = flowGeo.attributes.position.array;
      flowData.forEach((fd, i) => {
        fd.progress += fd.speed;
        if (fd.progress > 1) fd.progress = 0;
        const p = fd.progress;
        fp[i*3] = fd.donor.position.x * (1 - p);
        fp[i*3 + 1] = fd.donor.position.y * (1 - p);
        fp[i*3 + 2] = fd.donor.position.z * (1 - p);
      });
      flowGeo.attributes.position.needsUpdate = true;

      dust.rotation.y = t * 0.015;
      dust.rotation.x = mouse.y * 0.05;
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      clusterGeo.dispose();
      clusterMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      flowGeo.dispose();
      flowMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['O−','O+','A−','A+','B−','B+','AB−','AB+'];
      const cities = ['Bengaluru','Mumbai','Delhi','Chennai','Hyderabad','Pune','Kolkata','Ahmedabad'];
      const newActivity = Array.from({ length: 4 }).map(() => ({
        type: types[Math.floor(Math.random() * types.length)],
        dist: `${(Math.random() * 5 + 0.5).toFixed(1)}km`,
        city: cities[Math.floor(Math.random() * cities.length)],
        time: `${Math.floor(Math.random() * 14) + 1} min ago`
      }));
      setActivity(newActivity);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const Counter = ({ target, unit }) => {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2200;
          const start = performance.now();
          const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setVal(Math.floor(target * eased));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.unobserve(ref.current);
        }
      }, { threshold: 0.5 });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }, [target]);

    return <div ref={ref} className="font-display font-medium text-3xl md:text-4xl text-fg tracking-tight leading-none">{val.toLocaleString()}{unit && <span className="text-lg text-vermillion ml-1">{unit}</span>}</div>;
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20">
      <canvas ref={canvasRef} className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-[1]" />
      
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{background: 'linear-gradient(to right, rgba(251, 250, 249, 0.98) 40%, rgba(251, 250, 249, 0.5) 70%, transparent 100%)'}}></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 w-full relative z-10">
        <div className="w-full lg:w-1/2 lg:pr-8 text-center lg:text-left">
          <h1 className="font-display font-light text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-fg mb-8">
            When seconds decide, the <span className="bg-gradient-to-br from-vermillion-bright to-oxblood bg-clip-text text-transparent font-extrabold">network</span> <em className="italic font-medium text-vermillion">responds.</em>
          </h1>
          
          <div className="flex gap-4 items-center justify-center lg:justify-start flex-wrap mb-16">
            <a href="#emergency" className="btn-magnetic group inline-flex items-center gap-2 bg-vermillion text-white px-7 py-4 text-base font-medium border border-vermillion hover:bg-vermillion-bright hover:border-vermillion-bright transition-colors relative overflow-hidden shadow-lg shadow-vermillion/20">
              <i className="fa-solid fa-triangle-exclamation"></i> Request blood
              <i className="fa-solid fa-arrow-right ml-1 transition-transform group-hover:translate-x-1"></i>
            </a>
            <a href="#donor" className="btn-magnetic inline-flex items-center gap-2 bg-white text-fg px-7 py-4 text-base font-medium border border-line-strong hover:border-fg transition-colors shadow-sm">
              Join as donor <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          
          <div className="grid grid-cols-3 gap-8 md:gap-12 pt-8 border-t border-line max-w-[600px] mx-auto lg:mx-0">
            <div>
              <Counter target={47284} />
              <div className="text-xs text-muted uppercase tracking-wider mt-2">Verified donors</div>
            </div>
            <div>
              <Counter target={84} unit="s" />
              <div className="text-xs text-muted uppercase tracking-wider mt-2">Avg. match time</div>
            </div>
            <div>
              <Counter target={2341} />
              <div className="text-xs text-muted uppercase tracking-wider mt-2">Lives · this month</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-muted flex flex-col items-center gap-3 z-10">
        Scroll
        <span className="w-px h-10 bg-gradient-to-b from-vermillion to-transparent animate-scroll-line"></span>
      </div>
    </section>
  );
};

export default Hero;