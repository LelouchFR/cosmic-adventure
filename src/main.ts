import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Data from './data.json' assert {type: 'json'};

interface Styler extends HTMLElement {
  style: CSSStyleDeclaration
}

interface ButtonColors {
  Button1Color: string;
  Button2Color: string;
  Button3Color: string;
}

let Button1 = document.querySelector(".c1") as Styler, Button2 = document.querySelector(".c2") as Styler, Button3 = document.querySelector(".c3") as Styler;
let Answer1 = document.querySelector(".Q1") as Styler, Answer2 = document.querySelector(".Q2") as Styler, Answer3 = document.querySelector(".Q3") as Styler;

function CssJS(NUM: string, Mode: string = "toJS"): string {
	return Mode === "toCSS" ? NUM.replace("0x", '#') : NUM;
}

let counter: number = 0;
let BtnCounter: number = 0;
let Button1Color: string, Button2Color: string, Button3Color: string;

// Putting color for the buttons displayed on the screen (translated from '0x' to '#')
function ButtonColor(): ButtonColors {
	if (Data !== undefined && Data.Questions !== undefined) {
		if (BtnCounter >= 0 && BtnCounter < Data.Questions.length) {
			Button1Color = Data.Questions[BtnCounter].colors[0];
			Button2Color = Data.Questions[BtnCounter].colors[1];
			Button3Color = Data.Questions[BtnCounter].colors[2];

			// Style the css background of the buttons
        	Button1.style.backgroundColor = CssJS(Button1Color, "toCSS");
        	Button2.style.backgroundColor = CssJS(Button2Color, "toCSS");
        	Button3.style.backgroundColor = CssJS(Button3Color, "toCSS");
		} else {
			BtnCounter = -1;
		}
	} else {
		console.error("The Data object is undefined or does not have the Questions property");
	}
	BtnCounter++;
	return { Button1Color, Button2Color, Button3Color };
}

// Put the choices at the screen
let Choices: string[] = [];
function QuestionLoader(): ButtonColors {
	const { Button1Color, Button2Color, Button3Color }: ButtonColors = ButtonColor();
	if (counter >= Data.Questions.length) {
		(document.querySelector(".Choice") as HTMLElement)?.remove();
	} else {
		Answer1.innerHTML = Data.Questions[counter].Answer1;
		Answer2.innerHTML = Data.Questions[counter].Answer2;
		Answer3.innerHTML = Data.Questions[counter].Answer3;
	}
	counter++;
	return { Button1Color, Button2Color, Button3Color };
}

const scene: THREE.Scene = new THREE.Scene();

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#bg") as HTMLCanvasElement
});

const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);

// Settings de la camera
function CameraRenderer(): void {
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.position.set(33, 15, 33);
	renderer.render(scene, camera);
}

let geometry: THREE.BoxGeometry[] = [
	new THREE.BoxGeometry(10, 50, 10), new THREE.BoxGeometry(10, 40, 10), new THREE.BoxGeometry(10, 30, 10), new THREE.BoxGeometry(10, 20, 10), new THREE.BoxGeometry(10, 10, 10)
];

let texture: THREE.Texture = new THREE.TextureLoader().load("textures/test.png");

let material: THREE.MeshStandardMaterial[][] = [
	[new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture})],
	[new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture})],
	[new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture})],
	[new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture})],
	[new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture}), new THREE.MeshStandardMaterial({color: "", map: texture})]
];

// ThreeJS Platform
let meshs: any[][] = [
	[new THREE.Mesh(geometry[0], material[0][0]), new THREE.Mesh(geometry[1], material[0][1]), new THREE.Mesh(geometry[2], material[0][2]), new THREE.Mesh(geometry[3], material[0][3]), new THREE.Mesh(geometry[4], material[0][4])],
	[new THREE.Mesh(geometry[1], material[1][0]), new THREE.Mesh(geometry[1], material[1][1]), new THREE.Mesh(geometry[2], material[1][2]), new THREE.Mesh(geometry[3], material[1][3]), new THREE.Mesh(geometry[4], material[1][4])],
	[new THREE.Mesh(geometry[2], material[2][0]), new THREE.Mesh(geometry[2], material[2][1]), new THREE.Mesh(geometry[2], material[2][2]), new THREE.Mesh(geometry[3], material[2][3]), new THREE.Mesh(geometry[4], material[2][4])],
	[new THREE.Mesh(geometry[3], material[3][0]), new THREE.Mesh(geometry[3], material[3][1]), new THREE.Mesh(geometry[3], material[3][2]), new THREE.Mesh(geometry[3], material[3][3]), new THREE.Mesh(geometry[4], material[3][4])],
	[new THREE.Mesh(geometry[4], material[4][0]), new THREE.Mesh(geometry[4], material[4][1]), new THREE.Mesh(geometry[4], material[4][2]), new THREE.Mesh(geometry[4], material[4][3]), new THREE.Mesh(geometry[4], material[4][4])]
];

