import { useGLTF, OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { CuboidCollider, RigidBody, Physics } from '@react-three/rapier'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Experience() {
    const [hitSound] = useState(() => new Audio('./hit.mp3'))

    // De cube wordt gebruikt bij het refereren naar de RigidBody. Nu kan je bij de attributen. 
    const cube = useRef()
    const twister = useRef()

    const hamburger = useGLTF('./hamburger.glb')

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        const eulerRotation = new THREE.Euler(0, time, 0)
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)
        twister.current.setNextKinematicRotation(quaternionRotation)
    })

    const collisionEnter = () => {
        hitSound.currentTime = 0
        hitSound.volume = Math.random()
        hitSound.play()
    }

    const cubeJump = () => {
        // Impulse wordt gebruikt voor korte krachten, zoals een pijl die vliegt. Addforce is voor sterkere langere zoals de wind.
        // De cube verticaal laten springen
        cube.current.applyImpulse({ x: 0, y: 5, z: 0 })

        // De cube verticaal laten draaien
        cube.current.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 })
    }


    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />

        <Physics debug gravity={[0, - 9.81, 0]}>

            <RigidBody colliders="hull" position={[0, 4, 0]}>
                <primitive object={hamburger.scene} scale={0.25} />
            </RigidBody>

            <RigidBody colliders="ball" position={[- 1.5, 2, 0]}>
                <mesh castShadow>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={twister}
                position={[0, - 0.8, 0]}
                friction={0}
                type="kinematicPosition"
                onCollisionEnter={collisionEnter}
            >
                <mesh castShadow scale={[0.4, 0.4, 3]}>
                    <boxGeometry />
                    <meshStandardMaterial color="red" />
                </mesh>
            </RigidBody>

            <RigidBody ref={cube} position={[2, 2, 0]} restitution={1}>
                <mesh castShadow onClick={cubeJump}>
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                    <CuboidCollider mass={2} args={[0.5, 0.5, 0.5]} />
                </mesh>
            </RigidBody>

            <RigidBody type="fixed">
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, - 5.5]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[- 5.5, 1, 0]} />
            </RigidBody>

            <RigidBody type="fixed">
                <mesh receiveShadow position-y={- 1.25}>
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

        </Physics>
    </>
}