# Welcome at the open-source project named Cosmic Adventure

- ## What is this project about ?
  - It's a Quizz about 3 choices, the point is to get someone matching the same half cube!


- ## What languages & framework are used ?
  - This Project is using **Typescript** as main Language, there's also some **Scss** (I primarly used it to improve my skills on it :P), and some regular HTML. The Frameworks used during are **Vanilla Typescript** setuped by **Vite**, as Graphic framework, it's using **Threejs**, a 3D javascript framework.


## JSON Structure of the data which is used for all the project
```json
{
    "Questions": [
        {
            "Answer1": "...",
            "Answer2": "...",
            "Answer3": "...",
            "colors": [
                "0x...",
                "0x...",
                "0x..."
            ]
        }
    ]
}
```
"Answer1": a string representing the first answer option of the question
"Answer2": a string representing the second answer option of the question
"Answer3": a string representing the third answer option of the question
"colors": an array of strings **representing the colors of the buttons in hexadecimal format, in the format '0x'**
Each object in the "Questions" array represents **a question with three answer options and corresponding three colors**.
It is likely that the data file would contain more question objects to create a multiple-choice question and answer system.
It is also **important to notice that the colors are in the format '0x'**. This means that the colors must be converted to the format '#' before being used in css.



## The core program of the project
**[main.ts](./src/main.ts)** Is the main component of the code.

### Imports
The default imports that needs to be there to make the code work are:
```ts
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Data from './data.json' assert {type: 'json'};
```

On line 16 & 17 is initialized the buttons and the answers:
```ts
let Button1 = document.querySelector(".c1") as Styler, Button2 = document.querySelector(".c2") as Styler, Button3 = document.querySelector(".c3") as Styler;
let Answer1 = document.querySelector(".Q1") as Styler, Answer2 = document.querySelector(".Q2") as Styler, Answer3 = document.querySelector(".Q3") as Styler;
```

the `as Styler` is for the Buttons to get modified easier, `Styler` is an extended interface of the `HTMLElement`
```ts
interface Styler extends HTMLElement {
  style: CSSStyleDeclaration
}
```


The function `CssJS` is there to convert the hex values of the colors from one to other format: `0x -> #`. She talks from all alon by watching at it:
```ts
function CssJS(NUM: string, Mode: string = "toJS"): string {
	return Mode === "toCSS" ? NUM.replace("0x", '#') : NUM;
}
```



### ButtonColor Function
The `ButtonColor()` function is used to set the background color of three buttons, `Button1`, `Button2`, and `Button3`, using data from the imported JSON file.

```ts
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
```

The function return a type of this interface:
```ts
interface ButtonColors {
  Button1Color: string;
  Button2Color: string;
  Button3Color: string;
}
```

First, it checks if the `Data` object and its `Questions` property are defined, and if so, it checks if the current value of the `BtnCounter` variable is within the range of the `Data.Questions` array. If both of these conditions are true, the function assigns the color values of the first, second, and third buttons to the variables `Button1Color`, `Button2Color`, and `Button3Color` respectively.

If the value of `BtnCounter` is not within the range of the `Data.Questions` array or if the `Data` object or its `Questions` property are not defined, the function sets the value of `BtnCounter` to -1 and logs an error message to the console.

Finally, the function increments the value of `BtnCounter` by 1 and returns an object containing the three button color values.



### QuestionLoader Function
The `QuestionLoader()` function is used to display questions on the screen. It first calls the `ButtonColor()` function to set the background color of the buttons and assigns the returned button color values to the variables `Button1Color`, `Button2Color`, and `Button3Color`.

```ts
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
```

It then checks if the value of the `counter` variable is greater than or equal to the length of the `Data.Questions` array. If it is, it uses `document.querySelector()` to **remove an element with the class "Choice" from the DOM**. If the value of `counter` is less than the length of the `Data.Questions` array, it sets the inner HTML of the `Answer1`, `Answer2`, and `Answer3` elements to the values of the `Answer1`, `Answer2`, and `Answer3` properties of the current question object in the `Data.Questions` array.

