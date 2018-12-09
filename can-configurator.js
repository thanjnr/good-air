  var Configurator = (function () {
      var scene, engine, logo, mainTagline, captionTagline, bgFillColor = "#078ac3",
          template;

      return {
          init,
          addImageToTemplate,
          createCan,
          createCanLabel,
          selectTemplate,
          updateTemplate,
          download,
          createGUI,
          render,
          resize
      };

      function init(canvas) {
          engine = new BABYLON.Engine(canvas, true, {
              preserveDrawingBuffer: true,
              stencil: true
          });
          scene = new BABYLON.Scene(engine);
          scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
          var camera = new BABYLON.ArcRotateCamera("Camera", 5 * Math.PI / 8, 7 * Math.PI / 16, 3, BABYLON.Vector3.Zero(), scene);

          //camera.setPosition(new BABYLON.Vector3(0, 0, -1));

          // This targets the camera to scene origin
          camera.setTarget(BABYLON.Vector3.Zero());

          // This attaches the camera to the canvas
          camera.attachControl(canvas, true);

          // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
          var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
          light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
          light.specular = new BABYLON.Color3(0.8, 0.8, 0.8);
          light.groundColor = new BABYLON.Color3(1, 1, 1);

          scene.activeCamera.alpha = 0.8;

          return scene;
      }

      function render() {
          engine.runRenderLoop(function () {
              if (scene) {
                  scene.render();
              }
          });
      }

      function resize() {
          engine.resize();
      }

      function rotate(object) {
          scene.registerBeforeRender(function () {
              object.rotation.y += 0.001;
          });
      }

      function createCan() {
          var skull;
          var skullMaterial = new BABYLON.StandardMaterial("skullmat", scene);
          skullMaterial.backFaceCulling = false;
          skullMaterial.alpha = 0;

          var transparentMaterial = new BABYLON.StandardMaterial("transparentMat", scene);
          transparentMaterial.backFaceCulling = false;
          transparentMaterial.alpha = 0.5;

          var hiddenMaterial = new BABYLON.StandardMaterial("hiddenMat", scene);
          hiddenMaterial.backFaceCulling = false;
          hiddenMaterial.alpha = 0;

          // The first parameter can be used to specify which mesh to import. Here we import all meshes
          BABYLON.SceneLoader.ImportMesh("", "/scenes/", "Spraycan.babylon", scene, function (newMeshes) {
              console.log(newMeshes);
              for (let i = 0; i < newMeshes.length; i++) {
                  // i = 0 can top
                  // i = 1 can nozzle
                  // i = 2 can inner lid
                  // i = 3 can nozzle tip
                  // i = 4 can outer lid
                  if (i === 3) {
                      newMeshes[i].material = hiddenMaterial;
                  }
                  if (i === 4 || i === 1) {
                      // newMeshes[i].material = transparentMaterial; 
                  }
                  newMeshes[i].scaling.x = 0.5;
                  newMeshes[i].scaling.y = 0.415;
                  newMeshes[i].scaling.z = 0.5;
                  newMeshes[i].position.y = 0.95;
                  //newMeshes[i].material = skullMaterial; 
                  //newMeshes[i].diffuseColor.copyFrom({ r:255, g:0, b:0 }); 
                  rotate(newMeshes[i]);
              }
              skull = newMeshes[0];
          });
      }

      function createCanLabel() {
          var canMaterial = new BABYLON.StandardMaterial("material", scene);
          canMaterial.diffuseTexture = new BABYLON.Texture("good_air_can_large.png", scene)

          var faceUV = [
              new BABYLON.Vector4(0, 0, 0, 0),
              new BABYLON.Vector4(1, 0, 0, 1),
              new BABYLON.Vector4(0, 0, 0, 0)
          ];

          var faceColors = [new BABYLON.Color4(0.5, 0.5, 0.5, 1)];

          var innerCylinder = BABYLON.MeshBuilder.CreateCylinder("can", {
              height: 2.60,
              faceUV: faceUV,
              faceColors: faceColors,
              tessellation: 120
          }, scene);
          innerCylinder.material = canMaterial;

          rotate(innerCylinder);

          return innerCylinder;
      }

      function selectTemplate(selectedTemplate) {
          template = selectedTemplate;
          rotate(template.mesh);
      }

      function addImageToTemplate(image) {
          template.addImage(image);
      }

      function updateTemplate(mainText, caption, fillColor) {
          template.updateTemplate(mainText, caption, fillColor);
      }

      function download(generateCanvas) {
          template.download(generateCanvas);
      }

      function createGUI(canMaterial, customLabel, downLoadCallback) {
          // GUI
          var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

          var panel = new BABYLON.GUI.StackPanel();
          panel.width = "200px";
          panel.isVertical = true;
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
          panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
          advancedTexture.addControl(panel);

          var textBlock = new BABYLON.GUI.TextBlock();
          textBlock.text = "Diffuse color:";
          textBlock.height = "30px";
          panel.addControl(textBlock);

          var picker = new BABYLON.GUI.ColorPicker();
          picker.value = canMaterial.diffuseColor;
          picker.height = "150px";
          picker.width = "150px";
          picker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          picker.onValueChangedObservable.add(function (value) { // value is a color3
              canMaterial.diffuseColor.copyFrom(value);
          });

          var input = new BABYLON.GUI.InputText();
          input.width = 1;
          input.maxWidth = 1;
          input.height = "40px";
          input.text = "Enter custom text";
          input.color = "white";
          input.background = "green";

          input.onTextChangedObservable.add(function (value) { // value is a color3    
              updateCustomLabel(value.text, customLabel);

          });
          panel.addControl(input);
          panel.addControl(picker);

          var button = BABYLON.GUI.Button.CreateSimpleButton("but", "Download");
          button.width = 1;
          button.height = "40px";
          button.color = "white";
          button.background = "green";

          button.onPointerClickObservable.add(downLoadCallback);
          panel.addControl(button);
      }
  }());