function Pixels(Line: number, Column: number, Button: number, Color: boolean = true): void {
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 2, 2 );
	let zPos: number[] = [-20, -10, 0, 10, 20];
	// Creates the platform
	for(let i: number = 0, j: number = -20, k: number = 0; i < meshs.length; i++, j+=10, k = 0) {
		scene.add(meshs[0][i], meshs[1][i], meshs[2][i], meshs[3][i], meshs[4][i]);
		
		if (meshs[k][i] === meshs[0][0]) {
			meshs[k][i].position.set(j, 25, zPos[0]);
		} else if (meshs[k][i] === meshs[0][1]) {
			meshs[k][i].position.set(j, 20, zPos[0]);
		} else if (meshs[k][i] === meshs[0][2]) {
			meshs[k][i].position.set(j, 15, zPos[0]);
		} else if (meshs[k][i] === meshs[0][3]) {
			meshs[k][i].position.set(j, 10, zPos[0]);
		} else if (meshs[k][i] === meshs[0][4]) {
			meshs[k][i].position.set(j, 5, zPos[0]);
		} else {
			meshs[k][i].position.set(j, 0, zPos[0]);
		}
		k++;
		if (meshs[k][i] === meshs[1][0] || meshs[k][i] === meshs[1][1]) {
			meshs[k][i].position.set(j, 20, zPos[1]);
		} else if (meshs[k][i] === meshs[1][2]) {
			meshs[k][i].position.set(j, 15, zPos[1]);
		} else if (meshs[k][i] === meshs[1][3]) {
			meshs[k][i].position.set(j, 10, zPos[1]);
		} else if (meshs[k][i] === meshs[1][4]) {
			meshs[k][i].position.set(j, 5, zPos[1]);
		} else {
			meshs[k][i].position.set(j, 0, zPos[1]);
		}
		k++;
		if (meshs[k][i] === meshs[2][0] || meshs[k][i] === meshs[2][1] || meshs[k][i] === meshs[2][2]) {
			meshs[k][i].position.set(j, 15, zPos[2]);
		} else if (meshs[k][i] === meshs[2][3]) {
			meshs[k][i].position.set(j, 10, zPos[2]);
		} else {
			meshs[k][i].position.set(j, 5, zPos[2]);
		}
		k++;
		if (meshs[k][i] === meshs[3][0] || meshs[k][i] === meshs[3][1] || meshs[k][i] === meshs[3][2] || meshs[k][i] === meshs[3][3]) {
			meshs[k][i].position.set(j, 10, zPos[3]);
		} else {
			meshs[k][i].position.set(j, 5, zPos[3]);
		}
		k++;
		meshs[k][i].position.set(j, 5, zPos[4]);
	}

	// If color is asked, changed, else nothing
	if (Color) {
		if (Button == 1) {
			MeshColorRandomizer(Line, Column, "Btn1");
		} else if (Button == 2) {
			MeshColorRandomizer(Line, Column, "Btn2");
		} else if (Button == 3) {
			MeshColorRandomizer(Line, Column, "Btn3");
		}
	}
}

// Put the color on the ThreeJS Elements
let MeshColorRandomizer = function(Line: number, Column: number, Btn: string): void {
	if (Btn === 'Btn1') {
		meshs[Line][Column].material.color = new THREE.Color(CssJS(Button1.style.backgroundColor));
	} else if (Btn === 'Btn2') {
		meshs[Line][Column].material.color = new THREE.Color(CssJS(Button2.style.backgroundColor));
	} else if (Btn === 'Btn3') {
		meshs[Line][Column].material.color = new THREE.Color(CssJS(Button3.style.backgroundColor));
	}
	meshs[Line][Column].material.needsUpdate = true;
};

// Putting a floor
function Floor(): void {
	let floorGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(300, 0, 300);
	let floorMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
	const plane: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> = new THREE.Mesh(floorGeometry, floorMaterial);
	scene.add(plane);
	plane.position.y = 0;
}

// For the lights
function Lights(): void {
	const pointLight: THREE.PointLight = new THREE.PointLight(0xffffff);
	const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
	pointLight.position.set(5, 5, 5);
	scene.add(pointLight, ambientLight);
}

// for the background texture renderer
function BackgroundTextureLoader(): void {
	const BgTexture = new THREE.TextureLoader().load("textures/background.jpg");
	scene.background = BgTexture;
}

let LineCounter: number = 0;
let ColumnCounter: number = -1;

// Onclick Choices
(document.querySelector('.c1') as HTMLElement).onclick = function(): void {
	if (ColumnCounter >= 5) {
		LineCounter++;
		ColumnCounter = 0;
	} else {
		ColumnCounter++;
	}
	Pixels(LineCounter, ColumnCounter, 1, true);
  	Choices.push(Data.Questions[counter - 1].Answer1, Button1Color);
  	QuestionLoader();
};

(document.querySelector('.c2') as HTMLElement).onclick = function(): void {
	if (ColumnCounter >= 5) {
		LineCounter++;
		ColumnCounter = 0;
	} else {
		ColumnCounter++;
	}
	Pixels(LineCounter, ColumnCounter, 2, true);
  	Choices.push(Data.Questions[counter - 1].Answer2, Button2Color);
  	QuestionLoader();
};

(document.querySelector('.c3') as HTMLElement).onclick = function(): void {
	if (ColumnCounter >= 5) {
		LineCounter++;
		ColumnCounter = 0;
	} else {
		ColumnCounter++;
	}
	Pixels(LineCounter, ColumnCounter, 3, true);
  	Choices.push(Data.Questions[counter - 1].Answer3, Button3Color);
  	QuestionLoader();
};

function animate(): void {
	requestAnimationFrame(animate);
	controls.update();
	camera.position.y = camera.position.y <= 0 ? 0 : camera.position.y;
	renderer.render(scene, camera);
}

const main = (): void => {
	CameraRenderer();
	Pixels(NaN, NaN, NaN, false);
	Floor();
	Lights();
	BackgroundTextureLoader();
	const axesHelper: THREE.AxesHelper = new THREE.AxesHelper(5);
	scene.add(axesHelper);
	// const helper = new THREE.CameraHelper(camera);
	// scene.add(helper);
	QuestionLoader();
	animate();
};

window.onload = function(): void {
	main();
};