Finally, the function increments the value of `counter` by 1 and returns an object containing the three button color values.


## Data of the Cube

First We want to create some stages to get an effect like this (nums are to say what height they should have):
```
4 3 2 1
3 3 2 1
2 2 2 1
1 1 1 1
```
So we use some Y lengths to make it work:
```ts
let geometry: THREE.BoxGeometry[] = [
	new THREE.BoxGeometry(10, 50, 10), new THREE.BoxGeometry(10, 40, 10), new THREE.BoxGeometry(10, 30, 10), new THREE.BoxGeometry(10, 20, 10), new THREE.BoxGeometry(10, 10, 10)
];
```

after having set the geometry, we need some textures, materials and to set the meshs:

***I will not really explain those, it's basic Three.js***
```ts
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
```


### Pixels Function
The `Pixels` function  takes four parameters, `Line`, `Column`, `Button`, and `Color`, and returns `void`. It sets the texture wrapping of a `texture` object, and creates a platform by positioning `meshs` objects in a three-dimensional space.
The position of each `meshs` object depends on a combination of its index, `i`, and its position in the multi-dimensional array `meshs`. If `Color` is true, the color of the specified `meshs` objects is changed based on the value of `Button`.


### MeshColorRandomizer
The code defines a function named `MeshColorRandomizer` that takes 3 arguments: `Line`, `Column`, and `Btn`.
```ts
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
```
It sets the color of an object in a **2D array meshs** (with dimensions `Line` and `Column`) to a color determined by the argument `Btn`. The color is obtained from the background color of one of three buttons (`Btn1`, `Btn2`, `Btn3`) using the `CssJS` function to convert the color from CSS format to a `THREE.Color` object. Finally, the `needsUpdate` property of the object's material is set to `true` to indicate that the material needs to be updated.

### Floor, Lights & BackgroundTextureLoader Function
`Floor` -> This function creates a **green, double-sided plane with a 300x300 size and adds it to the scene**. It positions the plane at the **y-coordinate 0**.

`Lights` -> This function **creates a white point light and white ambient light and adds both to the scene**. The point light is **positioned at (5, 5, 5)**.

`BackgroundTextureLoader` -> This function **loads an image "textures/background.png" and sets it as the background texture of the scene**.


### Button onClick Function
`LineCounter` and `ColumnCounter` are two variables to **keep track of the line and column** of an array.
```ts
let LineCounter: number = 0;
let ColumnCounter: number = -1;
```
When the element with class "c1" or "c2" or "c3" is clicked, the script will be executed and performs the following tasks:

- Check if the value of `ColumnCounter` is greater than or equal to 5. If so, the value of `LineCounter` will be **incremented by 1**, and `ColumnCounter` will be **reset to 0**.
- If not, the value of `ColumnCounter` will be **incremented by 1**.
- Then, the function named `Pixels` will be called with `LineCounter`, `ColumnCounter`, `1`, and `true` as its arguments.
- The script also **pushes two values to an array called `Choices`**, which is the `Data.Questions[counter - 1].Answer1` and `Button1Color`.
- Finally, a function named `QuestionLoader` will be called.

```ts
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
```

### Animate function
This function is used to **animate the 3D scene** in the browser. The function uses the `requestAnimationFrame` method, which is a built-in method of the browser for creating animations.
```ts
function animate(): void {
	requestAnimationFrame(animate);
	controls.update();
	camera.position.y = camera.position.y <= 0 ? 0 : camera.position.y;
	renderer.render(scene, camera);
}
```
The function updates the controls of the scene, sets the **y position of the camera to 0** if it is less than or equal to 0, and then renders the scene by calling the `renderer.render` method with the scene and camera as arguments.

## The Html and the Scss
### Feel free to modify it as you want but it shouldn't be off topic