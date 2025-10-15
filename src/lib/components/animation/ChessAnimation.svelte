<script>
  import { onMount } from 'svelte';
  
  let container;

  onMount(() => {
const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, transparent: true });
        renderer.setClearColor(0x000000, 0.8);
        renderer.setClearAlpha(0.8);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement); // container는 div 요소입니다

        const chessPiecesGroup = new THREE.Group();
        scene.add(chessPiecesGroup);

        camera.position.set(0, 20, 50);
        camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
        light1.position.set(20, 20, 20);
        light1.castShadow = true;
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
        light2.position.set(-20, 20, -20);
        scene.add(light2);

        const pawnPts = [
            new THREE.Vector2(0.0, 0.69),
            new THREE.Vector2(0.18, 0.69),
            new THREE.Vector2(0.2, 0.69),
            new THREE.Vector2(0.2, 0.68),
            new THREE.Vector2(0.2, 0.65),
            new THREE.Vector2(0.2, 0.64),
            new THREE.Vector2(0.19, 0.64),
            new THREE.Vector2(0.12, 0.64),
            new THREE.Vector2(0.12, 0.41),
            new THREE.Vector2(0.15, 0.35),
            new THREE.Vector2(0.15, 0.35),
            new THREE.Vector2(0.162, 0.32),
            new THREE.Vector2(0.195, 0.29),
            new THREE.Vector2(0.23, 0.27),
            new THREE.Vector2(0.24, 0.255),
            new THREE.Vector2(0.24, 0.25),
            new THREE.Vector2(0.24, 0.225),
            new THREE.Vector2(0.25, 0.22),
            new THREE.Vector2(0.26, 0.19),
            new THREE.Vector2(0.35, 0.12),
            new THREE.Vector2(0.4, 0.11),
            new THREE.Vector2(0.4, 0.1),
            new THREE.Vector2(0.4, 0.05),
            new THREE.Vector2(0.4, 0.045),
            new THREE.Vector2(0.35, 0.05),
            new THREE.Vector2(0.36, 0.029),
            new THREE.Vector2(0.366, 0.02),
            new THREE.Vector2(0, 0)
        ];

        const queenPts = [
            new THREE.Vector2(0.171, 0.724),
            new THREE.Vector2(11.368, 3.368),
            new THREE.Vector2(18.932, 7.799),
            new THREE.Vector2(25.208, 21.171),
            new THREE.Vector2(25.208, 28.876),
            new THREE.Vector2(22.984, 36.093),
            new THREE.Vector2(15.541, 45.84),
            new THREE.Vector2(10.583, 48.071),
            new THREE.Vector2(14.797, 49.558),
            new THREE.Vector2(22.729, 57.987),
            new THREE.Vector2(27.856, 68.398),
            new THREE.Vector2(29.174, 80.296),
            new THREE.Vector2(48.758, 75.339),
            new THREE.Vector2(52.228, 75.339),
            new THREE.Vector2(58.673, 81.289),
            new THREE.Vector2(60.41, 86.742),
            new THREE.Vector2(59.417, 91.699),
            new THREE.Vector2(51.485, 95.171),
            new THREE.Vector2(46.031, 100.128),
            new THREE.Vector2(39.833, 117.977),
            new THREE.Vector2(43.429, 134.089),
            new THREE.Vector2(47.271, 140.782),
            new THREE.Vector2(50.617, 142.518),
            new THREE.Vector2(54.335, 148.22),
            new THREE.Vector2(51.732, 155.036),
            new THREE.Vector2(47.271, 156.772),
            new THREE.Vector2(44.792, 157.888),
            new THREE.Vector2(46.62, 159.122),
            new THREE.Vector2(54.438, 160.998),
            new THREE.Vector2(58.816, 170.38),
            new THREE.Vector2(57.878, 177.261),
            new THREE.Vector2(47.558, 181.638),
            new THREE.Vector2(35.987, 181.638),
            new THREE.Vector2(30.358, 186.642),
            new THREE.Vector2(27.856, 229.792),
            new THREE.Vector2(29.227, 259.498),
            new THREE.Vector2(35.394, 290.498),
            new THREE.Vector2(42.207, 309.212),
            new THREE.Vector2(43.456, 312.863),
            new THREE.Vector2(48.562, 312.903),
            new THREE.Vector2(62.056, 313.433),
            new THREE.Vector2(63.599, 315.417),
            new THREE.Vector2(62.277, 318.502),
            new THREE.Vector2(59.192, 323.791),
            new THREE.Vector2(59.192, 328.044),
            new THREE.Vector2(64.294, 333.147),
            new THREE.Vector2(79.603, 341.82),
            new THREE.Vector2(88.959, 354.919),
            new THREE.Vector2(90.745, 364.614),
            new THREE.Vector2(88.109, 372.439),
            new THREE.Vector2(84.536, 377.37),
            new THREE.Vector2(91.679, 377.37),
            new THREE.Vector2(95.592, 379.921),
            new THREE.Vector2(96.953, 384.174),
            new THREE.Vector2(96.273, 410.199),
            new THREE.Vector2(95.082, 416.323),
            new THREE.Vector2(89.639, 416.323),
            new THREE.Vector2(0.171, 417.137)
        ];

        queenPts.forEach(function(v) {
            v.x /= 250;
            v.y /= -250;
            v.y += 1.6;
        });

        const bishopPts = [
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(0.35, 0.05),
            new THREE.Vector2(0.4, 0.1),
            new THREE.Vector2(0.35, 0.15),
            new THREE.Vector2(0.25, 0.25),
            new THREE.Vector2(0.2, 0.35),
            new THREE.Vector2(0.15, 0.45),
            new THREE.Vector2(0.12, 0.55),
            new THREE.Vector2(0.15, 0.65),
            new THREE.Vector2(0.18, 0.75),
            new THREE.Vector2(0.15, 0.85),
            new THREE.Vector2(0.12, 0.95),
            new THREE.Vector2(0.08, 1.05),
            new THREE.Vector2(0.1, 1.15),
            new THREE.Vector2(0.15, 1.25),
            new THREE.Vector2(0.12, 1.35),
            new THREE.Vector2(0.08, 1.4),
            new THREE.Vector2(0.0, 1.45)
        ];

        const knightPts = [
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(0.35, 0.05),
            new THREE.Vector2(0.4, 0.1),
            new THREE.Vector2(0.35, 0.2),
            new THREE.Vector2(0.25, 0.3),
            new THREE.Vector2(0.2, 0.4),
            new THREE.Vector2(0.15, 0.5),
            new THREE.Vector2(0.18, 0.6),
            new THREE.Vector2(0.25, 0.7),
            new THREE.Vector2(0.3, 0.8),
            new THREE.Vector2(0.35, 0.9),
            new THREE.Vector2(0.4, 1.0),
            new THREE.Vector2(0.38, 1.1),
            new THREE.Vector2(0.32, 1.2),
            new THREE.Vector2(0.28, 1.3),
            new THREE.Vector2(0.2, 1.35),
            new THREE.Vector2(0.1, 1.4),
            new THREE.Vector2(0.0, 1.45)
        ];

        const rookPts = [
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(0.35, 0.05),
            new THREE.Vector2(0.4, 0.1),
            new THREE.Vector2(0.35, 0.2),
            new THREE.Vector2(0.25, 0.4),
            new THREE.Vector2(0.2, 0.6),
            new THREE.Vector2(0.18, 0.8),
            new THREE.Vector2(0.2, 1.0),
            new THREE.Vector2(0.25, 1.1),
            new THREE.Vector2(0.3, 1.15),
            new THREE.Vector2(0.3, 1.25),
            new THREE.Vector2(0.25, 1.3),
            new THREE.Vector2(0.3, 1.35),
            new THREE.Vector2(0.25, 1.4),
            new THREE.Vector2(0.3, 1.45),
            new THREE.Vector2(0.0, 1.45)
        ];

        const kingPts = [
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(0.35, 0.05),
            new THREE.Vector2(0.4, 0.1),
            new THREE.Vector2(0.35, 0.2),
            new THREE.Vector2(0.25, 0.4),
            new THREE.Vector2(0.2, 0.6),
            new THREE.Vector2(0.18, 0.8),
            new THREE.Vector2(0.2, 1.0),
            new THREE.Vector2(0.25, 1.2),
            new THREE.Vector2(0.22, 1.3),
            new THREE.Vector2(0.18, 1.4),
            new THREE.Vector2(0.15, 1.5),
            new THREE.Vector2(0.12, 1.6),
            new THREE.Vector2(0.08, 1.65),
            new THREE.Vector2(0.0, 1.7)
        ];

        function revolve(pts, segments) {
            const vertices = [];
            const indices = [];
            const normals = [];
            
            // 정점 생성
            for (let s = 0; s < segments; s++) {
                const theta = s / segments * Math.PI * 2;
                const rx = Math.cos(theta);
                const rz = -Math.sin(theta);
                
                for (let i = 0; i < pts.length; i++) {
                    vertices.push(pts[i].x * rx, pts[i].y, pts[i].x * rz);
                }
            }

            // 면 인덱스 생성
            for (let p = 0; p < pts.length - 1; p++) {
                for (let i = 0; i < segments; i++) {
                    const next = (i + 1) % segments;
                    
                    const a = i * pts.length + p;
                    const b = i * pts.length + p + 1;
                    const c = next * pts.length + p;
                    const d = next * pts.length + p + 1;
                    
                    indices.push(a, b, c);
                    indices.push(d, c, b);
                }
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setIndex(indices);
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.computeVertexNormals();
            
            return geometry;
        }

        const chessPieces = [];
        const whiteMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            flatShading: false,
            shininess: 13,
            specular: 0xffffff
        });
        const blackMaterial = new THREE.MeshPhongMaterial({
            color: 0x202020,
            flatShading: false,
            shininess: 140,
            specular: 0x101010
        });

        // 폰 생성 (구체 추가)
        const pawnGeo = revolve(pawnPts, 32);
        const sphereGeo = new THREE.SphereGeometry(0.19, 18, 18);
        sphereGeo.translate(0, 0.84, 0);
        
        // BufferGeometry 병합을 위한 새로운 방식
        const mergedGeo = new THREE.BufferGeometry();
        const pawnVertices = pawnGeo.getAttribute('position').array;
        const sphereVertices = sphereGeo.getAttribute('position').array;
        
        const totalVertices = new Float32Array(pawnVertices.length + sphereVertices.length);
        totalVertices.set(pawnVertices);
        totalVertices.set(sphereVertices, pawnVertices.length);
        
        const pawnIndices = pawnGeo.getIndex().array;
        const sphereIndices = sphereGeo.getIndex().array;
        const vertexOffset = pawnVertices.length / 3;
        
        const totalIndices = new Uint32Array(pawnIndices.length + sphereIndices.length);
        totalIndices.set(pawnIndices);
        for (let i = 0; i < sphereIndices.length; i++) {
            totalIndices[pawnIndices.length + i] = sphereIndices[i] + vertexOffset;
        }
        
        mergedGeo.setAttribute('position', new THREE.BufferAttribute(totalVertices, 3));
        mergedGeo.setIndex(new THREE.BufferAttribute(totalIndices, 1));
        mergedGeo.computeVertexNormals();

        // 퀸 생성
        const queenGeo = revolve(queenPts, 32);
        queenGeo.computeFaceNormals();
        queenGeo.computeVertexNormals();

        const bishopGeo = revolve(bishopPts, 32);
        const knightGeo = revolve(knightPts, 32);
        const rookGeo = revolve(rookPts, 32);
        const kingGeo = revolve(kingPts, 32);

        const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
        
        for (let layer = 0; layer < 3; layer++) {
            for (let i = 0; i < 8; i++) {
                const pieceType = pieceTypes[i % 6];
                let geometry;
                
                switch(pieceType) {
                    case 'pawn':
                        geometry = mergedGeo.clone();
                        break;
                    case 'rook':
                        geometry = rookGeo;
                        break;
                    case 'knight':
                        geometry = knightGeo;
                        break;
                    case 'bishop':
                        geometry = bishopGeo;
                        break;
                    case 'queen':
                        geometry = queenGeo;
                        break;
                    case 'king':
                        geometry = kingGeo;
                        break;
                }
                
                const material = (layer + i) % 2 === 0 ? whiteMaterial : blackMaterial;
                
                const piece = new THREE.Mesh(geometry, material);
                piece.castShadow = true;
                piece.receiveShadow = true;
                
                // 크기를 4배로 확대
                const scale = 4;
                piece.scale.set(scale, scale, scale);
                
                const totalIndex = layer * 8 + i;
                const angle = (totalIndex / 24) * Math.PI * 2;
                const radius = 25 + layer * 12;
                piece.position.x = Math.cos(angle) * radius;
                piece.position.z = Math.sin(angle) * radius;
                piece.position.y = Math.sin(totalIndex * 0.5) * 8 + layer * 6;
                
                piece.userData = { 
                    originalPosition: piece.position.clone(),
                    index: totalIndex,
                    layer: layer,
                    pieceType: pieceType
                };
                
                chessPiecesGroup.add(piece);
                chessPieces.push(piece);
            }
        }

        // 애니메이션 변수
        let time = 0;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.005;

            chessPiecesGroup.rotation.y = time * 0.2;

            // 각 체스 말을 복잡한 3D 궤도로 움직임
            chessPieces.forEach((piece, index) => {
                const animTime = time + index * Math.PI / 12;
                const layer = piece.userData.layer;
                const baseRadius = 25 + layer * 12;
                
                switch(index % 6) {
                    case 0: // 원형 궤도
                        piece.position.x = Math.cos(animTime * 0.8) * (baseRadius + Math.sin(animTime * 0.4) * 4);
                        piece.position.z = Math.sin(animTime * 0.8) * (baseRadius + Math.sin(animTime * 0.4) * 4);
                        piece.position.y = Math.sin(animTime * 1.5) * 6 + layer * 6;
                        break;
                    case 1: // 타원형 궤도
                        piece.position.x = Math.cos(animTime * 0.6) * (baseRadius + 3);
                        piece.position.z = Math.sin(animTime * 0.6) * (baseRadius - 2);
                        piece.position.y = Math.cos(animTime * 1.2) * 8 + layer * 6;
                        break;
                    case 2: // 8자형 궤도
                        piece.position.x = Math.sin(animTime * 0.5) * baseRadius;
                        piece.position.z = Math.sin(animTime * 1.0) * baseRadius;
                        piece.position.y = Math.cos(animTime * 0.7) * 10 + layer * 6;
                        break;
                    case 3: // 나선형 궤도
                        const radius = baseRadius + Math.sin(animTime * 0.3) * 5;
                        piece.position.x = Math.cos(animTime * 0.9) * radius;
                        piece.position.z = Math.sin(animTime * 0.9) * radius;
                        piece.position.y = Math.sin(animTime * 0.4) * 12 + layer * 6;
                        break;
                    case 4: // 복잡한 3D 궤도
                        piece.position.x = Math.cos(animTime * 0.4) * (baseRadius + Math.sin(animTime * 1.3) * 6);
                        piece.position.z = Math.sin(animTime * 0.4) * (baseRadius + Math.cos(animTime * 1.3) * 6);
                        piece.position.y = Math.sin(animTime * 0.8) * 8 + Math.cos(animTime * 2.2) * 4 + layer * 6;
                        break;
                    case 5: // 구형 궤도
                        const phi = animTime * 0.6;
                        const theta = animTime * 1.1;
                        const r = baseRadius;
                        piece.position.x = r * Math.sin(phi) * Math.cos(theta);
                        piece.position.y = r * Math.cos(phi) + layer * 6;
                        piece.position.z = r * Math.sin(phi) * Math.sin(theta);
                        break;
                }
                
                // 자체 회전
                piece.rotation.y = animTime * (0.3 + index * 0.02);
                piece.rotation.x = Math.sin(animTime + index) * 0.2;
            });

            renderer.render(scene, camera);
        }

        // 윈도우 리사이즈 처리
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 애니메이션 시작
        animate();

            return () => {
      window.removeEventListener('resize', handleResize);
      // Three.js 리소스 정리
      renderer.dispose();
      chessPieces.forEach(piece => {
        piece.geometry.dispose();
        piece.material.dispose();
      });
    };
  });

  console.log('ChessAnimation component loaded');
</script>

<div class="animation-container" bind:this={container}>
</div>
<style>
.animation-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0; /* 필요시 조정 */
  pointer-events: none; /* 애니메이션 위에 버튼 클릭 가능하게 */
}
</style>